// js/organelles.js - Cell Organelle System for Educational Display

export const ORGANELLES = {
  NUCLEUS: {
    name: "Nucleus",
    emoji: "🔵",
    color: "#4f46e5",
    description: "Cell's control center - contains DNA and directs all activities",
    size: 0.4,
    position: "center",
    health: 100
  },

  MITOCHONDRIA: {
    name: "Mitochondria",
    emoji: "⚡",
    color: "#ef4444",
    description: "Power plant - produces energy (ATP) for the cell",
    size: 0.15,
    count: 3,
    position: "scattered",
    health: 100
  },

  RIBOSOME: {
    name: "Ribosomes",
    emoji: "•",
    color: "#8b5cf6",
    description: "Protein factories - build proteins the cell needs",
    size: 0.08,
    count: 8,
    position: "scattered",
    health: 100
  },

  ENDOPLASMIC_RETICULUM: {
    name: "Endoplasmic Reticulum",
    emoji: "〰️",
    color: "#06b6d4",
    description: "Transport network - moves materials around the cell",
    size: 0.12,
    count: 4,
    position: "around-nucleus",
    health: 100
  },

  GOLGI: {
    name: "Golgi Apparatus",
    emoji: "📦",
    color: "#f59e0b",
    description: "Packaging center - packages and ships proteins",
    size: 0.18,
    count: 2,
    position: "side",
    health: 100
  },

  LYSOSOME: {
    name: "Lysosomes",
    emoji: "🗑️",
    color: "#ec4899",
    description: "Cleanup crew - breaks down waste and old parts",
    size: 0.1,
    count: 3,
    position: "scattered",
    health: 100
  },

  CELL_MEMBRANE: {
    name: "Cell Membrane",
    emoji: "🛡️",
    color: "#10b981",
    description: "Protective barrier - controls what enters and exits",
    size: 1,
    position: "edge",
    health: 100,
    isBarrier: true
  }
};

// Organelle positions generator
export function generateOrganellePositions(cellX, cellY, cellRadius, organelleConfig) {
  const positions = [];

  switch (organelleConfig.position) {
    case "center":
      positions.push({ x: cellX, y: cellY, angle: 0 });
      break;

    case "scattered":
      for (let i = 0; i < organelleConfig.count; i++) {
        const angle = (Math.PI * 2 * i) / organelleConfig.count + Math.random() * 0.5;
        const distance = cellRadius * (0.3 + Math.random() * 0.4);
        positions.push({
          x: cellX + Math.cos(angle) * distance,
          y: cellY + Math.sin(angle) * distance,
          angle
        });
      }
      break;

    case "around-nucleus":
      for (let i = 0; i < organelleConfig.count; i++) {
        const angle = (Math.PI * 2 * i) / organelleConfig.count;
        const distance = cellRadius * 0.25;
        positions.push({
          x: cellX + Math.cos(angle) * distance,
          y: cellY + Math.sin(angle) * distance,
          angle
        });
      }
      break;

    case "side":
      for (let i = 0; i < organelleConfig.count; i++) {
        const angle = Math.PI / 4 + (i * Math.PI);
        const distance = cellRadius * 0.5;
        positions.push({
          x: cellX + Math.cos(angle) * distance,
          y: cellY + Math.sin(angle) * distance,
          angle
        });
      }
      break;

    case "edge":
      // Cell membrane is the cell boundary itself
      positions.push({ x: cellX, y: cellY, angle: 0 });
      break;
  }

  return positions;
}

// Virus attack effects on organelles
export const VIRUS_EFFECTS = {
  NUCLEUS: {
    damage: 30,
    effect: "Virus hijacks DNA to reproduce!",
    visual: "nucleus-hijacked"
  },

  RIBOSOME: {
    damage: 20,
    effect: "Virus uses ribosomes to make viral proteins!",
    visual: "ribosome-corrupted"
  },

  MITOCHONDRIA: {
    damage: 15,
    effect: "Cell loses energy as mitochondria fail!",
    visual: "mitochondria-damaged"
  },

  CELL_MEMBRANE: {
    damage: 10,
    effect: "Membrane weakens - cell becomes vulnerable!",
    visual: "membrane-degraded"
  }
};

// White blood cell attack patterns
export const IMMUNE_ACTIONS = {
  PHAGOCYTOSIS: {
    name: "Phagocytosis",
    description: "White blood cell engulfs and destroys the pathogen",
    duration: 2000,
    effectiveness: 100
  },

  ANTIBODY_PRODUCTION: {
    name: "Antibody Production",
    description: "Produces antibodies that target specific pathogens",
    duration: 3000,
    effectiveness: 80
  },

  CYTOKINE_RELEASE: {
    name: "Cytokine Release",
    description: "Signals other immune cells to join the fight",
    duration: 1500,
    effectiveness: 60
  }
};
