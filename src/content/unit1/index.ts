import type { Unit } from '../types';
import { L1 } from './L1-first-program';
import { L2 } from './L2-cout';
import { L3 } from './L3-newlines';
import { L4 } from './L4-escapes';
import { L5 } from './L5-text-vs-numbers';
import { C1 } from './C1-checkpoint';

export const unit1: Unit = {
  id: 'u1',
  num: 1,
  title: 'Output with cout',
  summary: 'Make the computer talk: text, numbers, new lines, special characters and quick calculations.',
  levels: [L1, L2, L3, L4, L5, C1],
};
