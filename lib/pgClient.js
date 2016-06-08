var _ = require("underscore")
var Promise = require("bluebird")

module.exports = {
    insert: insert,
    query: runQuery,
    client: null
}

function insert(connection, table, data) {
    if (!table) throw new Error("Parameter 'table' is required") 
    if (!data) throw new Error("Parameter 'data' is required")
    
    return Promise.each(data, (row) => insertRow(connection, table, row))
}

function insertRow(connection, table, row) {
            
    var columns = []
    var values = []
    var params = []
    _.keys(row).forEach(function(key, i) {
        columns.push(key)
        values.push("$" + (i + 1))
        params.push(row[key])
    })
    
    return runQuery(connection, "INSERT INTO " + table + " (" + 
        columns.join(", ") +
        ") VALUES (" + 
        values.join(", ") +
        ")", params)      
}

function runQuery(connection, sqlStatement, params) {
    if (!sqlStatement) throw new Error("Parameter 'sql' is required") 
    if (!connection) {
        if (!module.exports.client) throw new Error("Not connected to Postgres")
        connection = module.exports.client
    }
    
    return new Promise((resolve, reject) => {
        var query = connection.query(sqlStatement, params)
        query.on("error", reject)
        var rows = []
        query.on("row", (row) => rows.push(row))
        query.on("end", (result) => resolve(rows))
    })
}
