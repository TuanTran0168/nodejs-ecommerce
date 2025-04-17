"use strict";

const mongoose = require("mongoose");
const { printConnetion, checkOverload } = require("../helpers/check.connect");
const { database: { host, port, name } } = require("../configs/config.mongodb");
const connectionString = `mongodb://${host}:${port}/${name}`;

console.log(connectionString);
class Database {
  constructor() {
    this._connect();
  }
  _connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
    mongoose.connect(connectionString, {
      maxPoolSize: 15,
    }).then(() => {
        console.log("Database connected (Singleton)");
        printConnetion();
        // checkOverload();
      }).catch((err) => {
        console.log(err);
      });
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
