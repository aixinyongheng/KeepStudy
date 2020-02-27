'use strict';
const Service = require('egg').Service;
const jwt = require('jsonwebtoken');
const UUID = require('uuid');
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
    const result = { code: 0, msg: '创建成功', data: '' };
    const id = UUID.v1();
    const userObject = JSON.parse(user);
    // 先判断用户是否已存在
    const existUser = await app.model.User.findOne({ where: { username: userObject.username } });
    console.log(existUser);
    if (existUser) {
      result.msg = '已存在该用户';
      result.code = '500';
      return result;
    }
    userObject.id = id;
    await app.model.User.create(userObject);
    result.data = userObject;
    return result;
  }

}
module.exports = AuthTestServer;
