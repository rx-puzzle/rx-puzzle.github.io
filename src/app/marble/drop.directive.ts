import { Directive, Renderer2, OnInit, OnDestroy } from '@angular/core';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { Subscription, merge } from 'rxjs';
import { auditTime, pluck } from 'rxjs/operators';

const OUTSIDE = 'rxp-drop-outside';
@Directive({ selector: '[rxpDrop]' })
export class DropDirective implements OnInit, OnDestroy {
  private dragMovedSubscription!: Subscription;

  get isOutside(): boolean {
    const classList = this.drag.element.nativeElement.classList;
    return classList.contains(OUTSIDE);
  }

  constructor(private renderer: Renderer2, private drag: CdkDrag) {}

  ngOnInit(): void {
    this.dragMovedSubscription = merge(
      this.drag.moved.pipe(auditTime(50), pluck('source')),
      this.drag.released.pipe(pluck('source'))
    ).subscribe((x) => this.updateElements(x));
  }

  ngOnDestroy(): void {
    this.dragMovedSubscription.unsubscribe();
  }

  private findDragPreview(): Element | null {
    const doc = this.drag.element.nativeElement.ownerDocument;
    return doc.querySelector('html > body > .cdk-drag.cdk-drag-preview');
  }

  private isOverlapping(a: Element | null, b: Element | null) {
    if (!a || !b) {
      return false;
    }
    const rA = a.getBoundingClientRect();
    const rB = b.getBoundingClientRect();
    if (rA.right < rB.left || rA.left > rB.right) {
      return false;
    }
    if (rA.bottom < rB.top || rA.top > rB.bottom) {
      return false;
    }
    return true;
  }

  private updateElements(drag: CdkDrag) {
    const placeholder = drag.getPlaceholderElement();
    if (!placeholder) {
      return;
    }
    const item = drag.element.nativeElement;
    const preview = this.findDragPreview();
    const container = placeholder.parentElement;

    const isOverlapping = !this.isOverlapping(preview, container);
    [placeholder, item, preview].map((elem) => {
      if (elem) {
        this.renderer.removeClass(elem, OUTSIDE);
        if (isOverlapping) {
          this.renderer.addClass(elem, OUTSIDE);
        }
      }
    });
  }
}
