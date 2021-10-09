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
