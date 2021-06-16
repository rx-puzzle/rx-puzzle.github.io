import { Marble } from '../../marble/marble.model';
import {
  Observable,
  VirtualTimeScheduler,
  race,
  concat,
  merge,
  zip,
  combineLatest,
} from 'rxjs';
import {
  map,
  //
  scan,
  pairwise,
  bufferCount,
  bufferTime,
  sampleTime,
  throttleTime,
  auditTime,
  debounceTime,
  distinct,
  distinctUntilKeyChanged,
  //
  withLatestFrom,
  concatMap,
  mergeMap,
  switchMap,
  exhaustMap,
  buffer,
  sample,
  throttle,
  audit,
  debounce,
  skipUntil,
  takeUntil,
} from 'rxjs/operators';

export type SequenceOperator = (
  scheduler: VirtualTimeScheduler,
  emittingInterval: number,
  ...sequences: Observable<Marble>[]
) => Observable<Marble>;

export const SINGLE_SEQ_OP_MAP = Object.freeze(
  createSingleSequenceOperatorMap()
);
export const SINGLE_SEQ_OP_KEYS = Object.freeze(
  Array.from(SINGLE_SEQ_OP_MAP.keys())
);

export const DOUBLE_SEQ_OP_MAP = Object.freeze(
  createDoubleSequenceOperatorMap()
);
export const DOUBLE_SEQ_OP_KEYS = Object.freeze(
  Array.from(DOUBLE_SEQ_OP_MAP.keys())
);

export const MULTIPLE_SEQ_OP_MAP = Object.freeze(
  createMultipleSequenceOperatorMap()
);
export const MULTIPLE_SEQ_OP_KEYS = Object.freeze(
  Array.from(MULTIPLE_SEQ_OP_MAP.keys())
);

// prettier-ignore
function combineMarbles(a: Marble, b: Marble): Marble {
  if (!a.shape) {
    return b;
  }
  let shape = 'circle';
  let color = '';
  if (a.shape === b.shape) {
    switch (a.shape) {
      case 'circle'  : shape = 'circle'  ; break;
      case 'rhombus' : shape = 'pentagon'; break;
      case 'pentagon': shape = 'hexagon' ; break;
      case 'hexagon' : shape = 'rhombus' ; break;
    }
  } else if (a.shape === 'circle') { shape = b.shape;
  } else if (b.shape === 'circle') { shape = a.shape;
  }
  if (a.color === b.color) { color = a.color;
  } else if (    !a.color) { color = b.color;
  } else if (    !b.color) { color = a.color;
  }
  return { shape, color } as Marble;
}

function reduceMarbles(marbles: Marble[]): Marble {
  return marbles.reduce(combineMarbles, { shape: '', color: '' });
}

// prettier-ignore
function createSingleSequenceOperatorMap() {
  const operators = new Map<string, SequenceOperator>();
  operators.set('race(a$)', (s, t, ...seqs) =>
    race(...seqs)
  );
  operators.set('scan((x, y) => x + y)', (s, t, ...seqs) =>
    seqs[0].pipe(scan(combineMarbles))
  );
  operators.set('pairwise()', (s, t, ...seqs) =>
    seqs[0].pipe(pairwise(), map(reduceMarbles))
  );
  operators.set('bufferCount(2)', (s, t, ...seqs) =>
    seqs[0].pipe(bufferCount(2), map(reduceMarbles))
  );
  operators.set('bufferCount(2, 1)', (s, t, ...seqs) =>
    seqs[0].pipe(bufferCount(2, 1), map(reduceMarbles))
  );
  operators.set('bufferTime(2t)', (s, t, ...seqs) =>
    seqs[0].pipe(bufferTime(2 * t, s), map(reduceMarbles))
  );
  operators.set('bufferTime(2t, 1t)', (s, t, ...seqs) =>
    seqs[0].pipe(bufferTime(2 * t, 1 * t, s), map(reduceMarbles))
  );
  operators.set('sampleTime(2t)', (s, t, ...seqs) =>
    seqs[0].pipe(sampleTime(2 * t, s))
  );
  operators.set('sampleTime(3t)', (s, t, ...seqs) =>
    seqs[0].pipe(sampleTime(3 * t, s))
  );
  operators.set('throttleTime(1t)', (s, t, ...seqs) =>
    seqs[0].pipe(throttleTime(1 * t, s))
  );
  operators.set('throttleTime(2t)', (s, t, ...seqs) =>
    seqs[0].pipe(throttleTime(2 * t, s))
  );
  operators.set('auditTime(1t)', (s, t, ...seqs) =>
    seqs[0].pipe(auditTime(1 * t, s))
  );
  operators.set('auditTime(2t)', (s, t, ...seqs) =>
    seqs[0].pipe(auditTime(2 * t, s))
  );
  operators.set('debounceTime(1t)', (s, t, ...seqs) =>
    seqs[0].pipe(debounceTime(1 * t, s))
  );
  operators.set('debounceTime(2t)', (s, t, ...seqs) =>
    seqs[0].pipe(debounceTime(2 * t, s))
  );
  operators.set('distinct(x => x.shape)', (s, t, ...seqs) =>
    seqs[0].pipe(distinct(x => x.shape))
  );
  operators.set('distinct(x => x.color)', (s, t, ...seqs) =>
    seqs[0].pipe(distinct(x => x.color))
  );
  operators.set(`distinctUntilKeyChanged('shape')`, (s, t, ...seqs) =>
    seqs[0].pipe(distinctUntilKeyChanged('shape'))
  );
  operators.set(`distinctUntilKeyChanged('color')`, (s, t, ...seqs) =>
    seqs[0].pipe(distinctUntilKeyChanged('color'))
  );
  return operators;
}

// prettier-ignore
function createDoubleSequenceOperatorMap() {
  const operators = new Map<string, SequenceOperator>();
  operators.set('race(a$, b$)', (s, t, ...seqs) =>
    race(...seqs)
  );
  operators.set('concat(a$, b$)', (s, t, ...seqs) =>
    concat(...seqs)
  );
  operators.set('merge(a$, b$)', (s, t, ...seqs) =>
    merge(...seqs)
  );
  operators.set('zip(a$, b$)', (s, t, ...seqs) =>
    zip(...seqs).pipe(map(reduceMarbles))
  );
  operators.set('combineLatest(a$, b$)', (s, t, ...seqs) =>
    combineLatest(seqs).pipe(map(reduceMarbles))
  );
  operators.set('withLatestFrom(b$, (a, b) => a + b)', (s, t, ...seqs) =>
    seqs[0].pipe(withLatestFrom(seqs[1], combineMarbles))
  );
  operators.set('concatMap(a => b$.map(b => a + b))', (s, t, ...seqs) =>
    seqs[0].pipe(
      concatMap((a) => seqs[1].pipe(map((b) => combineMarbles(a, b))))
    )
  );
  operators.set('mergeMap(a => b$.map(b => a + b))', (s, t, ...seqs) =>
    seqs[0].pipe(
      mergeMap((a) => seqs[1].pipe(map((b) => combineMarbles(a, b))))
    )
  );
  operators.set('switchMap(a => b$.map(b => a + b))', (s, t, ...seqs) =>
    seqs[0].pipe(
      switchMap((a) => seqs[1].pipe(map((b) => combineMarbles(a, b))))
    )
  );
  operators.set('exhaustMap(a => b$.map(b => a + b))', (s, t, ...seqs) =>
    seqs[0].pipe(
      exhaustMap((a) => seqs[1].pipe(map((b) => combineMarbles(a, b))))
    )
  );
  operators.set('buffer(b$)', (s, t, ...seqs) =>
    seqs[0].pipe(buffer(seqs[1]), map(reduceMarbles))
  );
  operators.set('sample(b$)', (s, t, ...seqs) =>
    seqs[0].pipe(sample(seqs[1]))
  );
  operators.set('throttle(_ => b$)', (s, t, ...seqs) =>
    seqs[0].pipe(throttle(() => seqs[1]))
  );
  operators.set('audit(_ => b$)', (s, t, ...seqs) =>
    seqs[0].pipe(audit(() => seqs[1]))
  );
  operators.set('debounce(_ => b$)', (s, t, ...seqs) =>
    seqs[0].pipe(debounce(() => seqs[1]))
  );
  operators.set('skipUntil(b$)', (s, t, ...seqs) =>
    seqs[0].pipe(skipUntil(seqs[1]))
  );
  operators.set('takeUntil(b$)', (s, t, ...seqs) =>
    seqs[0].pipe(takeUntil(seqs[1]))
  );
  return operators;
}

// prettier-ignore
export function createMultipleSequenceOperatorMap(): Map<
  string,
  SequenceOperator
> {
  const operators = new Map<string, SequenceOperator>();
  operators.set('race(...$)', (s, t, ...seqs) =>
    race(...seqs)
  );
  operators.set('concat(...$)', (s, t, ...seqs) =>
    concat(...seqs)
  );
  operators.set('merge(...$)', (s, t, ...seqs) =>
    merge(...seqs)
  );
  operators.set('zip(...$)', (s, t, ...seqs) =>
    zip(...seqs).pipe(map(reduceMarbles))
  );
  operators.set('combineLatest(...$)', (s, t, ...seqs) =>
    combineLatest(seqs).pipe(map(reduceMarbles))
  );
  return operators;
}
