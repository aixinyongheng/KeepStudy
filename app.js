// app.js
'use strict';
module.exports = app => {
  /**
   * Validate 表名是否有效
   */
  app.validator.addRule('tablename', (rule, value) => {
    if (value) {
      const v = '' + value;
      const reg = /^\w+$/;
      const tablenamearr = v.split(',');
      for (let i = 0; i < tablenamearr.length; i++) {
        const tablename = tablenamearr[i];
        if (!reg.test(tablename)) return '参数错误';
      }
    }
  });

  function dateFormat(date, fmt) {
    if (date == null || undefined == date) return '';
    const o = {
      'M+': date.getMonth() + 1, // 月份
      'd+': date.getDate(), // 日
      'h+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      S: date.getMilliseconds(), // 毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    for (const k in o) { if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))); }
    return fmt;
  }
  Date.prototype.toJSON = function() { return dateFormat(this, 'yyyy-MM-dd hh:mm:ss'); };
  String.prototype.interpolate = function(params) {
    const names = Object.keys(params);
    const vals = Object.values(params);
    return new Function(...names, `return \`${this}\`;`)(...vals);
  };
};
