// app/service/user.js

'use strict';
const path=require("path");
const fs=require("fs");
const mkdirp =require("mkdirp");
const sendToWormhole = require('stream-wormhole');
const awaitWriteStream = require('await-stream-ready').write;
const XLSX = require('xlsx');
const turf = require("@turf/turf");
const ejsExcel = require('ejsexcel');
const Service = require('egg').Service;
class DealExcelServer extends Service {
  // Node.js- Model
  async uploadExcel(stream,type) {
    const { app } = this;
    const result={code:1,data:null,msg:"服务成功"};
    let tempPath = "T://nodeExcel";
    tempPath = path.join(tempPath, "11");
    const filename = stream.filename;
    if (!stream || !filename) {
      result.code = 0;
      result.msg = '文件不存在!';
      return result;
    }
    const fileInfo = path.parse(filename);
    const ext = fileInfo.ext;
    if (![ '.xlsx' ].includes(ext.toLowerCase())) {
      result.msg = '文件格式不支持。';
      result.code = 0;
      return result;
    }
    if (!fs.existsSync(tempPath)) {
      mkdirp.sync(tempPath);
    }
    const filePath = path.join(tempPath, "11" + '-pc-' + Date.now() + '.xlsx');
    // 写入文件流
    const writeStream = fs.createWriteStream(filePath);
    try {
      await awaitWriteStream(stream.pipe(writeStream));
    } catch (err) {
      await sendToWormhole(stream);
      result.code = 0;
      result.msg = '上传文件失败';
      result.data = err;
      return result;
    }
    const xlsBuffer = fs.readFileSync(filePath);
    const wb = XLSX.read(xlsBuffer, { type: 'buffer', cellDates: true });
    let index=0;
    let excelJson=null;
    for (const sheetKey in wb.Sheets) {
      if (index === 0) {
        excelJson = XLSX.utils.sheet_to_json(wb.Sheets[sheetKey]);// 获取sheet
        console.log(excelJson);
        for (const excelItem of excelJson) {
          let address=excelItem["地址"];
          let mc=excelItem["名称"];
          let searchAddres="内蒙古自治区赤峰市巴林右旗";
          if(type==2){
            searchAddres+=mc+address;
          }else{
            searchAddres+=mc;
          }
          const resData= await this.ctx.service.position.finalLocate(searchAddres);
          console.log(resData);
          excelItem.lon=resData.data.location.lon;
          excelItem.lat=resData.data.location.lat;
          excelItem.score=resData.data.location.score;
          let line= turf.lineString([[Number(excelItem["经度"]), Number(excelItem["纬度"])], [Number(excelItem.lon),Number(excelItem.lat)]]);
          var length = turf.length(line, {units: 'kilometers'});
          excelItem.jl=length*1000;
        }
      } 
      index++;
    }
    let modelFilePath = `tempmodel/excelModel.xlsx`;
    const exlBuf = fs.readFileSync(modelFilePath);
    const exlBuf2 = await ejsExcel.renderExcel(exlBuf, excelJson).catch(err => {
      result.code = 0;
      result.msg = '数据导入模板失败';
      result.data = err;
      logger.error(new Error(err));
    });
    result.data = exlBuf2;
    fs.writeFileSync(`${config.dataPath.export}/result${type}.xlsx`,exlBuf2)
    return result;
  }
  
}

module.exports = DealExcelServer;
