// js/logger.js
import { bus } from "./communication.js";

const LOG_TYPES = {
  INFO: 'log-info',
  MUTATION: 'log-mutation', 
  WARNING: 'log-warning',
  ERROR: 'log-error'
};

export function logEvent(message, type = LOG_TYPES.INFO) {
  const timestamp = new Date().toLocaleTimeString();
  const logEntry = `[${timestamp}] ${message}`;
  
  // Log to console
  console.log(logEntry);
  
  // Add to DOM log
  const logContainer = document.getElementById('log-entries');
  if (logContainer) {
    const li = document.createElement('li');
    li.textContent = logEntry;
    li.className = type;
    
    // Add to top of list
    logContainer.insertBefore(li, logContainer.firstChild);
    
    // Keep only last 50 entries
    while (logContainer.children.length > 50) {
      logContainer.removeChild(logContainer.lastChild);
    }
  }
  
  // Emit event for other systems
  bus.emit('log-event', { message, type, timestamp });
}

export { LOG_TYPES };