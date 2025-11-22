// Main application logic

let essentialGenes = [];

// Handle form submission
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('configForm');
    const generateGenesBtn = document.getElementById('generateGenes');
    const runSimulationBtn = document.getElementById('runSimulation');

    generateGenesBtn.addEventListener('click', function(e) {
        e.preventDefault();
        generateGenes();
    });

    runSimulationBtn.addEventListener('click', function(e) {
        e.preventDefault();
        runSimulation();
    });
});

function generateGenes() {
    // Get input values
    const dnaCharsInput = document.getElementById('dnaCharacters').value.trim();
    const geneLength = parseInt(document.getElementById('geneLength').value);
    const numGenes = parseInt(document.getElementById('numEssentialGenes').value);

    // Validate inputs
    if (!dnaCharsInput) {
        alert('Please enter DNA characters');
        return;
    }

    if (isNaN(geneLength) || geneLength < 1) {
        alert('Gene length must be a positive number');
        return;
    }

    if (isNaN(numGenes) || numGenes < 1) {
        alert('Number of essential genes must be a positive number');
        return;
    }

    // Parse DNA characters
    const dnaChars = dnaCharsInput.split(',').map(c => c.trim()).filter(c => c.length > 0);

    if (dnaChars.length < 2) {
        alert('Please provide at least 2 DNA characters');
        return;
    }

    // Set configuration
    Config.setDnaCharacters(dnaChars);
    Config.setGeneLength(geneLength);

    // Generate essential genes
    essentialGenes = generateEssentialGenes(numGenes);

    // Display essential genes
    const genesDisplay = document.getElementById('essentialGenesDisplay');
    genesDisplay.innerHTML = '<h3>Generated Essential Genes:</h3>';

    const genesList = document.createElement('div');
    genesList.className = 'genes-list';

    essentialGenes.forEach((gene, index) => {
        const geneItem = document.createElement('div');
        geneItem.className = 'gene-item';
        geneItem.innerHTML = `<strong>Gene ${index + 1}:</strong> <code>${gene}</code>`;
        genesList.appendChild(geneItem);
    });

    genesDisplay.appendChild(genesList);

    // Show simulation section
    document.getElementById('simulationSection').style.display = 'block';
    document.getElementById('runSimulation').disabled = false;
}

function runSimulation() {
    // Show loading message
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '<div class="loading">Running simulation... Please wait.</div>';
    resultsContainer.style.display = 'block';

    // Get simulation parameters
    const startPopulation = parseInt(document.getElementById('startPopulation').value);
    const maxAllowedPopulation = parseInt(document.getElementById('maxAllowedPopulation').value);
    const generationCount = parseInt(document.getElementById('generationCount').value);
    const insertChance = parseFloat(document.getElementById('insertChance').value);
    const deleteChance = parseFloat(document.getElementById('deleteChance').value);
    const changeChance = parseFloat(document.getElementById('changeChance').value);
    const unusedRatio = parseFloat(document.getElementById('unusedRatio').value);

    // Validate parameters
    if (isNaN(startPopulation) || startPopulation < 1) {
        alert('Initial population must be a positive number');
        return;
    }

    if (isNaN(maxAllowedPopulation) || maxAllowedPopulation < 1) {
        alert('Maximum allowed population must be a positive number');
        return;
    }

    if (maxAllowedPopulation < startPopulation) {
        alert('Maximum allowed population must be greater than or equal to initial population');
        return;
    }

    if (isNaN(generationCount) || generationCount < 1) {
        alert('Generation count must be a positive number');
        return;
    }

    if (isNaN(insertChance) || insertChance < 0 || insertChance >= 1) {
        alert('Insert chance must be between 0.0 and 0.99');
        return;
    }

    if (isNaN(deleteChance) || deleteChance < 0 || deleteChance >= 1) {
        alert('Delete chance must be between 0.0 and 0.99');
        return;
    }

    if (isNaN(changeChance) || changeChance < 0 || changeChance >= 1) {
        alert('Change chance must be between 0.0 and 0.99');
        return;
    }

    if (isNaN(unusedRatio) || unusedRatio < 0 || unusedRatio >= 1) {
        alert('Unused ratio must be between 0.0 and 0.99');
        return;
    }

    // Run simulation asynchronously to avoid blocking UI
    setTimeout(() => {
        try {
            // Create gene pool with user-specified parameters
            const childCount = 2;

            const genePool = new GenePool(
                startPopulation,
                maxAllowedPopulation,
                essentialGenes,
                unusedRatio,
                generationCount,
                childCount,
                insertChance,
                deleteChance,
                changeChance
            );

            // Run simulation
            console.log('Starting simulation...');
            const startTime = performance.now();
            const generationStats = genePool.simulateGenerations();
            const endTime = performance.now();
            console.log(`Simulation completed in ${((endTime - startTime) / 1000).toFixed(2)} seconds`);

            // Clear loading message
            resultsContainer.innerHTML = '';

            // Display results
            const tableContainer = document.createElement('div');
            tableContainer.id = 'tableContainer';
            resultsContainer.appendChild(tableContainer);

            const chartsContainer = document.createElement('div');
            chartsContainer.id = 'chartsContainer';
            resultsContainer.appendChild(chartsContainer);

            displayTable(generationStats);
            displayCharts(generationStats);

        } catch (error) {
            resultsContainer.innerHTML = `<div class="error">Error running simulation: ${error.message}</div>`;
            console.error(error);
        }
    }, 100);
}
