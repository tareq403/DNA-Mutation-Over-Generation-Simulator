// Utility functions for DNA simulation

// Generate unique essential genes
function generateEssentialGenes(numberOfGenes) {
    const genes = new Set();

    while (genes.size < numberOfGenes) {
        let gene = '';
        for (let i = 0; i < Config.geneLength; i++) {
            gene += Config.getRandomDnaCharacter();
        }
        genes.add(gene);
    }

    return Array.from(genes);
}

// Format number with fixed decimal places
function formatNumber(num, decimals = 2) {
    return num.toFixed(decimals);
}

// Format large numbers with commas
function formatWithCommas(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
