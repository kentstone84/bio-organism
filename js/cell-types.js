// js/cell-types.js - Educational Cell Type Definitions

export const CELL_TYPES = {
  RED_BLOOD_CELL: {
    name: "Red Blood Cell",
    emoji: "🔴",
    color: "#ff4444",
    description: "Carries oxygen throughout the body",
    speed: 1.2,
    size: 1,
    energy: 80,
    canBeInfected: false,
    isVirus: false,
    isImmune: false
  },

  WHITE_BLOOD_CELL: {
    name: "White Blood Cell",
    emoji: "⚪",
    color: "#ffffff",
    description: "Defends the body against infections",
    speed: 1.5,
    size: 1.3,
    energy: 120,
    canBeInfected: false,
    isVirus: false,
    isImmune: true,
    attacksViruses: true
  },

  HEALTHY_CELL: {
    name: "Healthy Cell",
    emoji: "💚",
    color: "#44ff88",
    description: "A normal body cell that can be infected",
    speed: 0.5,
    size: 1.4,
    energy: 100,
    canBeInfected: true,
    isVirus: false,
    isImmune: false
  },

  INFECTED_CELL: {
    name: "Infected Cell",
    emoji: "🤢",
    color: "#88ff44",
    description: "A cell infected by a virus - will produce more viruses",
    speed: 0.3,
    size: 1.4,
    energy: 60,
    canBeInfected: false,
    isVirus: false,
    isImmune: false,
    producesViruses: true
  },

  VIRUS: {
    name: "Virus",
    emoji: "🦠",
    color: "#ff00ff",
    description: "Infects healthy cells and spreads disease",
    speed: 2,
    size: 0.8,
    energy: 50,
    canBeInfected: false,
    isVirus: true,
    isImmune: false,
    infectsOnContact: true
  },

  BACTERIA: {
    name: "Bacteria",
    emoji: "🧫",
    color: "#ffaa00",
    description: "Harmful bacteria that multiplies quickly",
    speed: 1,
    size: 1,
    energy: 70,
    canBeInfected: false,
    isVirus: false,
    isImmune: false,
    reproducesFast: true
  },

  VACCINATED_CELL: {
    name: "Vaccinated Cell",
    emoji: "💉",
    color: "#4488ff",
    description: "Protected by a vaccine - cannot be infected!",
    speed: 0.5,
    size: 1.4,
    energy: 100,
    canBeInfected: false,
    isVirus: false,
    isImmune: true,
    vaccinated: true
  },

  ANTIBODY: {
    name: "Antibody",
    emoji: "🛡️",
    color: "#00ffff",
    description: "Produced by white blood cells to neutralize viruses",
    speed: 2.5,
    size: 0.6,
    energy: 30,
    canBeInfected: false,
    isVirus: false,
    isImmune: true,
    neutralizesViruses: true
  }
};

export const EDUCATIONAL_FACTS = {
  VIRUS_INFECTION: "🦠 Viruses inject their genetic material into healthy cells!",
  WHITE_CELL_ATTACK: "⚪ White blood cells detect and destroy invaders!",
  VACCINE_PROTECTION: "💉 Vaccines teach your body to recognize threats!",
  ANTIBODY_DEFENSE: "🛡️ Antibodies stick to viruses and stop them!",
  CELL_DEATH: "☠️ Infected cells die to prevent virus spread!",
  REPRODUCTION: "🌱 Bacteria and viruses multiply quickly!",
  IMMUNE_RESPONSE: "💪 Your immune system is your body's army!"
};
