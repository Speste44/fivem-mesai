const { SpesteDB } = require("resthaven");
const db = new SpesteDB({ path: "./database/db.json" })

module.exports = db;