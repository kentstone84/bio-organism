// js/advanced-organism.js
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
import { logEvent, LOG_TYPES } from "./logger.js";
import { bus } from "./communication.js";
import { randRange, clamp, distance } from "./utils.js";

export class AdvancedOrganism {
  constructor(genome = null, generation = 1, parentIds = [], position = null) {
    this.id = this.generateId();
    this.generation = generation;
    this.parentIds = parentIds;
    this.age = 0;
    this.lifespan = randRange(1000, 3000); // ticks
    this.alive = true;
    this.species = "digitalis";
    
    // Genetic System - 24 "chromosomes" with trait pairs
    this.genome = genome || this.generateGenome();
    this.phenotype = this.expressGenome();
    
    // Neural Network Brain (simplified)
    this.brain = this.createBrain();
    this.memory = [];
    this.experiences = new Map();
    
    // Quantum Biology Properties (theoretical)
    this.quantumCoherence = randRange(0.1, 0.9);
    this.entanglementPartners = [];
    this.quantumState = { superposition: 0, collapsed: false };
    
    // Environmental Adaptation
    this.environmentalStress = 0;
    this.adaptationHistory = [];
    this.epigeneticMarkers = new Map();
    
    // Astrobiology Properties
    this.cosmicRadiationResistance = this.phenotype.radiationTolerance;
    this.vacuumAdaptation = this.phenotype.pressureTolerance;
    this.extremophileScore = this.calculateExtremophileScore();
    
    // Physical Properties
    this.position = position || new THREE.Vector3(randRange(-10, 10), 0, randRange(-10, 10));
    this.velocity = new THREE.Vector3();
    this.energy = this.phenotype.baseEnergy;
    this.mass = this.phenotype.size;
    
    // Social Behavior
    this.socialBonds = new Map();
    this.communicationSignals = [];
    this.groupIdentity = null;
    
    // Reproduction
    this.reproductiveMature = false;
    this.reproductiveUrge = 0;
    this.maxOffspring = Math.floor(this.phenotype.fertility * 3);
    this.offspringCount = 0;
    
    this.createVisual();
    this.startLifecycle();
    
    logEvent(`${this.species}-${this.id} born (Gen ${this.generation})`, LOG_TYPES.INFO);
  }
  
  generateId() {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  }
  
  generateGenome() {
    // 24 chromosomes, each with allele pairs for different traits
    const genome = {
      // Physical traits
      size: [randRange(0.5, 2.0), randRange(0.5, 2.0)],
      speed: [randRange(0.1, 1.0), randRange(0.1, 1.0)],
      color: [randRange(0, 360), randRange(0, 360)], // HSL hue
      
      // Metabolic traits
      metabolism: [randRange(0.5, 2.0), randRange(0.5, 2.0)],
      efficiency: [randRange(0.3, 1.0), randRange(0.3, 1.0)],
      baseEnergy: [randRange(50, 150), randRange(50, 150)],
      
      // Behavioral traits
      aggression: [randRange(0, 1), randRange(0, 1)],
      curiosity: [randRange(0, 1), randRange(0, 1)],
      socialTendency: [randRange(0, 1), randRange(0, 1)],
      
      // Survival traits
      radiationTolerance: [randRange(0, 1), randRange(0, 1)],
      pressureTolerance: [randRange(0, 1), randRange(0, 1)],
      temperatureTolerance: [randRange(0, 1), randRange(0, 1)],
      
      // Reproduction
      fertility: [randRange(0.1, 1.0), randRange(0.1, 1.0)],
      parentalCare: [randRange(0, 1), randRange(0, 1)],
      
      // Intelligence
      neuralComplexity: [randRange(0.3, 1.0), randRange(0.3, 1.0)],
      learningRate: [randRange(0.1, 1.0), randRange(0.1, 1.0)],
      memoryCapacity: [randRange(10, 100), randRange(10, 100)],
      
      // Quantum properties (theoretical)
      quantumSensitivity: [randRange(0, 1), randRange(0, 1)],
      coherenceStability: [randRange(0, 1), randRange(0, 1)]
    };
    
    return genome;
  }
  
  expressGenome() {
    // Express dominant/recessive traits and environmental influences
    const phenotype = {};
    
    for (const [trait, alleles] of Object.entries(this.genome)) {
      // Simple dominance model with some blending
      const dominance = Math.random();
      if (dominance < 0.25) {
        phenotype[trait] = alleles[0]; // First allele dominant
      } else if (dominance < 0.5) {
        phenotype[trait] = alleles[1]; // Second allele dominant
      } else {
        phenotype[trait] = (alleles[0] + alleles[1]) / 2; // Blended
      }
      
      // Environmental influence (epigenetics)
      if (this.environmentalStress > 0.5) {
        phenotype[trait] *= (1 + randRange(-0.2, 0.2));
      }
    }
    
    return phenotype;
  }
  
  createBrain() {
    // Simple neural network with input, hidden, and output layers
    const inputSize = 12; // sensory inputs
    const hiddenSize = Math.floor(this.phenotype.neuralComplexity * 20) + 5;
    const outputSize = 8; // behavioral outputs
    
    const brain = {
      weights_ih: this.randomMatrix(hiddenSize, inputSize),
      weights_ho: this.randomMatrix(outputSize, hiddenSize),
      bias_h: this.randomArray(hiddenSize),
      bias_o: this.randomArray(outputSize),
      
      // Neuromodulator systems
      dopamine: 0.5,
      serotonin: 0.5,
      norepinephrine: 0.5,
      
      // Learning parameters
      learningRate: this.phenotype.learningRate * 0.01,
      plasticity: this.phenotype.neuralComplexity
    };
    
    return brain;
  }
  
  randomMatrix(rows, cols) {
    return Array(rows).fill().map(() => 
      Array(cols).fill().map(() => randRange(-1, 1))
    );
  }
  
  randomArray(size) {
    return Array(size).fill().map(() => randRange(-0.5, 0.5));
  }
  
  think(sensorInputs) {
    // Forward propagation through neural network
    const { weights_ih, weights_ho, bias_h, bias_o } = this.brain;
    
    // Hidden layer activation
    const hidden = weights_ih.map((row, i) => {
      const sum = row.reduce((acc, weight, j) => acc + weight * sensorInputs[j], 0) + bias_h[i];
      return this.sigmoid(sum);
    });
    
    // Output layer activation
    const outputs = weights_ho.map((row, i) => {
      const sum = row.reduce((acc, weight, j) => acc + weight * hidden[j], 0) + bias_o[i];
      return this.sigmoid(sum);
    });
    
    // Apply neuromodulators
    return outputs.map((output, i) => {
      let modulated = output;
      if (i < 3) modulated *= (1 + this.brain.dopamine - 0.5); // Movement
      if (i >= 3 && i < 6) modulated *= (1 + this.brain.serotonin - 0.5); // Social
      if (i >= 6) modulated *= (1 + this.brain.norepinephrine - 0.5); // Survival
      return clamp(modulated, 0, 1);
    });
  }
  
  sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }
  
  getSensorInputs(environment) {
    // Collect sensory information from environment
    return [
      this.energy / 200, // Energy level
      this.age / this.lifespan, // Age ratio
      environment.foodDensity || 0, // Food availability
      environment.threatLevel || 0, // Danger level
      environment.temperature || 0.5, // Temperature
      environment.radiation || 0, // Radiation level
      environment.pressure || 1, // Atmospheric pressure
      this.socialBonds.size / 10, // Social connections
      this.reproductiveUrge, // Reproductive drive
      this.quantumCoherence, // Quantum state
      this.environmentalStress, // Stress level
      Math.random() // Random noise
    ];
  }
  
  update(environment, otherOrganisms) {
    if (!this.alive) return;
    
    this.age++;
    
    // Get sensory information and make decisions
    const sensorInputs = this.getSensorInputs(environment);
    const decisions = this.think(sensorInputs);
    
    // Execute behaviors based on neural outputs
    this.executeBehaviors(decisions, environment, otherOrganisms);
    
    // Quantum coherence effects
    this.updateQuantumState(environment);
    
    // Environmental adaptation
    this.adaptToEnvironment(environment);
    
    // Aging and metabolism
    this.metabolize();
    
    // Check survival
    if (this.energy <= 0 || this.age >= this.lifespan) {
      this.die();
    }
    
    // Reproductive maturity
    if (this.age > this.lifespan * 0.3) {
      this.reproductiveMature = true;
      this.reproductiveUrge = Math.min(1, this.reproductiveUrge + 0.01);
    }
    
    this.updateVisual();
  }
  
  executeBehaviors(decisions, environment, otherOrganisms) {
    // Movement behaviors
    const moveX = (decisions[0] - 0.5) * this.phenotype.speed;
    const moveZ = (decisions[1] - 0.5) * this.phenotype.speed;
    const moveY = (decisions[2] - 0.5) * this.phenotype.speed * 0.3;
    
    this.velocity.add(new THREE.Vector3(moveX, moveY, moveZ));
    this.velocity.multiplyScalar(0.95); // Friction
    this.position.add(this.velocity);
    
    // Social behaviors
    if (decisions[3] > 0.7) this.seekSocialContact(otherOrganisms);
    if (decisions[4] > 0.8) this.shareResources(otherOrganisms);
    if (decisions[5] > 0.6) this.communicate(otherOrganisms);
    
    // Survival behaviors
    if (decisions[6] > 0.5) this.forage(environment);
    if (decisions[7] > 0.9 && this.reproductiveMature) this.attemptReproduction(otherOrganisms);
  }
  
  updateQuantumState(environment) {
    // Theoretical quantum biology effects
    if (this.phenotype.quantumSensitivity > 0.7) {
      // Quantum coherence affects behavior
      const decoherenceRate = environment.temperature * 0.1 + environment.radiation * 0.05;
      this.quantumCoherence *= (1 - decoherenceRate);
      
      if (this.quantumCoherence < 0.3) {
        this.quantumState.collapsed = true;
        // Quantum collapse affects neural processing
        this.brain.dopamine *= 0.9;
      }
      
      // Quantum entanglement with nearby organisms
      this.updateQuantumEntanglement();
    }
  }
  
  updateQuantumEntanglement() {
    // Experimental: quantum entanglement between organisms
    if (this.entanglementPartners.length > 0) {
      this.entanglementPartners.forEach(partnerId => {
        // Correlated behavior due to entanglement
        if (Math.random() < 0.1) {
          this.brain.serotonin += randRange(-0.05, 0.05);
        }
      });
    }
  }
  
  adaptToEnvironment(environment) {
    // Epigenetic responses to environmental stress
    let stressLevel = 0;
    
    if (environment.temperature > 0.8 || environment.temperature < 0.2) {
      stressLevel += 0.2;
      this.activateEpigeneticMarker('heatShock', environment.temperature);
    }
    
    if (environment.radiation > 0.3) {
      stressLevel += 0.3;
      this.activateEpigeneticMarker('radiationResponse', environment.radiation);
    }
    
    if (environment.foodDensity < 0.2) {
      stressLevel += 0.1;
      this.activateEpigeneticMarker('starvationResponse', 1 - environment.foodDensity);
    }
    
    this.environmentalStress = stressLevel;
    
    // Adaptation over time
    if (this.environmentalStress > 0.5) {
      this.adaptationHistory.push({
        stress: this.environmentalStress,
        environment: { ...environment },
        age: this.age
      });
    }
  }
  
  activateEpigeneticMarker(marker, strength) {
    if (!this.epigeneticMarkers.has(marker)) {
      this.epigeneticMarkers.set(marker, 0);
    }
    
    const current = this.epigeneticMarkers.get(marker);
    this.epigeneticMarkers.set(marker, Math.min(1, current + strength * 0.1));
    
    // Epigenetic changes affect phenotype
    this.applyEpigeneticEffects(marker, strength);
  }
  
  applyEpigeneticEffects(marker, strength) {
    switch (marker) {
      case 'heatShock':
        this.phenotype.temperatureTolerance *= (1 + strength * 0.05);
        break;
      case 'radiationResponse':
        this.phenotype.radiationTolerance *= (1 + strength * 0.03);
        break;
      case 'starvationResponse':
        this.phenotype.efficiency *= (1 + strength * 0.02);
        break;
    }
  }
  
  seekSocialContact(otherOrganisms) {
    const nearby = otherOrganisms.filter(org => 
      org !== this && org.alive && 
      this.position.distanceTo(org.position) < 5
    );
    
    nearby.forEach(org => {
      const affinity = this.calculateSocialAffinity(org);
      if (affinity > 0.5) {
        this.formSocialBond(org);
      }
    });
  }
  
  calculateSocialAffinity(other) {
    let affinity = 0.5;
    
    // Genetic similarity
    const geneticSimilarity = this.calculateGeneticSimilarity(other);
    affinity += geneticSimilarity * 0.3;
    
    // Behavioral compatibility
    const behaviorDiff = Math.abs(this.phenotype.socialTendency - other.phenotype.socialTendency);
    affinity += (1 - behaviorDiff) * 0.2;
    
    // Species recognition
    if (this.species === other.species) affinity += 0.2;
    
    // Quantum entanglement bonus
    if (this.entanglementPartners.includes(other.id)) affinity += 0.3;
    
    return clamp(affinity, 0, 1);
  }
  
  calculateGeneticSimilarity(other) {
    let similarity = 0;
    let totalTraits = 0;
    
    for (const trait in this.genome) {
      const myAlleles = this.genome[trait];
      const otherAlleles = other.genome[trait];
      
      // Calculate allele similarity
      const sim1 = 1 - Math.abs(myAlleles[0] - otherAlleles[0]) / Math.max(myAlleles[0], otherAlleles[0], 1);
      const sim2 = 1 - Math.abs(myAlleles[1] - otherAlleles[1]) / Math.max(myAlleles[1], otherAlleles[1], 1);
      
      similarity += (sim1 + sim2) / 2;
      totalTraits++;
    }
    
    return similarity / totalTraits;
  }
  
  formSocialBond(other) {
    if (!this.socialBonds.has(other.id)) {
      this.socialBonds.set(other.id, {
        strength: 0.1,
        formed: this.age,
        interactions: 0
      });
      
      // Mutual bond formation
      if (!other.socialBonds.has(this.id)) {
        other.formSocialBond(this);
      }
      
      logEvent(`${this.id} formed social bond with ${other.id}`, LOG_TYPES.INFO);
    } else {
      // Strengthen existing bond
      const bond = this.socialBonds.get(other.id);
      bond.strength = Math.min(1, bond.strength + 0.05);
      bond.interactions++;
    }
  }
  
  reproduce(partner) {
    if (!this.reproductiveMature || !partner.reproductiveMature || 
        this.offspringCount >= this.maxOffspring || 
        partner.offspringCount >= partner.maxOffspring) {
      return null;
    }
    
    // Energy cost of reproduction
    const energyCost = 30;
    if (this.energy < energyCost || partner.energy < energyCost) {
      return null;
    }
    
    this.energy -= energyCost;
    partner.energy -= energyCost;
    
    // Genetic recombination
    const childGenome = this.recombineGenomes(this.genome, partner.genome);
    
    // Mutation
    this.mutateGenome(childGenome);
    
    // Create offspring
    const childPosition = new THREE.Vector3().addVectors(this.position, partner.position).multiplyScalar(0.5);
    childPosition.add(new THREE.Vector3(randRange(-2, 2), 0, randRange(-2, 2)));
    
    const child = new AdvancedOrganism(
      childGenome, 
      Math.max(this.generation, partner.generation) + 1,
      [this.id, partner.id],
      childPosition
    );
    
    this.offspringCount++;
    partner.offspringCount++;
    
    // Potential quantum entanglement with offspring
    if (Math.random() < this.phenotype.quantumSensitivity * 0.3) {
      this.entanglementPartners.push(child.id);
      child.entanglementPartners.push(this.id);
    }
    
    logEvent(`${this.id} × ${partner.id} → ${child.id} (Gen ${child.generation})`, LOG_TYPES.MUTATION);
    bus.emit('organism-reproduced', { parents: [this, partner], child });
    
    return child;
  }
  
  recombineGenomes(genome1, genome2) {
    const childGenome = {};
    
    for (const trait in genome1) {
      // Random crossover between parent genomes
      const crossover = Math.random();
      if (crossover < 0.25) {
        childGenome[trait] = [genome1[trait][0], genome1[trait][1]]; // Parent 1
      } else if (crossover < 0.5) {
        childGenome[trait] = [genome2[trait][0], genome2[trait][1]]; // Parent 2
      } else if (crossover < 0.75) {
        childGenome[trait] = [genome1[trait][0], genome2[trait][1]]; // Mixed 1
      } else {
        childGenome[trait] = [genome2[trait][0], genome1[trait][1]]; // Mixed 2
      }
    }
    
    return childGenome;
  }
  
  mutateGenome(genome) {
    const mutationRate = 0.05; // 5% chance per allele
    
    for (const trait in genome) {
      for (let i = 0; i < 2; i++) {
        if (Math.random() < mutationRate) {
          const mutationStrength = randRange(-0.2, 0.2);
          genome[trait][i] = clamp(genome[trait][i] + mutationStrength, 0, 2);
        }
      }
    }
  }
  
  attemptReproduction(otherOrganisms) {
    if (this.reproductiveUrge < 0.8) return;
    
    const potentialMates = otherOrganisms.filter(org => 
      org !== this && 
      org.alive && 
      org.reproductiveMature && 
      org.species === this.species &&
      this.position.distanceTo(org.position) < 3 &&
      org.reproductiveUrge > 0.5
    );
    
    if (potentialMates.length > 0) {
      // Choose mate based on genetic fitness and social bonds
      const mate = this.selectMate(potentialMates);
      if (mate) {
        const offspring = this.reproduce(mate);
        if (offspring) {
          this.reproductiveUrge = 0;
          mate.reproductiveUrge = 0;
          return offspring;
        }
      }
    }
    
    return null;
  }
  
  selectMate(candidates) {
    let bestMate = null;
    let bestScore = 0;
    
    candidates.forEach(candidate => {
      let score = 0;
      
      // Genetic diversity bonus (avoid inbreeding)
      const geneticSimilarity = this.calculateGeneticSimilarity(candidate);
      score += (1 - geneticSimilarity) * 0.4; // Prefer genetic diversity
      
      // Fitness indicators
      score += (candidate.energy / 200) * 0.2;
      score += (candidate.phenotype.size / 2) * 0.1;
      score += candidate.phenotype.fertility * 0.2;
      
      // Social bond bonus
      if (this.socialBonds.has(candidate.id)) {
        score += this.socialBonds.get(candidate.id).strength * 0.1;
      }
      
      if (score > bestScore) {
        bestScore = score;
        bestMate = candidate;
      }
    });
    
    return bestMate;
  }
  
  forage(environment) {
    const foragingSuccess = this.phenotype.curiosity * environment.foodDensity * Math.random();
    
    if (foragingSuccess > 0.3) {
      const energyGain = foragingSuccess * 20;
      this.energy = Math.min(200, this.energy + energyGain);
      
      // Learning: remember successful foraging locations
      this.addMemory('foraging', {
        location: this.position.clone(),
        success: foragingSuccess,
        age: this.age
      });
    }
  }
  
  addMemory(type, data) {
    this.memory.push({ type, data, age: this.age });
    
    // Limit memory based on capacity
    const maxMemories = this.phenotype.memoryCapacity;
    if (this.memory.length > maxMemories) {
      // Remove oldest memories (unless they're very important)
      this.memory = this.memory
        .sort((a, b) => b.importance - a.importance)
        .slice(0, maxMemories);
    }
  }
  
  metabolize() {
    const baseCost = this.phenotype.metabolism;
    const sizeCost = this.phenotype.size * 0.5;
    const movementCost = this.velocity.length() * 2;
    const brainCost = this.phenotype.neuralComplexity * 0.5;
    const stressCost = this.environmentalStress * 1.5;
    
    const totalCost = baseCost + sizeCost + movementCost + brainCost + stressCost;
    this.energy -= totalCost / this.phenotype.efficiency;
  }
  
  calculateExtremophileScore() {
    const radiation = this.phenotype.radiationTolerance;
    const pressure = this.phenotype.pressureTolerance;
    const temperature = this.phenotype.temperatureTolerance;
    
    return (radiation + pressure + temperature) / 3;
  }
  
  createVisual() {
    // Create 3D visual representation based on phenotype
    this.visual = new THREE.Group();
    
    // Main body - size and color based on genetics
    const bodySize = this.phenotype.size;
    const bodyGeometry = new THREE.SphereGeometry(bodySize, 16, 16);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color().setHSL(this.phenotype.color / 360, 0.8, 0.5),
      emissive: new THREE.Color().setHSL(this.phenotype.color / 360, 0.3, 0.1),
      transparent: true,
      opacity: 0.9
    });
    
    this.bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
    this.visual.add(this.bodyMesh);
    
    // Neural activity visualization
    this.createNeuralVisualization();
    
    // Quantum field visualization
    if (this.phenotype.quantumSensitivity > 0.5) {
      this.createQuantumField();
    }
    
    this.visual.position.copy(this.position);
  }
  
  createNeuralVisualization() {
    this.neuralNodes = [];
    const complexity = Math.floor(this.phenotype.neuralComplexity * 12) + 4;
    
    for (let i = 0; i < complexity; i++) {
      const nodeGeometry = new THREE.SphereGeometry(0.02, 6, 6);
      const nodeMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.6
      });
      
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      
      // Position nodes around the organism
      const radius = this.phenotype.size + 0.3;
      const phi = Math.acos(-1 + (2 * i) / complexity);
      const theta = Math.sqrt(complexity * Math.PI) * phi;
      
      node.position.setFromSphericalCoords(radius, phi, theta);
      this.neuralNodes.push(node);
      this.visual.add(node);
    }
  }
  
  createQuantumField() {
    const fieldGeometry = new THREE.RingGeometry(this.phenotype.size + 0.5, this.phenotype.size + 1, 16);
    const fieldMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide
    });
    
    this.quantumField = new THREE.Mesh(fieldGeometry, fieldMaterial);
    this.quantumField.rotation.x = Math.PI / 2;
    this.visual.add(this.quantumField);
  }
  
  updateVisual() {
    if (!this.visual) return;
    
    this.visual.position.copy(this.position);
    
    // Update body based on health and age
    const healthRatio = this.energy / 200;
    const ageRatio = this.age / this.lifespan;
    
    this.bodyMesh.material.opacity = healthRatio * 0.9 + 0.1;
    this.bodyMesh.scale.setScalar(1 + Math.sin(Date.now() * 0.003) * 0.1);
    
    // Neural activity based on brain state
    if (this.neuralNodes) {
      this.neuralNodes.forEach((node, i) => {
        const activity = this.brain.dopamine + this.brain.serotonin + Math.sin(Date.now() * 0.01 + i);
        node.material.opacity = clamp(activity * 0.5, 0.1, 1.0);
        node.scale.setScalar(0.5 + activity * 0.5);
      });
    }
    
    // Quantum field effects
    if (this.quantumField) {
      this.quantumField.material.opacity = this.quantumCoherence * 0.3;
      this.quantumField.rotation.z += 0.01;
      
      if (this.quantumState.collapsed) {
        this.quantumField.material.color.setHex(0xff0000);
      } else {
        this.quantumField.material.color.setHex(0x00ffff);
      }
    }
    
    // Color shifts based on environmental adaptation
    if (this.environmentalStress > 0.5) {
      const stressHue = (this.phenotype.color + 180) % 360;
      this.bodyMesh.material.color.setHSL(stressHue / 360, 0.8, 0.3);
    }
  }
  
  startLifecycle() {
    // Species-specific behaviors and lifecycle events
    this.lifecycleInterval = setInterval(() => {
      if (!this.alive) {
        clearInterval(this.lifecycleInterval);
        return;
      }
      
      // Periodic behaviors
      this.updateNeuromodulators();
      this.processMemories();
      this.socialMaintenance();
      this.quantumDecoherence();
      
    }, 100); // 10Hz lifecycle updates
  }
  
  updateNeuromodulators() {
    // Dopamine - reward and motivation
    if (this.energy > 100) {
      this.brain.dopamine = Math.min(1, this.brain.dopamine + 0.01);
    } else {
      this.brain.dopamine = Math.max(0, this.brain.dopamine - 0.02);
    }
    
    // Serotonin - social well-being
    const socialSatisfaction = this.socialBonds.size / 5;
    this.brain.serotonin = lerp(this.brain.serotonin, socialSatisfaction, 0.05);
    
    // Norepinephrine - stress and alertness
    this.brain.norepinephrine = lerp(this.brain.norepinephrine, this.environmentalStress, 0.1);
  }
  
  processMemories() {
    // Memory consolidation and learning
    if (this.memory.length > 0) {
      const recentMemories = this.memory.filter(m => (this.age - m.age) < 100);
      
      // Strengthen important memories
      recentMemories.forEach(memory => {
        if (memory.type === 'foraging' && memory.data.success > 0.5) {
          memory.importance = (memory.importance || 0) + 0.1;
        }
      });
      
      // Learn from experiences
      if (recentMemories.length > 5) {
        this.consolidateLearning(recentMemories);
      }
    }
  }
  
  consolidateLearning(memories) {
    // Simple learning: adjust brain weights based on successful experiences
    const successfulMemories = memories.filter(m => 
      m.type === 'foraging' && m.data.success > 0.4
    );
    
    if (successfulMemories.length > 2) {
      // Slightly adjust neural weights toward successful patterns
      const adjustment = this.brain.learningRate;
      
      // This is a simplified version of learning - in reality would be much more complex
      this.brain.weights_ih.forEach((row, i) => {
        row.forEach((weight, j) => {
          if (Math.random() < 0.1) {
            this.brain.weights_ih[i][j] += randRange(-adjustment, adjustment);
            this.brain.weights_ih[i][j] = clamp(this.brain.weights_ih[i][j], -2, 2);
          }
        });
      });
      
      logEvent(`${this.id} consolidated learning from ${successfulMemories.length} experiences`, LOG_TYPES.INFO);
    }
  }
  
  socialMaintenance() {
    // Maintain and update social bonds
    for (const [partnerId, bond] of this.socialBonds.entries()) {
      // Bonds decay over time without interaction
      bond.strength = Math.max(0, bond.strength - 0.001);
      
      if (bond.strength < 0.1) {
        this.socialBonds.delete(partnerId);
        logEvent(`${this.id} lost social bond with ${partnerId}`, LOG_TYPES.INFO);
      }
    }
  }
  
  quantumDecoherence() {
    // Quantum coherence naturally decays
    if (this.quantumCoherence > 0) {
      const decoherenceRate = 0.001 + (this.environmentalStress * 0.002);
      this.quantumCoherence = Math.max(0, this.quantumCoherence - decoherenceRate);
      
      // Spontaneous recoherence in low-stress environments
      if (this.environmentalStress < 0.2 && Math.random() < 0.01) {
        this.quantumCoherence = Math.min(1, this.quantumCoherence + 0.05);
        this.quantumState.collapsed = false;
      }
    }
  }
  
  communicate(otherOrganisms) {
    const nearby = otherOrganisms.filter(org => 
      org !== this && org.alive && 
      this.position.distanceTo(org.position) < 8
    );
    
    if (nearby.length > 0) {
      // Send communication signal
      const signal = {
        type: this.determineSignalType(),
        strength: this.phenotype.socialTendency,
        content: this.generateSignalContent(),
        senderId: this.id,
        timestamp: this.age
      };
      
      nearby.forEach(org => {
        org.receiveSignal(signal);
      });
      
      this.communicationSignals.push(signal);
      
      // Keep only recent signals
      this.communicationSignals = this.communicationSignals.slice(-20);
    }
  }
  
  determineSignalType() {
    if (this.energy < 50) return 'distress';
    if (this.reproductiveUrge > 0.7) return 'mating';
    if (this.environmentalStress > 0.5) return 'warning';
    if (this.brain.serotonin > 0.7) return 'social';
    return 'exploration';
  }
  
  generateSignalContent() {
    return {
      energy: this.energy > 100 ? 'high' : this.energy > 50 ? 'medium' : 'low',
      mood: this.brain.serotonin > 0.6 ? 'positive' : 'neutral',
      generation: this.generation,
      location: this.position.clone(),
      stress: this.environmentalStress
    };
  }
  
  receiveSignal(signal) {
    // Process received communication
    const affinity = this.socialBonds.has(signal.senderId) ? 
      this.socialBonds.get(signal.senderId).strength : 0;
    
    const receptivity = this.phenotype.socialTendency * (1 + affinity);
    
    if (Math.random() < receptivity) {
      switch (signal.type) {
        case 'distress':
          if (affinity > 0.3) {
            this.brain.serotonin += 0.1; // Empathy response
            // Could move toward distressed organism
          }
          break;
          
        case 'warning':
          this.brain.norepinephrine += 0.2;
          this.environmentalStress = Math.max(this.environmentalStress, signal.content.stress * 0.5);
          break;
          
        case 'mating':
          if (this.reproductiveMature && this.species === 'digitalis') {
            this.reproductiveUrge += 0.1;
          }
          break;
          
        case 'social':
          this.brain.serotonin += 0.05;
          break;
      }
      
      // Store communication in memory
      this.addMemory('communication', {
        signal: signal,
        response: 'processed',
        affinity: affinity
      });
    }
  }
  
  shareResources(otherOrganisms) {
    if (this.energy < 80) return; // Don't share if low energy
    
    const needyOrganisms = otherOrganisms.filter(org => 
      org !== this && 
      org.alive && 
      org.energy < 40 && 
      this.position.distanceTo(org.position) < 3 &&
      this.socialBonds.has(org.id)
    );
    
    needyOrganisms.forEach(org => {
      const bond = this.socialBonds.get(org.id);
      if (bond.strength > 0.5) {
        const shareAmount = 10 * bond.strength;
        this.energy -= shareAmount;
        org.energy += shareAmount;
        
        // Strengthen bond through altruism
        bond.strength = Math.min(1, bond.strength + 0.1);
        
        // Increase serotonin from helping
        this.brain.serotonin = Math.min(1, this.brain.serotonin + 0.15);
        
        logEvent(`${this.id} shared resources with ${org.id}`, LOG_TYPES.INFO);
      }
    });
  }
  
  die() {
    this.alive = false;
    
    // Record death data for analysis
    const deathData = {
      id: this.id,
      age: this.age,
      generation: this.generation,
      cause: this.determineCauseOfDeath(),
      finalGenome: this.genome,
      finalPhenotype: this.phenotype,
      offspring: this.offspringCount,
      socialBonds: this.socialBonds.size,
      adaptations: Array.from(this.epigeneticMarkers.entries()),
      extremophileScore: this.extremophileScore,
      quantumCoherence: this.quantumCoherence
    };
    
    // Visual death effects
    if (this.visual) {
      this.bodyMesh.material.opacity = 0.3;
      this.bodyMesh.material.color.setHex(0x666666);
      if (this.quantumField) {
        this.quantumField.visible = false;
      }
    }
    
    // Clear lifecycle
    if (this.lifecycleInterval) {
      clearInterval(this.lifecycleInterval);
    }
    
    // Emit death event with data
    bus.emit('organism-died', deathData);
    
    logEvent(`${this.id} died at age ${this.age} (Gen ${this.generation}): ${deathData.cause}`, LOG_TYPES.INFO);
  }
  
  determineCauseOfDeath() {
    if (this.energy <= 0) return 'starvation';
    if (this.age >= this.lifespan) return 'old age';
    if (this.environmentalStress > 0.9) return 'environmental stress';
    return 'unknown';
  }
  
  // Getters for analysis
  getGeneticSummary() {
    return {
      id: this.id,
      generation: this.generation,
      parentIds: this.parentIds,
      genome: this.genome,
      phenotype: this.phenotype,
      fitness: this.calculateFitness(),
      species: this.species
    };
  }
  
  calculateFitness() {
    // Multi-factor fitness calculation
    let fitness = 0;
    
    // Survival
    fitness += (this.age / this.lifespan) * 0.3;
    
    // Reproduction success
    fitness += this.offspringCount * 0.4;
    
    // Environmental adaptation
    fitness += (1 - this.environmentalStress) * 0.1;
    
    // Social success
    fitness += Math.min(this.socialBonds.size / 5, 1) * 0.1;
    
    // Neural efficiency
    fitness += this.phenotype.neuralComplexity * 0.1;
    
    return clamp(fitness, 0, 2);
  }
}