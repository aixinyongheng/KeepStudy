'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const auth = app.middlewares.auth();
  router.get('/sequelize/select', controller.sequelizeTest.index);
  router.get('/sequelize/insert', controller.sequelizeTest.inserttest);
  router.get('/sequelize/delete', controller.sequelizeTest.deletetest);
  router.get('/sequelize/update', controller.sequelizeTest.updatetest);

  router.get('/sequelizeModel/select', controller.sequelizeModelTest.selectTest);
  router.get('/sequelizeModel/insert', controller.sequelizeModelTest.insertTest);
  router.get('/sequelizeModel/delete', controller.sequelizeModelTest.deleteTest);
  router.get('/sequelizeModel/update', controller.sequelizeModelTest.updateTest);

  router.get('/auth/sequlizeModel/login', controller.authTest.loginTest);
  router.get('/auth/sequlizeModel/select', auth, controller.authTest.selectTest);
  router.get('/auth/sequlizeModel/insert', controller.authTest.createTest);


  router.get('/test/:data_id', controller.home.download);// 下载测试
  router.get('/updatetest', controller.home.mkSprite); // 雪碧图测试

  router.get('/font/:fontstack/:range.pbf', controller.home.mkSprite);
  
  router.post('/uploadExcel', controller.dealExcel.uploadExcel); // 解析excel

  //mvt 矢量实时切片获取
  router.get('/queryMvt/:z/:x/:y.mvt', controller.map.queryMvt);
  //geojson 获取geojson
  router.get('/queryGeojson',controller.map.queryGeojson);

 // 获取mbtiles
  router.get('/queryMbtiles/:z/:x/:y.pbf',controller.map.queryMbtiles);

  // 从mongodb中读取数据
  router.get('/queryPbf/:z/:x/:y.pbf',controller.map.queryPbf);

  // 通用服务
  router.post('/createOrUpdateData',controller.common.createOrUpdateData);// 先建编辑
  router.get('/queryListCommon',controller.common.queryListCommon);// 通用列表查询
  router.get('/test', controller.home.test);
};
