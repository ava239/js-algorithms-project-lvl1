// @ts-check

import SearchEngine from './classes/engine';

const buildSearchEngine = (docs) => new SearchEngine(docs);

export default buildSearchEngine;
