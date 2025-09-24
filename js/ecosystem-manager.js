// js/ecosystem-manager.js
import { AdvancedOrganism } from "./advanced-organism.js";
import { logEvent, LOG_TYPES } from "./logger.js";
import { bus } from "./communication.js";
import { randRange, clamp, distance } from "./utils.js";

export class EcosystemManager {
  constructor() {
    this.organisms = [];
    this.environment = this.createInitialEnvironment();
    this.species = new Map(); // Track different species
    this.generation = 1;
    this.totalOrganisms = 0;
    this.extinctionEvents = [];
    
    // Scientific data collection
    this.populationHistory = [];
    this.geneticDiversity = [];
    this.environmentalHistory = [];
    this.evolutionaryEvents = [];
    
    // Astrobiology scenarios
    this.planetaryConditions = this.generatePlanetaryConditions();
    
    // Advanced simulation parameters
    this.simulationSpeed = 1.0;
    this.catastropheTimer = 0;
    this.nextCatastrophe = randRange(5000, 15000); // ticks
    
    // Theoretical physics integration
    this.quantumField = this.initializeQuantumField();
    this.spacetimeMetric = 1.0;
    
    this.startSimulation();
  }
  
  createInitialEnvironment() {
    return {
      temperature: 0.5, // 0-1 scale
      radiation: 0.1,
      pressure: 1.0, // Earth-like
      oxygen: 0.21,
      co2: 0.0004,
      foodDensity: 0.6,
      toxicity: 0.1,
      magneticField: 0.8,
      gravity: 1.0, // Earth gravity
      season: 0, // 0-1 seasonal cycle
      
      // Astrobiology factors
      stellarActivity: 0.3, // Solar flares, etc.
      cosmicRadiation: 0.2,
      tideLevel: 0.5,
      atmosphericComposition: {
        nitrogen: 0.78,
        oxygen: 0.21,
        argon: 0.009,
        methane: 0.0002,
        hydrogen: 0.0001
      },
      
      // Theoretical factors
      darkMatterDensity: 0.27,
      quantumFluctuations: 0.1,
      temporalStability: 1.0,
      dimensionalRift: 0.0 // Experimental
    };
  }
  
  generatePlanetaryConditions() {
    const scenarios = [
      {
        name: "Earth-like",
        description: "Standard terrestrial conditions",
        modifiers: { temperature: 0, radiation: 0, pressure: 0 }
      },
      {
        name: "Mars Colony",
        description: "Low pressure, high radiation, cold",
        modifiers: { temperature: -0.4, radiation: 0.6, pressure: -0.9 }
      },
      {
        name: "Europa Ocean",
        description: "High pressure, low temperature, subsurface",
        modifiers: { temperature: -0.6, radiation: -0.3, pressure: 0.8 }
      },
      {
        name: "Titan Surface",
        description: "Methane atmosphere, organic chemistry",
        modifiers: { temperature: -0.8, radiation: -0.5, pressure: 0.5 }
      },
      {
        name: "Exoplanet K2-18b",
        description: "Hydrogen-rich atmosphere, potential ocean",
        modifiers: { temperature: 0.2, radiation: 0.4, pressure: 1.5 }
      },
      {
        name: "Proxima Centauri b",
        description: "Tidally locked, extreme temperature gradients",
        modifiers: { temperature: 0.8, radiation: 0.9, pressure: 0.1 }
      }
    ];
    
    return scenarios[Math.floor(Math.random() * scenarios.length)];
  }
  
  initializeQuantumField() {
    // Theoretical quantum field that affects organism behavior
    return {
      coherence: 0.5,
      entanglementDensity: 0.1,
      waveFunction: new Array(100).fill(0).map(() => Math.random()),
      decoherenceRate: 0.001,
      observerEffect: 0.0
    };
  }
  
  spawnInitialPopulation() {
    // Create diverse initial population
    const initialSize = 12;
    
    for (let i = 0; i < initialSize; i++) {
      const organism = new AdvancedOrganism();
      this.addOrganism(organism);
      
      // Add some initial genetic diversity
      if (i > 6) {
        // Create a different "subspecies" with modified traits
        Object.keys(organism.genome).forEach(trait => {
          organism.genome[trait] = organism.genome[trait].map(allele => 
            allele * randRange(0.8, 1.2)
          );
        });
        organism.phenotype = organism.expressGenome();
      }
    }
    
    logEvent(`Initial population of ${initialSize} organisms spawned`, LOG_TYPES.INFO);
  }
  
  addOrganism(organism) {
    this.organisms.push(organism);
    this.totalOrganisms++;
    
    // Track species
    if (!this.species.has(organism.species)) {
      this.species.set(organism.species, {
        count: 0,
        firstAppeared: Date.now(),
        generations: [organism.generation],
        geneticDiversity: 0,
        extinct: false
      });
    }
    
    const speciesData = this.species.get(organism.species);
    speciesData.count++;
    
    if (!speciesData.generations.includes(organism.generation)) {
      speciesData.generations.push(organism.generation);
    }
    
    // Register death listener
    bus.on('organism-died', (deathData) => {
      if (deathData.id === organism.id) {
        this.handleOrganismDeath(deathData);
      }
    });
    
    bus.emit('organism-added', organism);
  }
  
  handleOrganismDeath(deathData) {
    const speciesData = this.species.get('digitalis');
    if (speciesData) {
      speciesData.count--;
      
      if (speciesData.count === 0) {
        speciesData.extinct = true;
        this.extinctionEvents.push({
          species: 'digitalis',
          time: Date.now(),
          lastGeneration: deathData.generation,
          cause: 'population collapse'
        });
        
        logEvent(`Species digitalis has gone extinct`, LOG_TYPES.ERROR);
      }
    }
    
    // Record evolutionary data
    this.recordEvolutionaryEvent('death', deathData);
  }
  
  startSimulation() {
    this.simulationInterval = setInterval(() => {
      this.updateSimulation();
    }, 50); // 20 FPS simulation
    
    // Data collection interval
    this.dataInterval = setInterval(() => {
      this.collectScientificData();
    }, 1000); // Collect data every second
    
    // Environmental change interval
    this.envInterval = setInterval(() => {
      this.updateEnvironment();
    }, 2000);
  }
  
  updateSimulation() {
    // Update all organisms
    this.organisms.forEach(organism => {
      if (organism.alive) {
        organism.update(this.environment, this.organisms);
      }
    });
    
    // Handle reproduction attempts
    this.processReproduction();
    
    // Remove dead organisms (keep for data)
    // this.organisms = this.organisms.filter(org => org.alive);
    
    // Environmental events
    this.catastropheTimer++;
    if (this.catastropheTimer > this.nextCatastrophe) {
      this.triggerCatastrophicEvent();
    }
    
    // Quantum field evolution
    this.updateQuantumField();
    
    // Check for speciation events
    this.checkForSpeciation();
    
    // Population control
    this.managePopulation();
  }
  
  processReproduction() {
    const aliveOrganisms = this.organisms.filter(org => org.alive);
    const matureOrganisms = aliveOrganisms.filter(org => org.reproductiveMature);
    
    // Natural reproduction
    matureOrganisms.forEach(organism => {
      if (organism.reproductiveUrge > 0.8 && Math.random() < 0.01) {
        const offspring = organism.attemptReproduction(aliveOrganisms);
        if (offspring) {
          this.addOrganism(offspring);
        }
      }
    });
    
    // Artificial selection (for research)
    if (Math.random() < 0.001) {
      this.artificialSelection();
    }
  }
  
  artificialSelection() {
    // Select for specific traits (research tool)
    const candidates = this.organisms.filter(org => 
      org.alive && org.reproductiveMature && org.energy > 100
    );
    
    if (candidates.length >= 2) {
      // Select for extremophile traits
      const extremophiles = candidates
        .sort((a, b) => b.extremophileScore - a.extremophileScore)
        .slice(0, 2);
      
      if (extremophiles.length === 2) {
        const offspring = extremophiles[0].reproduce(extremophiles[1]);
        if (offspring) {
          offspring.artificialSelection = true;
          this.addOrganism(offspring);
          
          logEvent(`Artificial selection: breeding for extremophile traits`, LOG_TYPES.MUTATION);
        }
      }
    }
  }
  
  updateEnvironment() {
    // Seasonal changes
    this.environment.season = (this.environment.season + 0.01) % 1;
    
    // Temperature variation with season
    this.environment.temperature = 0.5 + Math.sin(this.environment.season * Math.PI * 2) * 0.2;
    
    // Random environmental fluctuations
    if (Math.random() < 0.1) {
      this.environment.radiation += randRange(-0.05, 0.05);
      this.environment.radiation = clamp(this.environment.radiation, 0, 1);
    }
    
    // Food availability cycles
    this.environment.foodDensity = 0.6 + Math.sin(this.environment.season * Math.PI * 2 + Math.PI) * 0.3;
    
    // Stellar activity (for astrobiology)
    if (Math.random() < 0.02) {
      this.stellarFlareEvent();
    }
    
    // Atmospheric evolution
    this.simulateAtmosphericEvolution();
    
    // Apply planetary condition modifiers
    this.applyPlanetaryConditions();
    
    // Record environmental data
    this.environmentalHistory.push({
      timestamp: Date.now(),
      conditions: { ...this.environment }
    });
    
    // Keep only recent history
    if (this.environmentalHistory.length > 1000) {
      this.environmentalHistory = this.environmentalHistory.slice(-1000);
    }
  }
  
  stellarFlareEvent() {
    this.environment.stellarActivity = Math.min(1, this.environment.stellarActivity + 0.3);
    this.environment.radiation += 0.2;
    
    logEvent(`Stellar flare detected - increased radiation levels`, LOG_TYPES.WARNING);
    
    // Affects organisms directly
    this.organisms.forEach(org => {
      if (org.alive && org.phenotype.radiationTolerance < 0.5) {
        org.environmentalStress += 0.3;
        org.energy -= 10;
      }
    });
    
    // Gradually return to normal
    setTimeout(() => {
      this.environment.stellarActivity *= 0.8;
      this.environment.radiation = Math.max(0.1, this.environment.radiation - 0.15);
    }, 5000);
  }
  
  simulateAtmosphericEvolution() {
    const aliveOrganisms = this.organisms.filter(org => org.alive).length;
    
    // Organisms affect atmospheric composition (simplified)
    if (aliveOrganisms > 0) {
      // Oxygen production through "photosynthesis"
      this.environment.atmosphericComposition.oxygen += aliveOrganisms * 0.000001;
      this.environment.atmosphericComposition.co2 -= aliveOrganisms * 0.0000005;
      
      // Normalize
      this.environment.atmosphericComposition.co2 = Math.max(0.0001, this.environment.atmosphericComposition.co2);
      this.environment.atmosphericComposition.oxygen = clamp(this.environment.atmosphericComposition.oxygen, 0.15, 0.25);
    }
  }
  
  applyPlanetaryConditions() {
    const conditions = this.planetaryConditions;
    
    this.environment.temperature += conditions.modifiers.temperature * 0.01;
    this.environment.radiation += conditions.modifiers.radiation * 0.01;
    this.environment.pressure += conditions.modifiers.pressure * 0.01;
    
    // Clamp values
    this.environment.temperature = clamp(this.environment.temperature, 0, 1);
    this.environment.radiation = clamp(this.environment.radiation, 0, 1);
    this.environment.pressure = clamp(this.environment.pressure, 0.1, 3.0);
  }
  
  triggerCatastrophicEvent() {
    const events = [
      'asteroid_impact',
      'supervolcano',
      'gamma_ray_burst',
      'climate_shift',
      'magnetic_reversal',
      'pandemic',
      'quantum_storm' // theoretical
    ];
    
    const event = events[Math.floor(Math.random() * events.length)];
    this.executeCatastrophe(event);
    
    // Reset timer
    this.catastropheTimer = 0;
    this.nextCatastrophe = randRange(8000, 20000);
  }
  
  executeCatastrophe(eventType) {
    switch (eventType) {
      case 'asteroid_impact':
        this.asteroidImpact();
        break;
      case 'supervolcano':
        this.supervolcanoEruption();
        break;
      case 'gamma_ray_burst':
        this.gammaRayBurst();
        break;
      case 'climate_shift':
        this.climateShift();
        break;
      case 'magnetic_reversal':
        this.magneticReversal();
        break;
      case 'pandemic':
        this.pandemicEvent();
        break;
      case 'quantum_storm':
        this.quantumStorm();
        break;
    }
  }
  
  asteroidImpact() {
    logEvent(`CATASTROPHIC EVENT: Asteroid impact detected`, LOG_TYPES.ERROR);
    
    // Immediate effects
    this.environment.temperature += 0.3;
    this.environment.radiation += 0.4;
    this.environment.foodDensity *= 0.3;
    
    // Kill percentage of population
    const survivalRate = 0.3;
    this.organisms.forEach(org => {
      if (org.alive && Math.random() > survivalRate) {
        org.energy = 0; // Will die on next update
      }
    });
    
    this.recordCatastrophe('asteroid_impact', { survivalRate, environmentalDamage: 'severe' });
  }
  
  gammaRayBurst() {
    logEvent(`CATASTROPHIC EVENT: Gamma ray burst from distant star`, LOG_TYPES.ERROR);
    
    this.environment.radiation = 1.0;
    this.environment.magneticField *= 0.1;
    
    // Only highly radiation-resistant organisms survive
    this.organisms.forEach(org => {
      if (org.alive) {
        const resistance = org.phenotype.radiationTolerance;
        if (resistance < 0.8) {
          org.energy -= 100;
        } else {
          // Survivors get adaptation boost
          org.phenotype.radiationTolerance = Math.min(1, org.phenotype.radiationTolerance + 0.1);
        }
      }
    });
    
    this.recordCatastrophe('gamma_ray_burst', { radiationLevel: 1.0 });
  }
  
  quantumStorm() {
    logEvent(`THEORETICAL EVENT: Quantum coherence storm detected`, LOG_TYPES.MUTATION);
    
    // Affects quantum-sensitive organisms
    this.quantumField.coherence = 0.9;
    this.quantumField.entanglementDensity = 0.8;
    
    this.organisms.forEach(org => {
      if (org.alive && org.phenotype.quantumSensitivity > 0.3) {
        // Random quantum effects
        if (Math.random() < 0.2) {
          // Spontaneous mutation
          this.induceQuantumMutation(org);
        }
        
        // Temporary quantum entanglement
        if (Math.random() < 0.1) {
          const others = this.organisms.filter(o => o !== org && o.alive);
          if (others.length > 0) {
            const partner = others[Math.floor(Math.random() * others.length)];
            org.entanglementPartners.push(partner.id);
            partner.entanglementPartners.push(org.id);
          }
        }
      }
    });
    
    this.recordCatastrophe('quantum_storm', { quantumCoherence: 0.9 });
  }
  
  induceQuantumMutation(organism) {
    // Quantum-induced mutations are more dramatic
    const trait = Object.keys(organism.genome)[Math.floor(Math.random() * Object.keys(organism.genome).length)];
    const alleleIndex = Math.floor(Math.random() * 2);
    
    const oldValue = organism.genome[trait][alleleIndex];
    organism.genome[trait][alleleIndex] *= randRange(0.5, 2.0);
    
    // Re-express phenotype
    organism.phenotype = organism.expressGenome();
    
    logEvent(`Quantum mutation: ${organism.id} ${trait} changed from ${oldValue.toFixed(2)} to ${organism.genome[trait][alleleIndex].toFixed(2)}`, LOG_TYPES.MUTATION);
  }
  
  recordCatastrophe(type, data) {
    this.extinctionEvents.push({
      type,
      timestamp: Date.now(),
      data,
      preEventPopulation: this.organisms.filter(org => org.alive).length,
      postEventPopulation: null // Will be filled later
    });
  }
  
  updateQuantumField() {
    // Simulate quantum field evolution
    this.quantumField.coherence *= (1 - this.quantumField.decoherenceRate);
    
    // Wave function collapse events
    this.quantumField.waveFunction = this.quantumField.waveFunction.map(amplitude => {
      if (Math.random() < 0.01) {
        // Collapse to eigenstate
        return Math.random() < 0.5 ? 0 : 1;
      } else {
        // Quantum evolution
        return amplitude + randRange(-0.1, 0.1);
      }
    });
    
    // Entanglement density affects organism interactions
    this.quantumField.entanglementDensity = Math.max(0, 
      this.quantumField.entanglementDensity + randRange(-0.01, 0.01)
    );
    
    // Observer effect from conscious organisms
    const consciousOrganisms = this.organisms.filter(org => 
      org.alive && org.phenotype.neuralComplexity > 0.7
    ).length;
    
    this.quantumField.observerEffect = Math.min(1, consciousOrganisms * 0.1);
  }
  
  checkForSpeciation() {
    // Analyze genetic divergence to identify new species
    const aliveOrganisms = this.organisms.filter(org => org.alive);
    
    if (aliveOrganisms.length < 4) return;
    
    // Group organisms by genetic similarity
    const geneticGroups = this.clusterByGeneticSimilarity(aliveOrganisms);
    
    geneticGroups.forEach((group, index) => {
      if (group.length >= 3) {
        const avgSimilarity = this.calculateGroupGeneticSimilarity(group);
        
        if (avgSimilarity < 0.6) { // Significant divergence
          const newSpeciesName = `digitalis-${String.fromCharCode(65 + index)}`;
          
          group.forEach(org => {
            if (org.species === 'digitalis') {
              org.species = newSpeciesName;
              this.recordEvolutionaryEvent('speciation', {
                organismId: org.id,
                oldSpecies: 'digitalis',
                newSpecies: newSpeciesName,
                geneticDivergence: 1 - avgSimilarity
              });
            }
          });
          
          logEvent(`New species emerged: ${newSpeciesName} (${group.length} individuals)`, LOG_TYPES.MUTATION);
        }
      }
    });
  }
  
  clusterByGeneticSimilarity(organisms) {
    const clusters = [];
    const processed = new Set();
    
    organisms.forEach(org1 => {
      if (processed.has(org1.id)) return;
      
      const cluster = [org1];
      processed.add(org1.id);
      
      organisms.forEach(org2 => {
        if (processed.has(org2.id) || org1 === org2) return;
        
        const similarity = org1.calculateGeneticSimilarity(org2);
        if (similarity > 0.7) {
          cluster.push(org2);
          processed.add(org2.id);
        }
      });
      
      clusters.push(cluster);
    });
    
    return clusters;
  }
  
  calculateGroupGeneticSimilarity(group) {
    if (group.length < 2) return 1;
    
    let totalSimilarity = 0;
    let comparisons = 0;
    
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        totalSimilarity += group[i].calculateGeneticSimilarity(group[j]);
        comparisons++;
      }
    }
    
    return comparisons > 0 ? totalSimilarity / comparisons : 1;
  }
  
  managePopulation() {
    const aliveCount = this.organisms.filter(org => org.alive).length;
    
    // Population pressure
    if (aliveCount > 50) {
      // Increase environmental stress
      this.environment.foodDensity *= 0.95;
      this.environment.toxicity += 0.01;
    } else if (aliveCount < 5) {
      // Population recovery assistance
      this.environment.foodDensity = Math.min(1, this.environment.foodDensity * 1.02);
      this.environment.toxicity = Math.max(0, this.environment.toxicity - 0.01);
    }
    
    // Genetic rescue - prevent extinction
    if (aliveCount < 3 && aliveCount > 0) {
      this.geneticRescue();
    }
  }
  
  geneticRescue() {
    logEvent(`Initiating genetic rescue protocol`, LOG_TYPES.WARNING);
    
    const survivors = this.organisms.filter(org => org.alive);
    
    if (survivors.length > 0) {
      // Clone the fittest survivor with mutations
      const fittest = survivors.reduce((best, org) => 
        org.calculateFitness() > best.calculateFitness() ? org : best
      );
      
      for (let i = 0; i < 3; i++) {
        const cloneGenome = JSON.parse(JSON.stringify(fittest.genome));
        
        // Add genetic diversity through mutation
        Object.keys(cloneGenome).forEach(trait => {
          cloneGenome[trait] = cloneGenome[trait].map(allele => 
            allele * randRange(0.7, 1.3)
          );
        });
        
        const clone = new AdvancedOrganism(cloneGenome, fittest.generation + 1, [fittest.id]);
        clone.position.add(new THREE.Vector3(randRange(-3, 3), 0, randRange(-3, 3)));
        this.addOrganism(clone);
      }
    }
  }
  
  collectScientificData() {
    const aliveOrganisms = this.organisms.filter(org => org.alive);
    const deadOrganisms = this.organisms.filter(org => !org.alive);
    
    // Population metrics
    const populationData = {
      timestamp: Date.now(),
      total: aliveOrganisms.length,
      byGeneration: this.getGenerationDistribution(aliveOrganisms),
      bySpecies: this.getSpeciesDistribution(aliveOrganisms),
      averageAge: this.calculateAverageAge(aliveOrganisms),
      averageFitness: this.calculateAverageFitness(aliveOrganisms),
      totalBorn: this.totalOrganisms,
      totalDied: deadOrganisms.length
    };
    
    this.populationHistory.push(populationData);
    
    // Genetic diversity analysis
    const geneticDiv = this.analyzeGeneticDiversity(aliveOrganisms);
    this.geneticDiversity.push({
      timestamp: Date.now(),
      ...geneticDiv
    });
    
    // Environmental correlation analysis
    this.analyzeEnvironmentalCorrelations();
    
    // Keep data size manageable
    this.trimDataHistory();
    
    // Emit data for visualization
    bus.emit('scientific-data', {
      population: populationData,
      genetics: geneticDiv,
      environment: this.environment,
      species: Array.from(this.species.entries())
    });
  }
  
  getGenerationDistribution(organisms) {
    const distribution = {};
    organisms.forEach(org => {
      distribution[org.generation] = (distribution[org.generation] || 0) + 1;
    });
    return distribution;
  }
  
  getSpeciesDistribution(organisms) {
    const distribution = {};
    organisms.forEach(org => {
      distribution[org.species] = (distribution[org.species] || 0) + 1;
    });
    return distribution;
  }
  
  calculateAverageAge(organisms) {
    if (organisms.length === 0) return 0;
    return organisms.reduce((sum, org) => sum + org.age, 0) / organisms.length;
  }
  
  calculateAverageFitness(organisms) {
    if (organisms.length === 0) return 0;
    return organisms.reduce((sum, org) => sum + org.calculateFitness(), 0) / organisms.length;
  }
  
  analyzeGeneticDiversity(organisms) {
    if (organisms.length === 0) return { diversity: 0, traits: {} };
    
    const traitVariances = {};
    const traits = Object.keys(organisms[0].genome);
    
    traits.forEach(trait => {
      const values = organisms.flatMap(org => org.genome[trait]);
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
      traitVariances[trait] = variance;
    });
    
    const overallDiversity = Object.values(traitVariances).reduce((a, b) => a + b, 0) / traits.length;
    
    return {
      diversity: overallDiversity,
      traits: traitVariances,
      heritability: this.calculateHeritability(organisms),
      selectionPressure: this.calculateSelectionPressure(organisms)
    };
  }
  
  calculateHeritability(organisms) {
    // Simplified heritability calculation
    const parents = organisms.filter(org => org.offspringCount > 0);
    if (parents.length < 2) return 0;
    
    // Calculate correlation between parent fitness and offspring fitness
    let correlation = 0;
    let samples = 0;
    
    parents.forEach(parent => {
      const offspring = this.organisms.filter(org => 
        org.parentIds.includes(parent.id) && org.alive
      );
      
      if (offspring.length > 0) {
        const parentFitness = parent.calculateFitness();
        const avgOffspringFitness = offspring.reduce((sum, child) => 
          sum + child.calculateFitness(), 0) / offspring.length;
        
        correlation += parentFitness * avgOffspringFitness;
        samples++;
      }
    });
    
    return samples > 0 ? correlation / samples : 0;
  }
  
  calculateSelectionPressure(organisms) {
    if (organisms.length < 2) return 0;
    
    const fitnesses = organisms.map(org => org.calculateFitness());
    const mean = fitnesses.reduce((a, b) => a + b, 0) / fitnesses.length;
    const variance = fitnesses.reduce((sum, f) => sum + Math.pow(f - mean, 2), 0) / fitnesses.length;
    
    return variance; // Higher variance = stronger selection pressure
  }
  
  analyzeEnvironmentalCorrelations() {
    if (this.populationHistory.length < 10 || this.environmentalHistory.length < 10) return;
    
    // Correlate population changes with environmental changes
    const recentPop = this.populationHistory.slice(-10);
    const recentEnv = this.environmentalHistory.slice(-10);
    
    const correlations = {
      temperature: this.calculateCorrelation(
        recentPop.map(p => p.total),
        recentEnv.map(e => e.conditions.temperature)
      ),
      radiation: this.calculateCorrelation(
        recentPop.map(p => p.total),
        recentEnv.map(e => e.conditions.radiation)
      ),
      foodDensity: this.calculateCorrelation(
        recentPop.map(p => p.total),
        recentEnv.map(e => e.conditions.foodDensity)
      )
    };
    
    // Log significant correlations
    Object.entries(correlations).forEach(([factor, correlation]) => {
      if (Math.abs(correlation) > 0.7) {
        logEvent(`Strong correlation detected: Population vs ${factor} (r=${correlation.toFixed(2)})`, LOG_TYPES.INFO);
      }
    });
  }
  
  calculateCorrelation(x, y) {
    if (x.length !== y.length || x.length === 0) return 0;
    
    const meanX = x.reduce((a, b) => a + b, 0) / x.length;
    const meanY = y.reduce((a, b) => a + b, 0) / y.length;
    
    const numerator = x.reduce((sum, xi, i) => sum + (xi - meanX) * (y[i] - meanY), 0);
    const denomX = Math.sqrt(x.reduce((sum, xi) => sum + Math.pow(xi - meanX, 2), 0));
    const denomY = Math.sqrt(y.reduce((sum, yi) => sum + Math.pow(yi - meanY, 2), 0));
    
    return denomX * denomY !== 0 ? numerator / (denomX * denomY) : 0;
  }
  
  recordEvolutionaryEvent(type, data) {
    this.evolutionaryEvents.push({
      type,
      timestamp: Date.now(),
      data
    });
    
    // Keep only recent events
    if (this.evolutionaryEvents.length > 500) {
      this.evolutionaryEvents = this.evolutionaryEvents.slice(-500);
    }
  }
  
  trimDataHistory() {
    const maxHistory = 1000;
    
    if (this.populationHistory.length > maxHistory) {
      this.populationHistory = this.populationHistory.slice(-maxHistory);
    }
    
    if (this.geneticDiversity.length > maxHistory) {
      this.geneticDiversity = this.geneticDiversity.slice(-maxHistory);
    }
  }
  
  // Research tools
  introduceSpecies(speciesName, traits = {}) {
    logEvent(`Introducing new species: ${speciesName}`, LOG_TYPES.MUTATION);
    
    const baseOrganism = new AdvancedOrganism();
    baseOrganism.species = speciesName;
    
    // Apply custom traits
    Object.entries(traits).forEach(([trait, value]) => {
      if (baseOrganism.genome[trait]) {
        baseOrganism.genome[trait] = [value, value];
      }
    });
    
    baseOrganism.phenotype = baseOrganism.expressGenome();
    this.addOrganism(baseOrganism);
    
    return baseOrganism;
  }
  
  setPlanetaryConditions(scenarioName) {
    const scenarios = {
      "Earth-like": { temperature: 0, radiation: 0, pressure: 0 },
      "Mars Colony": { temperature: -0.4, radiation: 0.6, pressure: -0.9 },
      "Europa Ocean": { temperature: -0.6, radiation: -0.3, pressure: 0.8 },
      "Titan Surface": { temperature: -0.8, radiation: -0.5, pressure: 0.5 },
      "Exoplanet K2-18b": { temperature: 0.2, radiation: 0.4, pressure: 1.5 },
      "Proxima Centauri b": { temperature: 0.8, radiation: 0.9, pressure: 0.1 }
    };
    
    if (scenarios[scenarioName]) {
      this.planetaryConditions = {
        name: scenarioName,
        description: `Switched to ${scenarioName} conditions`,
        modifiers: scenarios[scenarioName]
      };
      
      logEvent(`Planetary conditions changed to: ${scenarioName}`, LOG_TYPES.WARNING);
    }
  }
  
  getResearchData() {
    return {
      populationHistory: this.populationHistory,
      geneticDiversity: this.geneticDiversity,
      environmentalHistory: this.environmentalHistory,
      evolutionaryEvents: this.evolutionaryEvents,
      extinctionEvents: this.extinctionEvents,
      currentEnvironment: this.environment,
      species: Array.from(this.species.entries()),
      quantumField: this.quantumField,
      planetaryConditions: this.planetaryConditions
    };
  }
  
  exportData() {
    const data = this.getResearchData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `bio-simulation-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    logEvent(`Research data exported`, LOG_TYPES.INFO);
  }
  
  // Cleanup
  destroy() {
    if (this.simulationInterval) clearInterval(this.simulationInterval);
    if (this.dataInterval) clearInterval(this.dataInterval);
    if (this.envInterval) clearInterval(this.envInterval);
    
    this.organisms.forEach(org => {
      if (org.lifecycleInterval) {
        clearInterval(org.lifecycleInterval);
      }
    });
  }
}