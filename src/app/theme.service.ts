import {
  Injectable,
  Inject,
  OnDestroy,
  RendererFactory2,
  Renderer2,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ThemeService implements OnDestroy {
  readonly allThemes = Object.freeze(['rxp-light-theme', 'rxp-dark-theme']);

  get theme(): string {
    const first = this.allThemes.find((x) =>
      this.document.documentElement.classList.contains(x)
    );
    return first || 'rxp-light-theme';
  }

  set theme(value: string) {
    if (!this.allThemes.includes(value)) {
      return;
    }
    const elem = this.document.documentElement;
    this.allThemes.forEach((x) => this.renderer.removeClass(elem, x));
    this.renderer.addClass(elem, value);
  }

  private renderer: Renderer2;
  private disposeMessageListener = () => {
    return;
  };

  constructor(
    @Inject(DOCUMENT) private document: Document,
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.disposeMessageListener = this.renderer.listen(
      document.defaultView,
      'message',
      (event: MessageEvent<{ theme: string }>) => {
        const theme = event.data?.theme;
        if (theme && typeof theme === 'string') {
          this.theme = theme;
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.disposeMessageListener();
  }
}
