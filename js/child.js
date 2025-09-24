import { Organism, OrganismManager } from "./organism.js";
import { bus } from "./communication.js";
import { logEvent, LOG_TYPES } from "./logger.js";
import { shaderManager } from "./utils.js";  // <— glow effects

// Each child window gets its own mini-manager
const manager = new OrganismManager(1500);

// Randomly assign a role
const roles = ["Blood Cell", "Virus", "Stem Cell"];
const role = roles[Math.floor(Math.random() * roles.length)];

const organism = new Organism(role, null, manager, 200, 200);
manager.addOrganism(organism);

// Tell parent lab this node exists
bus.emit("child-organism-ready", { role, id: organism.name });
logEvent(`Child organism spawned as ${role}`, LOG_TYPES.INFO);

// React to lab broadcasts
bus.on("organism-mutation", (mutation) => {
  logEvent(`Child received mutation: ${mutation.type}`, LOG_TYPES.MUTATION);

  if (role === "Virus" && Math.random() > 0.5) {
    organism.feed(10); 
    shaderManager.addGlow(organism.x, organism.y, "rgba(255,0,150,0.6)", 50);
  } 
  else if (role === "Blood Cell") {
    organism.energy -= 5;
    shaderManager.addGlow(organism.x, organism.y, "rgba(200,0,0,0.4)", 40);
  } 
  else if (role === "Stem Cell") {
    organism.energy += 2; // stem cell is adaptive
    shaderManager.addGlow(organism.x, organism.y, "rgba(0,200,255,0.5)", 45);
  }
  // in child.js
const channel = new BroadcastChannel("bio-lab");

channel.postMessage({ type: "child-ready", role, id: organism.name });

channel.onmessage = (e) => {
  if (e.data.type === "mutation") {
    // Apply same reaction logic here
  }
};

});
