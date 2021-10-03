import _ from 'lodash';

class SearchEngine {
  constructor(docs = []) {
    this.docs = docs;
  }

  textProcess(text) {
    const tokens = text.split(' ');
    const terms = tokens.reduce((acc, token) => [...acc, ...token.match(/\w+/g) ?? []], []);
    return { tokens, terms };
  }

  process(docs) {
    return docs.map((doc) => ({ ...doc, ...this.textProcess(doc.text) }));
  }

  search(needle) {
    const docs = this.process(this.docs);
    const { terms: searchTerms } = this.textProcess(needle);
    return docs
      .filter(({ terms }) => _.intersection(terms, searchTerms).length === searchTerms.length)
      .map(({ id }) => id);
  }
}

export default SearchEngine;
