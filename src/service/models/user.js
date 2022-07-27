'use strict';

const Aliase = require(`./aliase`);
const {DataTypes, Model} = require(`sequelize`);

class User extends Model {}

const define = (sequelize) => User.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  sequelize,
  modelName: `User`,
  tableName: Aliase.USERS,
  underscored: true,
});

module.exports = define;
