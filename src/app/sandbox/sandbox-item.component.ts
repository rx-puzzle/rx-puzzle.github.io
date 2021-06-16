import {
  Component,
  Input,
  HostBinding,
  Output,
  EventEmitter,
  NgZone,
  Renderer2,
  ElementRef,
  DoCheck,
} from '@angular/core';
import { ulid } from 'ulid';
import { Marble } from '../marble/marble.model';
import { Sandbox } from './sandbox.model';
import { SandboxItem } from './sandbox-item.model';
import { SandboxOptions } from './sandbox-options.model';
import { SandboxService } from './sandbox.service';
import { cssStr, cssNum } from 'app/utils/css-var';
import { SandboxComponent } from '../sandbox/sandbox.component';

@Component({
  selector: 'rxp-sandbox-item',
  templateUrl: './sandbox-item.component.html',
  styleUrls: ['./sandbox-item.component.scss'],
})
export class SandboxItemComponent implements DoCheck {
  @Input() sandbox!: Sandbox;
  @Input() index!: number;
  @Input() playProgress = 0;
  @Input() isPlaying = false;

  @HostBinding('class.is-editable')
  @Input()
  isEditable = false;

  get options(): SandboxOptions {
    return this.sandbox.options;
  }

  get items(): readonly SandboxItem[] {
    return this.sandbox.items;
  }

  @Output()
  itemsChange = new EventEmitter<readonly SandboxItem[]>();

  get item(): SandboxItem {
    return this.items[this.index];
  }

  @Input()
  get isExpanded(): boolean {
    return this.elementRef.nativeElement.classList.contains('is-expanded');
  }

  set isExpanded(value: boolean) {
    const elem = this.elementRef.nativeElement;
    const name = 'is-expanded';
    if (value) {
      this.renderer.addClass(elem, name);
    } else {
      this.renderer.removeClass(elem, name);
    }
  }

  @HostBinding('class.is-sequence')
  get isSequence(): boolean {
    return this.item.type === 'sequence';
  }

  @HostBinding('class.is-transformer')
  get isTransformer(): boolean {
    return this.item.type === 'transformer';
  }

  @HostBinding('class.is-expandable')
  get isExpandable(): boolean {
    if (this.isPictureMode) {
      return false;
    }
    return this.isEditable || this.isTransformer;
  }

  get isPictureMode(): boolean {
    return this.sandboxComponent.isPictureMode;
  }

  get marbles(): readonly Marble[] {
    return this.item.type !== 'sequence' ? [] : this.item.marbles;
  }

  get operatorKey(): string {
    return this.item.type !== 'transformer' ? '' : this.item.operatorKey;
  }

  get operatorLabel(): string {
    return this.sandboxComponent.getOperatorLabel(this.operatorKey);
  }

  get operatorName(): string {
    return this.operatorLabel.split('(')[0];
  }

  get operatorParen(): string {
    const n = this.operatorLabel.indexOf('(');
    return n < 0 ? '' : this.operatorLabel.substr(n);
  }

  get operatorHref(): string {
    const joinCreationOperators = [
      'combineLatest',
      'concat',
      'forkJoin',
      'merge',
      'partition',
      'race',
      'zip',
    ];
    const apiUrl = 'https://rxjs-dev.firebaseapp.com/api';
    if (joinCreationOperators.includes(this.operatorName)) {
      return apiUrl + '/index/function/' + this.operatorName;
    }
    return apiUrl + '/operators/' + this.operatorName;
  }

  get canRemove(): boolean {
    const index = this.index;
    const count = this.items.length;
    if (count <= 2) {
      return false;
    }
    if (index === 0 && this.item.type === 'sequence') {
      return this.items[index + 1].type === this.item.type;
    }
    if (index === count - 1 && this.item.type === 'transformer') {
      return this.items[index - 1].type === this.item.type;
    }
    return index > 0 && index < count - 1;
  }

  get canAddSequence(): boolean {
    const index = this.index;
    const count = this.items.length;
    const maxCount = this.options.maxItemCount;
    return count < maxCount && index >= 0 && index < count - 1;
  }

  get canAddTransformer(): boolean {
    const index = this.index;
    const count = this.items.length;
    const maxCount = this.options.maxItemCount;
    return count < maxCount && index >= 0 && index < count;
  }

  get canMoveUp(): boolean {
    const index = this.index;
    const count = this.items.length;
    if (count < 2 || index <= 0 || index >= count) {
      return false;
    }
    if (index === 1) {
      return this.item.type === 'sequence';
    }
    if (index === count - 1) {
      return this.items[index - 1].type === 'transformer';
    }
    return true;
  }

  get canMoveDown(): boolean {
    const index = this.index;
    const count = this.items.length;
    if (count < 2 || index < 0 || index >= count - 1) {
      return false;
    }
    if (index === count - 2) {
      return this.item.type === 'transformer';
    }
    if (index === 0) {
      return this.items[index + 1].type === 'sequence';
    }
    return true;
  }

  get selectableOperatorKeys(): readonly string[] | null {
    if (!this.cachedSelectableOperatorKeys) {
      this.cachedSelectableOperatorKeys = this.findSelectableOperatorKeys();
    }
    return this.cachedSelectableOperatorKeys;
  }

  private cachedSelectableOperatorKeys: readonly string[] | null = null;

  constructor(
    private zone: NgZone,
    private sandboxService: SandboxService,
    private sandboxComponent: SandboxComponent,
    private renderer: Renderer2,
    private elementRef: ElementRef<HTMLElement>
  ) {}

  ngDoCheck(): void {
    this.cachedSelectableOperatorKeys = null;
    const normalized = this.normalizeOperatorKey();
    if (normalized !== this.item) {
      this.spliceItems(this.index, 1, normalized);
    }
  }

  onPanelHeaderClick(event: MouseEvent): void {
    this.isExpanded = this.isExpandable ? !this.isExpanded : false;
    event.stopPropagation();
  }

  onOperatorSelectionButtonClick(event: MouseEvent): void {
    this.selectOperator();
    event.stopPropagation();
  }

  cssStr(name: string, defaultValue = ''): string {
    return cssStr(name, defaultValue, this.elementRef.nativeElement);
  }

  cssNum(name: string, defaultValue = 0): number {
    return cssNum(name, defaultValue, this.elementRef.nativeElement);
  }

  remove(): void {
    if (this.canRemove) {
      this.spliceItems(this.index, 1);
    }
  }

  addSequence(): void {
    if (this.canAddSequence) {
      this.spliceItems(this.index + 1, 0, {
        type: 'sequence',
        id: ulid(),
        marbles: [],
      });
    }
  }

  addTransformer(): void {
    if (this.canAddTransformer) {
      this.spliceItems(this.index + 1, 0, {
        type: 'transformer',
        id: ulid(),
        operatorKey: '',
      });
    }
  }

  moveUp(): void {
    if (this.canMoveUp) {
      const a = this.items[this.index - 1];
      const b = this.items[this.index - 0];
      this.spliceItems(this.index - 1, 2, b, a);
      const curr = this.elementRef.nativeElement;
      const prev = curr.previousElementSibling;
      this.zone.runOutsideAngular(() => this.doSwapTransition(curr, prev));
    }
  }

  moveDown(): void {
    if (this.canMoveDown) {
      const a = this.items[this.index + 0];
      const b = this.items[this.index + 1];
      this.spliceItems(this.index, 2, b, a);
      const curr = this.elementRef.nativeElement;
      const next = curr.nextElementSibling;
      this.zone.runOutsideAngular(() => this.doSwapTransition(curr, next));
    }
  }

  onSequenceChange(marbles: readonly Marble[]): void {
    if (this.item.type !== 'sequence') {
      return;
    }
    this.spliceItems(this.index, 1, { ...this.item, marbles });
  }

  getTransformerOutput(): Marble[] {
    return this.sandboxService.getTransformerOutput(this.index);
  }

  selectOperator(): void {
    this.sandboxComponent.selectableOperatorKeys = this.selectableOperatorKeys;
    this.sandboxComponent.operatorSelected = (operatorKey: string) => {
      if (this.item.type === 'transformer') {
        this.spliceItems(this.index, 1, { ...this.item, operatorKey });
      }
    };
    void this.sandboxComponent.sidenav.open();
  }

  // prettier-ignore
  private findSelectableOperatorKeys(): readonly string[] {
    let count = 0;
    for (let n = this.index - 1; n >= 0; --n) {
      count += 1;
      if (this.items[n].type === 'transformer') {
        break;
      }
    }
    switch (count) {
      case 1: return this.sandboxService.singleSequenceOperatorKeys;
      case 2: return this.sandboxService.doubleSequenceOperatorKeys;
      default: return this.sandboxService.multipleSequenceOperatorKeys;
    }
  }

  private spliceItems(
    start: number,
    deleteCount?: number,
    ...newItems: SandboxItem[]
  ) {
    const items = [...this.items];
    if (deleteCount === undefined) {
      items.splice(start);
    } else {
      items.splice(start, deleteCount, ...newItems);
    }
    this.itemsChange.emit(items);
  }

  private normalizeOperatorKey(item = this.item): SandboxItem {
    if (item.type !== 'transformer' || !this.selectableOperatorKeys) {
      return item;
    }
    if (!this.selectableOperatorKeys.includes(item.operatorKey)) {
      const operatorKey = this.selectableOperatorKeys[0];
      return { ...item, operatorKey };
    }
    return item;
  }

  private doSwapTransition(a: Element | null, b: Element | null) {
    if (!a || !b) {
      return;
    }

    const aTop = a.getBoundingClientRect().top;
    const bTop = b.getBoundingClientRect().top;

    requestAnimationFrame(() => {
      const aDelta = aTop - a.getBoundingClientRect().top;
      const bDelta = bTop - b.getBoundingClientRect().top;
      this.renderer.setStyle(a, 'transition', 'none');
      this.renderer.setStyle(a, 'transform', `translateY(${aDelta}px)`);
      this.renderer.setStyle(b, 'transition', 'none');
      this.renderer.setStyle(b, 'transform', `translateY(${bDelta}px)`);
      requestAnimationFrame(() => {
        [a, b].forEach((x) => {
          this.renderer.removeStyle(x, 'transition');
          this.renderer.removeStyle(x, 'transform');
          this.renderer.removeStyle(x, 'margin');
        });
      });
    });
  }
}
