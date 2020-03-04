// Khai báo các thư viện cần thiết
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const router = express.Router()
const router2 = express.Router()
const cors = require('cors')
require('./Route/login')(router)
require('./Route/api')(router2)
require('dotenv').config()
//set đường dẫn và request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/Public'))
// Thư viện google api 
app.use(cors())
//  Midlleware Token Google API
app.use('/api',function (req, res, next) {
const { google } = require('googleapis');
const OAuth2Data = require('./cre.json')
const CLIENT_ID = OAuth2Data.web.client_id;
const CLIENT_SECRET = OAuth2Data.web.client_secret;
const REDIRECT_URL = OAuth2Data.web.redirect_uris;
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL)
  const token = req.headers['auth-hbg']
  oAuth2Client.verifyIdToken({idToken:token}).then(async()=> {
        next()
  }).catch(e => {
    if(e)
      res.status('500')
      console.log('fail')
  })
})
// Xác thực trả về tooken api
app.use('/',router)
// Cho sử dụng API 
app.use('/api',router2)

app.listen(process.env.APP_PORT || 80 ,function(){
    console.log(`Server is listening port ${process.env.APP_PORT}`)
})