// DNA class for genetic simulation
class DNA {
    constructor(...args) {
        if (args.length === 2 && typeof args[0] === 'number') {
            // Constructor 1: DNA(length, essentialGenes)
            this.initWithLength(args[0], args[1]);
        } else if (args.length === 2 && typeof args[1] === 'number') {
            // Constructor 2: DNA(essentialGenes, unusedRatio)
            this.initWithUnusedRatio(args[0], args[1]);
        } else if (args.length === 1 && typeof args[0] === 'string') {
            // Constructor for cloning with existing sequence
            this.sequence = args[0];
        } else {
            throw new Error('Invalid constructor arguments');
        }
    }

    initWithLength(length, essentialGenes) {
        if (length < this.getTotalEssentialLength(essentialGenes)) {
            throw new Error('DNA length is too short to fit all essential genes');
        }

        this.sequence = this.generateDnaWithLength(length, essentialGenes);
    }

    initWithUnusedRatio(essentialGenes, unusedRatio) {
        if (unusedRatio < 0 || unusedRatio >= 1.0) {
            throw new Error('unusedRatio must be between 0.0 and 0.99');
        }

        const totalEssentialLength = this.getTotalEssentialLength(essentialGenes);
        // Calculate total length: essentialLength / (1 - unusedRatio)
        const totalLength = Math.ceil(totalEssentialLength / (1 - unusedRatio));

        this.sequence = this.generateDnaWithLength(totalLength, essentialGenes);
    }

    getTotalEssentialLength(essentialGenes) {
        return essentialGenes.reduce((sum, gene) => sum + gene.length, 0);
    }

    generateDnaWithLength(length, essentialGenes) {
        // Create array to build DNA sequence
        let dna = new Array(length);

        // Shuffle essential genes to randomize placement
        const shuffledGenes = [...essentialGenes].sort(() => Math.random() - 0.5);

        // Calculate positions for each gene
        const positions = [];
        let remainingLength = length;

        shuffledGenes.forEach((gene, index) => {
            if (index === shuffledGenes.length - 1) {
                // Last gene: place it in remaining space
                const maxStart = length - gene.length;
                const start = Math.floor(Math.random() * (maxStart + 1));
                positions.push({ gene, start });
            } else {
                const maxStart = remainingLength - gene.length -
                    (shuffledGenes.length - index - 1); // Reserve space for remaining genes
                const start = Math.floor(Math.random() * Math.max(1, maxStart));
                positions.push({ gene, start });
            }
        });

        // Sort positions by start index to place genes sequentially
        positions.sort((a, b) => a.start - b.start);

        // Place genes in DNA
        let currentPos = 0;
        positions.forEach(({ gene, start }) => {
            // Fill gap before gene with random characters
            for (let i = currentPos; i < start; i++) {
                dna[i] = Config.getRandomDnaCharacter();
            }
            // Place gene
            for (let i = 0; i < gene.length; i++) {
                dna[start + i] = gene[i];
            }
            currentPos = start + gene.length;
        });

        // Fill remaining positions with random characters
        for (let i = currentPos; i < length; i++) {
            dna[i] = Config.getRandomDnaCharacter();
        }

        return dna.join('');
    }

    makeExactCopies(numberOfCopies) {
        const copies = [];
        for (let i = 0; i < numberOfCopies; i++) {
            copies.push(new DNA(this.sequence));
        }
        return copies;
    }

    makeMutatedCopies(numberOfCopies, insertChance, deleteChance, changeChance) {
        const copies = [];
        for (let i = 0; i < numberOfCopies; i++) {
            copies.push(this.mutate(insertChance, deleteChance, changeChance));
        }
        return copies;
    }

    mutate(insertChance, deleteChance, changeChance) {
        let mutatedSequence = '';

        for (let i = 0; i < this.sequence.length; i++) {
            // Insertion before current position
            if (Math.random() < insertChance) {
                mutatedSequence += Config.getRandomDnaCharacter();
            }

            // Deletion of current character
            if (Math.random() < deleteChance) {
                continue; // Skip this character
            }

            // Change current character
            if (Math.random() < changeChance) {
                mutatedSequence += Config.getRandomDnaCharacter();
            } else {
                mutatedSequence += this.sequence[i];
            }
        }

        // Possible insertion at the end
        if (Math.random() < insertChance) {
            mutatedSequence += Config.getRandomDnaCharacter();
        }

        return new DNA(mutatedSequence);
    }

    canSurvive(essentialGenes) {
        // Check if DNA contains at least one copy of each essential gene
        for (const gene of essentialGenes) {
            if (!this.sequence.includes(gene)) {
                return false;
            }
        }
        return true;
    }

    fitnessScore(essentialGenes) {
        let score = 0;

        for (const gene of essentialGenes) {
            // Count occurrences of this gene
            let pos = 0;
            while ((pos = this.sequence.indexOf(gene, pos)) !== -1) {
                score++;
                pos += gene.length;
            }
        }

        return score;
    }

    getUnusedRatio(essentialGenes) {
        const totalLength = this.sequence.length;
        if (totalLength === 0) return 1.0;

        // Mark positions that are part of essential genes
        const usedPositions = new Set();

        for (const gene of essentialGenes) {
            let pos = 0;
            while ((pos = this.sequence.indexOf(gene, pos)) !== -1) {
                for (let i = 0; i < gene.length; i++) {
                    usedPositions.add(pos + i);
                }
                pos += gene.length;
            }
        }

        const usedLength = usedPositions.size;
        const unusedLength = totalLength - usedLength;

        return unusedLength / totalLength;
    }

    getLength() {
        return this.sequence.length;
    }

    getSequence() {
        return this.sequence;
    }
}
