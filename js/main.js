// Main application logic

let essentialGenes = [];
let currentGenePool = null;
let simulationRunning = false;
let stopRequested = false;

// Handle form submission
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('configForm');
    const generateGenesBtn = document.getElementById('generateGenes');
    const runSimulationBtn = document.getElementById('runSimulation');
    const stopSimulationBtn = document.getElementById('stopSimulation');

    generateGenesBtn.addEventListener('click', function(e) {
        e.preventDefault();
        generateGenes();
    });

    runSimulationBtn.addEventListener('click', function(e) {
        e.preventDefault();
        runSimulation();
    });

    stopSimulationBtn.addEventListener('click', function(e) {
        e.preventDefault();
        stopSimulation();
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
    // Get simulation parameters
    const startPopulation = parseInt(document.getElementById('startPopulation').value);
    const maxAllowedPopulation = parseInt(document.getElementById('maxAllowedPopulation').value);
    const generationCount = parseInt(document.getElementById('generationCount').value);
    const insertChance = parseFloat(document.getElementById('insertChance').value);
    const deleteChance = parseFloat(document.getElementById('deleteChance').value);
    const changeChance = parseFloat(document.getElementById('changeChance').value);
    const unusedRatio = parseFloat(document.getElementById('unusedRatio').value);

    // Get reproduction mode
    const reproductionMode = document.querySelector('input[name="reproductionMode"]:checked').value;
    const asexual = reproductionMode === 'asexual';

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

    try {
        // Create gene pool with user-specified parameters
        currentGenePool = new GenePool(
            startPopulation,
            maxAllowedPopulation,
            essentialGenes,
            unusedRatio,
            generationCount,
            insertChance,
            deleteChance,
            changeChance,
            asexual
        );

        // Reset state
        simulationRunning = true;
        stopRequested = false;

        // Update UI
        document.getElementById('runSimulation').disabled = true;
        document.getElementById('stopSimulation').style.display = 'inline-block';
        document.getElementById('progressContainer').style.display = 'block';
        document.getElementById('resultsContainer').style.display = 'block';
        document.getElementById('resultsContainer').innerHTML = '';

        // Reset charts from previous run
        resetCharts();

        // Prepare results containers
        const tableContainer = document.createElement('div');
        tableContainer.id = 'tableContainer';
        document.getElementById('resultsContainer').appendChild(tableContainer);

        const chartsContainer = document.createElement('div');
        chartsContainer.id = 'chartsContainer';
        document.getElementById('resultsContainer').appendChild(chartsContainer);

        // Start progressive simulation
        console.log('Starting progressive simulation...');
        runProgressiveSimulation();

    } catch (error) {
        alert(`Error starting simulation: ${error.message}`);
        console.error(error);
        resetSimulationUI();
    }
}

function runProgressiveSimulation() {
    if (stopRequested || currentGenePool.isComplete()) {
        // Simulation complete
        finishSimulation();
        return;
    }

    // Simulate next generation
    const generation = currentGenePool.simulateNextGeneration();

    if (generation === null) {
        // Population extinct or complete
        finishSimulation();
        return;
    }

    // Update progress
    updateProgress();

    // Update visualization
    updateVisualization();

    // Schedule next generation (using setTimeout to prevent UI freeze)
    setTimeout(runProgressiveSimulation, 0);
}

function updateProgress() {
    const progress = currentGenePool.getProgress();
    const currentGen = currentGenePool.currentGeneration;
    const totalGen = currentGenePool.generationCount;
    const currentStats = currentGenePool.generations[currentGenePool.generations.length - 1].getStats();

    // Update progress bar
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = `${(progress * 100).toFixed(1)}%`;

    // Update progress text
    const progressText = document.getElementById('progressText');
    progressText.textContent = `Generation ${currentGen} / ${totalGen}`;

    // Update progress stats
    const progressStats = document.getElementById('progressStats');
    progressStats.innerHTML = `
        <div><strong>Population:</strong> ${formatWithCommas(currentStats.populationSize)}</div>
        <div><strong>Avg Fitness:</strong> ${formatNumber(currentStats.avgFitness)}</div>
        <div><strong>Median Fitness:</strong> ${formatNumber(currentStats.medianFitness)}</div>
        <div><strong>Avg Length:</strong> ${formatNumber(currentStats.avgLength)}</div>
        <div><strong>Avg Unused Ratio:</strong> ${formatNumber(currentStats.avgUnusedRatio, 4)}</div>
    `;
}

function finishSimulation() {
    console.log('Simulation complete!');
    simulationRunning = false;

    // Final update
    updateProgress();
    updateVisualization();

    // Reset UI
    resetSimulationUI();

    // Show completion message
    const progressText = document.getElementById('progressText');
    progressText.textContent += ' - Complete!';
}

function stopSimulation() {
    stopRequested = true;
    console.log('Stop requested...');
}

function resetSimulationUI() {
    document.getElementById('runSimulation').disabled = false;
    document.getElementById('stopSimulation').style.display = 'none';
}

function updateVisualization() {
    const allStats = currentGenePool.getAllStats();

    // Update table
    displayTable(allStats);

    // Update charts
    displayCharts(allStats);
}
