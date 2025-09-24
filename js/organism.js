import { logEvent, distance, clamp } from "./utils.js";
import { bus } from "./communication.js";
import { shaderManager } from "./shaders.js"; // export a singleton in shaders.js

let organismCounter = 0;

export class Organism {
  constructor(name, elementId, manager, x = 100, y = 100) {
    this.name = name || `Org-${++organismCounter}`;
    this.manager = manager;

    // Find or create DOM element
    this.element = elementId ? document.getElementById(elementId) : null;
    if (!this.element) {
      this.element = document.createElement("div");
      this.element.id = `org-${organismCounter}`;
      this.element.className = "organism";
      document.querySelector(".playground").appendChild(this.element);
    }

    this.energy = 100;
    this.size = 1;
    this.alive = true;
    this.x = x;
    this.y = y;

    this.updatePosition();

    // Click to feed
    this.element.addEventListener("click", () => this.feed(20));

    logEvent(`Organism "${this.name}" created.`);
    bus.emit("organism-created", this);
  }

  updatePosition() {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }

  feed(amount) {
    if (!this.alive) return;
    this.energy += amount;
    this.size += 0.05;
    this.updateView();

    logEvent(`${this.name} fed (+${amount}). Energy: ${this.energy}`);
    bus.emit("organism-fed", this);

    shaderManager.addGlow(this.x, this.y, "rgba(0,255,100,0.5)", 50);
  }

  decay() {
    if (!this.alive) return;

    this.energy -= 2;
    if (this.energy <= 0) {
      this.die();
    } else {
      this.move();
      this.checkInteractions();
      if (this.energy >= 150) {
        this.reproduce();
      }
      this.updateView();
    }
  }

  move() {
    const dx = Math.random() * 20 - 10;
    const dy = Math.random() * 20 - 10;

    // Boundaries with padding
    const maxX = window.innerWidth - this.element.offsetWidth;
    const maxY = window.innerHeight - this.element.offsetHeight;
    this.x = Math.max(20, Math.min(maxX, this.x + dx));
    this.y = Math.max(20, Math.min(maxY, this.y + dy));

    this.updatePosition();
  }

  checkInteractions() {
    this.manager.organisms.forEach(other => {
      if (other !== this && other.alive) {
        const d = distance(this.x, this.y, other.x, other.y);

        if (d < 60) {
          if (this.energy > other.energy) {
            this.energy += 5;
            other.energy -= 5;

            logEvent(`${this.name} drained ${other.name}`);
            bus.emit("organism-drain", { from: this, to: other });
            shaderManager.addGlow(this.x, this.y, "rgba(255,0,0,0.5)", 40);

            if (other.energy <= 0) other.die();
          }
        }
      }
    });
  }

  reproduce() {
    this.energy -= 70;
    const babyX = this.x + Math.random() * 50 - 25;
    const babyY = this.y + Math.random() * 50 - 25;
    const baby = new Organism(null, null, this.manager, babyX, babyY);
    this.manager.addOrganism(baby);

    logEvent(`${this.name} reproduced → ${baby.name}`);
    bus.emit("organism-reproduced", baby);
    shaderManager.addGlow(this.x, this.y, "rgba(0,150,255,0.6)", 60);
  }

  updateView() {
    this.element.style.transform = `scale(${this.size})`;
    this.element.style.opacity = clamp(this.energy / 200, 0, 1);
  }

  die() {
    this.alive = false;
    this.element.style.opacity = "0.2";
    this.element.style.filter = "grayscale(100%)";
    logEvent(`${this.name} has died.`);
    bus.emit("organism-died", this);
    shaderManager.addGlow(this.x, this.y, "rgba(200,200,200,0.5)", 80);
  }
}

export class OrganismManager {
  constructor(tickRate = 2000) {
    this.organisms = [];
    this.tickRate = tickRate;

    setInterval(() => this.tick(), this.tickRate);
  }

  addOrganism(organism) {
    this.organisms.push(organism);
    logEvent(`${organism.name} added to simulation.`);
    bus.emit("organism-added", organism);
  }

  tick() {
    this.organisms.forEach(org => org.decay());
  }
}
