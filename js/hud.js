import { bus } from "./communication.js";

export class HUD {
  constructor(containerId = "hud") {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.id = containerId;
      this.container.className = "hud";
      document.body.appendChild(this.container);
    }

    this.populationEl = document.createElement("div");
    this.populationEl.className = "hud-population";
    this.container.appendChild(this.populationEl);

    this.eventsEl = document.createElement("ul");
    this.eventsEl.className = "hud-events";
    this.container.appendChild(this.eventsEl);

    this.organismCount = 0;
    this.updatePopulation();

    this.registerEvents();
  }

  registerEvents() {
    bus.on("organism-added", () => {
      this.organismCount++;
      this.updatePopulation();
    });

    bus.on("organism-died", () => {
      this.organismCount--;
      this.updatePopulation();
    });

    bus.on("organism-reproduced", (baby) => {
      this.logEvent(`✨ ${baby.name} was born`);
    });

    bus.on("organism-fed", (org) => {
      this.logEvent(`🍏 ${org.name} fed`);
    });

    bus.on("organism-drain", ({ from, to }) => {
      this.logEvent(`⚡ ${from.name} drained ${to.name}`);
    });

    bus.on("organism-died", (org) => {
      this.logEvent(`💀 ${org.name} died`);
    });
  }

  updatePopulation() {
    this.populationEl.textContent = `Population: ${this.organismCount}`;
  }

  logEvent(message) {
    const li = document.createElement("li");
    li.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    this.eventsEl.prepend(li);

    // Keep only last 10 logs
    while (this.eventsEl.children.length > 10) {
      this.eventsEl.removeChild(this.eventsEl.lastChild);
    }
  }

  // Alias for logEvent to match main.js usage
  log(message) {
    this.logEvent(message);
  }
}
