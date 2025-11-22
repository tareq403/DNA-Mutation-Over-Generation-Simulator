// Visualization functions for displaying simulation results

// Store chart instances for progressive updates
let chartInstances = {};

// Display generation statistics in a table
function displayTable(generationStats) {
    const tableContainer = document.getElementById('tableContainer');
    tableContainer.innerHTML = '<h2>Generation Statistics</h2>';

    const table = document.createElement('table');
    table.id = 'statsTable';

    // Create header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = [
        'Generation',
        'Population Size',
        'Total Fitness',
        'Median Fitness',
        'Avg Fitness',
        'Avg Length',
        'Total Length',
        'Avg Unused Ratio'
    ];

    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create body
    const tbody = document.createElement('tbody');

    generationStats.forEach(stats => {
        const row = document.createElement('tr');

        const cells = [
            stats.generation,
            stats.populationSize,
            formatWithCommas(stats.totalFitness),
            formatNumber(stats.medianFitness),
            formatNumber(stats.avgFitness),
            formatNumber(stats.avgLength),
            formatWithCommas(stats.totalLength),
            formatNumber(stats.avgUnusedRatio, 4)
        ];

        cells.forEach(cellData => {
            const td = document.createElement('td');
            td.textContent = cellData;
            row.appendChild(td);
        });

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    tableContainer.appendChild(table);
}

// Create charts for visualization
function displayCharts(generationStats) {
    const chartsContainer = document.getElementById('chartsContainer');

    // Extract data arrays
    const generations = generationStats.map(s => s.generation);
    const populationSizes = generationStats.map(s => s.populationSize);
    const totalFitness = generationStats.map(s => s.totalFitness);
    const avgFitness = generationStats.map(s => s.avgFitness);
    const medianFitness = generationStats.map(s => s.medianFitness);
    const avgLength = generationStats.map(s => s.avgLength);
    const avgUnusedRatio = generationStats.map(s => s.avgUnusedRatio);

    // Chart configurations
    const chartConfigs = [
        {
            id: 'populationChart',
            title: 'Population Size Over Generations',
            data: populationSizes,
            color: 'rgb(75, 192, 192)'
        },
        {
            id: 'totalFitnessChart',
            title: 'Total Fitness Over Generations',
            data: totalFitness,
            color: 'rgb(255, 99, 132)'
        },
        {
            id: 'avgFitnessChart',
            title: 'Average Fitness Over Generations',
            data: avgFitness,
            color: 'rgb(54, 162, 235)'
        },
        {
            id: 'medianFitnessChart',
            title: 'Median Fitness Over Generations',
            data: medianFitness,
            color: 'rgb(255, 206, 86)'
        },
        {
            id: 'avgLengthChart',
            title: 'Average DNA Length Over Generations',
            data: avgLength,
            color: 'rgb(153, 102, 255)'
        },
        {
            id: 'avgUnusedRatioChart',
            title: 'Average Unused Ratio Over Generations',
            data: avgUnusedRatio,
            color: 'rgb(255, 159, 64)'
        }
    ];

    // Check if we need to initialize charts
    const needsInit = Object.keys(chartInstances).length === 0;

    if (needsInit) {
        // First time: create chart structure
        chartsContainer.innerHTML = '<h2>Generation Trends</h2>';

        chartConfigs.forEach(config => {
            const chartWrapper = document.createElement('div');
            chartWrapper.className = 'chart-wrapper';

            const canvas = document.createElement('canvas');
            canvas.id = config.id;
            chartWrapper.appendChild(canvas);
            chartsContainer.appendChild(chartWrapper);

            const ctx = canvas.getContext('2d');
            chartInstances[config.id] = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: generations,
                    datasets: [{
                        label: config.title,
                        data: config.data,
                        borderColor: config.color,
                        backgroundColor: config.color.replace('rgb', 'rgba').replace(')', ', 0.1)'),
                        borderWidth: 2,
                        fill: true,
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    animation: {
                        duration: 0 // Disable animation for better performance
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        },
                        title: {
                            display: true,
                            text: config.title
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Generation'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Value'
                            },
                            beginAtZero: true
                        }
                    }
                }
            });
        });
    } else {
        // Update existing charts
        chartConfigs.forEach(config => {
            const chart = chartInstances[config.id];
            if (chart) {
                chart.data.labels = generations;
                chart.data.datasets[0].data = config.data;
                chart.update('none'); // Update without animation
            }
        });
    }
}

// Reset charts (call this when starting a new simulation)
function resetCharts() {
    // Destroy existing chart instances
    Object.values(chartInstances).forEach(chart => {
        if (chart) {
            chart.destroy();
        }
    });
    chartInstances = {};
}
