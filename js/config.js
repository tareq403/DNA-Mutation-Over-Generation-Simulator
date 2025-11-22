// Global configuration for DNA simulation
class Config {
    static dnaCharacters = ['A', 'T', 'C', 'G'];
    static geneLength = 10;

    static setDnaCharacters(characters) {
        this.dnaCharacters = characters;
    }

    static setGeneLength(length) {
        this.geneLength = length;
    }

    static getRandomDnaCharacter() {
        return this.dnaCharacters[Math.floor(Math.random() * this.dnaCharacters.length)];
    }
}
