import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

export const ANIMATIONS = [
  trigger('fadeOutLeft', [
    state('overflowed', style({ opacity: 0, width: 0 })),
    transition(
      (fromState, toState, element: HTMLElement) => {
        if (fromState === 'void' && toState === 'overflowed') {
          return true;
        }
        const isOutside = element.classList.contains('rxp-drop-outside');
        return toState === 'void' && isOutside;
      },
      [
        style('*'),
        animate(
          '225ms cubic-bezier(0.4, 0.0, 0.2, 1)',
          style({ opacity: 0, width: 0 })
        ),
      ]
    ),
  ]),
  trigger('zoomIn', [
    state('false', style({ transform: 'scale(0, 0)' })),
    state('true', style({ transform: 'scale(1, 1)' })),
    transition(
      'false => true',
      animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
    ),
  ]),
];
