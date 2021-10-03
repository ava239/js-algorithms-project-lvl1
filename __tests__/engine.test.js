import { test, expect } from '@jest/globals';
import buildSearchEngine from '../src/engine.js';

test('empty', () => {
  const searchEngine = buildSearchEngine([]);

  expect(searchEngine.search('')).toEqual([]);
});

test('docs', () => {
  const doc1 = { id: 'doc1', text: "I can't shoot straight unless I've had a pint!" };
  const doc2 = { id: 'doc2', text: "Don't shoot shoot shoot that thing at me." };
  const doc3 = { id: 'doc3', text: "I'm your shooter." };
  const docs = [doc1, doc2, doc3];

  const searchEngine = buildSearchEngine(docs);

  expect(searchEngine.search('shoot')).toEqual(['doc1', 'doc2']);
  expect(searchEngine.search('pint')).toEqual(['doc1']);
  expect(searchEngine.search('pint!')).toEqual(['doc1']);
});
