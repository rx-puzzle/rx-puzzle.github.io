import {
  Component,
  Inject,
  Renderer2,
  ChangeDetectorRef,
  OnInit,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'rxp-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private breakpointObserver: BreakpointObserver,
    private changeDetectorRef: ChangeDetectorRef,
    private renderer: Renderer2,
    @Inject(DOCUMENT)
    private document: Document,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    this.addSvgIcons(iconRegistry, sanitizer);
  }

  ngOnInit(): void {
    this.breakpointObserver
      .observe([
        Breakpoints.Small, // 599px ~ 959px
        Breakpoints.HandsetPortrait, // 359px
        Breakpoints.HandsetLandscape, // 599px
      ])
      .subscribe(() => {
        this.changeDetectorRef.detectChanges();
        this.updateViewport(400);
      });
  }

  private addSvgIcons(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    // prettier-ignore
    const entries: [string, string][] = [
      ['favicon'        , 'favicon.svg'        ],
      ['github'         , 'github-circle.svg'  ],
      ['add-sequence'   , 'add-sequence.svg'   ],
      ['add-transformer', 'add-transformer.svg'],
      ['equal'          , 'equal.svg'          ],
      ['not-equal'      , 'not-equal.svg'      ],
    ];
    for (const entry of entries) {
      const url = `assets/icons/${entry[1]}`;
      const safeUrl = sanitizer.bypassSecurityTrustResourceUrl(url);
      iconRegistry.addSvgIcon(entry[0], safeUrl);
    }
  }

  private updateViewport(minWidth: number) {
    const vp = this.document.querySelector('meta[name=viewport]');
    const vpWidth = this.document.defaultView?.innerWidth;
    if (vp && vpWidth) {
      const width = vpWidth < minWidth ? `${minWidth}px` : 'device-width';
      const options = `width=${width}, user-scalable=no`;
      this.renderer.setAttribute(vp, 'content', options);
    }
  }
}
