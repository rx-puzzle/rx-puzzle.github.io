import { CdkDragDrop } from '@angular/cdk/drag-drop';
import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Marble } from './marble.model';

@Component({
  selector: 'rxp-marble-palette',
  templateUrl: './marble-palette.component.html',
  styleUrls: ['./marble-palette.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class MarblePaletteComponent implements OnChanges {
  // prettier-ignore
  @Input() marbles: Marble[] = [
    { shape: 'circle'  , color: ''       },
    { shape: 'rhombus' , color: ''       },
    { shape: 'pentagon', color: ''       },
    { shape: 'hexagon' , color: ''       },
    { shape: 'circle'  , color: 'type-a' },
    { shape: 'rhombus' , color: 'type-a' },
    { shape: 'pentagon', color: 'type-a' },
    { shape: 'hexagon' , color: 'type-a' },
    { shape: 'circle'  , color: 'type-b' },
    { shape: 'rhombus' , color: 'type-b' },
    { shape: 'pentagon', color: 'type-b' },
    { shape: 'hexagon' , color: 'type-b' },
    { shape: 'circle'  , color: 'type-c' },
    { shape: 'rhombus' , color: 'type-c' },
    { shape: 'pentagon', color: 'type-c' },
    { shape: 'hexagon' , color: 'type-c' },
  ];

  @Input() cols = 4;
  @Input() gutterSize = 4;
  @Input() rowHeight = 4;
  @Input() marbleSize = 20;

  marbleBoxes: Marble[][];

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    this.marbleBoxes = this.marbles?.map((x) => [{ ...x }]);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.marbles) {
      this.marbleBoxes = this.marbles.map((x) => [{ ...x }]);
    }
  }

  dontEnter(): boolean {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onDragDropped(event: CdkDragDrop<Marble[]>): void {
    this.marbleBoxes.forEach((x, n) => {
      x.splice(0, x.length, { ...this.marbles[n] });
    });
    this.changeDetectorRef.markForCheck();
  }
}
