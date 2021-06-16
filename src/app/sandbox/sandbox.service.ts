import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { Marble } from '../marble/marble.model';
import { Sandbox } from './sandbox.model';
import { SandboxOptions } from './sandbox-options.model';
import { deflate, inflate } from 'pako';
import { Base64 } from 'js-base64';
import { isEqual } from 'lodash';
import { ulid } from 'ulid';
import { VirtualTimeScheduler } from 'rxjs';
import {
  SINGLE_SEQ_OP_MAP,
  SINGLE_SEQ_OP_KEYS,
  DOUBLE_SEQ_OP_MAP,
  DOUBLE_SEQ_OP_KEYS,
  MULTIPLE_SEQ_OP_MAP,
  MULTIPLE_SEQ_OP_KEYS,
  SequenceOperator,
} from './internal/operator-maps';
import { Transformer } from './internal/transformer';

interface PlayState {
  snapshot: Sandbox;
  outputs: Map<number, Marble[]>;
  playtime: number;
  isCleared: boolean;
}

@Injectable({ providedIn: 'root' })
export class SandboxService implements OnDestroy {
  isPlaying = false;

  get singleSequenceOperatorMap(): Readonly<Map<string, SequenceOperator>> {
    return SINGLE_SEQ_OP_MAP;
  }

  get singleSequenceOperatorKeys(): readonly string[] {
    return SINGLE_SEQ_OP_KEYS;
  }

  get doubleSequenceOperatorMap(): Readonly<Map<string, SequenceOperator>> {
    return DOUBLE_SEQ_OP_MAP;
  }

  get doubleSequenceOperatorKeys(): readonly string[] {
    return DOUBLE_SEQ_OP_KEYS;
  }

  get multipleSequenceOperatorMap(): Readonly<Map<string, SequenceOperator>> {
    return MULTIPLE_SEQ_OP_MAP;
  }

  get multipleSequenceOperatorKeys(): readonly string[] {
    return MULTIPLE_SEQ_OP_KEYS;
  }

  get snapshot(): Sandbox {
    return this.playState.snapshot;
  }

  get playtime(): number {
    return this.playState.playtime;
  }

  set playtime(value: number) {
    this.playState.playtime = value;
  }

  get isCleared(): boolean {
    return this.playState.isCleared;
  }

  get output(): Marble[] {
    const index = this.snapshot.items.length - 1;
    return this.getTransformerOutput(index);
  }

  private playState = this.createPlayState();
  private isDestroyed = false;

  constructor(zone: NgZone) {
    zone.runOutsideAngular(() => this.startPlayer());
  }

  ngOnDestroy(): void {
    this.isDestroyed = true;
  }

  updatePlayState(sandbox: Sandbox): boolean {
    if (
      sandbox.options === this.snapshot.options &&
      sandbox.items === this.snapshot.items
    ) {
      return false;
    }
    if (!this.isNormalized(sandbox)) {
      return false;
    }
    this.playState = this.createPlayState(sandbox);
    return true;
  }

  exportStageData(): string {
    const options = { ...this.snapshot.options, goalMarbles: this.output };
    const items = this.snapshot.items.map((x) =>
      x.type !== 'transformer' ? x : { ...x, operatorKey: '' }
    );
    return this.serialize({ options, items });
  }

  exportData(): string {
    return this.serialize(this.snapshot);
  }

  serialize(sandbox: Sandbox): string {
    try {
      const json = JSON.stringify(sandbox);
      const buf = deflate(json, { level: 9 });
      return Base64.fromUint8Array(buf, true);
    } catch (error) {
      console.warn(error);
      throw Error('Serialization failed.');
    }
  }

  deserialize(encodedText: string): Sandbox {
    try {
      const buf = Base64.toUint8Array(encodedText);
      const json = inflate(new Uint8Array(buf), { to: 'string' });
      const sandbox = JSON.parse(json) as Sandbox;
      sandbox.options = this.validateOptions(sandbox.options);
      return sandbox;
    } catch (error) {
      console.warn(error);
      const sandbox = this.createMinimalSandbox();
      sandbox.error = Error('Deserialization failed.');
      return sandbox;
    }
  }

  validateOptions(
    options: SandboxOptions | Record<string, unknown>
  ): SandboxOptions {
    // prettier-ignore
    const defaultOptions = Object.freeze({
      marblesPerSequence    : 14,
      marbleEmittingInterval: 200,
      maxItemCount          : 10,
      goalMarbles           : [],
    } as SandboxOptions);

    if (!options) {
      return defaultOptions;
    }

    const draft: Record<string, unknown> = {};
    for (const key of Object.keys(defaultOptions)) {
      const a = options[key];
      const b = defaultOptions[key];
      draft[key] = typeof a === typeof b ? a : b;
    }
    return Object.freeze(draft as SandboxOptions);
  }

  createMinimalSandbox(): Sandbox {
    return {
      options: this.validateOptions({}),
      items: [
        { type: 'sequence', id: ulid(), marbles: [] },
        { type: 'transformer', id: ulid(), operatorKey: '' },
      ],
    };
  }

  getTransformerOutput(index: number): Marble[] {
    let output = this.playState.outputs.get(index);
    if (!output) {
      output = [];
      this.playState.outputs.set(index, output);
    }
    return output;
  }

  isNormalized(sandbox: Sandbox): boolean {
    const sqLen = sandbox.options.marblesPerSequence;
    if (sandbox.options.goalMarbles.length !== sqLen) {
      return false;
    }
    let seqCount = 0;
    for (const item of sandbox.items) {
      if (item.type === 'sequence') {
        seqCount += 1;
        if (item.marbles.length !== sqLen) {
          return false;
        }
        if (item.marbles.findIndex((x) => !x) >= 0) {
          return false;
        }
      } else {
        const k = item.operatorKey;
        if (seqCount === 1 && !SINGLE_SEQ_OP_MAP.has(k)) {
          return false;
        } else if (seqCount === 2 && !DOUBLE_SEQ_OP_MAP.has(k)) {
          return false;
        } else if (seqCount >= 3 && !MULTIPLE_SEQ_OP_MAP.has(k)) {
          return false;
        }
        seqCount = 1;
      }
    }
    return true;
  }

  private createPlayState(sandbox?: Sandbox): PlayState {
    const state = {
      snapshot: this.createMinimalSandbox(),
      outputs: new Map<number, Marble[]>(),
      playtime: 0,
      isCleared: false,
    } as PlayState;

    if (sandbox) {
      state.snapshot = { ...sandbox };
    }
    const s = new VirtualTimeScheduler();
    const transformers = this.createTransformers(state.snapshot, s);
    transformers.forEach((x) => state.outputs.set(x.index, x.output));
    const i = state.snapshot.items.length - 1;
    const g = state.snapshot.options.goalMarbles;
    state.isCleared = isEqual(state.outputs.get(i), g);
    return state;
  }

  private createTransformers(
    snapshot: Sandbox,
    s: VirtualTimeScheduler
  ): Transformer[] {
    const transformers = [] as Transformer[];
    let prev: Transformer | null = null;
    snapshot.items.forEach((x) => {
      if (x.type === 'transformer') {
        const curr = new Transformer(snapshot, s, prev);
        transformers.push(curr);
        prev = curr;
      }
    });
    return transformers;
  }

  private startPlayer() {
    let lastMs = Date.now();
    const tick = () => {
      if (this.isDestroyed) {
        return;
      }
      const currMs = Date.now();
      if (this.isPlaying) {
        this.playState.playtime += currMs - lastMs;
      }
      lastMs = currMs;
      requestAnimationFrame(() => tick());
    };
    requestAnimationFrame(() => tick());
  }
}
