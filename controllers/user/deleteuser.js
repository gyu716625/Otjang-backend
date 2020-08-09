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

                // join을 이용하여 userId를 알때, item_seasons 테이블의 id를 알아낸다. 
                await items_seasons.findAll({
                    attributes: ['items_seasons.id'],
                    include: [{
                        // Items 테이블의 UserId가 decoded 된 id외 같은 data join
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
                    }
                })

                // item 테이블에서 삭제
                await Items.destroy({
                    where: { Userid: id }
                },{ transaction: t })
                // items_seasons 테이블에서 삭제
                for(let i of season_itemId){
                    await items_seasons.destroy({
                        where:{
                            id: i
                        }
                    },{ transaction: t })
                }                
            })

            // users 에서 삭제
            await Users.destroy({
                where: { id : id }
            })

            res.status(200).json({ message: 'Successful' });

        }catch(err){
            res.status(404).json({ message: "Failed", err: err.message });
        }
    }
}