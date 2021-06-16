import {
  Component,
  ViewChild,
  Renderer2,
  ElementRef,
  OnInit,
  DoCheck,
} from '@angular/core';
import { MatSidenav, MatDrawerMode } from '@angular/material/sidenav';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';

interface TocNode {
  name: string;
  children: TocNode[];
  depth: number;
  href: string;
}

@Component({
  selector: 'rxp-guide',
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.scss'],
})
export class GuideComponent implements OnInit, DoCheck {
  @ViewChild(MatSidenav, { static: true })
  readonly sidenav!: MatSidenav;

  sidenavAnimationDisabled = false;

  tocDataSource = new MatTreeNestedDataSource<TocNode>();
  tocTreeControl = new NestedTreeControl<TocNode>((x) => x.children);

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef<HTMLElement>
  ) {}

  ngOnInit(): void {
    this.initToc();
    requestAnimationFrame(() => {
      this.tocTreeControl.expandAll();
    });
  }

  ngDoCheck(): void {
    this.updateSidenavMode();
  }

  isInternalNode(index: number, node: TocNode): boolean {
    return node.children.length > 0;
  }

  onTocNodeClick(event: MouseEvent): void {
    if (this.sidenav.mode !== 'side') {
      void this.sidenav.close();
    }
    if (!event) {
      return;
    }
    const elem = event.target as Element;
    elem.querySelector('a')?.click();
    const selected = [elem];
    let parent = elem.parentElement;
    while (parent && !parent.classList.contains('mat-tree')) {
      if (parent.classList.contains('mat-nested-tree-node')) {
        const treeNode = parent.querySelector('.mat-tree-node');
        if (treeNode) {
          selected.push(treeNode);
        }
      }
      parent = parent.parentElement;
    }
    const name = 'is-selected';
    this.elementRef.nativeElement
      .querySelectorAll('mat-sidenav .' + name)
      .forEach((x) => this.renderer.removeClass(x, name));
    selected.forEach((x) => this.renderer.addClass(x, name));
  }

  private initToc() {
    const tocNodes: TocNode[] = [];
    const headings = this.elementRef.nativeElement.querySelectorAll(
      'h1, h2, h3, h4, h5, h6'
    );
    headings.forEach((elem) => {
      const heading = elem as HTMLElement;
      if (!heading.innerText.trim().startsWith('#')) {
        return;
      }
      const tokens = heading.innerText
        .split(/[#>]/)
        .map((x) => x.trim())
        .filter((x) => x);
      if (tokens.length === 0) {
        return;
      }
      let siblings = tocNodes;
      let tocNode: TocNode | undefined;
      tokens.forEach((token, index) => {
        tocNode = siblings.find((x) => x.name === token);
        if (!tocNode) {
          tocNode = { name: token, children: [], depth: index, href: '' };
          siblings.push(tocNode);
        }
        siblings = tocNode.children;
      });
      const id = tokens.map((x) => x.replace(/\s/g, '-')).join('>');
      if (!tocNode) {
        return;
      }
      const text = tocNode.name;
      tocNode.href = '/guide#' + id;
      this.renderer.setProperty(heading, 'id', id);
      this.renderer.setProperty(heading, 'innerText', text);
    });
    this.tocDataSource.data = tocNodes;
    this.tocTreeControl.dataNodes = tocNodes;
  }

  private updateSidenavMode() {
    const width = this.elementRef.nativeElement.clientWidth;
    const mode: MatDrawerMode = width <= 959 ? 'over' : 'side';
    if (this.sidenav.mode !== mode) {
      requestAnimationFrame(() => {
        this.sidenav.mode = mode;
        this.sidenav.opened = mode === 'side';
        this.sidenavAnimationDisabled = true;
        requestAnimationFrame(() => (this.sidenavAnimationDisabled = false));
      });
    }
  }
}
