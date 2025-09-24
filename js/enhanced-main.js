// js/enhanced-main.js - Advanced Bio-Digital Organism Lab
import { AdvancedOrganism } from "./advanced-organism.js";
import { EcosystemManager } from "./ecosystem-manager.js";
import { ScientificDashboard } from "./data-visualization.js";
import { BiologicalOrganism } from "./bio-organism.js";
import { logEvent, LOG_TYPES } from "./logger.js";
import { bus } from "./communication.js";
import { randRange } from "./utils.js";

class AdvancedBioDigitalLab {
  constructor() {
    this.ecosystem = null;
    this.dashboard = null;
    this.visualOrganism = null;
    this.childWindows = [];
    this.researchMode = true;
    this.autoSpawn = false;
    this.simulationSpeed = 1.0;
    
    this.init();
  }
  
  async init() {
    try {
      this.updateStatus("Initializing advanced bio-digital laboratory...");
      
      // Create enhanced UI
      this.createEnhancedUI();
      
      // Initialize ecosystem manager
      this.ecosystem = new EcosystemManager();
      
      // Initialize scientific dashboard
      this.dashboard = new ScientificDashboard("dashboard");
      
      // Create 3D visualization
      this.visualOrganism = new BiologicalOrganism(true);
      
      // Setup advanced controls
      this.setupAdvancedControls();
      
      // Setup event bus communication
      this.setupEventBus();
      
      // Initialize with research population
      await this.initializeResearchPopulation();
      
      // Start educational scenarios
      this.loadEducationalScenarios();
      
      this.updateStatus("Advanced Bio-Digital Laboratory online");
      logEvent("🚀 Advanced Bio-Digital Laboratory initialized", LOG_TYPES.INFO);
      
      // Start initial demonstration
      setTimeout(() => {
        this.runWelcomeDemo();
      }, 2000);
      
    } catch (error) {
      console.error("Initialization error:", error);
      this.updateStatus(`Error: ${error.message}`);
    }
  }
  
  createEnhancedUI() {
    const controlsDiv = document.getElementById('controls');
    if (controlsDiv) {
      controlsDiv.innerHTML = `
        <div class="lab-header">
          <h2>🧬 Advanced Bio-Digital Organism Laboratory</h2>
          <div class="lab-subtitle">Educational & Research Platform for Digital Evolution</div>
        </div>
        
        <div class="control-sections">
          <!-- Population Controls -->
          <div class="control-section">
            <h4>🧪 Population Control</h4>
            <button id="spawn-population" class="btn-primary">Initialize Population</button>
            <button id="spawn-viewport" class="btn-secondary">Spawn Viewport</button>
            <button id="genetic-rescue" class="btn-warning">Genetic Rescue</button>
            <button id="reset-ecosystem" class="btn-danger">Reset Ecosystem</button>
          </div>
          
          <!-- Environmental Controls -->
          <div class="control-section">
            <h4>🌍 Environmental Control</h4>
            <label>Temperature: <input type="range" id="temp-slider" min="0" max="100" value="50"></label>
            <label>Radiation: <input type="range" id="rad-slider" min="0" max="100" value="10"></label>
            <label>Food Density: <input type="range" id="food-slider" min="0" max="100" value="60"></label>
            <button id="trigger-catastrophe" class="btn-warning">Trigger Catastrophe</button>
          </div>
          
          <!-- Research Tools -->
          <div class="control-section">
            <h4>🔬 Research Tools</h4>
            <button id="artificial-selection" class="btn-secondary">Artificial Selection</button>
            <button id="introduce-species" class="btn-secondary">Introduce Species</button>
            <button id="quantum-storm" class="btn-special">Quantum Storm</button>
            <button id="export-data" class="btn-primary">Export Data</button>
          </div>
          
          <!-- Educational Scenarios -->
          <div class="control-section">
            <h4>📚 Educational Scenarios</h4>
            <select id="scenario-selector">
              <option value="">Select Scenario...</option>
              <option value="natural-selection">Natural Selection Demo</option>
              <option value="genetic-drift">Genetic Drift</option>
              <option value="founder-effect">Founder Effect</option>
              <option value="adaptive-radiation">Adaptive Radiation</option>
              <option value="extinction-recovery">Mass Extinction & Recovery</option>
              <option value="astrobiology">Astrobiology Simulation</option>
              <option value="quantum-evolution">Quantum Evolution (Theoretical)</option>
            </select>
            <button id="run-scenario" class="btn-primary">Run Scenario</button>
          </div>
          
          <!-- Simulation Controls -->
          <div class="control-section">
            <h4>⚙️ Simulation</h4>
            <label>Speed: <input type="range" id="speed-slider" min="0.1" max="5" step="0.1" value="1"></label>
            <label><input type="checkbox" id="auto-spawn"> Auto-spawn</label>
            <label><input type="checkbox" id="research-mode" checked> Research Mode</label>
            <button id="pause-resume" class="btn-secondary">Pause</button>
          </div>
        </div>
        
        <div class="status-panel">
          <div id="status" class="status-text">System initializing...</div>
          <div id="quick-stats" class="quick-stats">
            <span id="pop-count">Pop: 0</span>
            <span id="gen-count">Gen: 1</span>
            <span id="species-count">Species: 1</span>
          </div>
        </div>
      `;
    }
    
    // Create dashboard container if it doesn't exist
    if (!document.getElementById('dashboard')) {
      const dashboardDiv = document.createElement('div');
      dashboardDiv.id = 'dashboard';
      document.body.appendChild(dashboardDiv);
    }
  }
  
  setupAdvancedControls() {
    // Population controls
    document.getElementById('spawn-population')?.addEventListener('click', () => {
      this.spawnResearchPopulation();
    });
    
    document.getElementById('spawn-viewport')?.addEventListener('click', () => {
      this.spawnViewport();
    });
    
    document.getElementById('genetic-rescue')?.addEventListener('click', () => {
      this.ecosystem.geneticRescue();
    });
    
    document.getElementById('reset-ecosystem')?.addEventListener('click', () => {
      this.resetEcosystem();
    });
    
    // Environmental controls
    document.getElementById('temp-slider')?.addEventListener('input', (e) => {
      this.ecosystem.environment.temperature = e.target.value / 100;
    });
    
    document.getElementById('rad-slider')?.addEventListener('input', (e) => {
      this.ecosystem.environment.radiation = e.target.value / 100;
    });
    
    document.getElementById('food-slider')?.addEventListener('input', (e) => {
      this.ecosystem.environment.foodDensity = e.target.value / 100;
    });
    
    document.getElementById('trigger-catastrophe')?.addEventListener('click', () => {
      this.ecosystem.triggerCatastrophicEvent();
    });
    
    // Research tools
    document.getElementById('artificial-selection')?.addEventListener('click', () => {
      this.ecosystem.artificialSelection();
    });
    
    document.getElementById('introduce-species')?.addEventListener('click', () => {
      this.introduceNewSpecies();
    });
    
    document.getElementById('quantum-storm')?.addEventListener('click', () => {
      this.ecosystem.quantumStorm();
    });
    
    document.getElementById('export-data')?.addEventListener('click', () => {
      this.ecosystem.exportData();
    });
    
    // Educational scenarios
    document.getElementById('run-scenario')?.addEventListener('click', () => {
      const scenario = document.getElementById('scenario-selector').value;
      if (scenario) {
        this.runEducationalScenario(scenario);
      }
    });
    
    // Simulation controls
    document.getElementById('speed-slider')?.addEventListener('input', (e) => {
      this.simulationSpeed = parseFloat(e.target.value);
      // Apply speed to ecosystem
    });
    
    document.getElementById('auto-spawn')?.addEventListener('change', (e) => {
      this.autoSpawn = e.target.checked;
    });
    
    document.getElementById('research-mode')?.addEventListener('change', (e) => {
      this.researchMode = e.target.checked;
      this.updateResearchMode();
    });
    
    document.getElementById('pause-resume')?.addEventListener('click', () => {
      this.togglePauseResume();
    });
  }
  
  setupEventBus() {
    // Listen for ecosystem events
    bus.on('organism-added', (organism) => {
      this.updateQuickStats();
      if (this.researchMode) {
        logEvent(`📊 Research subject ${organism.id} added to study`, LOG_TYPES.INFO);
      }
    });
    
    bus.on('organism-died', (deathData) => {
      this.updateQuickStats();
      this.analyzeDeathData(deathData);
    });
    
    bus.on('organism-reproduced', (reproductionData) => {
      this.updateQuickStats();
      if (this.researchMode) {
        this.analyzeReproduction(reproductionData);
      }
    });
    
    bus.on('scientific-data', (data) => {
      this.updateQuickStats(data);
    });
    
    bus.on('change-planetary-conditions', (scenario) => {
      this.ecosystem.setPlanetaryConditions(scenario);
      logEvent(`🌍 Planetary conditions changed to: ${scenario}`, LOG_TYPES.WARNING);
    });
    
    bus.on('export-research-data', () => {
      this.ecosystem.exportData();
    });
  }
  
  async initializeResearchPopulation() {
    this.updateStatus("Initializing research population...");
    
    // Spawn diverse initial population
    this.ecosystem.spawnInitialPopulation();
    
    // Add some pre-adapted organisms for educational purposes
    this.addEducationalExamples();
    
    this.updateStatus("Research population established");
  }
  
  addEducationalExamples() {
    // Heat-adapted organism
    const thermophile = this.ecosystem.introduceSpecies('thermophilus', {
      temperatureTolerance: 0.9,
      radiationTolerance: 0.3,
      size: 0.8
    });
    thermophile.position.set(2, 0, 2);
    
    // Radiation-resistant organism  
    const radiophile = this.ecosystem.introduceSpecies('radiophilus', {
      radiationTolerance: 0.95,
      temperatureTolerance: 0.4,
      size: 0.6
    });
    radiophile.position.set(-2, 0, -2);
    
    // Highly intelligent organism
    const cogitans = this.ecosystem.introduceSpecies('cogitans', {
      neuralComplexity: 0.9,
      learningRate: 0.8,
      socialTendency: 0.7
    });
    cogitans.position.set(0, 0, 3);
    
    logEvent("📚 Educational example organisms introduced", LOG_TYPES.INFO);
  }
  
  loadEducationalScenarios() {
    this.scenarios = {
      'natural-selection': {
        name: 'Natural Selection Demonstration',
        description: 'Shows how environmental pressure selects for beneficial traits',
        setup: () => this.setupNaturalSelectionDemo(),
        duration: 60000 // 1 minute
      },
      'genetic-drift': {
        name: 'Genetic Drift',
        description: 'Demonstrates random changes in small populations',
        setup: () => this.setupGeneticDriftDemo(),
        duration: 45000
      },
      'founder-effect': {
        name: 'Founder Effect',
        description: 'Shows genetic bottleneck effects in new populations',
        setup: () => this.setupFounderEffectDemo(),
        duration: 90000
      },
      'adaptive-radiation': {
        name: 'Adaptive Radiation',
        description: 'Multiple species evolve from common ancestor',
        setup: () => this.setupAdaptiveRadiationDemo(),
        duration: 120000
      },
      'extinction-recovery': {
        name: 'Mass Extinction & Recovery',
        description: 'Catastrophic event followed by evolutionary recovery',
        setup: () => this.setupExtinctionRecoveryDemo(),
        duration: 180000
      },
      'astrobiology': {
        name: 'Astrobiology Simulation',
        description: 'Life adaptation to extreme planetary conditions',
        setup: () => this.setupAstrobiologyDemo(),
        duration: 150000
      },
      'quantum-evolution': {
        name: 'Quantum Evolution (Theoretical)',
        description: 'Speculative quantum effects on evolution',
        setup: () => this.setupQuantumEvolutionDemo(),
        duration: 120000
      }
    };
  }
  
  runEducationalScenario(scenarioId) {
    const scenario = this.scenarios[scenarioId];
    if (!scenario) return;
    
    logEvent(`🎓 Running educational scenario: ${scenario.name}`, LOG_TYPES.INFO);
    this.updateStatus(`Running scenario: ${scenario.name}`);
    
    // Reset environment for clean demonstration
    this.resetEcosystem();
    
    // Setup scenario
    setTimeout(() => {
      scenario.setup();
      
      // Show scenario information
      this.showScenarioInfo(scenario);
      
      // Auto-end scenario
      setTimeout(() => {
        this.endScenario(scenario);
      }, scenario.duration);
      
    }, 1000);
  }
  
  setupNaturalSelectionDemo() {
    logEvent("🔬 Demonstrating natural selection with temperature stress", LOG_TYPES.INFO);
    
    // Create population with varied temperature tolerance
    for (let i = 0; i < 10; i++) {
      const organism = new AdvancedOrganism();
      // Vary temperature tolerance
      organism.genome.temperatureTolerance = [randRange(0.1, 0.9), randRange(0.1, 0.9)];
      organism.phenotype = organism.expressGenome();
      this.ecosystem.addOrganism(organism);
    }
    
    // Gradually increase temperature
    let tempIncrease = 0;
    const tempInterval = setInterval(() => {
      tempIncrease += 0.02;
      this.ecosystem.environment.temperature = 0.5 + tempIncrease;
      
      if (tempIncrease > 0.4) {
        clearInterval(tempInterval);
        logEvent("🌡️ Temperature stress complete - observe survivors", LOG_TYPES.WARNING);
      }
    }, 2000);
  }
  
  setupGeneticDriftDemo() {
    logEvent("🎲 Demonstrating genetic drift in small population", LOG_TYPES.INFO);
    
    // Create small population (bottleneck)
    for (let i = 0; i < 4; i++) {
      const organism = new AdvancedOrganism();
      this.ecosystem.addOrganism(organism);
    }
    
    // Remove selection pressure - make environment optimal
    this.ecosystem.environment.temperature = 0.5;
    this.ecosystem.environment.radiation = 0.05;
    this.ecosystem.environment.foodDensity = 0.9;
    
    logEvent("🔬 Small population under neutral conditions - observing random genetic changes", LOG_TYPES.INFO);
  }
  
  setupFounderEffectDemo() {
    logEvent("🏝️ Demonstrating founder effect - new colony from few individuals", LOG_TYPES.INFO);
    
    // Start with large diverse population
    for (let i = 0; i < 15; i++) {
      const organism = new AdvancedOrganism();
      this.ecosystem.addOrganism(organism);
    }
    
    // After some time, simulate colonization event
    setTimeout(() => {
      // Keep only 2-3 "founder" organisms
      const aliveOrganisms = this.ecosystem.organisms.filter(org => org.alive);
      const founders = aliveOrganisms.slice(0, 3);
      
      // "Kill" the rest (simulate geographic separation)
      aliveOrganisms.slice(3).forEach(org => {
        org.energy = 0;
      });
      
      logEvent(`🚢 Founder event: ${founders.length} organisms colonize new habitat`, LOG_TYPES.WARNING);
      
      // New environment conditions
      this.ecosystem.environment.foodDensity = 0.8;
      
    }, 15000);
  }
  
  setupAdaptiveRadiationDemo() {
    logEvent("🌳 Demonstrating adaptive radiation - one ancestor, many niches", LOG_TYPES.INFO);
    
    // Start with single species
    const ancestor = new AdvancedOrganism();
    this.ecosystem.addOrganism(ancestor);
    
    // Create environmental gradient
    this.createEnvironmentalGradient();
    
    // Boost reproduction rate
    this.ecosystem.organisms.forEach(org => {
      if (org.alive) {
        org.phenotype.fertility *= 2;
        org.lifespan *= 2;
      }
    });
    
    logEvent("🌍 Environmental gradients created - watch species diverge", LOG_TYPES.INFO);
  }
  
  setupExtinctionRecoveryDemo() {
    logEvent("💥 Demonstrating mass extinction and evolutionary recovery", LOG_TYPES.WARNING);
    
    // Build up large diverse population first
    for (let i = 0; i < 20; i++) {
      const organism = new AdvancedOrganism();
      this.ecosystem.addOrganism(organism);
    }
    
    // Wait for population to establish
    setTimeout(() => {
      logEvent("☄️ MASS EXTINCTION EVENT INCOMING!", LOG_TYPES.ERROR);
      
      // Trigger catastrophic event
      setTimeout(() => {
        this.ecosystem.executeCatastrophe('asteroid_impact');
        
        // Recovery phase
        setTimeout(() => {
          logEvent("🌱 Post-extinction recovery phase beginning", LOG_TYPES.INFO);
          this.ecosystem.environment.foodDensity = 0.8; // Abundant resources
          this.ecosystem.environment.temperature = 0.5; // Stable conditions
        }, 10000);
        
      }, 2000);
    }, 20000);
  }
  
  setupAstrobiologyDemo() {
    logEvent("🚀 Astrobiology simulation: Life on Mars-like planet", LOG_TYPES.INFO);
    
    // Set Mars-like conditions
    this.ecosystem.setPlanetaryConditions("Mars Colony");
    
    // Start with extremophile organisms
    for (let i = 0; i < 8; i++) {
      const organism = new AdvancedOrganism();
      // Pre-adapt for harsh conditions
      organism.genome.radiationTolerance = [randRange(0.6, 0.9), randRange(0.6, 0.9)];
      organism.genome.temperatureTolerance = [randRange(0.3, 0.7), randRange(0.3, 0.7)];
      organism.genome.pressureTolerance = [randRange(0.7, 0.95), randRange(0.7, 0.95)];
      organism.phenotype = organism.expressGenome();
      this.ecosystem.addOrganism(organism);
    }
    
    // Periodic dust storms
    setInterval(() => {
      if (Math.random() < 0.3) {
        this.ecosystem.environment.radiation += 0.1;
        logEvent("🌪️ Martian dust storm increases radiation", LOG_TYPES.WARNING);
        
        setTimeout(() => {
          this.ecosystem.environment.radiation = Math.max(0.3, this.ecosystem.environment.radiation - 0.1);
        }, 5000);
      }
    }, 15000);
  }
  
  setupQuantumEvolutionDemo() {
    logEvent("⚛️ Theoretical quantum evolution demonstration", LOG_TYPES.MUTATION);
    
    // Create quantum-sensitive organisms
    for (let i = 0; i < 6; i++) {
      const organism = new AdvancedOrganism();
      organism.genome.quantumSensitivity = [randRange(0.7, 0.95), randRange(0.7, 0.95)];
      organism.genome.coherenceStability = [randRange(0.5, 0.9), randRange(0.5, 0.9)];
      organism.phenotype = organism.expressGenome();
      this.ecosystem.addOrganism(organism);
    }
    
    // Enhance quantum field
    this.ecosystem.quantumField.coherence = 0.8;
    this.ecosystem.quantumField.entanglementDensity = 0.6;
    
    // Periodic quantum events
    const quantumInterval = setInterval(() => {
      if (Math.random() < 0.4) {
        this.ecosystem.quantumStorm();
      }
    }, 8000);
    
    // End quantum events after demo
    setTimeout(() => {
      clearInterval(quantumInterval);
    }, 120000);
  }
  
  createEnvironmentalGradient() {
    // Simulate spatial environmental variation
    // This would ideally create different zones with different conditions
    logEvent("🌈 Creating environmental gradient across habitat", LOG_TYPES.INFO);
    
    // Vary conditions over time to simulate different niches
    let gradientPhase = 0;
    const gradientInterval = setInterval(() => {
      gradientPhase += 0.1;
      
      // Create oscillating conditions
      this.ecosystem.environment.temperature = 0.5 + Math.sin(gradientPhase) * 0.3;
      this.ecosystem.environment.radiation = 0.2 + Math.cos(gradientPhase * 0.7) * 0.1;
      this.ecosystem.environment.foodDensity = 0.6 + Math.sin(gradientPhase * 0.3) * 0.2;
      
    }, 3000);
    
    // Stop gradient after some time
    setTimeout(() => {
      clearInterval(gradientInterval);
      logEvent("🌍 Environmental gradient stabilized", LOG_TYPES.INFO);
    }, 60000);
  }
  
  showScenarioInfo(scenario) {
    // Create info panel
    const infoPanel = document.createElement('div');
    infoPanel.className = 'scenario-info-panel';
    infoPanel.innerHTML = `
      <div class="scenario-info">
        <h3>📚 ${scenario.name}</h3>
        <p>${scenario.description}</p>
        <div class="scenario-timer">
          Duration: ${Math.floor(scenario.duration / 1000)}s
        </div>
        <button onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;
    
    document.body.appendChild(infoPanel);
    
    // Auto-remove after scenario
    setTimeout(() => {
      if (infoPanel.parentElement) {
        infoPanel.remove();
      }
    }, scenario.duration);
  }
  
  endScenario(scenario) {
    logEvent(`✅ Scenario "${scenario.name}" completed`, LOG_TYPES.INFO);
    this.updateStatus(`Scenario completed: ${scenario.name}`);
    
    // Show summary statistics
    const data = this.ecosystem.getResearchData();
    const summary = this.generateScenarioSummary(scenario, data);
    
    logEvent(`📊 Scenario summary: ${summary}`, LOG_TYPES.INFO);
  }
  
  generateScenarioSummary(scenario, data) {
    const currentPop = this.ecosystem.organisms.filter(org => org.alive).length;
    const totalSpecies = data.species.length;
    const avgFitness = data.populationHistory.length > 0 ? 
      data.populationHistory[data.populationHistory.length - 1].averageFitness : 0;
    
    return `Population: ${currentPop}, Species: ${totalSpecies}, Avg Fitness: ${avgFitness.toFixed(2)}`;
  }
  
  spawnResearchPopulation() {
    logEvent("🧪 Spawning research population", LOG_TYPES.INFO);
    
    // Clear existing population
    this.ecosystem.organisms = [];
    
    // Spawn new research subjects
    this.ecosystem.spawnInitialPopulation();
    this.addEducationalExamples();
    
    this.updateStatus("New research population established");
  }
  
  spawnViewport() {
    try {
      const childWindow = window.open(
        'child.html',
        `organism-${Date.now()}`,
        'width=800,height=600,scrollbars=no,resizable=yes'
      );
      
      if (childWindow) {
        this.childWindows.push(childWindow);
        logEvent("🪟 New research viewport spawned", LOG_TYPES.INFO);
        this.updateStatus("Research viewport spawned");
      } else {
        throw new Error("Popup blocked - enable popups for full functionality");
      }
    } catch (error) {
      logEvent(`❌ Viewport spawn failed: ${error.message}`, LOG_TYPES.ERROR);
      this.updateStatus(`Error: ${error.message}`);
    }
  }
  
  introduceNewSpecies() {
    const speciesNames = ['aquaticus', 'volans', 'giganteus', 'crystallinus', 'luminous'];
    const randomName = speciesNames[Math.floor(Math.random() * speciesNames.length)];
    
    const traits = {};
    // Random trait enhancement
    const allTraits = ['size', 'speed', 'neuralComplexity', 'radiationTolerance', 'temperatureTolerance'];
    const enhancedTrait = allTraits[Math.floor(Math.random() * allTraits.length)];
    traits[enhancedTrait] = randRange(0.8, 1.0);
    
    const newOrganism = this.ecosystem.introduceSpecies(randomName, traits);
    
    logEvent(`🌟 New species introduced: ${randomName} (enhanced ${enhancedTrait})`, LOG_TYPES.MUTATION);
    this.updateStatus(`New species "${randomName}" introduced`);
  }
  
  resetEcosystem() {
    if (confirm("Reset entire ecosystem? This will clear all research data.")) {
      logEvent("🔄 Ecosystem reset initiated", LOG_TYPES.WARNING);
      
      // Clear organisms
      this.ecosystem.organisms = [];
      
      // Reset environment
      this.ecosystem.environment = this.ecosystem.createInitialEnvironment();
      
      // Reset data
      this.ecosystem.populationHistory = [];
      this.ecosystem.geneticDiversity = [];
      this.ecosystem.environmentalHistory = [];
      this.ecosystem.evolutionaryEvents = [];
      
      this.updateStatus("Ecosystem reset complete");
    }
  }
  
  updateResearchMode() {
    if (this.researchMode) {
      logEvent("🔬 Research mode activated - enhanced data collection", LOG_TYPES.INFO);
    } else {
      logEvent("🎮 Casual mode activated - simplified interface", LOG_TYPES.INFO);
    }
  }
  
  togglePauseResume() {
    const button = document.getElementById('pause-resume');
    // This would need to be implemented in the ecosystem manager
    // For now, just update the button text
    if (button.textContent === 'Pause') {
      button.textContent = 'Resume';
      logEvent("⏸️ Simulation paused", LOG_TYPES.INFO);
    } else {
      button.textContent = 'Pause';
      logEvent("▶️ Simulation resumed", LOG_TYPES.INFO);
    }
  }
  
  updateQuickStats(data = null) {
    if (data) {
      document.getElementById('pop-count').textContent = `Pop: ${data.population.total}`;
      document.getElementById('species-count').textContent = `Species: ${data.species.length}`;
      
      if (data.population.byGeneration) {
        const maxGen = Math.max(...Object.keys(data.population.byGeneration).map(Number));
        document.getElementById('gen-count').textContent = `Gen: ${maxGen}`;
      }
    } else {
      // Fallback to ecosystem data
      const aliveCount = this.ecosystem.organisms.filter(org => org.alive).length;
      const maxGen = this.ecosystem.organisms.reduce((max, org) => Math.max(max, org.generation), 1);
      const speciesCount = this.ecosystem.species.size;
      
      document.getElementById('pop-count').textContent = `Pop: ${aliveCount}`;
      document.getElementById('gen-count').textContent = `Gen: ${maxGen}`;
      document.getElementById('species-count').textContent = `Species: ${speciesCount}`;
    }
  }
  
  updateStatus(message) {
    const statusEl = document.getElementById('status');
    if (statusEl) {
      statusEl.textContent = message;
    }
  }
  
  analyzeDeathData(deathData) {
    if (!this.researchMode) return;
    
    // Research analysis of death patterns
    if (deathData.cause === 'environmental stress') {
      logEvent(`🔬 Research note: Environmental stress death - stress level: ${deathData.finalPhenotype?.environmentalStress || 'unknown'}`, LOG_TYPES.INFO);
    }
    
    if (deathData.extremophileScore > 0.7) {
      logEvent(`🔬 Research note: High extremophile organism died - potential for study`, LOG_TYPES.INFO);
    }
  }
  
  analyzeReproduction(reproductionData) {
    if (!this.researchMode) return;
    
    const { parents, child } = reproductionData;
    
    // Analyze genetic recombination
    if (child.generation > 10) {
      logEvent(`🔬 Research note: Long-term evolution - Generation ${child.generation} reached`, LOG_TYPES.INFO);
    }
    
    // Check for novel trait combinations
    const parentFitness = (parents[0].calculateFitness() + parents[1].calculateFitness()) / 2;
    const childFitness = child.calculateFitness();
    
    if (childFitness > parentFitness * 1.2) {
      logEvent(`🔬 Research note: Hybrid vigor detected - child fitness 20% above parents`, LOG_TYPES.MUTATION);
    }
  }
  
  runWelcomeDemo() {
    logEvent("👋 Welcome to the Advanced Bio-Digital Laboratory!", LOG_TYPES.INFO);
    logEvent("🎓 Try the educational scenarios or create your own experiments", LOG_TYPES.INFO);
    logEvent("🔬 Research mode provides detailed scientific analysis", LOG_TYPES.INFO);
    logEvent("🌍 Adjust environmental conditions to see evolutionary responses", LOG_TYPES.INFO);
    
    // Auto-start a gentle demonstration
    setTimeout(() => {
      this.runEducationalScenario('natural-selection');
    }, 5000);
  }
  
  // Cleanup on page unload
  destroy() {
    if (this.ecosystem) {
      this.ecosystem.destroy();
    }
    
    this.childWindows.forEach(window => {
      if (!window.closed) {
        window.close();
      }
    });
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.bioLab = new AdvancedBioDigitalLab();
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (window.bioLab) {
      window.bioLab.destroy();
    }
  });
});

// Global functions for educational use
window.runScenario = (scenarioId) => {
  if (window.bioLab) {
    window.bioLab.runEducationalScenario(scenarioId);
  }
};

window.setEnvironment = (temp, rad, food) => {
  if (window.bioLab && window.bioLab.ecosystem) {
    window.bioLab.ecosystem.environment.temperature = temp;
    window.bioLab.ecosystem.environment.radiation = rad;
    window.bioLab.ecosystem.environment.foodDensity = food;
  }
};

// Add some helpful console commands for teachers/researchers
console.log("🧬 Advanced Bio-Digital Laboratory loaded!");
console.log("Available commands:");
console.log("- runScenario('natural-selection')");
console.log("- setEnvironment(0.8, 0.5, 0.3)");
console.log("- window.bioLab.ecosystem.exportData()");
console.log("- window.bioLab.ecosystem.introduceSpecies('custom', {size: 2.0})");