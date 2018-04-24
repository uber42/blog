'use strict';

module.exports = (sequelize, Sequelize) => {
  var article = sequelize.define('article', {
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      foreignKey : true
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    text: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false
    }
  }, {});
  article.associate = function(models) {
    article.belongsTo(models.user, {foreignKey : 'userId'});  
  };
  return article;
};