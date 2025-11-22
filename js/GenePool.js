// GenePool class for running evolutionary simulation
class GenePool {
    constructor(startPopulation, maxAllowedPopulation, essentialGenes, unusedRatio,
                generationCount, insertChance, deleteChance, changeChance, asexual) {
        this.startPopulation = startPopulation;
        this.maxAllowedPopulation = maxAllowedPopulation;
        this.essentialGenes = essentialGenes;
        this.unusedRatio = unusedRatio;
        this.generationCount = generationCount;
        this.insertChance = insertChance;
        this.deleteChance = deleteChance;
        this.changeChance = changeChance;
        this.asexual = asexual;

        this.currentGeneration = 0;
        this.population = [];
        this.generations = [];
        this.isExtinct = false;

        // Initialize starting population with organisms
        for (let i = 0; i < startPopulation; i++) {
            this.population.push(new Organism(essentialGenes, unusedRatio, asexual));
        }

        // Store initial generation
        this.generations.push(new Generation(0, this.population, this.essentialGenes));
    }

    // Reproduce to create a child organism
    reproduce() {
        if (this.asexual) {
            // Asexual reproduction: take 1 random organism
            const parent = this.population[Math.floor(Math.random() * this.population.length)];

            // Get gamete (direct copy for asexual)
            const gamete = parent.getGamete();

            // Apply mutations
            const mutatedGamete = gamete.mutate(this.insertChance, this.deleteChance, this.changeChance);

            // Create child organism
            return Organism.fromDNA(mutatedGamete, null, this.essentialGenes, true);
        } else {
            // Sexual reproduction: take 2 random organisms
            const parent1 = this.population[Math.floor(Math.random() * this.population.length)];
            const parent2 = this.population[Math.floor(Math.random() * this.population.length)];

            // Get gametes from both parents (with recombination)
            const gamete1 = parent1.getGamete();
            const gamete2 = parent2.getGamete();

            // Apply mutations to both gametes
            const mutatedGamete1 = gamete1.mutate(this.insertChance, this.deleteChance, this.changeChance);
            const mutatedGamete2 = gamete2.mutate(this.insertChance, this.deleteChance, this.changeChance);

            // Create child organism with both mutated gametes
            return Organism.fromDNA(mutatedGamete1, mutatedGamete2, this.essentialGenes, false);
        }
    }

    // Simulate one generation and return the generation snapshot
    simulateNextGeneration() {
        // Check if simulation is already complete
        if (this.isComplete()) {
            return null;
        }

        this.currentGeneration++;

        // Create children through reproduction
        const children = [];
        const currentPopulationSize = this.population.length;
        const targetChildrenCount = currentPopulationSize * 2;

        // Reproduce until we have at least n*2 children
        while (children.length < targetChildrenCount) {
            const child = this.reproduce();
            children.push(child);
        }

        // Filter out children that cannot survive
        const survivors = children.filter(child => child.canSurvive());

        // Check if population extinct
        if (survivors.length === 0) {
            console.log(`Population extinct at generation ${this.currentGeneration}`);
            this.isExtinct = true;
            return null;
        }

        // Sort by fitness score (descending)
        survivors.sort((a, b) => {
            return b.getFitness() - a.getFitness();
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
