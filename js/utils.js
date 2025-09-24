// utils.js
// Shared helper functions + lightweight shader-like effects

// ---------------------------
// Math & Random Utilities
// ---------------------------

export function randRange(min, max) {
  return Math.random() * (max - min) + min;
}

export function randInt(min, max) {
  return Math.floor(randRange(min, max));
}

export function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function map(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

export function distance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

export function angleBetween(x1, y1, x2, y2) {
  return Math.atan2(y2 - y1, x2 - x1);
}

// ---------------------------
// Utility Generators
// ---------------------------

export function uuid() {
  // Unique organism/node identifier
  return 'xxxx-4xxx-yxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = (c === 'x') ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function now() {
  return performance.now();
}

// ---------------------------
// Canvas Shader Manager
// ---------------------------

class ShaderManager {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");

    Object.assign(this.canvas.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      pointerEvents: "none", // don’t block clicks
      zIndex: "9999",
    });

    document.body.appendChild(this.canvas);

    this.effects = [];
    this.resize();
    window.addEventListener("resize", () => this.resize());

    this.render = this.render.bind(this);
    requestAnimationFrame(this.render);
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0); // reset
    this.ctx.scale(dpr, dpr);
  }

  addGlow(x, y, color = "rgba(0,255,150,0.4)", radius = 40) {
    this.effects.push({ x, y, color, radius, life: 40 });
  }

  render() {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.effects = this.effects.filter(e => e.life > 0);

    this.effects.forEach(e => {
      const alpha = e.life / 40; // fade out
      ctx.beginPath();
      ctx.fillStyle = e.color.replace(/[\d.]+\)$/g, `${alpha})`);
      ctx.shadowBlur = 30;
      ctx.shadowColor = e.color;
      ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      e.life -= 1;
    });

    requestAnimationFrame(this.render);
  }
}

export const shaderManager = new ShaderManager();
