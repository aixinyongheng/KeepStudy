'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/sequelize/select', controller.sequelizeTest.index);
  router.get('/sequelize/insert',controller.sequelizeTest.inserttest)
  router.get('/sequelize/delete',controller.sequelizeTest.deletetest)
  router.get('/sequelize/update',controller.sequelizeTest.updatetest)

  router.get('/sequelizeModel/select',controller.sequelizeModelTest.selectTest)
  router.get('/sequelizeModel/insert',controller.sequelizeModelTest.insertTest)
  router.get('/sequelizeModel/delete',controller.sequelizeModelTest.deleteTest)
  router.get('/sequelizeModel/update',controller.sequelizeModelTest.updateTest)


  router.get('/bb', controller.home.test);
  router.get('/insertest',controller.home.inserttest)
  router.get('/test/:data_id',controller.home.download)
  router.get('/updatetest',controller.home.mkSprite) //雪碧图测试
};
