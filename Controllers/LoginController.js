const {OAuth2Client} = require('google-auth-library');
const { google } = require('googleapis');
const OAuth2Data = require('../cre.json')
const GoogleAdmin = require('../Libraries/GoogleAdmin')
const url = require('url');
const CLIENT_ID = OAuth2Data.web.client_id;
const CLIENT_SECRET = OAuth2Data.web.client_secret;
const REDIRECT_URL = OAuth2Data.web.redirect_uris;
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL)

// chuyển hướng đăng nhập sang google
exports.login = async  (req,res,next) => {
    const url = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: [
          'https://www.googleapis.com/auth/admin.directory.user.security',
          'https://www.googleapis.com/auth/gmail.readonly','https://www.googleapis.com/auth/contacts.readonly','https://www.googleapis.com/auth/contacts','https://www.googleapis.com/auth/userinfo.email','https://www.googleapis.com/auth/userinfo.profile','https://www.googleapis.com/auth/admin.directory.user.readonly']
      });
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, DELETE, OPTIONS"
      );
      // res.send({url:url})
      res.redirect(url);
}
// Lấy token từ google trả về cho client token_id
exports.jwttoken =  async (req,res,next) => {
    try {
        if (req.url.indexOf('/auth/google/callback') > -1) {
          const qs = new url.URL(req.url, 'http://localhost')
            .searchParams;
          const code = qs.get('code');
          const r = await oAuth2Client.getToken(code)
          oAuth2Client.setCredentials(r.tokens)
          GoogleAdmin.CurrentEmail('cuong.nguyenhai@hbc.com.vn')
          res.json(r.tokens.id_token)
          res.status(200)
        }
      } catch (e) {
        res.status(404)
      }
    
}
exports.checkToken =  (req,res) => {
      const token = req.body.token
      if(token === null){
        console.log('ok')
        res.send({check:false})
      }
      else{
        console.log('not ok')
        const checkinfo = oAuth2Client.verifyIdToken({idToken:token}).then(respoense => {
          res.send({check:true})
        }
          )
      }
}
exports.Test = (req,res,next)=>{
  res.render('index')
}

