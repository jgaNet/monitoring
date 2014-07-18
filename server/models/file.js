var schema = require('../config/db');

var File = schema.define('File', {
    name: String,
    path: String
});

module.exports = File;