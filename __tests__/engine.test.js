import { test, expect, beforeEach } from '@jest/globals';
import buildSearchEngine from '../src/engine.js';

let searchEngine;
beforeEach(() => {
  const doc1 = { id: 'doc1', text: "I can't shoot shoot straight unless I've had a pint!" };
  const doc2 = { id: 'doc2', text: "Don't shoot shoot shoot that thing at me." };
  const doc3 = { id: 'doc3', text: "I'm your shooter." };
  const doc4 = { id: 'doc4', text: "Don't shoot that thing at me." };
  const docs = [doc1, doc2, doc3, doc4];
  searchEngine = buildSearchEngine(docs);
});

test('empty docs', () => {
  const searchEngineEmpty = buildSearchEngine([]);
  expect(searchEngineEmpty.search('')).toEqual([]);
});

test('terms search', () => {
  expect(searchEngine.search('pint')).toEqual(['doc1']);
  expect(searchEngine.search('pint!')).toEqual(['doc1']);
});

test('relevancy order', () => {
  expect(searchEngine.search('shoot')).toEqual(['doc2', 'doc1', 'doc4']);
});

test('non-exact search', () => {
  expect(searchEngine.search('shoot me')).toEqual(['doc2', 'doc4', 'doc1']);
});

test('reverse index', () => {
  const expectedIndex = {
    i: ['doc1', 'doc3'],
    can: ['doc1'],
    t: ['doc1', 'doc2', 'doc4'],
    shoot: ['doc1', 'doc2', 'doc4'],
    straight: ['doc1'],
    unless: ['doc1'],
    ve: ['doc1'],
    had: ['doc1'],
    a: ['doc1'],
    pint: ['doc1'],
    don: ['doc2', 'doc4'],
    that: ['doc2', 'doc4'],
    thing: ['doc2', 'doc4'],
    at: ['doc2', 'doc4'],
    me: ['doc2', 'doc4'],
    m: ['doc3'],
    your: ['doc3'],
    shooter: ['doc3'],
  };
  expect(searchEngine.reverseIndex).toEqual(expectedIndex);
});
