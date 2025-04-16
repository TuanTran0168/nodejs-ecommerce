'use strict';

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shopdev').then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.log("Can't connect to MongoDB", error);
})

if (1 === 1) {
    mongoose.set('debug', true);
    mongoose.set('debug', { color: true });
}

module.exports = mongoose;