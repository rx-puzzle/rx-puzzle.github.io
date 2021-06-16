import { Clipboard } from '@angular/cdk/clipboard';
import {
  Component,
  Input,
  ViewChild,
  Inject,
  LOCALE_ID,
  Self,
  NgZone,
  ChangeDetectorRef,
  Renderer2,
  ElementRef,
  OnInit,
  OnChanges,
  SimpleChanges,
  DoCheck,
  OnDestroy,
} from '@angular/core';
import { ANIMATIONS } from './sandbox.component.anim';
import { Location } from '@angular/common';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Marble } from 'app/marble/marble.model';
import { Sandbox } from './sandbox.model';
import { SandboxItem } from './sandbox-item.model';
import { SandboxService } from './sandbox.service';
import { ThemeService } from 'app/theme.service';
import { cssNum, cssStr } from 'app/utils/css-var';
import { MarbleSequenceComponent } from '../marble/marble-sequence.component';
import { Subscription, interval, animationFrameScheduler } from 'rxjs';
import { first } from 'rxjs/operators';
import sha256 from 'fast-sha256';

/* eslint @angular-eslint/no-conflicting-lifecycle: "off" */
@Component({
  selector: 'rxp-sandbox',
  templateUrl: './sandbox.component.html',
  styleUrls: ['./sandbox.component.scss'],
  animations: ANIMATIONS,
  providers: [SandboxService],
})
export class SandboxComponent implements OnInit, OnChanges, DoCheck, OnDestroy {
  @Input() mode: 'edit' | 'play' | 'picture';
  @Input() src: Sandbox | string = '';
  @Input() hint = '';
  sandbox: Sandbox;
  paletteExpanded = false;
  contentAnimationDisabled = false;

  get isEditMode(): boolean {
    return !this.mode || this.mode === 'edit';
  }

  get isPlayMode(): boolean {
    return this.mode === 'play';
  }

  get isPictureMode(): boolean {
    return this.mode === 'picture';
  }

  get playtime(): number {
    return this.sandboxService.playtime;
  }

  set playtime(value: number) {
    this.sandboxService.playtime = value;
  }

  get playEndTime(): number {
    const w = this.goalSequence.width;
    const m = this.goalSequence.marbleSize;
    const t = this.sandbox.options.marbleEmittingInterval;
    const v = (w / m) * t;
    return !isNaN(v) ? v : Number.MAX_VALUE;
  }

  get playProgress(): number {
    return this.playtime / this.playEndTime;
  }

  get isPlaying(): boolean {
    return this.sandboxService.isPlaying;
  }

  set isPlaying(value: boolean) {
    this.sandboxService.isPlaying = value;
  }

  get playEnded(): boolean {
    return !this.isPlaying && this.playtime >= this.playEndTime;
  }

  get isCleared(): boolean {
    return this.sandboxService.isCleared;
  }

  get canUndo(): boolean {
    const i = this.undoHistoryIndex;
    const c = this.undoHistory.length;
    return i > 0 && i <= c;
  }

  get canRedo(): boolean {
    const i = this.undoHistoryIndex;
    const c = this.undoHistory.length;
    return i >= 0 && i < c - 1;
  }

  get document(): Document {
    return this.elementRef.nativeElement.ownerDocument;
  }

  @ViewChild('sidenav', { read: MatSidenav, static: true })
  readonly sidenav!: MatSidenav;

  @ViewChild('goalSequence', { read: MarbleSequenceComponent, static: true })
  private readonly goalSequence!: MarbleSequenceComponent;

  private readonly undoHistoryLimit = 30;
  private undoHistoryIndex = 0;
  private readonly undoHistory = [] as Sandbox[];
  private undoHistoryEnabled = false;

  private refreshSubscription!: Subscription;

  selectableOperatorKeys: readonly string[] | null = null;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  operatorSelected = (operator: string): void => {};

  constructor(
    route: ActivatedRoute,
    outlet: RouterOutlet,
    @Inject(LOCALE_ID)
    readonly locale: string,
    private location: Location,
    private zone: NgZone,
    private changeDetectorRef: ChangeDetectorRef,
    private renderer: Renderer2,
    private elementRef: ElementRef<HTMLElement>,
    private themeService: ThemeService,
    @Self()
    private sandboxService: SandboxService,
    private clipboard: Clipboard,
    private snackBar: MatSnackBar
  ) {
    // console.log(`LOCALE_ID = ${locale}`);
    this.mode =
      (route.snapshot.data.mode as 'edit' | 'play' | 'picture') || 'edit';
    if (route.snapshot.data.navbarDisabled) {
      const navbar = document.querySelector('rxp-app rxp-navbar');
      this.renderer.setStyle(navbar, 'display', 'none');
      this.renderer.addClass(this.elementRef.nativeElement, 'navbar-disabled');
    }
    this.sandbox = this.sandboxService.createMinimalSandbox();
    outlet.activateEvents.pipe(first()).subscribe(() => {
      if (outlet.component !== this) {
        return;
      }
      const src = route.snapshot.data.src as string;
      if (src) {
        this.src = src;
        this.sandbox = this.sandboxService.deserialize(src);
      }
      const hint = route.snapshot.data.hint as string;
      if (hint) {
        this.hint = hint;
      }
      const theme = route.snapshot.data.theme as string;
      if (theme) {
        this.themeService.theme = theme;
      }
      const title = route.snapshot.data.title as string;
      if (title) {
        this.document.title = title;
      }
    });
  }

  ngOnInit(): void {
    this.refreshSubscription = interval(0, animationFrameScheduler).subscribe(
      () => this.changeDetectorRef.detectChanges()
    );
    this.contentAnimationDisabled = true;
    requestAnimationFrame(() => (this.contentAnimationDisabled = false));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.mode) {
      this.collapseAllItems();
    }
    if (changes.src) {
      if (typeof this.src === 'string') {
        this.sandbox = this.sandboxService.deserialize(this.src);
      } else {
        this.sandbox = { ...this.src };
      }
    }
  }

  ngDoCheck(): void {
    if (!this.hasValidSandbox()) {
      this.snackBar.open(this.sandbox.error?.toString() || '', 'OK');
      this.sandbox = this.sandboxService.createMinimalSandbox();
    }
    this.updatePlayState();
    if (this.isPlaying && this.playProgress >= 1) {
      this.isPlaying = false;
      this.storeClearState();
    }
  }

  ngOnDestroy(): void {
    this.refreshSubscription?.unsubscribe();
  }

  onUndoButtonClick(): void {
    if (this.undoHistoryIndex === this.undoHistory.length) {
      this.updateUndoHistory(this.sandboxService.snapshot);
      this.undoHistoryIndex -= 1;
    }
    this.undoHistoryIndex -= 1;
    this.sandbox = this.undoHistory[this.undoHistoryIndex];
    this.undoHistoryEnabled = true;
    this.contentAnimationDisabled = true;
    this.zone.runOutsideAngular(() =>
      requestAnimationFrame(() => (this.contentAnimationDisabled = false))
    );
  }

  onRedoButtonClick(): void {
    this.undoHistoryIndex += 1;
    this.sandbox = this.undoHistory[this.undoHistoryIndex];
    this.undoHistoryEnabled = true;
    this.contentAnimationDisabled = true;
    this.zone.runOutsideAngular(() =>
      requestAnimationFrame(() => (this.contentAnimationDisabled = false))
    );
  }

  onPlayButtonClick(): void {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.play();
    }
  }

  onCollapseAllMenuClick(): void {
    this.collapseAllItems();
  }

  openSnackBar(selector: string): void {
    const elem = this.elementRef.nativeElement.querySelector(selector);
    if (!elem) {
      return;
    }
    const message = elem.getAttribute('data-message') ?? 'No Message.';
    const action = elem.getAttribute('data-action') ?? 'OK';
    const duration = parseInt(elem.getAttribute('data-duration') ?? '-1', 10);
    this.snackBar.open(message, action, { duration });
  }

  onPlayStageMenuClick(event: MouseEvent): void {
    const data = this.sandboxService.exportStageData();
    const url = `./stages/${data}?theme=${this.themeService.theme}`;
    const elem = event.target as HTMLElement;
    this.renderer.setAttribute(elem, 'href', url);
  }

  onSaveMenuClick(): void {
    const host = this.document.location.host;
    const data = this.sandboxService.exportData();
    const url = `${host}/sandbox/${data}`;
    this.clipboard.copy(url);
    this.openSnackBar('.on-sandbox-url-exported');
    this.location.go(`/sandbox/${data}`);
  }

  onExportAsStageUrlMenuClick(): void {
    const host = this.document.location.host;
    const data = this.sandboxService.exportStageData();
    const url = `${host}/stages/${data}`;
    this.clipboard.copy(url);
    this.openSnackBar('.on-stage-url-exported');
  }

  onExportAsPictureUrlMenuClick(): void {
    const host = this.document.location.host;
    const data = this.sandboxService.exportData();
    const url = `${host}/pictures/${data}`;
    this.clipboard.copy(url);
    this.openSnackBar('.on-picture-url-exported');
  }

  onItemsChange(items: readonly SandboxItem[]): void {
    this.sandbox.items = items;
  }

  onGoalMarblesChange(goalMarbles: readonly Marble[]): void {
    this.sandbox.options = {
      ...this.sandbox.options,
      goalMarbles,
    };
  }

  play(): void {
    this.collapseAllItems();
    this.scrollToGoalMarbles();
    this.sandboxService.updatePlayState(this.sandbox);
    const delay = 200;
    this.playtime = -delay;
    this.isPlaying = true;
  }

  stop(): void {
    this.isPlaying = false;
    this.sandboxService.updatePlayState(this.sandbox);
    this.playtime = 0;
  }

  cssStr(name: string, defaultValue = ''): string {
    return cssStr(name, defaultValue, this.elementRef.nativeElement);
  }

  cssNum(name: string, defaultValue = 0): number {
    return cssNum(name, defaultValue, this.elementRef.nativeElement);
  }

  trackByItemId(index: number, item: SandboxItem): string {
    return item.id;
  }

  collapseAllItems(): void {
    this.elementRef.nativeElement
      .querySelectorAll('rxp-sandbox-item')
      .forEach((x) => this.renderer.removeClass(x, 'is-expanded'));
  }

  scrollToGoalMarbles(): void {
    const elem = this.elementRef.nativeElement.querySelector('.goal-marbles');
    elem?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }

  getOperatorLabel(key: string): string {
    const t = this.sandbox.options.marbleEmittingInterval;
    return key.replace(/([0-9])t/gi, (_, n) => `${Number(n) * t}`);
  }

  selectOperatorAndClose(operator: string): void {
    this.operatorSelected(operator);
    this.operatorSelected = () => {
      return;
    };
    void this.sidenav.close();
  }

  getTransformerOutput(index: number): Marble[] {
    return this.sandboxService.getTransformerOutput(index);
  }

  private hasValidSandbox() {
    return this.sandbox && !this.sandbox.error;
  }

  private updatePlayState() {
    const snapshot = this.sandboxService.snapshot;
    if (!this.sandboxService.updatePlayState(this.sandbox)) {
      return;
    }
    if (this.isEditMode) {
      if (this.undoHistoryEnabled) {
        this.undoHistoryEnabled = false;
      } else if (this.sandboxService.isNormalized(snapshot)) {
        this.updateUndoHistory(snapshot);
      }
    }
    this.playtime = 0;
    this.isPlaying = false;
    if (this.isEditMode || this.isPictureMode) {
      this.zone.runOutsideAngular(() =>
        requestAnimationFrame(() => (this.playtime = this.playEndTime))
      );
    }
  }

  private updateUndoHistory(snapshot: Sandbox) {
    this.undoHistory.splice(this.undoHistoryIndex);
    this.undoHistory.push(snapshot);
    const count = this.undoHistory.length - this.undoHistoryLimit;
    if (count > 0) {
      this.undoHistory.splice(0, count);
    }
    this.undoHistoryIndex = this.undoHistory.length;
  }

  private storeClearState() {
    if (!this.isPlayMode || typeof this.src !== 'string') {
      return;
    }
    if (this.isPlaying || !this.isCleared) {
      return;
    }
    const storage = this.document.defaultView?.localStorage;
    if (storage) {
      const bytes = new TextEncoder().encode(this.src);
      const key = Array.from(sha256(bytes), (byte) => {
        return ('0' + (byte & 0xff).toString(16)).slice(-2);
      }).join('');
      storage.setItem(key, 'cleared');
    }
  }
}
