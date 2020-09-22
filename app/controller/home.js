'use strict';
const fs = require('fs');

// 自己测试，非node任务
const Controller = require('egg').Controller;

class HomeController extends Controller {
  // zip打包文件
  async zipFile() {
    const exe_str = `cd ${folderpath} && zip -r -q ${folderpath}.zip ./* -x *.img *.json *.zip`;
    const execResult = await new Promise(function(resolve, reject) {
      exec(exe_str, function(error, stdout, stderr) {
        if (error) reject(error);
        resolve('ok');
      });
    });
  }
  // 下载文件
  async download() {
    const { ctx } = this;
    const result = {
      code: 1,
      data: null,
      msg: '下载成功',
    };
    const folderpath = 'F:\\emergency';
    const dataBuffer = fs.readFileSync(`${folderpath}.zip`);
    // fs.unlink(`${folderpath}.zip`);
    result.data = dataBuffer;
    ctx.response.attachment('yangzh.zip');
    ctx.body = result.data;
  }
  // 制作雪碧图
  async mkSprite() {
    const { ctx } = this;
    console.log('yangzh');
    const pngResult = await new Promise(function(resolve, reject) {
      ctx.service.user.createImgByPNG('F://pngtest', null, function(err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
    ctx.body = pngResult;
  }

  async test(){
    const { ctx } = this;
    console.log("转发了");
    ctx.redirect('http://www.baidu.com');
  }

}

module.exports = HomeController;
