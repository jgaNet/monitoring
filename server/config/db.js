var settings = require("../../settings");
var caminte = require('caminte'),
    Schema = caminte.Schema,
    db = {
        driver: "redis",
        host: "localhost",
        port: "6379"
    };

var schema = new Schema(db.driver, db);

module.exports = schema;