const MasterDataCustomerModel = require('../Models/MasterDataCustomerModel')
const { google } = require('googleapis');
const OAuth2Data = require('../cre.json')
const CLIENT_ID = OAuth2Data.web.client_id;
const CLIENT_SECRET = OAuth2Data.web.client_secret;
const REDIRECT_URL = OAuth2Data.web.redirect_uris;
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL)
const fs = require('fs')
const GoogleAdmin = require('../Libraries/GoogleAdmin')

exports.checkLicTradNum = async (req,res)=> {
   try{
        const lictradnum = req.body.lictradnum
        console.log(req.body)
        const get = new MasterDataCustomerModel
        const data = await get.getLicTradNum(lictradnum)
        res.send(data)
   }catch(e){
       res.status('500')
       res.send(e)
   }
}

exports.FormMasterDataCustomer = async (req,res,next) => {
    try{
    const token = req.headers['auth-hbg']
    const formdata  = req.body.formdata
    const verifytoken = (await oAuth2Client.verifyIdToken({idToken:token})).getPayload()
    const curemail = verifytoken.email
    const save = new MasterDataCustomerModel
    if(save.InsertRequestMasterDataCustomer(formdata,curemail))
     //Submit form thành công gửi mess xác nhận với status 200
     {
      
        res.send({mess:true})
     }
    else res.send({
        errors:'có lỗi xảy ra',
        mess:false})
    }
    catch(e){
        res.send({errors:e})
        res.send({mess:false})
    }
}
exports.getList = async (req,res) => {
    const token = req.headers['auth-hbg']
    const formdata  = req.body.formdata
    const verifytoken = (await oAuth2Client.verifyIdToken({idToken:token})).getPayload()
    const curemail = verifytoken.email
    const masterdatamodel = new MasterDataCustomerModel
    const list = await masterdatamodel.listRequest(curemail)
    res.status(200).json(list)
}