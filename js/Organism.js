// Organism class representing an individual with DNA
class Organism {
    constructor(essentialGenes, unusedRatio, asexual) {
        this.asexual = asexual;
        this.essentialGenes = essentialGenes;

        if (asexual) {
            // Asexual organism has 1 DNA
            this.dna1 = new DNA(essentialGenes, unusedRatio);
            this.dna2 = null;
        } else {
            // Sexual organism has 2 DNAs
            this.dna1 = new DNA(essentialGenes, unusedRatio);
            this.dna2 = new DNA(essentialGenes, unusedRatio);
        }
    }

    // Alternative constructor for creating organism from existing DNA(s)
    static fromDNA(dna1, dna2, essentialGenes, asexual) {
        const organism = Object.create(Organism.prototype);
        organism.asexual = asexual;
        organism.essentialGenes = essentialGenes;
        organism.dna1 = dna1;
        organism.dna2 = dna2;
        return organism;
    }

    // Get gamete for reproduction
    getGamete() {
        if (this.asexual) {
            // Asexual: return direct copy of DNA
            return new DNA(this.dna1.getSequence());
        } else {
            // Sexual: perform recombination and return one gamete
            return this.performRecombination();
        }
    }

    // Perform recombination between two DNAs
    performRecombination() {
        const seq1 = this.dna1.getSequence();
        const seq2 = this.dna2.getSequence();

        // Determine number of crossover points (k)
        // Random between 1 and 5 crossover points
        const k = Math.floor(Math.random() * 5) + 1;

        // Get the minimum length to avoid index out of bounds
        const minLength = Math.min(seq1.length, seq2.length);

        if (minLength < 2) {
            // If sequences too short, just return one randomly
            return Math.random() < 0.5 ? new DNA(seq1) : new DNA(seq2);
        }

        // Generate k random crossover points
        const crossoverPoints = new Set();
        while (crossoverPoints.size < k) {
            const point = Math.floor(Math.random() * (minLength - 1)) + 1;
            crossoverPoints.add(point);
        }

        // Sort crossover points
        const sortedPoints = Array.from(crossoverPoints).sort((a, b) => a - b);

        // Add boundaries
        const points = [0, ...sortedPoints, Math.max(seq1.length, seq2.length)];

        // Perform crossover to create two gametes
        let gamete1 = '';
        let gamete2 = '';
        let useFirst = true;

        for (let i = 0; i < points.length - 1; i++) {
            const start = points[i];
            const end = points[i + 1];

            if (useFirst) {
                gamete1 += seq1.substring(start, Math.min(end, seq1.length));
                gamete2 += seq2.substring(start, Math.min(end, seq2.length));
            } else {
                gamete1 += seq2.substring(start, Math.min(end, seq2.length));
                gamete2 += seq1.substring(start, Math.min(end, seq1.length));
            }

            useFirst = !useFirst;
        }

        // Return one of the two gametes randomly
        return Math.random() < 0.5 ? new DNA(gamete1) : new DNA(gamete2);
    }

    // Get fitness score
    getFitness() {
        if (this.asexual) {
            return this.dna1.fitnessScore(this.essentialGenes);
        } else {
            return this.dna1.fitnessScore(this.essentialGenes) +
                   this.dna2.fitnessScore(this.essentialGenes);
        }
    }

    // Check if organism can survive
    canSurvive() {
        if (this.asexual) {
            // All essential genes must be in the single DNA
            return this.dna1.canSurvive(this.essentialGenes);
        } else {
            // Each essential gene must be in at least one of the two DNAs
            for (const gene of this.essentialGenes) {
                const inDna1 = this.dna1.getSequence().includes(gene);
                const inDna2 = this.dna2.getSequence().includes(gene);

                if (!inDna1 && !inDna2) {
                    return false;
                }
            }
            return true;
        }
    }

    // Get average DNA length
    getAverageLength() {
        if (this.asexual) {
            return this.dna1.getLength();
        } else {
            return (this.dna1.getLength() + this.dna2.getLength()) / 2;
        }
    }

    // Get average unused ratio
    getAverageUnusedRatio() {
        if (this.asexual) {
            return this.dna1.getUnusedRatio(this.essentialGenes);
        } else {
            return (this.dna1.getUnusedRatio(this.essentialGenes) +
                    this.dna2.getUnusedRatio(this.essentialGenes)) / 2;
        }
    }

    // Get total DNA length
    getTotalLength() {
        if (this.asexual) {
            return this.dna1.getLength();
        } else {
            return this.dna1.getLength() + this.dna2.getLength();
        }
    }
}
