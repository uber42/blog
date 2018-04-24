var bCrypt = require('bcrypt');

module.exports = function(sequelize, Sequelize) {
 
  var user = sequelize.define('user', {
      name: {
          type: Sequelize.STRING,
          allowNull: false,
          notEmpty: true
      },
      email: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
              isEmail: true
          }
      },
      en_password: {
          type: Sequelize.STRING,
          allowNull: false
      },

      admin: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
      }

  }, {
    setterMethods: {
        password : function(value) {
            this.setDataValue('en_password', bCrypt.hashSync(value, bCrypt.genSaltSync(8)));
        }
    }
  });

  user.prototype.PassIsEquals = function(password){
    return bCrypt.compareSync(password, this.en_password);
  };

  user.associate = function(models) {
    user.hasMany(models.article, {foreignKey: 'userId'})
  };
  return user;
};