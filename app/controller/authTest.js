'use strict';

const Controller = require('egg').Controller;

class AuthTestController extends Controller {
  async loginTest() {
    const { ctx } = this;
    const res = await ctx.service.authTest.loginTest(ctx.query.username, ctx.query.password);
    ctx.body = res;
  }
  async selectTest() {
    const { ctx } = this;
    const res = await ctx.service.authTest.selectTest();
    ctx.body = res;
  }
  async createTest() {
    const { ctx } = this;
    const user = ctx.query.user;
    const res = await ctx.service.authTest.createTest(user);
    ctx.body = res;
  }
}
module.exports = AuthTestController;
