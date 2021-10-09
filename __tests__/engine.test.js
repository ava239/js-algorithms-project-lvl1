import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import { test, expect } from '@jest/globals';
import buildSearchEngine from '../src/engine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const read = (filePath) => fs.readFileSync(filePath, 'utf-8').trim();
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const getFixture = (id) => read(getFixturePath(`${id}`));

test('simple search', () => {
  const docIds = ['garbage_patch_NG', 'garbage_patch_ocean_clean', 'garbage_patch_wiki'];
  const docs = docIds.map((id) => ({ id, text: getFixture(id) }));
  const searchEngine = buildSearchEngine(docs);

  const expected = ['garbage_patch_NG', 'garbage_patch_ocean_clean', 'garbage_patch_wiki'];
  expect(searchEngine.search('trash island')).toEqual(expected);
});

test('with spam', () => {
  const docIds = ['garbage_patch_NG', 'garbage_patch_ocean_clean', 'garbage_patch_wiki', 'garbage_patch_spam'];
  const docs = docIds.map((id) => ({ id, text: getFixture(id) }));
  const searchEngine = buildSearchEngine(docs);

  const expected = ['garbage_patch_NG', 'garbage_patch_ocean_clean', 'garbage_patch_wiki', 'garbage_patch_spam'];
  expect(searchEngine.search('the trash island is a')).toEqual(expected);
});

test('empty', () => {
  const docIds = ['garbage_patch_NG', 'garbage_patch_ocean_clean', 'garbage_patch_wiki', 'garbage_patch_spam'];
  const docs = docIds.map((id) => ({ id, text: getFixture(id) }));
  const searchEngine = buildSearchEngine(docs);

  const expected = [];
  expect(searchEngine.search('')).toEqual(expected);
});

test('short strings', () => {
  const doc1 = { id: 'doc1', text: "I can't shoot straight unless I've had a pint!" };
  const doc2 = { id: 'doc2', text: "Don't shoot shoot shoot that thing at me." };
  const doc3 = { id: 'doc3', text: "I'm your shooter." };
  const docs = [doc1, doc2, doc3];
  const searchEngine = buildSearchEngine(docs);

  const expected = ['doc2', 'doc1'];
  expect(searchEngine.search('shoot at me, nerd')).toEqual(expected);
});
