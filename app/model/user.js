'use strict';
const crypto = require('crypto');


module.exports = app => {
  const { STRING, DATE, VIRTUAL } = app.Sequelize;
  const User = app.model.define('user', {
    id: { type: STRING(50), primaryKey: true },
    username: { type: STRING(50) },
    password: { type: STRING(255),
      set(password) {
        const result = crypto.createHash('md5').update(password).digest('hex');
        this.setDataValue('password', result);
      },
      get() {
        return this.getDataValue('password');
      },
    },
    sex: { type: STRING(1) },
    qq: { type: STRING(50) },
    email: { type: STRING(50) },
    cjsj: DATE,
    token: {
      type: VIRTUAL,
      set(token) {
        this.setDataValue('token', token);
      },
      get() {
        return this.getDataValue('token');
      },
    },
  }, {
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    tableName: 'user',
  });
  User.associate = function() {
  };
  User.prototype.valicatePassword = function(password) {
    const password_md5 = crypto.createHash('md5').update(password).digest('hex');
    return password_md5 === this.password;

  };
  return User;
};
