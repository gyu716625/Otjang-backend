const { Users } = require('../../models/index');
const { Items } = require('../../models/index');
const { items_seasons } = require('../../models/index');
const { sequelize } = require('../../models/index');

module.exports= {
    delete: async(req,res) => {
        const { id } = req.decoded;

        let season_itemId = [];

        try{
            await sequelize.transaction(async(t) => {

                await items_seasons.findAll({
                    attributes: ['items_seasons.id'],
                    include: [{
                        model: Items,
                        where: {UserId : id}
                    }],
                    raw:true,
                    transaction: t
                }).then((result) => {
                    if(result.length){
                        result.map((acc) => {
                            season_itemId.push(acc.id);
                        })
                        console.log(season_itemId)
                    }
                })


                await Items.destroy({
                    where: { Userid: id }
                },{ transaction: t })
                
                for(let i of season_itemId){
                    await items_seasons.destroy({
                        where:{
                            id: i
                        }
                    },{ transaction: t })
                }                
            })

            await Users.destroy({
                where: { id : id }
            })

            res.status(200).json({ message: 'Successful' });

        }catch(err){
            console.log(err.message)
            res.status(404).json({ message: "Failed", err: err.message });
        }
    }
}