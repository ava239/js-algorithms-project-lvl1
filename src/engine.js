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
  const docsWithWord = reverseIndex[word].length;
  return Math.log(collectionLength / docsWithWord);
};

const buildSearchEngine = (docs) => {
  const engine = {
    reverseIndex: {},
    docs: [],
    avgLength: 1,
    search: (query) => {
      const { terms: searchTerms } = processText(query);
      const weighedDocs = engine.docs
        .map((doc) => {
          const { terms, id } = doc;
          const weights = searchTerms.map((term) => {
            const idf = calculateIDF(engine.docs.length, engine.reverseIndex, term);
            const tf = calculateTF(doc, term);
            const k1 = 0;
            const b = 0.75;
            const tfNumer = tf * (k1 + 1);
            const tfDenom = tf + k1 * (1 - b + b * (terms.length / engine.avgLength));
            const tfPart = tfNumer / tfDenom;
            return idf * tfPart;
          });
          const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);
          const wordsFound = searchTerms.filter((term) => engine.reverseIndex[term].includes(id));
          return { id, totalWeight, wordsFound };
        })
        .filter(({ wordsFound }) => wordsFound.length > 0)
        .sort((a, b) => b.totalWeight - a.totalWeight);
      return weighedDocs.map(({ id }) => id);
    },
  };
  engine.docs = processCollection(docs);
  const sumLength = engine.docs
    .map(({ terms }) => terms.length)
    .reduce((acc, length) => acc + length, 0);
  engine.avgLength = sumLength / engine.docs.length;
  engine.reverseIndex = generateReverseIndex(engine.docs);
  return engine;
};

export default buildSearchEngine;
