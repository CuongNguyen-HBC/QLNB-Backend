const mssql = require('mssql')
class Model {
    constructor(){
        this.pool = new mssql.ConnectionPool({
            user:process.env.DB_USER || 'sa',
            password:process.env.DB_PASSWORD || '*hbc123',
            server:process.env.DB_HOST || '118.69.225.159',
            port:parseInt(process.env.DB_PORT,10) || 8500,
            database:process.env.DB_NAME || 'QuanLyNoiBo' ,
            options:{
                "encrypt": false,
                "enableArithAbort": false
            }
        })
        this.pool.connect('error', (errors) => {
            console.log(errors)
        })
    }
}
module.exports = Model