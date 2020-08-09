const { Users } = require('../../models/index');
const crypto = require('crypto');

module.exports = {
    post: async(req, res) => {
        const { email } = req.decoded;
        let { password, newpassword } = req.body;

        password = crypto.pbkdf2Sync(password, process.env.PASSWORD_SALT, 48537, 64, 'sha512').toString('base64');

        await Users
          .update(
            {
            password: newpassword
            },
            { 
              where: {
                email: email,
                password: password,
            }
          }).then((result) => {
              if(!result[0]){
                res.status(409).json({ message : 'Wrong Infomation' });
              } else{
                res.status(200).json({ message : 'Successful' });
              }
          }).catch((err) => {
              res.status(404).json({ message : "Failed", err: err.message });
          })
        
        
    },
};