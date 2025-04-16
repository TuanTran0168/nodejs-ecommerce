"use strict";

const mongoose = require("mongoose");
const os = require("os");
const process = require("process");
const _SECOND = 30000;

// Count connection
const countConnetion = () => {
  return mongoose.connections.length;
};

const printConnetion = () => {
  console.log(`Number of connections: ${countConnetion()}`);
};

// Check Overload
const checkOverload = () => {
  console.log("✅ checkOverload() CALLED");
  setInterval(() => {
    console.log("⏰ setInterval RUNNING");

    const numConnections = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss / 1024 / 1024;
    const maxConnections = numCores * 2;

    console.log(`🧠 Current: ${numConnections} / Max: ${maxConnections}, RAM: ${memoryUsage.toFixed(2)} MB`);

    if (numConnections > maxConnections) {
      console.log("🚨 Overload detected!");
    }
  }, _SECOND);
};

module.exports = {
  countConnetion,
  printConnetion,
  checkOverload,
}
