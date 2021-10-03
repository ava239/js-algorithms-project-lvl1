class SearchEngine {
  constructor(docs = []) {
    this.docs = docs;
  }

  process() {
    this.docs = this.docs.map((doc) => {
      const words = doc.text.split(' ');
      return { ...doc, words };
    });
  }

  search(needle) {
    this.process();
    return this.docs
      .filter(({ words }) => words.includes(needle))
      .map(({ id }) => id);
  }
}

export default SearchEngine;
