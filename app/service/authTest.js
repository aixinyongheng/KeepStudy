'use strict';
const Service = require('egg').Service;
const jwt = require('jsonwebtoken');
class AuthTestServer extends Service {
  async loginTest(username, password) {
    const { app } = this;
    const user = await app.model.User.findOne({ where: { username } });
    if (user.valicatePassword(password)) {
      const token = jwt.sign({ id: user.id, name: user.name }, 'my-token', { expiresIn: '2h' });
      console.log(token);
      user.token = token;
      user.password = '123456789';
      return user;
    }
    return '密码错误';
  }

  async selectTest() {
    const { app } = this;
    const user = await app.model.User.findAll();
    return user;
  }

  async createTest(user) {
    const { app } = this;
    const UUID = require('uuid');
    const id = UUID.v1();
    console.log('yangzhtest', user);
    console.log('yangzh:', id);
    const userObject = JSON.parse(user);
    console.log('object', userObject);
    userObject.id = id;
    await app.model.User.create(userObject);
    return id;

  }

}
module.exports = AuthTestServer;
