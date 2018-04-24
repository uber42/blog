var db = require('../models');
var Joi = require('joi')
var sanitizeHtml = require('sanitize-html');

var schema = Joi.object().keys({
    title: Joi.string().min(3).max(100),
    description: Joi.string().min(20).max(300),
    text: Joi.string().min(100).max(2000),
    userId: Joi.number()
});

var getClean = (str) => {
    try {
        return sanitizeHtml(str,  {
            allowedTags: [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'b', 'i', 'blockquote', 'pre', 'a' ],
            allowedAttributes: {
                a: ['href'],
                img: ['alt', 'src']
            }
        });
    } catch (err) {
        throw new Error('Cleaning error');
    }

}

module.exports.createPost = async (req) => {
    try {
        var valid = await Joi.validate({
            title: req.body.aTitle,
            description: req.body.description,
            text: req.body.text
        }, schema);

        var cleanDescription = await getClean(req.body.description);
        var cleanText = await getClean(req.body.text);

        var data = {
            title: req.body.aTitle,
            description: cleanDescription,
            text: cleanText,
            userId: req.user.id
        }

        var result = await db.article.create(data);
        return result.get();

    } catch (err) {
        req.flash('message', err.message);
        return false;
    }
}

module.exports.getPosts = async (req) => {
    var amount = 10;
    return await db.article.findAll({
        include: [{
            model: db.user,
            attributes: {
                exclude: ["en_password"]
            }
        }],
        order: [['updatedAt', 'DESC']],
        offset: ((req.params.id - 1) * amount),
        limit: amount
    });
}

module.exports.getAll = async () => {
    try {
        return await db.article.findAll();
    } catch(err) {
        return false
    }
}

module.exports.getPostById = async (req, includes = true) => {
    try {
        if(includes) {
            var result = await db.article.findOne({
                include: [{
                    model: db.user,
                    attributes: {
                        exclude: ["en_password"]
                    }
                }],
                where: {
                    id: req.params.id
                }
            });
        } else {
            var result = await db.article.findOne({
                where: {
                    id: req.params.id
                }
            });
        }
        return result;
    } catch(err) {
        return false;
    }
}

module.exports.getLastPost = async () => {
    return await db.article.findAll({
        include: [{
            model: db.user, 
            attributes: {
                exclude: ["en_password"]
            }
        }],
        
        order: [['updatedAt', 'DESC']],
        offset: 0,
        limit: 1
    });
}

module.exports.updatePost = async (req) => {
    try { 
        var valid = await Joi.validate({
            title: req.body.aTitle,
            description: req.body.description,
            text: req.body.text
        }, schema);

        var cleanDescription = await getClean(req.body.description);
        var cleanText = await getClean(req.body.text);

        var data = {
            title: req.body.aTitle,
            description: cleanDescription,
            text: cleanText
        };

        return await db.article.update(data, {
            where: {
                id: req.params.id
            }
        });

    } catch(err) {
        req.flash('message', err.message);
        return false;
    }
}

module.exports.deletePost = async (req) => {
    try {
        return await db.article.destroy({
            where: {
                id: req.params.id
            }
        });
    } catch(err) {
        req.flash('message', err.message);
        return false;
    }
}

module.exports.count = () => {
    return db.article.count();
}
