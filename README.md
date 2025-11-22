# DNA Evolution Simulation

A web-based simulation demonstrating the evolutionary advantage of unused DNA segments in maintaining species fitness through genetic recombination.

## Overview

This simulation explores the hypothesis that large "unused" gene sequences in DNA are evolutionarily selected because they increase species survival. The presence of non-coding DNA segments reduces the probability that essential protein-synthesizing genes are damaged during chromosomal crossover events in reproductive cell division.

## Theory

During reproductive cell division, DNA segments are cut and swapped between chromosomes at random locations. If DNA consists primarily of essential genes:
- High probability of cuts occurring within essential genes
- Broken genes reduce descendant fitness and survival

With significant unused DNA segments:
- Most cuts occur in non-coding regions
- Essential genes remain intact
- Higher descendant survival rates
- Mutations in unused regions can create redundant copies of essential genes

## Project Structure

```
unusd_dna/
├── index.html          # Main HTML interface
├── css/
│   └── styles.css      # Application styling
├── js/
│   ├── config.js       # Global configuration
│   ├── DNA.js          # DNA class with mutation logic
│   ├── Generation.js   # Generation snapshot class
│   ├── GenePool.js     # Population simulation logic
│   ├── utils.js        # Utility functions
│   ├── visualization.js # Charts and tables
│   └── main.js         # Application entry point
└── unused_dna.md       # Original requirements
```

## Features

### DNA Class
- Constructor with configurable length and unused ratio
- Exact and mutated copy generation
- Mutation operations (insert, delete, change)
- Survival checking (presence of all essential genes)
- Fitness scoring (count of essential gene occurrences)
- Unused ratio calculation

### Generation Class
- Stores population snapshots for each generation
- Calculates and caches generation statistics
- Enables efficient progressive rendering

### GenePool Class
- Population-based evolutionary simulation
- Progressive generation-by-generation simulation
- Fitness-based selection
- Comprehensive statistics collection
- Non-blocking execution for long simulations

### Visualization
- Interactive input form with helpful descriptions
- Real-time progress bar and statistics
- Stop simulation capability
- Progressive updates of tables and charts
- Generation statistics table
- Multiple trend charts:
  - Population size over time
  - Total and average fitness
  - Median fitness
  - Average DNA length
  - Average unused ratio

## Usage

1. **Open the Application**
   - Open `index.html` in a modern web browser
   - No server required - runs entirely client-side

2. **Configure Parameters**
   - **DNA Characters**: Base nucleotides (default: A,T,C,G)
   - **Gene Length**: Number of characters per essential gene
   - **Number of Essential Genes**: How many unique genes are required for survival
   - **Generation Count**: Number of generations to simulate
   - **Insert Chance**: Probability of inserting random characters during mutation
   - **Delete Chance**: Probability of deleting characters during mutation
   - **Change Chance**: Probability of changing characters during mutation
   - **Unused Ratio**: Proportion of DNA that doesn't code for proteins (0.0-0.99)

3. **Generate Essential Genes**
   - Click "Generate Essential Genes" to create unique gene sequences
   - Generated genes are displayed for reference

4. **Run Simulation**
   - Click "Run Simulation" to start the evolutionary process
   - Watch population evolve over multiple generations
   - View detailed statistics and trends

## Example Scenarios

To test the hypothesis, run multiple simulations with different configurations:

### Scenario 1: Only Essential Genes, No Crossover
- Unused Ratio: 0.0
- Low mutation rates
- Baseline for comparison

### Scenario 2: With Unused DNA, No Crossover
- Unused Ratio: 0.7
- Low mutation rates
- Shows effect of unused DNA without recombination

### Scenario 3: Only Essential Genes, With Crossover
- Unused Ratio: 0.0
- Higher mutation rates (simulating crossover damage)
- Should show lower fitness over time

### Scenario 4: With Unused DNA, With Crossover
- Unused Ratio: 0.7
- Higher mutation rates
- Should maintain or improve fitness

## Interpreting Results

- **Population Size**: Indicates survival across generations
- **Fitness Score**: Higher scores indicate more copies of essential genes
- **Unused Ratio**: Track how unused DNA evolves over time
- **DNA Length**: Monitor genome size changes

## Technical Details

- **Language**: Pure JavaScript (ES6+)
- **Visualization**: Chart.js for graphs
- **Architecture**: Object-oriented, modular design
- **No Dependencies**: Runs in browser without installation

## Performance Notes

- **Progressive Simulation**: The simulation runs one generation at a time using `setTimeout`, preventing browser freezing even with 500+ generations
- **Real-time Updates**: Tables and charts update live as the simulation progresses
- **Stop Capability**: Users can stop long-running simulations at any time
- **Optimized Rendering**: Chart animations are disabled for better performance during progressive updates
- **Non-blocking**: The UI remains fully responsive throughout the entire simulation
- Progress is logged to browser console for debugging

## Future Enhancements

Potential additions:
- Crossover/recombination implementation
- Multiple population comparison
- Export results to CSV
- Parameter presets for different scenarios
- Visual DNA sequence display

## Credits

Based on evolutionary biology principles exploring the selective advantage of non-coding DNA sequences in maintaining species fitness through genetic recombination events.
