'use strict';

const Service = require('egg').Service;
// const axios = require('axios');
const gcoord = require('gcoord');

class Position extends Service {
  async addressPosition_zdtype(address, type) {
    const { ctx, config, logger } = this;
    const result = {
      code: 1,
      msg: '请求位置坐标成功。',
      data: { location: {} },
    };
    try {
      let url = '';
      if (type == 'tdt') {
        url = `http://api.tianditu.gov.cn/geocoder?ds={"keyWord":"${encodeURIComponent(address)}"}&type=geocode&tk=${config.mapKeys.tdt}`;
      } else if (type == 'gd') {
        url = `https://restapi.amap.com/v3/geocode/geo?address="${encodeURIComponent(address)}"&output=JSON&key=${config.mapKeys.gd}`;
      } else if (type == 'bd') {
        url = `http://api.map.baidu.com/geocoding/v3/?output=json&address="${encodeURIComponent(address)}"&ak=${config.mapKeys.bd}`;
      } else {
        result.code = 0;
        result.msg = '不支持该编码方式。';
        return result;
      }
      console.log(url);
      const Res = await ctx.curl(url).catch(err => {
        result.code = 0;
        result.msg = `请求${type}空间位置失败。`;
        result.data = err;
        logger.error(new Error(err));
      });
      if (Res && Res.data) {
        const res = JSON.parse(Res.data.toString());
        if (type == 'tdt') {
          if (res.status == 0) {
            result.data.location = res.location;
          } else {
            result.code = 2;
            result.msg = '未请求到';
            return result;
          }
        } else if (type == 'gd') {
          if (res.status == 1 && res.geocodes[0]) {
            const lnglat = [ res.geocodes[0].location.split(',')[0], res.geocodes[0].location.split(',')[1] ];
            const transformRes = gcoord.transform(
              lnglat, // 经纬度坐标
              gcoord.GCJ02, // 当前坐标系
              gcoord.WGS84 // 目标坐标系
            );
            result.data.location = { lon: transformRes[0], lat: transformRes[1] };
          } else {
            result.code = 2;
            result.msg = '未请求到';
            return result;
          }
        } else {
          if (res.status == 0) {
            const lnglat = [ res.result.location.lng, res.result.location.lat ];
            const transformRes = gcoord.transform(
              lnglat, // 经纬度坐标
              gcoord.BD09, // 当前坐标系
              gcoord.WGS84 // 目标坐标系
            );

            result.data.location = { lon: transformRes[0], lat: transformRes[1] };
          } else {
            result.code = 2;
            result.msg = '未请求到';
            return result;
          }
        }
      } else {
        result.code = 0;
        result.msg = `请求${type}空间位置失败。`;
        return result;
      }
    } catch (error) {
      result.code = 0;
      result.msg = error;
      logger.error(new Error(error));
    }
    return result;
  }
  // async addressPosition(address, type) {
  //   const { ctx, config, logger } = this;
  //   const result = {
  //     code: 1,
  //     msg: '请求位置坐标成功。',
  //     data: { location: {} },
  //   };
  //   try {
  //     let keydata = null;
  //     if (!type) {
  //       const keyRes = await axios.post(config.xzqhUrlgetMapKey, {
  //         type: 'query',
  //         key_type: null,
  //       });
  //       keydata = keyRes.data.data[0];
  //       type = keydata.key_type;
  //     } else {
  //       const keyRes = await axios.post(config.xzqhUrlgetMapKey, {
  //         type: 'query',
  //         key_type: type,
  //       });
  //       keydata = keyRes.data.data[0];
  //       type = keydata.key_type;
  //     }
  //     let url = '';
  //     if (type == 'tdt') {
  //       url = `http://api.tianditu.gov.cn/geocoder?ds={"keyWord":"${encodeURIComponent(address)}"}&type=geocode&tk=${keydata.key}`;
  //     } else if (type == 'gd') {
  //       url = `https://restapi.amap.com/v3/geocode/geo?address="${encodeURIComponent(address)}"&output=JSON&key=${keydata.key}`;
  //     } else if (type == 'bd') {
  //       url = `http://api.map.baidu.com/geocoding/v3/?output=json&address="${encodeURIComponent(address)}"&ak=${keydata.key}`;
  //     } else {
  //       result.code = 0;
  //       result.msg = '不支持该编码方式。';
  //       return result;
  //     }
  //     console.log(url);
  //     const Res = await ctx.curl(url).catch(err => {
  //       result.code = 0;
  //       result.msg = `请求${type}空间位置失败。`;
  //       result.data = err;
  //       logger.error(new Error(err));
  //     });
  //     if (Res && Res.data) {
  //       const res = JSON.parse(Res.data.toString());
  //       if (type == 'tdt') {
  //         if (res.status == 0) {
  //           result.data.location = res.location;
  //           result.data.type = 'tdt';
  //         } else {
  //           result.code = 2;
  //           result.msg = '未请求到';
  //           return result;
  //         }
  //       } else if (type == 'gd') {
  //         if (res.status == 1 && res.infocode == '10000' && res.geocodes[0]) {
  //           const lnglat = [ res.geocodes[0].location.split(',')[0], res.geocodes[0].location.split(',')[1] ];
  //           const transformRes = gcoord.transform(
  //             lnglat, // 经纬度坐标
  //             gcoord.GCJ02, // 当前坐标系
  //             gcoord.WGS84 // 目标坐标系
  //           );
  //           result.data.location = { lon: transformRes[0], lat: transformRes[1] };
  //           result.data.type = 'gd';
  //           console.log(result.data);
  //         } else {
  //           if (res.infocode == '10003') {
  //             axios.post(config.xzqhUrlgetMapKey, {
  //               type: 'update',
  //               key_type: type,
  //               keyid: keydata.id,
  //             });
  //           }
  //           const bddata = await this.addressPosition(address, 'bd');
  //           if (bddata.code == 1) {
  //             result.data = bddata.data;
  //           } else {
  //             result.code = 2;
  //             result.msg = '未请求到';
  //             return result;
  //           }
  //         }
  //       } else {
  //         if (res.status == 0) {
  //           const lnglat = [ res.result.location.lng, res.result.location.lat ];
  //           const transformRes = gcoord.transform(
  //             lnglat, // 经纬度坐标
  //             gcoord.BD09, // 当前坐标系
  //             gcoord.WGS84 // 目标坐标系
  //           );
  //           result.data.location = { lon: transformRes[0], lat: transformRes[1] };
  //           result.data.type = 'bd';
  //         } else {
  //           const tdtdata = await this.addressPosition(address, 'tdt');
  //           if (result.status == '302') {
  //             axios.post(config.xzqhUrlgetMapKey, {
  //               type: 'update',
  //               key_type: type,
  //               keyid: keydata.id,
  //             });
  //           }
  //           if (tdtdata.code == 1) {
  //             result.data = tdtdata.data;
  //           } else {
  //             result.code = 2;
  //             result.msg = '未请求到';
  //             return result;
  //           }
  //         }
  //       }
  //     } else {
  //       result.code = 0;
  //       result.msg = `请求${type}空间位置失败。`;
  //       return result;
  //     }
  //   } catch (error) {
  //     result.code = 0;
  //     result.msg = error;
  //     logger.error(new Error(error));
  //   }
  //   return result;
  // }

  async finalLocate(address) {
    const { ctx } = this;
    let result = {
      code: 1,
      msg: '请求位置坐标成功。',
      data: null,
    };
    result = await ctx.service.position.addressPosition_zdtype(address, 'tdt');
    if (result.code == 1) return result;

    result = await ctx.service.position.addressPosition_zdtype(address, 'gd');
    if (result.code == 1) return result;

    result = await ctx.service.position.addressPosition_zdtype(address, 'bd');
    if (result.code == 1) return result;

    result.code = 0;
    return result;


  }
  async positionAddress(geojson, type) {
    const { ctx, config, logger } = this;
    const result = {
      code: 1,
      msg: '请求地址成功。',
      data: null,
    };
    const lon = geojson.coordinates[0],
      lat = geojson.coordinates[1];
    let url = '';
    if (type == 'tdt') {
      url = `http://api.tianditu.gov.cn/geocoder?postStr={'lon':${lon},'lat':${lat},'ver':1}&type=geocode&tk=${config.mapKeys.tdt}`;
    } else if (type == 'gd') {
      url = `https://restapi.amap.com/v3/geocode/regeo?output=JSON&location=${lon},${lat}&key=${config.mapKeys.gd}`;
    } else if (type == 'bd') {
      url = `http://api.map.baidu.com/geocoder/v2/?location=${lat},${lon}&output=json&ak=${config.mapKeys.bd}`;
    } else {
      result.code = 0;
      result.msg = '不支持该编码方式。';
      return result;
    }
    console.log(url);
    const Res = await ctx.curl(url).catch(err => {
      result.code = 0;
      result.msg = `请求${type}地址失败。`;
      result.data = err;
      logger.error(new Error(err));
    });
    if (Res && Res.data) {
      const res = JSON.parse(Res.data.toString());
      if (type == 'tdt') {
        if (res.status == 0) {
          result.data = res.result.formatted_address;
        } else {
          result.code = 2;
          result.msg = '未请求到';
          return result;
        }
      } else if (type == 'gd') {
        if (res.status == 1) {
          result.data = res.regeocode.formatted_address;
        } else {
          result.code = 2;
          result.msg = '未请求到';
          return result;
        }
      } else {
        if (res.status == 0) {
          result.data = res.result.formatted_address;
        } else {
          result.code = 2;
          result.msg = '未请求到';
          return result;
        }
      }
    } else {
      result.code = 0;
      result.msg = `请求${type}地址失败。`;
      return result;
    }
    return result;
  }
  async finalAddress(geojson) {
    const { ctx } = this;
    const result = {
      code: 1,
      msg: '请求位置坐标成功。',
      data: null,
    };
    const tdtRes = await ctx.service.position.positionAddress(geojson, 'tdt');
    if (tdtRes.code == 0 || tdtRes.code == 1) return tdtRes;

    const gdRes = await ctx.service.position.positionAddress(geojson, 'gd');
    if (gdRes.code == 0 || gdRes.code == 1) return gdRes;

    const bdRes = await ctx.service.position.positionAddress(geojson, 'bd');
    return bdRes;


  }
}

module.exports = Position;
