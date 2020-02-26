'use strict';

module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;
  const TestUser = app.model.define('test_user', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    mytest: STRING(255),
    mytest2: STRING(255),
  }, {
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    tableName: 'test_user',
  });
  TestUser.associate = function() {

  };

  return TestUser;
};
