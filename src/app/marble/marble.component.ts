import {
  Component,
  ChangeDetectionStrategy,
  Input,
  HostBinding,
} from '@angular/core';
import { Marble } from './marble.model';
@Component({
  selector: 'rxp-marble',
  templateUrl: './marble.component.html',
  styleUrls: ['./marble.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarbleComponent {
  @Input() marble: Marble = { shape: '', color: '' };
  @Input() indicatorColor: string | undefined;

  @HostBinding('class') get classList(): string[] {
    return [
      `shape-${this.marble.shape || 'none'}`,
      `color-${this.marble.color || 'none'}`,
    ];
  }
}
