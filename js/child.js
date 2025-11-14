// js/child.js - Child Window for Biology Lab
import { Organism, OrganismManager } from "./organism.js";
import { bus } from "./communication.js";
import { logEvent } from "./logger.js";
import { shaderManager } from "./utils.js";
import { CELL_TYPES } from "./cell-types.js";

// Setup unique window identification
window.name = window.name || `child-${Date.now()}`;

// Setup BroadcastChannel for cross-window communication
window.bioChannel = new BroadcastChannel("bio-lab");

// Each child window gets its own mini-manager
const manager = new OrganismManager(1500);

// Initialize playground
function initializePlayground() {
  let playground = document.querySelector(".playground");
  if (!playground) {
    playground = document.createElement("div");
    playground.className = "playground";
    document.body.appendChild(playground);
  }

  // Add title bar
  const titleBar = document.createElement("div");
  titleBar.className = "child-title-bar";
  titleBar.innerHTML = `
    <h2>🪟 Bio Lab Window</h2>
    <div class="child-controls">
      <button id="spawn-virus-child">🦠 Virus</button>
      <button id="spawn-healthy-child">💚 Healthy Cell</button>
      <button id="spawn-white-child">⚪ White Blood Cell</button>
      <button id="vaccinate-child">💉 Vaccinate All</button>
    </div>
    <div id="child-status">Drag cells here from other windows!</div>
  `;
  document.body.insertBefore(titleBar, playground);

  // Setup buttons
  document.getElementById("spawn-virus-child").addEventListener("click", () => {
    const x = Math.random() * (window.innerWidth - 200) + 100;
    const y = Math.random() * (window.innerHeight - 200) + 100;
    const virus = new Organism("VIRUS", manager, x, y);
    manager.addOrganism(virus);
  });

  document.getElementById("spawn-healthy-child").addEventListener("click", () => {
    const x = Math.random() * (window.innerWidth - 200) + 100;
    const y = Math.random() * (window.innerHeight - 200) + 100;
    const cell = new Organism("HEALTHY_CELL", manager, x, y);
    manager.addOrganism(cell);
  });

  document.getElementById("spawn-white-child").addEventListener("click", () => {
    const x = Math.random() * (window.innerWidth - 200) + 100;
    const y = Math.random() * (window.innerHeight - 200) + 100;
    const whiteCell = new Organism("WHITE_BLOOD_CELL", manager, x, y);
    manager.addOrganism(whiteCell);
  });

  document.getElementById("vaccinate-child").addEventListener("click", () => {
    manager.organisms.forEach(org => {
      if (org.config.canBeInfected && !org.vaccinated) {
        org.vaccinate();
      }
    });
  });
}

initializePlayground();

// Create initial cell based on random type
const cellTypes = ["RED_BLOOD_CELL", "HEALTHY_CELL", "WHITE_BLOOD_CELL"];
const randomType = cellTypes[Math.floor(Math.random() * cellTypes.length)];
const initialCell = new Organism(randomType, manager, 300, 250);
manager.addOrganism(initialCell);

// Add a couple more cells
const cell2 = new Organism("HEALTHY_CELL", manager, 200, 200);
manager.addOrganism(cell2);

const cell3 = new Organism("RED_BLOOD_CELL", manager, 400, 300);
manager.addOrganism(cell3);

// Update stats
function updateStats() {
  const stats = manager.getStats();
  const status = document.getElementById("child-status");
  if (status) {
    status.innerHTML = `
      Alive: ${stats.alive} | Infected: ${stats.infected} |
      Viruses: ${stats.viruses} | Vaccinated: ${stats.vaccinated}
    `;
  }
}

setInterval(updateStats, 1000);

// Tell parent this window is ready
window.bioChannel.postMessage({
  type: "child-ready",
  data: {
    role: randomType,
    id: window.name
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
        logEvent(`📤 Organism transferred out`);
      }
      break;

    case "drag-start":
      // Visual feedback when dragging from another window
      const status = document.getElementById("child-status");
      if (status) {
        status.style.background = "rgba(255,255,0,0.2)";
        status.textContent = `Drop ${data.emoji} ${data.name} here!`;
        setTimeout(() => {
          status.style.background = "";
          updateStats();
        }, 2000);
      }
      break;
  }
};

// Log lifecycle events
bus.on("organism-added", org => {
  logEvent(`${org.config.emoji} ${org.name} added to window`);
});

bus.on("cell-infected", org => {
  logEvent(`⚠️ ${org.name} has been infected!`);
  shaderManager.addGlow(org.x, org.y, "rgba(255,0,255,0.8)", 80);
});

bus.on("organism-died", org => {
  logEvent(`☠️ ${org.name} died`);
});

logEvent(`Child window ${window.name} ready with ${randomType}`);
