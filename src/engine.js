// @ts-check

const processText = (text) => {
  const tokens = text.split(' ');
  const rawTerms = tokens.reduce((acc, token) => [...acc, ...token.match(/\w+/g) ?? []], []);
  const terms = rawTerms.map((term) => term.toLowerCase());
  return { tokens, terms };
};

const processCollection = (docs) => docs.map((doc) => ({ ...doc, ...processText(doc.text) }));

const generateReverseIndex = (docs) => {
  const termsByDoc = docs.map(({ terms }) => terms);
  const allTerms = [...termsByDoc].flat();
  const uniqueTerms = Array.from(new Set(allTerms));
  return uniqueTerms.reduce((acc, term) => {
    acc[term] = docs.filter(({ terms }) => terms.includes(term)).map(({ id }) => id);
    return acc;
  }, {});
};

const buildSearchEngine = (docs) => {
  const searchEngine = {
    reverseIndex: {},
    docs: [],
    search: (needle) => {
      const { terms: searchTerms } = processText(needle);
      return searchEngine.docs
        .map((doc) => {
          const { id, terms } = doc;
          const wordsFound = searchTerms.filter((term) => searchEngine.reverseIndex[term].includes(id));
          const matchesCount = terms.filter((term) => wordsFound.includes(term)).length;
          return { ...doc, matchesCount, wordsFound };
        })
        .filter(({ wordsFound }) => wordsFound.length > 0)
        .sort((a, b) => {
          const wordsDiff = b.wordsFound.length - a.wordsFound.length;
          if (wordsDiff !== 0) {
            return wordsDiff;
          }
          return b.matchesCount - a.matchesCount;
        })
        .map(({ id }) => id);
    },
  };
  searchEngine.docs = processCollection(docs);
  searchEngine.reverseIndex = generateReverseIndex(searchEngine.docs);
  return searchEngine;
};

export default buildSearchEngine;
