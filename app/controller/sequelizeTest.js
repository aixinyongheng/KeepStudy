'use strict';

const Controller = require('egg').Controller;

class SequelizeTestController extends Controller {
  async index() {
    const { ctx } = this;
    const user = await ctx.service.sequelizeTest.getUser();
    let test=1/0;
    ctx.body = user;
  }
  async inserttest() {
    const { ctx } = this;
    const user = await ctx.service.sequelizeTest.inserttest();
    ctx.body = user;
  }
  async updatetest() {
    const { ctx } = this;
    const user = await ctx.service.sequelizeTest.updatetest();
    ctx.body = user;
  }
  async deletetest() {
    const { ctx } = this;
    const id = ctx.query.id;
    const user = await ctx.service.sequelizeTest.deletetest(id);
    ctx.body = user;
  }


}

module.exports = SequelizeTestController;
