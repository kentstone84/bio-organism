import { logEvent, distance, clamp } from "./utils.js";
import { bus } from "./communication.js";
import { shaderManager } from "./shaders.js";
import { CELL_TYPES, EDUCATIONAL_FACTS } from "./cell-types.js";

let organismCounter = 0;

export class Organism {
  constructor(cellType, manager, x = 100, y = 100) {
    this.id = `cell-${++organismCounter}`;
    this.cellType = cellType;
    this.config = CELL_TYPES[cellType];
    this.name = this.config.name;
    this.manager = manager;

    // Create DOM element
    this.element = document.createElement("div");
    this.element.id = this.id;
    this.element.className = "organism";
    this.element.setAttribute("draggable", "true");
    this.element.innerHTML = `
      <div class="cell-emoji">${this.config.emoji}</div>
      <div class="cell-label">${this.config.name}</div>
    `;

    const playground = document.querySelector(".playground");
    if (playground) {
      playground.appendChild(this.element);
    }

    // Properties
    this.energy = this.config.energy;
    this.size = this.config.size;
    this.alive = true;
    this.x = x;
    this.y = y;
    this.infected = false;
    this.vaccinated = this.config.vaccinated || false;

    this.updatePosition();
    this.updateView();
    this.setupDragAndDrop();
    this.setupTooltip();

    logEvent(`${this.config.emoji} ${this.name} created.`);
    bus.emit("organism-created", this);
  }

  setupTooltip() {
    this.element.title = this.config.description;

    this.element.addEventListener("mouseenter", () => {
      bus.emit("show-info", {
        name: this.name,
        description: this.config.description,
        energy: this.energy,
        status: this.getStatus()
      });
    });
  }

  getStatus() {
    if (!this.alive) return "Dead";
    if (this.infected) return "Infected";
    if (this.vaccinated) return "Vaccinated";
    if (this.config.isVirus) return "Pathogen";
    if (this.config.isImmune) return "Immune";
    return "Healthy";
  }

  setupDragAndDrop() {
    // Start dragging
    this.element.addEventListener("dragstart", (e) => {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", JSON.stringify({
        id: this.id,
        cellType: this.cellType,
        x: this.x,
        y: this.y,
        windowId: window.name || "main"
      }));

      this.element.style.opacity = "0.5";

      // Broadcast to other windows
      if (window.bioChannel) {
        window.bioChannel.postMessage({
          type: "drag-start",
          data: {
            id: this.id,
            cellType: this.cellType,
            name: this.name,
            emoji: this.config.emoji
          }
        });
      }

      logEvent(`🎯 Dragging ${this.name}`);
    });

    this.element.addEventListener("dragend", (e) => {
      this.element.style.opacity = "1";

      if (window.bioChannel) {
        window.bioChannel.postMessage({
          type: "drag-end",
          data: { id: this.id }
        });
      }
    });

    // Allow clicking for interaction
    this.element.addEventListener("click", (e) => {
      if (!e.defaultPrevented) {
        this.interact();
      }
    });
  }

  interact() {
    if (!this.alive) return;

    if (this.config.isVirus) {
      logEvent(`${EDUCATIONAL_FACTS.VIRUS_INFECTION}`);
      shaderManager.addGlow(this.x, this.y, "rgba(255,0,255,0.7)", 60);
    } else if (this.cellType === "WHITE_BLOOD_CELL") {
      logEvent(`${EDUCATIONAL_FACTS.WHITE_CELL_ATTACK}`);
      this.produceAntibody();
    } else {
      this.feed(20);
    }
  }

  produceAntibody() {
    if (this.energy < 40) return;

    this.energy -= 30;
    const antibody = new Organism(
      "ANTIBODY",
      this.manager,
      this.x + Math.random() * 60 - 30,
      this.y + Math.random() * 60 - 30
    );
    this.manager.addOrganism(antibody);

    logEvent(`${EDUCATIONAL_FACTS.ANTIBODY_DEFENSE}`);
    shaderManager.addGlow(this.x, this.y, "rgba(0,255,255,0.6)", 50);
  }

  updatePosition() {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }

  feed(amount) {
    if (!this.alive) return;
    this.energy += amount;
    this.size += 0.02;
    this.updateView();

    logEvent(`${this.name} gained energy (+${amount})`);
    bus.emit("organism-fed", this);
    shaderManager.addGlow(this.x, this.y, "rgba(0,255,100,0.5)", 40);
  }

  decay() {
    if (!this.alive) return;

    // Energy drain
    let energyLoss = 1;
    if (this.infected) energyLoss = 3;
    if (this.config.isVirus) energyLoss = 0.5; // Viruses drain less

    this.energy -= energyLoss;

    if (this.energy <= 0) {
      this.die();
    } else {
      this.move();
      this.checkInteractions();

      // Special behaviors
      if (this.infected && Math.random() < 0.1) {
        this.produceVirus();
      }

      if (this.config.reproducesFast && this.energy >= 100 && Math.random() < 0.2) {
        this.reproduce();
      }

      this.updateView();
    }
  }

  move() {
    const speed = this.config.speed;
    const dx = (Math.random() * 20 - 10) * speed;
    const dy = (Math.random() * 20 - 10) * speed;

    const maxX = window.innerWidth - this.element.offsetWidth - 20;
    const maxY = window.innerHeight - this.element.offsetHeight - 20;
    this.x = Math.max(20, Math.min(maxX, this.x + dx));
    this.y = Math.max(20, Math.min(maxY, this.y + dy));

    this.updatePosition();
  }

  checkInteractions() {
    this.manager.organisms.forEach(other => {
      if (other !== this && other.alive) {
        const d = distance(this.x, this.y, other.x, other.y);

        if (d < 70) {
          // Virus infects healthy cells
          if (this.config.isVirus && other.config.canBeInfected && !other.vaccinated) {
            this.infectCell(other);
          }

          // White blood cells attack viruses
          if (this.config.attacksViruses && other.config.isVirus) {
            this.attackVirus(other);
          }

          // Antibodies neutralize viruses
          if (this.config.neutralizesViruses && other.config.isVirus) {
            this.neutralizeVirus(other);
          }
        }
      }
    });
  }

  infectCell(cell) {
    if (cell.infected || cell.vaccinated) return;

    cell.becomeInfected();
    logEvent(`${EDUCATIONAL_FACTS.VIRUS_INFECTION}`);
    shaderManager.addGlow(cell.x, cell.y, "rgba(255,0,255,0.8)", 70);
  }

  becomeInfected() {
    if (this.vaccinated) {
      logEvent(`${EDUCATIONAL_FACTS.VACCINE_PROTECTION}`);
      shaderManager.addGlow(this.x, this.y, "rgba(0,150,255,0.6)", 50);
      return;
    }

    this.infected = true;
    this.cellType = "INFECTED_CELL";
    this.config = CELL_TYPES.INFECTED_CELL;

    // Update visual
    const emojiDiv = this.element.querySelector(".cell-emoji");
    const labelDiv = this.element.querySelector(".cell-label");
    if (emojiDiv) emojiDiv.textContent = this.config.emoji;
    if (labelDiv) labelDiv.textContent = this.config.name;

    this.updateView();
    bus.emit("cell-infected", this);
  }

  produceVirus() {
    if (!this.infected) return;
    if (this.energy < 20) return;

    this.energy -= 15;
    const virus = new Organism(
      "VIRUS",
      this.manager,
      this.x + Math.random() * 50 - 25,
      this.y + Math.random() * 50 - 25
    );
    this.manager.addOrganism(virus);

    logEvent(`${this.config.emoji} Infected cell produced virus!`);
    shaderManager.addGlow(this.x, this.y, "rgba(255,0,255,0.6)", 50);
  }

  attackVirus(virus) {
    virus.energy -= 10;
    this.energy -= 5;

    logEvent(`${EDUCATIONAL_FACTS.WHITE_CELL_ATTACK}`);
    shaderManager.addGlow(virus.x, virus.y, "rgba(255,255,255,0.7)", 50);

    if (virus.energy <= 0) {
      virus.die();
    }
  }

  neutralizeVirus(virus) {
    virus.energy -= 20;
    this.energy -= 10;

    logEvent(`${EDUCATIONAL_FACTS.ANTIBODY_DEFENSE}`);
    shaderManager.addGlow(virus.x, virus.y, "rgba(0,255,255,0.8)", 60);

    if (virus.energy <= 0) {
      virus.die();
    }

    // Antibody may also die
    if (this.energy <= 0) {
      this.die();
    }
  }

  vaccinate() {
    if (this.config.canBeInfected) {
      this.vaccinated = true;
      this.cellType = "VACCINATED_CELL";
      this.config = CELL_TYPES.VACCINATED_CELL;

      const emojiDiv = this.element.querySelector(".cell-emoji");
      const labelDiv = this.element.querySelector(".cell-label");
      if (emojiDiv) emojiDiv.textContent = this.config.emoji;
      if (labelDiv) labelDiv.textContent = this.config.name;

      logEvent(`${EDUCATIONAL_FACTS.VACCINE_PROTECTION}`);
      shaderManager.addGlow(this.x, this.y, "rgba(0,100,255,0.8)", 80);
      this.updateView();
      bus.emit("cell-vaccinated", this);
    }
  }

  reproduce() {
    if (this.energy < 70) return;

    this.energy -= 50;
    const babyX = this.x + Math.random() * 80 - 40;
    const babyY = this.y + Math.random() * 80 - 40;
    const baby = new Organism(this.cellType, this.manager, babyX, babyY);
    this.manager.addOrganism(baby);

    logEvent(`${this.config.emoji} ${this.name} reproduced!`);
    bus.emit("organism-reproduced", baby);
    shaderManager.addGlow(this.x, this.y, "rgba(0,200,255,0.6)", 60);
  }

  updateView() {
    this.element.style.transform = `scale(${this.size})`;
    this.element.style.opacity = clamp(this.energy / 150, 0.3, 1);
    this.element.style.borderColor = this.config.color;
    this.element.style.boxShadow = `0 0 20px ${this.config.color}`;
  }

  die() {
    this.alive = false;
    this.element.style.opacity = "0.2";
    this.element.style.filter = "grayscale(100%)";
    this.element.setAttribute("draggable", "false");

    logEvent(`☠️ ${this.name} has died.`);
    bus.emit("organism-died", this);
    shaderManager.addGlow(this.x, this.y, "rgba(150,150,150,0.5)", 70);
  }

  remove() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}

export class OrganismManager {
  constructor(tickRate = 1500) {
    this.organisms = [];
    this.tickRate = tickRate;

    setInterval(() => this.tick(), this.tickRate);
    this.setupDropZone();
  }

  setupDropZone() {
    const playground = document.querySelector(".playground");
    if (!playground) return;

    playground.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    });

    playground.addEventListener("drop", (e) => {
      e.preventDefault();

      const data = JSON.parse(e.dataTransfer.getData("text/plain"));
      const rect = playground.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Check if dropped from another window
      const isFromAnotherWindow = data.windowId && data.windowId !== (window.name || "main");

      if (isFromAnotherWindow) {
        // Create new organism from dropped data
        const newOrganism = new Organism(data.cellType, this, x, y);
        this.addOrganism(newOrganism);
        logEvent(`📥 ${newOrganism.name} arrived from another window!`);
        shaderManager.addGlow(x, y, "rgba(255,255,0,0.8)", 100);

        // Notify other window to remove the organism
        if (window.bioChannel) {
          window.bioChannel.postMessage({
            type: "organism-transferred",
            data: { id: data.id, from: data.windowId, to: window.name || "main" }
          });
        }
      } else {
        // Move existing organism
        const organism = this.organisms.find(o => o.id === data.id);
        if (organism) {
          organism.x = x;
          organism.y = y;
          organism.updatePosition();
          logEvent(`Moved ${organism.name}`);
        }
      }
    });
  }

  addOrganism(organism) {
    this.organisms.push(organism);
    bus.emit("organism-added", organism);
  }

  removeOrganism(id) {
    const index = this.organisms.findIndex(o => o.id === id);
    if (index !== -1) {
      this.organisms[index].remove();
      this.organisms.splice(index, 1);
    }
  }

  tick() {
    this.organisms.forEach(org => org.decay());
  }

  getStats() {
    const alive = this.organisms.filter(o => o.alive).length;
    const infected = this.organisms.filter(o => o.infected).length;
    const viruses = this.organisms.filter(o => o.config.isVirus && o.alive).length;
    const vaccinated = this.organisms.filter(o => o.vaccinated).length;

    return { alive, infected, viruses, vaccinated, total: this.organisms.length };
  }
}
