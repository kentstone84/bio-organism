// js/main.js
import { Organism, OrganismManager } from "./organism.js";
import { shaderManager } from "./utils.js";
import { bus } from "./communication.js";
import { HUD } from "./hud.js";

const manager = new OrganismManager(2000);
const hud = new HUD();

// Seed organisms
const blob = new Organism("Blob", "organism-1", manager, 100, 100);
manager.addOrganism(blob);

const spark = new Organism("Spark", "organism-2", manager, 250, 150);
manager.addOrganism(spark);

// Event-driven glow effects
bus.on("organism-fed", org => {
  shaderManager.addGlow(org.x, org.y, "rgba(0,255,200,0.5)");
  hud.log(`${org.name} absorbed nutrients ✨`);
});

bus.on("organism-reproduced", data => {
  shaderManager.addGlow(data.x, data.y, "rgba(200,100,255,0.6)");
  hud.log(`New organism born: ${data.name}`);
});

bus.on("organism-died", org => {
  shaderManager.addGlow(org.x, org.y, "rgba(255,50,50,0.6)", 60);
  hud.log(`☠️ ${org.name} has perished`);
});
