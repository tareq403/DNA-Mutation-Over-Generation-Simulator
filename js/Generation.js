// Generation class for storing population snapshot data
class Generation {
    constructor(generationNumber, population, essentialGenes) {
        this.generation = generationNumber;
        this.population = population;
        this.essentialGenes = essentialGenes;

        // Calculate and store statistics
        this.calculateStats();
    }

    calculateStats() {
        const fitnessScores = this.population.map(organism => organism.getFitness());
        const lengths = this.population.map(organism => organism.getAverageLength());
        const totalLengths = this.population.map(organism => organism.getTotalLength());
        const unusedRatios = this.population.map(organism => organism.getAverageUnusedRatio());

        this.populationSize = this.population.length;
        this.totalFitness = fitnessScores.reduce((sum, score) => sum + score, 0);
        this.totalLength = totalLengths.reduce((sum, len) => sum + len, 0);

        this.avgFitness = this.populationSize > 0 ? this.totalFitness / this.populationSize : 0;
        this.avgLength = this.populationSize > 0 ?
            lengths.reduce((sum, len) => sum + len, 0) / this.populationSize : 0;
        this.avgUnusedRatio = this.populationSize > 0 ?
            unusedRatios.reduce((sum, ratio) => sum + ratio, 0) / this.populationSize : 0;

        this.medianFitness = this.calculateMedian(fitnessScores);
    }

    calculateMedian(values) {
        if (values.length === 0) return 0;

        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);

        if (sorted.length % 2 === 0) {
            return (sorted[mid - 1] + sorted[mid]) / 2;
        } else {
            return sorted[mid];
        }
    }

    getStats() {
        return {
            generation: this.generation,
            populationSize: this.populationSize,
            totalFitness: this.totalFitness,
            medianFitness: this.medianFitness,
            avgFitness: this.avgFitness,
            avgLength: this.avgLength,
            totalLength: this.totalLength,
            avgUnusedRatio: this.avgUnusedRatio
        };
    }
}
