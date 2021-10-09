// @ts-check

const processText = (text) => {
  const tokens = text
    .split(' ')
    .reduce((acc, part) => [...acc, ...part.split('\n')], []);
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

const calculateTF = ({ terms }, word) => {
  const matchedTermsCount = terms.filter((term) => term === word).length;
  return matchedTermsCount / terms.length;
};

const calculateIDF = (collectionLength, reverseIndex, word) => {
  const docsWithWord = reverseIndex[word] ?? [];
  const numer = collectionLength - docsWithWord.length + 0.5;
  const denom = docsWithWord.length + 0.5;
  const rational = numer / denom;
  return Math.log(rational + 1);
};

const buildSearchEngine = (docs) => {
  const engine = {
    reverseIndex: {},
    docs: [],
    search: (query) => {
      const { terms: searchTerms } = processText(query);
      const weighedDocs = engine.docs
        .map((doc) => {
          const weights = searchTerms.map((term) => {
            const idf = calculateIDF(engine.docs.length, engine.reverseIndex, term);
            const tf = calculateTF(doc, term);
            return idf * tf;
          });
          const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);
          const wordsFound = searchTerms
            .filter((term) => engine.reverseIndex[term]?.includes(doc.id));
          return { id: doc.id, totalWeight, wordsFound };
        })
        .filter(({ wordsFound }) => wordsFound.length > 0)
        .sort((a, b) => b.totalWeight - a.totalWeight);
      return weighedDocs.map(({ id }) => id);
    },
  };
  engine.docs = processCollection(docs);
  engine.reverseIndex = generateReverseIndex(engine.docs);
  return engine;
};

export default buildSearchEngine;
