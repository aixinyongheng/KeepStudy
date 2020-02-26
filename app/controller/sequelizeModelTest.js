'use strict';
const Controller = require('egg').Controller;

class SequelizeModelController extends Controller {
  async selectTest() {
    const { ctx } = this;
    const user = await ctx.service.sequelizeModelTest.selectTest();
    ctx.body = user;
  }
  async insertTest() {
    const { ctx } = this;
    const user = await ctx.service.sequelizeModelTest.insertTest();
    ctx.body = user;
  }
  async updateTest() {
    const { ctx } = this;
    const user = await ctx.service.sequelizeModelTest.updateTest();
    ctx.body = user;
  }
  async deleteTest() {
    const { ctx } = this;
    const id = ctx.query.id;
    const user = await ctx.service.sequelizeModelTest.deleteTest(id);
    ctx.body = user;
  }

  async authSelectTest() {
    const { ctx } = this;
    const userId = ctx.params.user_id;
    const user = await ctx.service.sequelizeModelTest.authSelectTest(userId);
    ctx.body = user;
  }

}

module.exports = SequelizeModelController;
