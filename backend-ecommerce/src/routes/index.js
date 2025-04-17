'use strict'

const express = require('express');
const router = express.Router();

router.use("/api/v1", require("./access/index"))

// router.get("/", (req, res, next) => {
//     const stringCompression = " ALO ALO ALO ";
//     return res.status(200).json({
//         message: "Hello World, I'm Tuấn Trần",
//         // metadata: stringCompression.repeat(1000000),
//     });
// });

module.exports = router;
