// js/data-visualization.js
import { bus } from "./communication.js";
import { logEvent, LOG_TYPES } from "./logger.js";

export class ScientificDashboard {
  constructor(containerId = "dashboard") {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.id = containerId;
      this.container.className = "scientific-dashboard";
      document.body.appendChild(this.container);
    }

    this.charts = {};
    this.data = { population: [], genetics: [], environment: [], species: [] };

    this.createDashboard();
    this.setupEventListeners();
  }

  createDashboard() {
    this.container.innerHTML = `
      <div class="dashboard-header">
        <h2>🧬 Bio-Digital Research Dashboard</h2>
        <div class="dashboard-controls">
          <button id="export-data" class="btn-primary">Export Data</button>
          <button id="toggle-realtime" class="btn-secondary">Real-time: ON</button>
          <select id="planet-selector">
            <option value="Earth-like">Earth-like</option>
            <option value="Mars Colony">Mars Colony</option>
            <option value="Europa Ocean">Europa Ocean</option>
            <option value="Titan Surface">Titan Surface</option>
            <option value="Exoplanet K2-18b">K2-18b</option>
            <option value="Proxima Centauri b">Proxima b</option>
          </select>
        </div>
      </div>

      <div class="dashboard-grid">
        <!-- Population Analytics -->
        <div class="panel population-panel">
          <h3>📊 Population Dynamics</h3>
          <canvas id="population-chart" width="400" height="200"></canvas>
          <div class="stats-grid">
            <div class="stat"><label>Current Population:</label> <span id="current-pop">0</span></div>
            <div class="stat"><label>Total Born:</label> <span id="total-born">0</span></div>
            <div class="stat"><label>Total Died:</label> <span id="total-died">0</span></div>
            <div class="stat"><label>Avg Fitness:</label> <span id="avg-fitness">0.00</span></div>
          </div>
        </div>

        <!-- Genetic Analysis -->
        <div class="panel genetics-panel">
          <h3>🧬 Genetic Analysis</h3>
          <canvas id="genetics-chart" width="400" height="200"></canvas>
          <div class="stats-grid">
            <div class="stat"><label>Genetic Diversity:</label> <span id="genetic-diversity">0.00</span></div>
            <div class="stat"><label>Heritability:</label> <span id="heritability">0.00</span></div>
            <div class="stat"><label>Selection Pressure:</label> <span id="selection-pressure">0.00</span></div>
            <div class="stat"><label>Species Count:</label> <span id="species-count">1</span></div>
          </div>
        </div>

        <!-- Environmental Monitoring -->
        <div class="panel environment-panel">
          <h3>🌍 Environmental Conditions</h3>
          <canvas id="environment-chart" width="400" height="200"></canvas>
          <div class="env-indicators">
            <div class="indicator">
              <label>Temperature:</label>
              <div class="progress-bar"><div id="temp-bar" class="progress-fill"></div></div>
              <span id="temp-value">0.5</span>
            </div>
            <div class="indicator">
              <label>Radiation:</label>
              <div class="progress-bar"><div id="rad-bar" class="progress-fill"></div></div>
              <span id="rad-value">0.1</span>
            </div>
            <div class="indicator">
              <label>Food Density:</label>
              <div class="progress-bar"><div id="food-bar" class="progress-fill"></div></div>
              <span id="food-value">0.6</span>
            </div>
            <div class="indicator">
              <label>Atmospheric O₂:</label>
              <div class="progress-bar"><div id="o2-bar" class="progress-fill"></div></div>
              <span id="o2-value">21%</span>
            </div>
          </div>
        </div>

        <!-- Evolutionary Timeline -->
        <div class="panel evolution-panel">
          <h3>🌟 Evolutionary Events</h3>
          <div id="evolution-timeline" class="timeline"></div>
        </div>

        <!-- Species Tree -->
        <div class="panel species-panel">
          <h3>🌳 Phylogenetic Tree</h3>
          <canvas id="species-tree" width="400" height="300"></canvas>
        </div>

        <!-- Quantum Physics -->
        <div class="panel quantum-panel">
          <h3>⚛️ Quantum Coherence Field</h3>
          <canvas id="quantum-field" width="400" height="200"></canvas>
          <div class="quantum-stats">
            <div class="stat"><label>Coherence Level:</label> <span id="coherence-level">0.50</span></div>
            <div class="stat"><label>Entanglements:</label> <span id="entanglement-count">0</span></div>
            <div class="stat"><label>Observer Effect:</label> <span id="observer-effect">0.00</span></div>
          </div>
        </div>

        <!-- Research Notes -->
        <div class="panel research-panel">
          <h3>📋 Research Observations</h3>
          <div id="research-notes" class="research-notes">
            <div class="note-input">
              <input type="text" id="note-input" placeholder="Add research observation...">
              <button id="add-note">Add</button>
            </div>
            <div id="notes-list" class="notes-list"></div>
          </div>
        </div>

        <!-- Advanced Analysis -->
        <div class="panel analysis-panel">
          <h3>🔬 Advanced Analysis</h3>
          <div class="analysis-tools">
            <button id="run-pca" class="analysis-btn">Principal Component Analysis</button>
            <button id="phylogenetic-analysis" class="analysis-btn">Phylogenetic Analysis</button>
            <button id="environmental-correlation" class="analysis-btn">Environmental Correlation</button>
            <button id="mutation-rate-analysis" class="analysis-btn">Mutation Rate Analysis</button>
          </div>
          <div id="analysis-results" class="analysis-results"></div>
        </div>
      </div>
    `;

    this.initializeCharts();
  }

  initializeCharts() {
    const chartsMap = {
      population: 'population-chart',
      genetics: 'genetics-chart',
      environment: 'environment-chart',
      quantum: 'quantum-field',
      species: 'species-tree',
    };

    for (const key in chartsMap) {
      const canvas = document.getElementById(chartsMap[key]);
      if (canvas) this.charts[key] = canvas.getContext('2d');
    }
  }

  setupEventListeners() {
    // Export
    document.getElementById('export-data').addEventListener('click', () => bus.emit('export-research-data'));

    // Real-time toggle
    let realTimeEnabled = true;
    const toggleBtn = document.getElementById('toggle-realtime');
    toggleBtn.addEventListener('click', () => {
      realTimeEnabled = !realTimeEnabled;
      toggleBtn.textContent = `Real-time: ${realTimeEnabled ? 'ON' : 'OFF'}`;
      toggleBtn.className = realTimeEnabled ? 'btn-secondary' : 'btn-danger';
    });

    // Planet selector
    document.getElementById('planet-selector').addEventListener('change', e => {
      bus.emit('change-planetary-conditions', e.target.value);
    });

    // Research notes
    const addNote = () => this.addResearchNote();
    document.getElementById('add-note').addEventListener('click', addNote);
    document.getElementById('note-input').addEventListener('keypress', e => {
      if (e.key === 'Enter') addNote();
    });

    // Advanced Analysis buttons
    document.getElementById('run-pca').addEventListener('click', () => this.runPCA());
    document.getElementById('phylogenetic-analysis').addEventListener('click', () => this.runPhylogeneticAnalysis());
    document.getElementById('environmental-correlation').addEventListener('click', () => this.runEnvironmentalCorrelation());
    document.getElementById('mutation-rate-analysis').addEventListener('click', () => this.runMutationRateAnalysis());

    // Scientific data updates
    bus.on('scientific-data', data => { if (realTimeEnabled) this.updateDashboard(data); });
    bus.on('evolutionary-event', event => this.addEvolutionaryEvent(event));
  }

  // ... (all update functions, chart draws, and analysis functions remain unchanged but must be wrapped properly)
}
