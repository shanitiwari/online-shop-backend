#!/usr/bin/env node

/**
 * Script to kill processes running on a specific port
 * Usage: node scripts/kill-port.js [port]
 * If no port is specified, defaults to 3000
 */

const { exec } = require('child_process');
const port = process.argv[2] || 3000;

console.log(`Attempting to kill processes on port ${port}...`);

// For macOS/Linux
const killCommand = `lsof -ti:${port} | xargs kill -9`;

exec(killCommand, (error, stdout, stderr) => {
  if (error) {
    if (error.code === 1) {
      console.log(`No processes found running on port ${port}`);
    } else {
      console.error(`Error killing processes: ${error.message}`);
    }
    return;
  }
  
  if (stderr) {
    console.error(`Error: ${stderr}`);
    return;
  }
  
  console.log(`Successfully killed processes on port ${port}`);
});