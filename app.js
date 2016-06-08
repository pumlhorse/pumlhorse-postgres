var connectionFactory = require("./lib/connectionFactory")
var pgClient = require("./lib/pgClient")

module.exports = pumlhorse.module("pumlhorse-postgres")
    .function("connect", ["connectionString", connectionFactory.connect])
    .function("insert", ["connection", "table", "data", pgClient.insert])
    .function("query", ["connection", "sql", "parameters", pgClient.query])
    .asExport()