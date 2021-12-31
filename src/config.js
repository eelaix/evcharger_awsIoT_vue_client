

// for China NX
export const BASE = 'https://4cyh1ztsz3.execute-api.cn-northwest-1.amazonaws.com.cn';

// for Korea
// export const BASE = 'https://5d50gubidj.execute-api.ap-northeast-2.amazonaws.com';


export const Guest_noyes = ['g_no','g_yes'];
export const GunStandard = ['US','EU','GB'];
export const ChargerSTATS = ['readyfree','readygunin','readywaiting','readycharging','readybadgnd','stopdown','offline'];
export const ChargerGuns = ['threeparse1gun','singleparse1gun','singleparse2guns','singleparse3guns'];

if (typeof(Date.prototype.format) === "undefined") {
  Date.prototype.format = function(fmt) {
    var o = {
      'M+': this.getMonth() + 1,
      'd+': this.getDate(),
      'h+': this.getHours(),
      'm+': this.getMinutes(),
      's+': this.getSeconds()
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' +
        o[k]).substr(('' + o[k]).length)));
    return fmt;
  };
}