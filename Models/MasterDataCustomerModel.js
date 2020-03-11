const mssql = require('mssql')
const Model = require('./Model')
const fs = require('fs')
const GoogleAdmin = require('../Libraries/GoogleAdmin')
const path = require('path')
const process = require('child_process')
const diapi = `${path.dirname(require.main.filename || process.mainModule.filename)}\\diapi.jar`

class MasterDataCustomerModel extends Model {
    constructor(){
        super()
        this.table = 'Request_MasterData_Customer'
        this.arCompany = []
        this.arCompany['HBC']       = 'Hòa Bình'
        this.arCompany['KBI']       = 'Kim Bình'
        this.arCompany['LBC']       = 'Long Bình Tri Tôn'
        this.arCompany['AKBC']      = 'An Khánh Bình'
        this.arCompany['AKiBC']     = 'An Kiên Bình'
        this.arCompany['GBC']       = 'Gia Bình'
        this.arCompany['HHBC']      = 'Hồng Hải Bình'
        this.arCompany['TBC']       = 'Tâm Bình'
        this.folder = `C:\\Users\\${__dirname.split('\\')[2]}\\Desktop\\MasterData\\`
    }
    async getLicTradNum(lictradnum){
        const pool1 = await this.pool.connect()
        const request = pool1.request('select * FROM vMasterData')
        const data = await request
        .input('lictradnum',mssql.VarChar(50),lictradnum)
        .query('select top 10 * FROM vMasterData where LicTradNum = @lictradnum')
        return data.recordset
    }
    async getCardCode(Company,GroupCode){
        const a = []
        a['HBC']      = 'H'
        a['KBI']      = 'K'
        a['LBC']      = 'L'
        a['AKBC']     = 'A'
        a['AKiBC']    = 'I'
        a['GBC']      = 'G'
        a['HHBC']     = 'D'
        a['TBC']      = 'T'
      // nhóm loại ngành hàng
        const b = []
        b['02_Cust_Đại_Lý']       = 'D'
        b['03_Cust_Dự_Án']        = 'P'
        b['04_Cust_Lẻ']           = 'R'
        b['05_Cust_Xuất_Khẩu']    = 'E'
        const pool1 = await this.pool.connect()
        const request = pool1.request()
        const result = await request.query(`select count(*) as 'sl' from vMasterData where Company = N'${this.arCompany[Company]}'`)
        const sl = result.recordset[0].sl +1
        return a[Company]+b[GroupCode]+sl
    }
    async InsertRequestMasterDataCustomer(formdata,curemail){
        const CardName          = formdata.CardName
        const GroupCode         = formdata.GroupCode.split('_').shift()
        const CmpPrivate        = formdata.CmpPrivate == "Tổ chức" ? "C" : "P"
        const Phone1            = formdata.Phone1
        const Phone2            = formdata.Phone2
        const Tel1              = formdata.Tel1
        const Tel2              = formdata.Tel2
        const Fax               = formdata.Fax
        const LicTradNum        = formdata.LicTradNum
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
        const Manager           = await GoogleAdmin.YourManager(curemail)
        const pool1             = await this.pool.connect()
        const request           = await pool1.request()
        const Company           = await GoogleAdmin.YourCompany(curemail)
        const CardCode          = await this.getCardCode(Company,formdata.GroupCode)
       
        request.input('CardName',mssql.NVarChar(200),CardName)
        request.input('GroupCode',mssql.NVarChar(20),GroupCode)
        request.input('CmpPrivate',mssql.NVarChar(20),CmpPrivate)
        request.input('Phone1',mssql.NVarChar(20),Phone1)
        request.input('Phone2',mssql.NVarChar(20),Phone2)
        request.input('Tel1',mssql.NVarChar(20),Tel1)
        request.input('Tel2',mssql.NVarChar(20),Tel2)
        request.input('FederalTaxID',mssql.NVarChar(20),LicTradNum)
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
        request.input('Manager',mssql.NVarChar(100),Manager)
        request.input('Company',mssql.NVarChar(100),Company)
        request.input('Fax',mssql.NVarChar(20),Fax)
        request.query(`insert into ${this.table}(CardName,GroupCode,CmpPrivate,Phone1,Phone2,Tel1,Tel2,FederalTaxID,GroupNum,CreditLine,StreetNo,Street,Block,State,City,Country,Name,Address,Requester,Manager,Company,Fax) 
        values(@CardName,@GroupCode,@CmpPrivate,@Phone1,@Phone2,@Tel1,@Tel2,@FederalTaxID,@GroupNum,@CreditLine,@StreetNo,@Street,@Block,@State,@City,@Country,@Name,@Address,@Requester,@Manager,@Company,@Fax)`,(err,res)=> {
            if(err)
            console.log(err)
        })
        this.insertSap()
        // const title = '\ufeffCardCode\tCardCode01\tCardName\tGroupCode\tCmpPrivate\tFederalTaxID\tPhone1\tPhone2\tTel1\tTel2\tFax\tGroupNum\tCreditLine\tStreetNo\tStreet\tBlock\tState\tCity\tCountry\tName\n'
        // const data = `${CardCode}\t${CardCode}\t${CardName}\t${GroupCode}\t${CmpPrivate}\t${LicTradNum}\t${Phone1}\t${Phone2}\t${Tel1}\t${Tel2}\t${Fax}\t${GroupNum}\t${CreditLine}\t${StreetNo}\t${Street}\t${Block}\t${State}\t${City}\t${Country}\t${Name}`
        // const stringfile = title+title+data
        // fs.writeFile(`${this.folder}${Company}\\${CardCode}-${curemail}.txt`,stringfile,'utf8',(err,res)=>{
        //     if(err) console.log(err)
        // })
    }
    async listRequest(email){
        const pool = await this.pool.connect()
        const result = await pool.query(`select * FROM ${this.table} where Requester='${email}'`)
        return result.recordset
    }
    async insertSap(){
        const pool1 = await this.pool.connect()
       await pool1.query('select * FROM Request_MasterData_Customer where Status = 0 ').then(res=> {
            if(res.recordset.length >= 0 ){
                process.exec(`java -d32 -jar -client ${diapi}`);
                pool1.close()
            }
        })
        
    }
}
module.exports = MasterDataCustomerModel