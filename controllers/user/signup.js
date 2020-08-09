const { Users } = require('../../models/index');

module.exports = {
    post: async(req, res) => {
        const { email, password } = req.body;
        
        await Users
            .findOrCreate({
                where: {
                    email: email,
                },
                defaults: {
                    password: password,
                },
            })
            .then(async([user,created]) => {
                if(!created){
                    return res.status(409).json({ message: 'Already exists' })
                }
                res.status(200).json({ message: 'Successful' });
            })
            .catch((err) => {
                res.status(404).json({ message: "Failed", err: err.message });
            })
    },
};