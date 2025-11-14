// js/main.js - Educational Biology Lab Main Window
import { Organism, OrganismManager } from "./organism.js";
import { shaderManager } from "./utils.js";
import { bus } from "./communication.js";
import { HUD } from "./hud.js";
import { CELL_TYPES, EDUCATIONAL_FACTS } from "./cell-types.js";

// Setup window identification
window.name = window.name || "main";

// Setup BroadcastChannel for cross-window communication
window.bioChannel = new BroadcastChannel("bio-lab");

const manager = new OrganismManager(1500);
const hud = new HUD();

// Initialize playground
function initializePlayground() {
  const canvasContainer = document.getElementById("canvas-container");
  if (canvasContainer) {
    const playground = document.createElement("div");
    playground.className = "playground";
    canvasContainer.appendChild(playground);
  }
}

initializePlayground();

// Seed initial cells
const redCell1 = new Organism("RED_BLOOD_CELL", manager, 150, 150);
manager.addOrganism(redCell1);

const redCell2 = new Organism("RED_BLOOD_CELL", manager, 250, 200);
manager.addOrganism(redCell2);

const whiteCell = new Organism("WHITE_BLOOD_CELL", manager, 200, 300);
manager.addOrganism(whiteCell);

const healthyCell1 = new Organism("HEALTHY_CELL", manager, 350, 250);
manager.addOrganism(healthyCell1);

const healthyCell2 = new Organism("HEALTHY_CELL", manager, 450, 300);
manager.addOrganism(healthyCell2);

// Update buttons to spawn different cell types
const controls = document.getElementById("controls");
if (controls) {
  controls.innerHTML = `
    <h2>🧬 Cell Lab Controls</h2>
    <div class="button-grid">
      <button id="spawn-virus-btn" class="spawn-btn virus-btn">🦠 Spawn Virus</button>
      <button id="spawn-bacteria-btn" class="spawn-btn bacteria-btn">🧫 Spawn Bacteria</button>
      <button id="spawn-white-cell-btn" class="spawn-btn white-btn">⚪ Spawn White Blood Cell</button>
      <button id="spawn-healthy-btn" class="spawn-btn healthy-btn">💚 Spawn Healthy Cell</button>
      <button id="vaccinate-btn" class="spawn-btn vaccine-btn">💉 Vaccinate All Cells</button>
      <button id="spawn-window-btn" class="spawn-btn window-btn">🪟 Open New Window</button>
    </div>
    <div id="status">System ready - Drag cells between windows!</div>
  `;

  // Virus button
  document.getElementById("spawn-virus-btn").addEventListener("click", () => {
    const x = Math.random() * (window.innerWidth - 200) + 100;
    const y = Math.random() * (window.innerHeight - 200) + 100;
    const virus = new Organism("VIRUS", manager, x, y);
    manager.addOrganism(virus);
    hud.log(`${EDUCATIONAL_FACTS.VIRUS_INFECTION}`);
  });

  // Bacteria button
  document.getElementById("spawn-bacteria-btn").addEventListener("click", () => {
    const x = Math.random() * (window.innerWidth - 200) + 100;
    const y = Math.random() * (window.innerHeight - 200) + 100;
    const bacteria = new Organism("BACTERIA", manager, x, y);
    manager.addOrganism(bacteria);
    hud.log("🧫 Bacteria spawned - it will multiply quickly!");
  });

  // White blood cell button
  document.getElementById("spawn-white-cell-btn").addEventListener("click", () => {
    const x = Math.random() * (window.innerWidth - 200) + 100;
    const y = Math.random() * (window.innerHeight - 200) + 100;
    const whiteCell = new Organism("WHITE_BLOOD_CELL", manager, x, y);
    manager.addOrganism(whiteCell);
    hud.log(`${EDUCATIONAL_FACTS.WHITE_CELL_ATTACK}`);
  });

  // Healthy cell button
  document.getElementById("spawn-healthy-btn").addEventListener("click", () => {
    const x = Math.random() * (window.innerWidth - 200) + 100;
    const y = Math.random() * (window.innerHeight - 200) + 100;
    const cell = new Organism("HEALTHY_CELL", manager, x, y);
    manager.addOrganism(cell);
    hud.log("💚 Healthy cell created!");
  });

  // Vaccinate button
  document.getElementById("vaccinate-btn").addEventListener("click", () => {
    let vaccinatedCount = 0;
    manager.organisms.forEach(org => {
      if (org.config.canBeInfected && !org.vaccinated) {
        org.vaccinate();
        vaccinatedCount++;
      }
    });
    hud.log(`${EDUCATIONAL_FACTS.VACCINE_PROTECTION} (${vaccinatedCount} cells protected)`);
  });

  // Spawn new window button
  document.getElementById("spawn-window-btn").addEventListener("click", () => {
    const childWindow = window.open(
      "child.html",
      `child-${Date.now()}`,
      "width=800,height=600"
    );
    hud.log("🪟 New window opened! Drag cells between windows!");
  });
}

// Update stats display
function updateStats() {
  const stats = manager.getStats();
  const status = document.getElementById("status");
  if (status) {
    status.innerHTML = `
      <strong>📊 Lab Statistics:</strong><br>
      Alive: ${stats.alive} | Infected: ${stats.infected} |
      Viruses: ${stats.viruses} | Vaccinated: ${stats.vaccinated}
    `;
  }
}

setInterval(updateStats, 1000);

// Event-driven visual effects
bus.on("organism-fed", org => {
  shaderManager.addGlow(org.x, org.y, "rgba(0,255,200,0.5)", 40);
  hud.log(`${org.config.emoji} ${org.name} absorbed nutrients ✨`);
});

bus.on("organism-reproduced", data => {
  shaderManager.addGlow(data.x, data.y, "rgba(200,100,255,0.6)", 60);
  hud.log(`${data.config.emoji} New organism born: ${data.name}`);
});

bus.on("organism-died", org => {
  shaderManager.addGlow(org.x, org.y, "rgba(255,50,50,0.6)", 60);
  hud.log(`☠️ ${org.name} has died`);
});

bus.on("cell-infected", org => {
  hud.log(`${EDUCATIONAL_FACTS.VIRUS_INFECTION} ${org.name} is now infected!`);
});

bus.on("cell-vaccinated", org => {
  hud.log(`${EDUCATIONAL_FACTS.VACCINE_PROTECTION} ${org.name} is now protected!`);
});

bus.on("show-info", info => {
  const logPanel = document.getElementById("bio-log");
  if (logPanel) {
    logPanel.innerHTML = `
      <h2>📋 Cell Information</h2>
      <div class="info-panel">
        <p><strong>Name:</strong> ${info.name}</p>
        <p><strong>Description:</strong> ${info.description}</p>
        <p><strong>Energy:</strong> ${Math.round(info.energy)}</p>
        <p><strong>Status:</strong> ${info.status}</p>
      </div>
      <h3>💡 Educational Facts:</h3>
      <ul id="log-entries"></ul>
    `;
  }
});

// Cross-window communication handlers
window.bioChannel.onmessage = (event) => {
  const { type, data } = event.data;

  switch (type) {
    case "organism-transferred":
      // Remove organism when it's been transferred to another window
      if (data.from === window.name) {
        manager.removeOrganism(data.id);
        hud.log(`📤 ${data.id} transferred to another window`);
      }
      break;

    case "child-ready":
      hud.log(`🪟 ${data.role} window is ready!`);
      break;

    case "drag-start":
      hud.log(`🎯 Dragging ${data.emoji} ${data.name} - drop in any window!`);
      break;
  }
};

// Display educational information
hud.log("🧬 Welcome to the Bio-Digital Lab!");
hud.log("🎯 Drag and drop cells between windows!");
hud.log("🦠 Viruses infect healthy cells on contact");
hud.log("⚪ White blood cells defend against viruses");
hud.log("💉 Vaccinate cells to protect them!");
