// app/service/user.js

'use strict';

const Service = require('egg').Service;
const rd = require("rd");
const fs = require("fs");
const Async = require("async");
const Spritesmith = require("spritesmith");
const util=require("../util")

class SequelizeTestServer extends Service {
  // Node.js-Sequelize之原始查询
  async getUser(){
    const { config } = this;
    let mysequlize=util.getSequelize(config.sequelize)
    // console.log(mysequlize.QueryTypes)
    let user=await mysequlize.query("select * from test_user where 1=1",{type:"SELECT"}).catch(err => {
    })
    return user
  } 
  async inserttest(){
    const { config } = this;
    let mysequlize=util.getSequelize(config.sequelize)
    let user=await mysequlize.query("insert into test_user (id,mytest) value ('66','test6666')",{type:"INSERT"}).catch(err => { 
    })
    return user
  } 
 
  async deletetest(id){
    const { config } = this;
    let mysequlize=util.getSequelize(config.sequelize)
    let user=await mysequlize.query("delete from  test_user where id=?",{type:"INSERT",replacements: [id]}).catch(err => {
    })
    return user
  } 
  async updatetest(){
    const { config } = this;
    let mysequlize=util.getSequelize(config.sequelize)
    let user=await mysequlize.query("update test_user set mytest='update666' where id=66",{type:"UPDATE"}).catch(err => {
     
    })
    return user
  } 
 
}

module.exports = SequelizeTestServer;
