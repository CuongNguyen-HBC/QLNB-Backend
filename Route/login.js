
const LoginController = require('../Controllers/LoginController')
module.exports = (app) =>{
//  xác thực tài khoản google gửi token id
app.route('/login')
    .get(LoginController.login)
app.route('/auth/google/callback')
    .get(LoginController.jwttoken)
app.route('/checkToken')
    .get(LoginController.checkToken)
app.route('/test')
    .get(LoginController.Test)
}