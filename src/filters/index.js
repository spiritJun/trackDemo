export function NumFormat(value) {
  if (!value) return '0';

  var intPart = Number(value) - Number(value) % 1;
  var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'); //将整数部分逢三一断

  var floatPart = ""; //预定义小数部分
  var value2Array = value.toString().split(".");

  //=2表示数据有小数位
  if (value2Array.length == 2) {
    floatPart = value2Array[1].toString(); //拿到小数部分

  } else {
    return intPartFormat + floatPart;
  }
}
