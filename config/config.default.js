/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1581684233832_516';
  // 跨域设置
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };
  // add your middleware config here
  config.middleware= ['errorHandler'],
  // 只对 /api 前缀的 url 路径生效
  config.errorHandler= {
    match: '/',
  }
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };
  // config.sequelize = {
  //   dialect: 'postgres', // support: mysql, mariadb, postgres, mssql
  //   database: 'emergency',
  //   host: '39.105.87.199',
  //   port: '54433',
  //   username: 'postgres',
  //   password: '123456',
  //   timezone: '+08:00',
  //   pool: {
  //     max: 5,
  //     min: 0,
  //     acquire: 30000,
  //     idle: 10000,
  //   },
  //   define: {
  //     timestamps: false,
  //     underscored: true,
  //     freezeTableName: true,
  //   },
  // };

  config.sequelize = {
    datasources: [
      {
        delegate: 'model', // load all models to app.model and ctx.model
        baseDir: 'model',
        dialect: 'postgres', // support: mysql, mariadb, postgres, mssql
        username: 'postgres', // username
        database: 'emergency',
        host: 'localhost',
        password: '123456',
        // host: '10.18.66.169',
        // password: 'qgzhdc@123',
        port: '55433',
        timezone: '+08:00',
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
        define: {
          timestamps: false,
          underscored: true,
          freezeTableName: true,
        },
      },
    ],
  
  };
  config.mapKeys = {
    tdt: 'a9e9bd2afa02ca0473c5ae68253561df',
    gd: '76c52a1be09375ac80cb68bfe55906dd',
    bd: 'qr3knqGBH0yt7s5MQZYlclbv1aciREt6',
  };
  config.security = {
    // domainWhiteList: [ 'http://localhost:8080' ],
    csrf: {
      enable: false,
    },
  };
  const path=require("path");
  config.multipart = {
    fileSize: '4gb',
    whitelist: filename => /\..{0,}/.test(path.extname(filename) || ''),  // 指定可上传任何类型
    // fileExtensions: [
    //   '.csv',
    //   '.zip',
    //   '.geojson',
    //   '.json',
    //   '.mbtiles',
    //   '.ttf',
    //   '.otf',
    //   '.xlsx',
    //   '.png',
    //   '.txt',
    // ],
    // ,
    // mode: 'file'
  };
  const baseDir='/data/study/';
  config.dataPath = {
    import: baseDir+"/import",
    export: baseDir+"/export",
  };
  config.sequelize = { ...config.sequelize };
  return {
    ...config,
    ...userConfig,
  };
};
