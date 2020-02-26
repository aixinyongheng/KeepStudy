const Sequelize = require('sequelize');
module.exports = {
  // 获取sequelize
  getSequelize(config) {
    const sequelize = new Sequelize(
      config.database,
      config.username,
      config.password,
      {
        host: config.host,
        port: config.port,
        dialect: config.dialect,
        pool: config.pool,
        define: config.define,
        logging: config.logging,
      }
    );
    return sequelize;
  },
  // 第归查找节点并更新
  setAttrDeep(org, obj) {
    const attr = Object.getOwnPropertyNames(obj);
    if (!org.hasOwnProperty(attr[0])) {
      return false;
    }
    if (typeof obj[attr[0]] === 'object') {
      return this.setAttrDeep(org[attr[0]], obj[attr[0]]);
    }
    org[attr[0]] = obj[attr[0]];
    return true;

  },
  // 坐标转换（生成mvt时会用到）
  xyz2lonlat(x, y, z) {
    const n = Math.pow(2, z);
    const lon_deg = (x / n) * 360.0 - 180.0;
    const lat_rad = Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / n)));
    const lat_deg = (180 * lat_rad) / Math.PI;
    return [ lon_deg, lat_deg ];
  },
  async runSql(sql, type, sequelize, msg, result, logger, nonum) {
    let res = await sequelize.query(sql, { type }).catch(err => {
      result.code = 0;
      result.msg = msg;
      result.data = err;
      logger.error(new Error(err));
      console.log(err.sql);
    });
    if (!res) return res;
    if (!nonum && nonum == null) {
      if (type == 'INSERT' || type == 'DELETE' || type == 'UPDATE') {
        if (res[1] == 0) {
          result.code = 0;
          result.msg = '未执行成功';
          res = null;
          console.log(sql);
          return res;
        }
      }
    }
    return res;
  },
};
