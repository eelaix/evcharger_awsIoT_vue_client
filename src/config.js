// for China NX
export const BASE = 'https://aoegltw0uj.execute-api.cn-northwest-1.amazonaws.com.cn';
// for Ko
//export const BASE = 'https://nupllfj700.execute-api.ap-northeast-2.amazonaws.com';


export const Guest_noyes = ['g_no','g_yes'];
export const GunStandard = ['US','EU','GB'];
export const ChargerSTATS = ['readyfree','readygunin','readywaiting','readycharging','readybadgnd','stopdown','offline'];

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
if (typeof(Array.prototype.contains) === "undefined") {
    Array.prototype.contains = function (obj) {
        let i = this.length;
        while (i--) {
            if (this[i] === obj) {
                return true;
            }
        }
        return false;
    };
}
if (typeof(Array.prototype.removeone) === "undefined") {
    Array.prototype.removeone = function (val) {
        let index = -1;
        for (let i = 0; i < this.length; i++) {
            if (this[i] == val) {
                index = i;
                break;
            }
        }
        if (index > -1) {
            this.splice(index, 1);
        }
        return index;
    };
}
