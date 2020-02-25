'use strict';
const fs = require("fs");
const util = require('../util');

const Controller = require('egg').Controller;

class SequelizeTestController extends Controller {
  async index() {
    const { ctx } = this;
    const user = await ctx.service.sequelizeTest.getUser();
    console.log("yagnzhtest",user)
    ctx.body = user;
  }
  async inserttest() {
    const { ctx } = this;
    const user = await ctx.service.sequelizeTest.inserttest();
    ctx.body = user;
  }
  async updatetest(){
    const { ctx } = this;
    const user = await ctx.service.sequelizeTest.updatetest();
    ctx.body = user;
  }
  async deletetest(){
    const { ctx } = this;
    let id=ctx.query.id
    const user = await ctx.service.sequelizeTest.deletetest(id);
    ctx.body = user;
  }


  
}

module.exports = SequelizeTestController;
