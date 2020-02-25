'use strict';

const Controller = require('egg').Controller;

class SequelizeModelController extends Controller {
  async selectTest() {
    const { ctx } = this;
    const user = await ctx.service.sequelizeModelTest.selectTest();
    console.log("yagnzhtest22",user)
    ctx.body = user;
  }
  async insertTest() {
    const { ctx } = this;
    const user = await ctx.service.sequelizeModelTest.insertTest();
    ctx.body = user;
  }
  async updateTest(){
    const { ctx } = this;
    const user = await ctx.service.sequelizeModelTest.updateTest();
    ctx.body = user;
  }
  async deleteTest(){
    const { ctx } = this;
    let id=ctx.query.id
    const user = await ctx.service.sequelizeModelTest.deleteTest(id);
    ctx.body = user;
  }


  
}

module.exports = SequelizeModelController;
