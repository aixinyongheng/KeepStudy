// app/service/user.js

'use strict';

const Service = require('egg').Service;

const util = require('../util');

class SequelizeTestServer extends Service {
  // Node.js-Sequelize之原始查询
  async getUser() {
    const user = await this.app.model.query('select * from test_user where 1=1', { type: 'SELECT' });
    return user;
  }
  async inserttest() {
    const { config } = this;
    const mysequlize = util.getSequelize(config.sequelize);
    const user = await mysequlize.query("insert into test_user (id,mytest) value ('66','test6666')", { type: 'INSERT' });
    return user;
  }

  async deletetest(id) {
    const { config } = this;
    const mysequlize = util.getSequelize(config.sequelize);
    const user = await mysequlize.query('delete from  test_user where id=?', { type: 'INSERT', replacements: [ id ] });
    return user;
  }
  async updatetest() {
    const { config } = this;
    const mysequlize = util.getSequelize(config.sequelize);
    const user = await mysequlize.query("update test_user set mytest='update666' where id=66", { type: 'UPDATE' });
    return user;
  }

}

module.exports = SequelizeTestServer;
