const { Users } = require('../../models/index');
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');

module.exports = {
    post: async(req,res) => {

        const { idToken } = req.body;
        let decodedinfo
        
        admin.initializeApp({
            credential: admin.credential.applicationDefault(),
            databaseURL: 'https://otjang-d0bf7.firebaseio.com'
          });
        
        admin.auth().verifyIdToken(idToken)
        .then(function(decodedToken){
            decodedinfo = decodedToken;
            //console.log(decodedinfo);
        }).catch((err)=> {
            res.status(404).json({ message: err.message });
        })

        Users
            .findOrCreate({
                where: {
                    email: decodedinfo.email,
                },
                // defaults: {
                //     password: '',
                // },
            })
            .then(async([user,created]) => {
                const data = await user.get({ plain: true });
                const payload = { id: data.id, email: data.email }
                const token = jwt.sign(payload,process.env.JWT_SECRET,
                {
                    expiresIn: "1 days"
                });
                res.status(200).json({ message: 'Successful', id: data.id, email: data.email, token: token });
            })
            .catch((err) => {
                res.status(404).json({ message: "Failed", err: err.message });
            })
    }
}