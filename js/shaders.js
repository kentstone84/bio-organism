// shaders.js
// GLSL shaders for the organism visuals + shader manager export

export const organismVertexShader = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const organismFragmentShader = `
  varying vec3 vNormal;
  uniform float time;
  uniform vec3 colorA;
  uniform vec3 colorB;

  void main() {
    float pulse = 0.5 + 0.5 * sin(time + length(vNormal));
    vec3 color = mix(colorA, colorB, pulse);
    gl_FragColor = vec4(color, 1.0);
  }
`;

// Export shaderManager from utils for organism.js compatibility
export { shaderManager } from './utils.js';
