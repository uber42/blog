var db = require('../models');


module.exports.findUserById = async (req) => {
    try {
        var result = await db.user.findOne({
            include: [{
                model: db.article 
            }],
            where: {
                id: req.params.id
            },
            order: [['createdAt', 'ASC']],
        });
        return result;
    } catch(err) {
        return false;
    }
}