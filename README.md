# DNA Evolution Simulation

A web-based simulation demonstrating the evolutionary advantage of unused DNA segments in maintaining species fitness through genetic recombination.

## Overview

This simulation explores the hypothesis that large "unused" gene sequences in DNA are evolutionarily selected because they increase species survival. The presence of non-coding DNA segments reduces the probability that essential protein-synthesizing genes are damaged during chromosomal crossover events in reproductive cell division.

## Theory

### Sexual vs Asexual Reproduction

This simulation compares two reproduction strategies:

**Asexual Reproduction (Cloning)**:
- Organisms have 1 DNA strand
- Offspring are direct copies with mutations
- Simple, fast reproduction
- No genetic diversity from recombination

**Sexual Reproduction (Recombination)**:
- Organisms have 2 DNA strands (diploid)
- During gamete formation, DNA undergoes crossover at random points
- Two parents contribute gametes to create offspring
- Genetic diversity through recombination
- **Key mechanism**: DNA strands are cut at 1-5 random positions and segments are swapped between chromosomes

### The Role of Unused DNA

During sexual reproduction with DNA recombination, segments are cut and swapped at random locations:

**If DNA consists primarily of essential genes**:
- High probability of cuts occurring within essential genes
- Broken genes reduce descendant fitness and survival
- Limited redundancy - losing one copy of a gene is catastrophic

**With significant unused DNA segments**:
- Most cuts occur in non-coding regions
- Essential genes remain intact during recombination
- Higher descendant survival rates
- **Diploid advantage**: Essential genes can be present in either DNA strand - genetic redundancy
- Mutations in unused regions can create redundant copies of essential genes

**Hypothesis**: Sexual reproduction with high unused DNA ratio should show superior fitness over generations compared to other combinations, as it provides both genetic diversity and protection during recombination.

## Project Structure

```
unusd_dna/
├── index.html          # Main HTML interface
├── css/
│   └── styles.css      # Application styling
├── js/
│   ├── config.js       # Global configuration
│   ├── DNA.js          # DNA class with mutation logic
│   ├── Organism.js     # Organism class with sexual/asexual reproduction
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

### Organism Class
- Represents individual organisms with DNA
- **Asexual organisms**: contain 1 DNA, reproduce through direct cloning
- **Sexual organisms**: contain 2 DNAs, reproduce through recombination
- **DNA Recombination**: Sexual reproduction performs crossover at 1-5 random points, swapping DNA segments between parent chromosomes
- Fitness calculation: single DNA fitness (asexual) or combined fitness of both DNAs (sexual)
- Survival mechanism:
  - Asexual: all essential genes must be in the single DNA
  - Sexual: each essential gene must be in at least one of the two DNAs (genetic redundancy)

### Generation Class
- Stores population snapshots for each generation
- Calculates and caches generation statistics
- Enables efficient progressive rendering
- Works with organism-based populations

### GenePool Class
- Population-based evolutionary simulation with organisms
- **Reproduction modes**:
  - **Asexual**: 1 parent → gamete (copy) → mutation → child (1 DNA)
  - **Sexual**: 2 parents → gametes (recombination) → mutations → child (2 DNAs)
- Produces 2n children per generation (where n = current population size)
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
   - **Initial Population**: Starting number of organisms
   - **Maximum Allowed Population**: Population cap per generation
   - **Generation Count**: Number of generations to simulate
   - **Insert Chance**: Probability of inserting random characters during mutation
   - **Delete Chance**: Probability of deleting characters during mutation
   - **Change Chance**: Probability of changing characters during mutation
   - **Unused Ratio**: Proportion of DNA that doesn't code for proteins (0.0-0.99)
   - **Reproduction Mode**:
     - **Asexual**: Organisms have 1 DNA, reproduce by cloning
     - **Sexual**: Organisms have 2 DNAs, reproduce with recombination

3. **Generate Essential Genes**
   - Click "Generate Essential Genes" to create unique gene sequences
   - Generated genes are displayed for reference

4. **Run Simulation**
   - Click "Run Simulation" to start the evolutionary process
   - Watch population evolve over multiple generations
   - View detailed statistics and trends

## Example Scenarios

To test the hypothesis about sexual vs asexual reproduction and the role of unused DNA:

### Scenario 1: Asexual, Minimal Unused DNA
- **Reproduction Mode**: Asexual
- **Unused Ratio**: 0.1
- **Mutation Rates**: Low (0.001 insert/delete, 0.005 change)
- **Expected**: Baseline performance, vulnerable to gene damage

### Scenario 2: Asexual, High Unused DNA
- **Reproduction Mode**: Asexual
- **Unused Ratio**: 0.7
- **Mutation Rates**: Low (0.001 insert/delete, 0.005 change)
- **Expected**: Better mutation buffer, more stable fitness

### Scenario 3: Sexual, Minimal Unused DNA
- **Reproduction Mode**: Sexual
- **Unused Ratio**: 0.1
- **Mutation Rates**: Low (0.001 insert/delete, 0.005 change)
- **Expected**: Recombination may damage genes without buffer, potential fitness loss

### Scenario 4: Sexual, High Unused DNA
- **Reproduction Mode**: Sexual
- **Unused Ratio**: 0.7
- **Mutation Rates**: Low (0.001 insert/delete, 0.005 change)
- **Expected**: Recombination protected by unused DNA, genetic redundancy provides resilience, highest fitness potential

### Key Comparisons
- **Asexual vs Sexual** with same unused ratio: Tests impact of recombination
- **Low vs High unused ratio** with same reproduction mode: Tests buffer hypothesis
- **Sexual + High unused** vs all others: Should demonstrate evolutionary advantage

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
