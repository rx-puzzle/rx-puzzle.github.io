import {
  AnimationStyleMetadata,
  trigger,
  transition,
  style,
  animate,
} from '@angular/animations';

export const ANIMATIONS = [
  trigger('fadeIn', [
    enterTransition(style({ opacity: '0' }), style({ opacity: '1' })),
  ]),
  trigger('fadeInDown', [
    enterTransition(
      style({ opacity: '0', height: '0' }),
      style({ opacity: '1', height: '*' })
    ),
  ]),
  trigger('fadeOut', [
    leaveTransition(style({ opacity: '*' }), style({ opacity: '0' })),
  ]),
  trigger('fadeOutUp', [
    leaveTransition(
      style({ opacity: '*', height: '*' }),
      style({ opacity: '0', height: '0' })
    ),
  ]),
];

function enterTransition(
  start: AnimationStyleMetadata,
  end: AnimationStyleMetadata
) {
  const timings = '225ms cubic-bezier(0.4, 0.0, 0.2, 1)';
  return transition(':enter', [start, animate(timings, end)]);
}

function leaveTransition(
  start: AnimationStyleMetadata,
  end: AnimationStyleMetadata
) {
  const timings = '225ms cubic-bezier(0.4, 0.0, 0.2, 1)';
  return transition(':leave', [start, animate(timings, end)]);
}
