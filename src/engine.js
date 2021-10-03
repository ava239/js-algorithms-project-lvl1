// @ts-check
import _ from 'lodash';

const processText = (text) => {
  const tokens = text.split(' ');
  const terms = tokens.reduce((acc, token) => [...acc, ...token.match(/\w+/g) ?? []], []);
  return { tokens, terms };
};

const processCollection = (docs) => docs.map((doc) => ({ ...doc, ...processText(doc.text) }));

const buildSearchEngine = (docs) => ({
  search: (needle) => {
    const processedDocs = processCollection(docs);
    const { terms: searchTerms } = processText(needle);
    return processedDocs
      .map((doc) => {
        const { terms } = doc;
        const matchesCount = terms.filter((term) => searchTerms.includes(term)).length;
        const wordsFound = _.intersection(terms, searchTerms).length;
        return { ...doc, matchesCount, wordsFound };
      })
      .filter(({ wordsFound }) => wordsFound > 0)
      .sort((a, b) => {
        const wordsDiff = b.wordsFound - a.wordsFound;
        if (wordsDiff !== 0) {
          return wordsDiff;
        }
        return b.matchesCount - a.matchesCount;
      })
      .map(({ id }) => id);
  },
});

export default buildSearchEngine;
