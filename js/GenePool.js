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
        this.generations = [];
        this.isExtinct = false;

        // Initialize starting population
        for (let i = 0; i < startPopulation; i++) {
            this.population.push(new DNA(essentialGenes, unusedRatio));
        }

        // Store initial generation
        this.generations.push(new Generation(0, this.population, this.essentialGenes));
    }

    // Simulate one generation and return the generation snapshot
    simulateNextGeneration() {
        // Check if simulation is already complete
        if (this.isComplete()) {
            return null;
        }

        this.currentGeneration++;

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
            console.log(`Population extinct at generation ${this.currentGeneration}`);
            this.isExtinct = true;
            return null;
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

        // Create and store generation snapshot
        const generation = new Generation(this.currentGeneration, this.population, this.essentialGenes);
        this.generations.push(generation);

        return generation;
    }

    // Check if simulation is complete
    isComplete() {
        return this.isExtinct || this.currentGeneration >= this.generationCount;
    }

    // Get all generation statistics
    getAllStats() {
        return this.generations.map(gen => gen.getStats());
    }

    // Get current progress (0 to 1)
    getProgress() {
        return this.currentGeneration / this.generationCount;
    }

    // Legacy method for backward compatibility - runs all generations at once
    simulateGenerations() {
        while (!this.isComplete()) {
            this.simulateNextGeneration();
        }
        return this.getAllStats();
    }
}
