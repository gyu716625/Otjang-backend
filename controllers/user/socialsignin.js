const { Users } = require('../../models/index');
const admin = require('firebase-admin');

module.exports = {
    post: async(req,res) => {

        let idToken 
        
        admin.initializeApp({
            credential: admin.credential.applicationDefault(),
            databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
          });
        
        admin.auth().verifyIdToken(idToken)
        .then(function(decodedToken){
            let decodedinfo = decodedToken;
            console.log(decodedinfo);
        }).catch((err)=> {

        })


    }
}