import { Component, HostListener, ElementRef, OnInit } from '@angular/core';
import { ThemeService } from 'app/theme.service';
import { range } from 'lodash';
import sha256 from 'fast-sha256';
@Component({
  selector: 'rxp-stage-list',
  templateUrl: './stage-list.component.html',
  styleUrls: ['./stage-list.component.scss'],
})
export class StageListComponent implements OnInit {
  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private themeService: ThemeService
  ) {}

  range(start: number, end?: number, step?: number): number[] {
    return range(start, end, step);
  }

  ngOnInit(): void {
    this.initStageLinks();
    this.updateStageLinks();
  }

  @HostListener('document:visibilitychange', ['$event'])
  visibilitychange(): void {
    this.updateStageLinks();
  }

  private getStageLinks(): NodeListOf<HTMLAnchorElement> {
    return this.elementRef.nativeElement.querySelectorAll<HTMLAnchorElement>(
      '.stages > a'
    );
  }

  private initStageLinks() {
    this.getStageLinks().forEach((a, n) => {
      a.target = '_blank';
      a.text = (n + 1).toString();
      a.className = 'mat-elevation-z2';

      if (!a.dataset.src) {
        return;
      }

      const bytes = new TextEncoder().encode(a.dataset.src);
      a.dataset.key = Array.from(sha256(bytes), (byte) => {
        return ('0' + (byte & 0xff).toString(16)).slice(-2);
      }).join('');

      const doc = this.elementRef.nativeElement.ownerDocument;
      const src = a.dataset.src;
      const hint = `hint=${a.dataset.hint ?? ''}`;
      const title = `title=${doc.title} - ${a.text}`;
      const theme = `theme=${this.themeService.theme}`;
      a.removeAttribute('data-src');
      a.removeAttribute('data-hint');
      a.href = `/stages/${src}?${hint}&${title}&${theme}`;

      a.onclick = () => {
        a.href = a.href.replace(
          /&theme=[^&]*/,
          `&theme=${this.themeService.theme}`
        );
      };
    });
  }

  private updateStageLinks() {
    const document = this.elementRef.nativeElement.ownerDocument;
    const storage = document.defaultView?.localStorage;

    if (!storage) {
      return;
    }

    this.getStageLinks().forEach((a) => {
      const k = a.dataset.key ?? '';
      const v = storage.getItem(k);
      if (v) {
        a.classList.add(v);
      }
    });
  }
}
