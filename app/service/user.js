// app/service/user.js

'use strict';

const Service = require('egg').Service;
const rd = require('rd');
const fs = require('fs');
const Async = require('async');
const Spritesmith = require('spritesmith');


class UserService extends Service {
  // 制作雪碧图
  async createImgByPNG(spriteDir, scale, cb) {
    Async.autoInject(
      {
        files(callback) {
          rd.readFileFilter(spriteDir, /\.png$/i, callback);
        },
        pngs(files, callback) {
          // var spritesmith = new Spritesmith();
          Spritesmith.run({ src: files }, (err, result) => {
            if (err) {
              return callback({
                data: null,
                status: 500,
                error: err,
                msg: '生成雪碧图失败!',
              });
            }
            const json = {};
            for (const key in result.coordinates) {
              let json_key = key.split('/')[key.split('/').length - 1];
              json_key = json_key.substring(0, json_key.indexOf('.png'));
              json[json_key] = result.coordinates[key];
              json[json_key].pixelRatio = 1;
            }
            fs.writeFile(spriteDir + '/sprite.img', result.image, function(
              err,
              png_result
            ) {
              if (err) {
                return callback({
                  data: null,
                  status: 500,
                  error: err,
                  msg: '保存png失败',
                });
              }
              fs.writeFile(
                spriteDir + '/sprite.json',
                JSON.stringify(json),
                (err, json_result) => {
                  if (err) {
                    return callback({
                      data: null,
                      status: 500,
                      error: err,
                      msg: '保存json失败',
                    });
                  }
                  return callback(null, { data: '更新成功', status: 200 });
                }
              );
            });
          });
        },
      },
      function(err, results) {
        return cb(err, results);
      }
    );
  }
  // 制作雪碧图通过svg
  async createImgBySVG(spriteDir, scale, cb) {
    Async.autoInject(
      {
        files(callback) {
          rd.readFileFilter(spriteDir, /\.svg$/i, callback);
        },
        svgs(files, callback) {
          Async.map(
            files,
            function(file, next) {
              fs.readFile(file, function(err, buffer) {
                err;
                if (err) return next(err);
                next(null, {
                  id: path.basename(file, path.extname(file)),
                  svg: buffer,
                });
              });
            },
            callback
          );
        },
        json(svgs, callback) {
          spritezero.generateLayout(
            { imgs: svgs, pixelRatio: scale, format: true },
            callback
          );
        },
        layout(svgs, callback) {
          spritezero.generateLayout(
            { imgs: svgs, pixelRatio: scale, format: false },
            callback
          );
        },
        image(layout, callback) {
          spritezero.generateImage(layout, callback);
        },
      },
      function(err, results) {
        return cb(err, results);
      }
    );
  }
}

module.exports = UserService;
