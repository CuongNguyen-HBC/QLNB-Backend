const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const path = require('path')

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/admin.directory.user'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json'
const file = require('../credentials.json')
  /**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback,options={}) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oauth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);
  const token = require('../token.json')
    oauth2Client.credentials = token
  return callback(oauth2Client,options);
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oauth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
    if (err) return console.warn(`Token not stored to ${TOKEN_PATH}`, err);
    console.log(`Token stored to ${TOKEN_PATH}`);
  });
}

/**
 * Lists the first 10 users in the domain.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */

 function getInfoEmail(auth,options={}){
    const email = options.email
    const service = google.admin({version: 'directory_v1', auth});
    const result = service.users.get({
      userKey:email
     }, (async (err,res) => {
      return res
     }).apply()
     )
     return result
}
// Mọi hàm phải được qua hàm callapi để trả về giá trị
exports.YourCompany = async (email) => {
  const options = {
    email:email
  }
  const value = await authorize(file,getInfoEmail,options)
  const company = value.data.orgUnitPath.split('/')
  return company[1]
}
exports.YourManager = async(email) => {
  const options = {
    email:email
  }
  const value = await authorize(file,getInfoEmail,options)
  const manager = value.data.relations[0].value
  return manager
}