'use strict';
const fs = require("fs");
const util = require('../util');

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async test(){
    const { ctx } = this;
    console.log(ctx.query)
    const user = await ctx.service.user.find(ctx.query);
    ctx.body = user;
  }
  async inserttest(){
    const { ctx } = this;
    console.log(ctx.query)
    const user = await ctx.service.user.inserttest(ctx.query);
    ctx.body = user;
  }
  // zip打包文件
  async zipFile(){
    let exe_str = `cd ${folderpath} && zip -r -q ${folderpath}.zip ./* -x *.img *.json *.zip`;
    let execResult = await new Promise(function (resolve, reject) {
      exec(exe_str, function (error, stdout, stderr) {
        if (error) reject(error);
        resolve("ok");
      });
    })
  }
  // 下载文件
  async download(){
    const { ctx } = this;
    let result = {
      code: 1,
      data: null,
      msg: "下载成功"
    };
    let folderpath="F:\\emergency";
    let dataBuffer = fs.readFileSync(`${folderpath}.zip`);
    //fs.unlink(`${folderpath}.zip`);
    result.data = dataBuffer;
    ctx.response.attachment("yangzh.zip");
    ctx.body = result.data;
  }
  // 制作雪碧图
  async mkSprite(){
    const { ctx } = this;
    console.log("yangzh")
    let pngResult = await new Promise(function (resolve, reject) {
        ctx.service.user.createImgByPNG("F://pngtest",null,function (err, res) {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        })
    })
    ctx.body=pngResult
  }

}

module.exports = HomeController;
