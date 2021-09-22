import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  ViewChild,
  EventEmitter,
  NgZone,
  Renderer2,
  ElementRef,
  OnInit,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { ANIMATIONS } from './marble-sequence.component.anim';
import {
  CdkDrag,
  CdkDropList,
  CdkDragStart,
  CdkDragEnter,
  CdkDragExit,
  CdkDragEnd,
  CdkDragDrop,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { first } from 'rxjs/operators';
import { Marble } from './marble.model';
import { hasStyleTransition } from 'app/utils/has-style-transition';
import { EMPTY } from 'rxjs';
import { range } from 'lodash';

@Component({
  selector: 'rxp-marble-sequence',
  templateUrl: './marble-sequence.component.html',
  styleUrls: ['./marble-sequence.component.scss'],
  animations: ANIMATIONS,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarbleSequenceComponent implements OnInit, OnChanges, OnDestroy {
  @Input() marbles: readonly Marble[] = [];
  @Output() marblesChange = new EventEmitter<readonly Marble[]>();
  @Input() isEditable = false;
  @Input() marbleSize = 20;
  @Input() fixedLength = 12;
  @Input() timelineColor: string | undefined;
  @Input() progress = 1;

  @Output() dragStarted = new EventEmitter<CdkDragStart>();
  @Output() dragEnded = new EventEmitter<CdkDragEnd>();

  get width(): number {
    return this.elementRef.nativeElement.clientWidth;
  }

  get indexInProgress(): number {
    return this.cachedIndexInProgress;
  }

  get isDragging(): boolean {
    const elem = this.dropList.element.nativeElement;
    return elem.classList.contains('cdk-drop-list-dragging');
  }

  get overflowedMarbles(): Marble[] {
    if (this.isEditable && this.overflowedMarble) {
      return [this.overflowedMarble];
    }
    return [];
  }

  get progressClipPath(): string {
    const percent = 100 - Math.min(Math.max(100 * this.progress, 0), 100);
    return `inset(0 ${percent.toFixed(2)}% 0 0)`;
  }

  get timelineScaleCounter(): number[] {
    return range(this.marbles.length + 1);
  }

  @ViewChild(CdkDropList, { static: true })
  private readonly dropList!: CdkDropList;

  private get dropListLeft() {
    const a = this.elementRef.nativeElement.clientWidth;
    const b = this.dropList.element.nativeElement.scrollWidth;
    return a - b;
  }

  @ViewChild('endMarker', { static: true })
  private readonly endMarkerRef!: ElementRef<HTMLElement>;

  private dragDroppedSubscription = EMPTY.subscribe();
  private placeholderIndex = -1;
  private overflowedMarble: Marble | null = null;
  private cachedIndexInProgress = -1;
  private removalMarkerUpdaterId = 0;

  constructor(
    private zone: NgZone,
    private renderer: Renderer2,
    private elementRef: ElementRef<HTMLElement>
  ) {}

  ngOnInit(): void {
    this.cachedIndexInProgress = this.computeIndexInProgress();
  }

  ngOnChanges(changes: SimpleChanges): void {
    let needsUpdateEndMarker = false;
    if (changes.marbles) {
      const normalized = this.normalizeMarbles(this.marbles);
      if (normalized !== this.marbles) {
        requestAnimationFrame(() => this.marblesChange.emit(normalized));
      } else {
        needsUpdateEndMarker = true;
      }
    }
    if (changes.progress) {
      this.cachedIndexInProgress = this.computeIndexInProgress();
      needsUpdateEndMarker = true;
    }
    if (needsUpdateEndMarker) {
      this.zone.runOutsideAngular(() => this.updateEndMarker());
    }
  }

  ngOnDestroy(): void {
    this.zone.runOutsideAngular(() => {
      this.stopRemovalMarkerUpdater();
    });
  }

  onDragStarted(event: CdkDragStart): void {
    const container = event.source.dropContainer;
    this.placeholderIndex = container
      .getSortedItems()
      .findIndex((x) => x === event.source);
    this.zone.runOutsideAngular(() => {
      requestAnimationFrame(() => this.updateEndMarker());
      this.startRemovalMarkerUpdater();
    });
    this.subscribeDragDropped(event.source);
  }

  onDropListEnterPredicate(drag: CdkDrag): boolean {
    const elem = drag?.dropContainer.element.nativeElement;
    return this.isEditable && elem?.classList.contains('can-drag-marble');
  }

  onDropListEntered(event: CdkDragEnter): void {
    this.placeholderIndex = event.currentIndex;
    this.zone.runOutsideAngular(() => {
      this.runPlaceholderEnterTransition(event.item);
      requestAnimationFrame(() => this.updateEndMarker());
      this.startRemovalMarkerUpdater();
    });
    this.subscribeDragDropped(event.item);
  }

  onDropListExited(event: CdkDragExit): void {
    this.zone.runOutsideAngular(() => {
      this.runPlaceholderExitTransition(event.item);
    });
    const elem = event.item.getPlaceholderElement();
    elem.classList.remove('should-remove');
  }

  onDropListDropped(event: CdkDragDrop<Marble[]>): void {
    const action = this.getDragDroppedEventAction(event);
    if (action !== 'skip') {
      const marbles = [...this.marbles];
      switch (action) {
        case 'sort':
          moveItemInArray(marbles, event.previousIndex, event.currentIndex);
          break;
        case 'send':
        case 'remove':
          marbles.splice(event.previousIndex, 1);
          break;
        case 'receive':
          marbles.splice(event.currentIndex, 0, event.item.data);
          break;
      }
      if (marbles.length > this.fixedLength) {
        this.overflowedMarble = marbles[this.fixedLength];
        marbles.pop();
      } else if (marbles.length < this.fixedLength) {
        marbles.push({ shape: '', color: '' });
      }
      this.marblesChange.emit(marbles);
    }
    this.zone.runOutsideAngular(() => {
      requestAnimationFrame(() => this.updateEndMarker());
      this.startRemovalMarkerUpdater();
    });
    this.placeholderIndex = -1;
  }

  private normalizeMarbles(marbles: readonly Marble[]) {
    const src = marbles;
    const normalized = src.length === this.fixedLength && !src.find((x) => !x);
    if (normalized) {
      return src;
    }
    const dst = src.map((x) => x ?? { shape: '', color: '' });
    while (dst.length > this.fixedLength) {
      dst.pop();
    }
    while (dst.length < this.fixedLength) {
      dst.push({ shape: '', color: '' });
    }
    return dst;
  }

  private subscribeDragDropped(drag: CdkDrag) {
    if (!this.dragDroppedSubscription.closed) {
      return;
    }
    this.dragDroppedSubscription = drag.dropped
      .pipe(first())
      .subscribe((event) => this.onDropListDropped(event));
  }

  private getDragDroppedEventAction(
    event: CdkDragDrop<Marble[]>
  ): 'skip' | 'sort' | 'receive' | 'send' | 'remove' {
    const dropList = this.dropList;
    if (dropList !== event.container && dropList !== event.previousContainer) {
      return 'skip';
    }
    const classList = event.item.element.nativeElement.classList;
    if (classList.contains('rxp-drop-outside')) {
      return dropList === event.previousContainer ? 'remove' : 'skip';
    }
    if (event.container === event.previousContainer) {
      return event.currentIndex === event.previousIndex ? 'skip' : 'sort';
    }
    return dropList === event.container ? 'receive' : 'send';
  }

  private runPlaceholderEnterTransition(drag: CdkDrag) {
    const placeholder = drag.getPlaceholderElement();
    const rect = placeholder.getBoundingClientRect();
    this.renderer.setStyle(placeholder, 'transition', 'none');
    this.renderer.setStyle(placeholder, 'margin-right', `-${rect.width}px`);
    requestAnimationFrame(() => {
      this.renderer.removeStyle(placeholder, 'transition');
      this.renderer.removeStyle(placeholder, 'margin-right');
    });
  }

  private runPlaceholderExitTransition(drag: CdkDrag) {
    const placeholder = drag.getPlaceholderElement();
    const parent = placeholder.parentElement;
    if (!parent) {
      return;
    }
    const rect = placeholder.getBoundingClientRect();
    const newChild = this.renderer.createElement('div') as HTMLElement;
    const refChild = parent.children.item(this.placeholderIndex + 1);
    this.renderer.insertBefore(parent, newChild, refChild);
    this.renderer.addClass(newChild, 'cdk-drag-placeholder');
    this.renderer.setStyle(newChild, 'width', `${rect.width}px`);
    this.renderer.setStyle(newChild, 'height', `${rect.height}px`);
    this.renderer.setStyle(newChild, 'opacity', '0.0');
    requestAnimationFrame(() => {
      this.renderer.setStyle(newChild, 'margin-right', `-${rect.width}px`);
      if (!hasStyleTransition(newChild)) {
        this.renderer.removeChild(parent, newChild);
      } else {
        newChild.ontransitionend = () => {
          this.renderer.removeChild(parent, newChild);
        };
      }
    });
  }

  private computeIndexInProgress() {
    const w = this.width;
    const s = this.dropListLeft / w;
    const m = this.marbleSize / w;
    const p = Math.min(Math.max(this.progress, 0), 1);
    return ~~((p - s) / m) - 1;
  }

  private updateEndMarker() {
    let i = this.marbles.length - 1;
    for (; i >= 0; --i) {
      if (this.marbles[i].shape !== '') {
        break;
      }
    }
    i += 1;
    const marker = this.endMarkerRef.nativeElement;
    const m = this.marbleSize;
    const s = this.dropListLeft - marker.clientWidth / 2;
    const h = `${m + 4}px`;
    const x = `${s + m / 2 + i * m}px`;
    this.renderer.setStyle(marker, 'left', x);
    this.renderer.setStyle(marker, 'height', h);
    let sy = 0;
    if (this.isEditable) {
      sy = this.isDragging ? 0 : 1;
    } else {
      sy = i > this.indexInProgress ? 0 : 1;
    }
    if (sy === 0 && !this.isEditable) {
      this.renderer.setStyle(marker, 'transition', 'none');
    } else {
      this.renderer.setStyle(marker, 'transition', null);
    }
    this.renderer.setStyle(marker, 'transform', `scale(1, ${sy})`);
  }

  private startRemovalMarkerUpdater() {
    if (this.removalMarkerUpdaterId === 0) {
      const view = this.elementRef.nativeElement.ownerDocument.defaultView;
      if (view) {
        const id = view.setInterval(() => this.updateRemovalMarkers(), 100);
        this.removalMarkerUpdaterId = id;
      }
    }
  }

  private stopRemovalMarkerUpdater() {
    const id = this.removalMarkerUpdaterId;
    this.removalMarkerUpdaterId = 0;
    requestAnimationFrame(() => {
      const view = this.elementRef.nativeElement.ownerDocument.defaultView;
      if (view) {
        view.clearInterval(id);
        this.clearRemovalMarkers();
      }
    });
  }

  private updateRemovalMarkers() {
    const children = Array.from(this.dropList.element.nativeElement.children)
      .map<[number, Element]>((x) => [x.getBoundingClientRect().x, x])
      .sort((a, b) => a[0] - b[0]);

    let removalCount = 0;
    children.forEach((x, n) => {
      const child = x[1] as HTMLElement;
      this.renderer.removeClass(child, 'should-remove');
      if (child.classList.contains('rxp-drop-outside')) {
        removalCount += 1;
        this.renderer.addClass(child, 'should-remove');
      }
      if (n >= this.fixedLength + removalCount && child.clientWidth > 0) {
        this.renderer.addClass(child, 'should-remove');
      }
    });
  }

  private clearRemovalMarkers() {
    const children = Array.from(this.dropList.element.nativeElement.children);
    children.forEach((x) => this.renderer.removeClass(x, 'should-remove'));
  }
}
