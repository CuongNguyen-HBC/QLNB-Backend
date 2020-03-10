
const LoginController = require('../Controllers/LoginController')
const ApproveController = require('../Controllers/ApproveController')
module.exports = (app) =>{
//  xác thực tài khoản google gửi token id
app.route('/masterdata-customer')
.get(()=>{console.log('ok')})
.post(ApproveController.FormMasterDataCustomer)
app.route('/masterdata-customer/lictradnum')
.post(ApproveController.checkLicTradNum)
app.route('/masterdata-customer/list-request')
.get(ApproveController.getList)
}