const mssql = require('mssql')
const Model = require('./Model')
class MasterDataCustomerModel extends Model {
    constructor(){
        super()
        this.table = 'Request_MasterData_Customer'
    }
    async getLicTradNum(lictradnum){
        const pool1 = await this.pool.connect()
        const request = pool1.request('select * FROM vMasterData')
        const data = await request
        .input('lictradnum',mssql.VarChar(50),lictradnum)
        .query('select top 10 * FROM vMasterData where LicTradNum = @lictradnum')
        return data.recordset
    }
    async InsertRequestMasterDataCustomer(formdata,curemail){
        const CardName          = formdata.CardName
        const GroupCode         = formdata.GroupCode.split('_').shift()
        const CmpPrivate        = formdata.CmpPrivate == "Tổ chức" ? "C" : "P"
        const Phone1            = formdata.Phone1
        const Phone2            = formdata.Phone2
        const Tel1              = formdata.Tel1
        const Tel2              = formdata.Tel2
        const GroupNum          = formdata.GroupNum
        const CreditLine        = formdata.CreditLine
        const StreetNo          = formdata.StreetNo
        const Street            = formdata.Street
        const Block             = formdata.Block
        const State             = formdata.State
        const City              = formdata.City
        const Country           = formdata.Country
        const Name              = formdata.Name
        const Address           = formdata.Address
        const Requester         = curemail
        const pool1             = await this.pool.connect()
        const request           = await pool1.request()
        request.input('CardName',mssql.NVarChar(200),CardName)
        request.input('GroupCode',mssql.NVarChar(20),GroupCode)
        request.input('CmpPrivate',mssql.NVarChar(20),CmpPrivate)
        request.input('Phone1',mssql.NVarChar(20),Phone1)
        request.input('Phone2',mssql.NVarChar(20),Phone2)
        request.input('Tel1',mssql.NVarChar(20),Tel1)
        request.input('Tel2',mssql.NVarChar(20),Tel2)
        request.input('GroupNum',mssql.NVarChar(20),GroupNum)
        request.input('CreditLine',mssql.NVarChar(20),CreditLine)
        request.input('StreetNo',mssql.NVarChar(100),StreetNo)
        request.input('Street',mssql.NVarChar(100),Street)
        request.input('Block',mssql.NVarChar(100),Block)
        request.input('State',mssql.NVarChar(100),State)
        request.input('City',mssql.NVarChar(100),City)
        request.input('Country',mssql.NVarChar(100),Country)
        request.input('Name',mssql.NVarChar(100),Name)
        request.input('Address',mssql.NVarChar(100),Address)
        request.input('Requester',mssql.NVarChar(100),Requester)
        request.query(`insert into ${this.table}(CardName,GroupCode,CmpPrivate,Phone1,Phone2,Tel1,Tel2,GroupNum,CreditLine,StreetNo,Street,Block,State,City,Country,Name,Address,Requester) values(@CardName,@GroupCode,@CmpPrivate,@Phone1,@Phone2,@Tel1,@Tel2,@GroupNum,@CreditLine,@StreetNo,@Street,@Block,@State,@City,@Country,@Name,@Address,@Requester)`)
    
    }
}
module.exports = MasterDataCustomerModel