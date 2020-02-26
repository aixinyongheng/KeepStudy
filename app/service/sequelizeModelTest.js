// app/service/user.js

'use strict';

const Service = require('egg').Service;

class SequelizeModelTestServer extends Service {
  // Node.js- Model
  async selectTest() {
    const { app } = this;
    const users = await app.model.TestUser.findAll();
    return users;
  }
  async insertTest() {
    const { app } = this;
    const user = await app.model.TestUser.create({ mytest: 'yangzh666' });
    return user;
  }

  async deleteTest(id) {
    const { app } = this;
    const user = await app.model.TestUser.destroy({ where: { id } }); // 返回值  为删除的数量   0
    return user;
  }
  async updateTest() {
    const { app } = this;
    const user = await app.model.TestUser.update({ mytest2: 'yangzh666' }, { where: { id: 1 } });
    return user;
  }

  async authSelectTest(userID) {
    const { app } = this;
    const users = await app.model.TestUser.findOne({ where: { id: userID } });
    return users;
  }

}

module.exports = SequelizeModelTestServer;
