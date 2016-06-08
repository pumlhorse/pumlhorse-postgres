var pg = require("pg")
var Promise = require("bluebird")
var pgClient = require("./pgClient")

module.exports = {
    connect: connect
}


//var pgConnect = Promise.promisify(pg.connect)
function connect(connectionString) {
    if (!connectionString) connectionString = arguments[0]
    if (!connectionString) throw new Error("connectionString is required")
    
    return new Promise((resolve, reject) => {
        pg.connect(connectionString, (err, client, end) => {
            if (err) return reject(err)
            
            pgClient.client = client
            resolve(client)
        })
    })
    // return pgConnect(connectionString)
    //     .then((client, end) => {
    //         pgClient.client = client
    //         return client
    //     })
}