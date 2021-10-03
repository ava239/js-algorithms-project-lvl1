class SearchEngine {
  constructor(docs = []) {
    this.docs = docs;
  }

  process() {
    this.docs = this.docs.map((doc) => {
      const tokens = doc.text.split(' ');
      const terms = tokens.reduce((acc, token) => [...acc, ...token.match(/\w+/g)], []);
      return { ...doc, tokens, terms };
    });
  }

  search(needle) {
    this.process();
    return this.docs
      .filter(({ terms }) => terms.includes(needle))
      .map(({ id }) => id);
  }
}

export default SearchEngine;
