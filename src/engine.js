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
      .filter(({ terms }) => _.intersection(terms, searchTerms).length === searchTerms.length)
      .map(({ id }) => id);
  },
});

export default buildSearchEngine;
