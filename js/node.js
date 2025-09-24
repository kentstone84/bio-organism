// node.js
// Each browser window can be a node in the organism network

import { uuid } from "./utils.js";
import { logEvent } from "./logger.js";

export class OrganismNode {
  constructor(isRoot = false) {
    this.id = uuid();
    this.isRoot = isRoot;
    this.connectedNodes = new Map();
    this.state = {
      health: 100,
      energy: 50,
      role: isRoot ? "nucleus" : "cell",
    };

    logEvent(`🧬 Node created [${this.id}] Role=${this.state.role}`);
  }

  connect(node) {
    if (!this.connectedNodes.has(node.id)) {
      this.connectedNodes.set(node.id, node);
      node.connectedNodes.set(this.id, this);
      logEvent(`🔗 Node ${this.id} connected to ${node.id}`);
    }
  }

  disconnect(node) {
    if (this.connectedNodes.has(node.id)) {
      this.connectedNodes.delete(node.id);
      node.connectedNodes.delete(this.id);
      logEvent(`❌ Node ${this.id} disconnected from ${node.id}`);
    }
  }

  sendSignal(targetId, payload) {
    if (this.connectedNodes.has(targetId)) {
      const target = this.connectedNodes.get(targetId);
      logEvent(`📡 Node ${this.id} -> ${targetId}: ${payload.type}`);
      target.receiveSignal(this.id, payload);
    }
  }

  receiveSignal(fromId, payload) {
    logEvent(`📥 Node ${this.id} received [${payload.type}] from ${fromId}`);
    if (payload.type === "attack" && this.state.role !== "virus") {
      this.state.health -= payload.strength;
      if (this.state.health <= 0) {
        logEvent(`💀 Node ${this.id} has died`);
      }
    }
  }
}
