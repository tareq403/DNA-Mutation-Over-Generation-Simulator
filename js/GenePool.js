// GenePool class for running evolutionary simulation
class GenePool {
    constructor(startPopulation, maxAllowedPopulation, essentialGenes, unusedRatio,
                generationCount, childCount, insertChance, deleteChance, changeChance) {
        this.startPopulation = startPopulation;
        this.maxAllowedPopulation = maxAllowedPopulation;
        this.essentialGenes = essentialGenes;
        this.unusedRatio = unusedRatio;
        this.generationCount = generationCount;
        this.childCount = childCount;
        this.insertChance = insertChance;
        this.deleteChance = deleteChance;
        this.changeChance = changeChance;

        this.currentGeneration = 0;
        this.population = [];

        // Initialize starting population
        for (let i = 0; i < startPopulation; i++) {
            this.population.push(new DNA(essentialGenes, unusedRatio));
        }
    }

    simulateGenerations() {
        const generationStats = [];

        // Record initial generation stats
        generationStats.push(this.getGenerationStats(0));

        for (let gen = 1; gen <= this.generationCount; gen++) {
            this.currentGeneration = gen;

            // Create children from current population
            const children = [];
            for (const parent of this.population) {
                const mutatedChildren = parent.makeMutatedCopies(
                    this.childCount,
                    this.insertChance,
                    this.deleteChance,
                    this.changeChance
                );
                children.push(...mutatedChildren);
            }

            // Filter out children that cannot survive
            const survivors = children.filter(child => child.canSurvive(this.essentialGenes));

            // Check if population extinct
            if (survivors.length === 0) {
                console.log(`Population extinct at generation ${gen}`);
                break;
            }

            // Sort by fitness score (descending)
            survivors.sort((a, b) => {
                return b.fitnessScore(this.essentialGenes) - a.fitnessScore(this.essentialGenes);
            });

            // Keep only top performers if exceeding max population
            if (survivors.length > this.maxAllowedPopulation) {
                this.population = survivors.slice(0, this.maxAllowedPopulation);
            } else {
                this.population = survivors;
            }

            // Record stats for this generation
            generationStats.push(this.getGenerationStats(gen));
        }

        return generationStats;
    }

    getGenerationStats(generation) {
        const fitnessScores = this.population.map(dna =>
            dna.fitnessScore(this.essentialGenes)
        );
        const lengths = this.population.map(dna => dna.getLength());
        const unusedRatios = this.population.map(dna =>
            dna.getUnusedRatio(this.essentialGenes)
        );

        const totalFitness = fitnessScores.reduce((sum, score) => sum + score, 0);
        const totalLength = lengths.reduce((sum, len) => sum + len, 0);
        const avgFitness = this.population.length > 0 ? totalFitness / this.population.length : 0;
        const avgLength = this.population.length > 0 ? totalLength / this.population.length : 0;
        const avgUnusedRatio = this.population.length > 0 ?
            unusedRatios.reduce((sum, ratio) => sum + ratio, 0) / this.population.length : 0;

        const medianFitness = this.calculateMedian(fitnessScores);

        return {
            generation: generation,
            populationSize: this.population.length,
            totalFitness: totalFitness,
            medianFitness: medianFitness,
            avgFitness: avgFitness,
            avgLength: avgLength,
            totalLength: totalLength,
            avgUnusedRatio: avgUnusedRatio
        };
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
}
