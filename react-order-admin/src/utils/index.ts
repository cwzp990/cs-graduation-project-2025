// 将数字专为千分位
export function formatNumber(num: number) {
  if (num === null) {
    return "0";
  }
  const str = num.toString();
  const len = str.length;
  if (len <= 3) {
    return str;
  }
  const remainder = len % 3;
  let result = str.substring(0, remainder);
  let i = remainder;
  while (i < len) {
    if (i !== 0) {
      result += ",";
    }
    result += str.substring(i, i + 3);
    i += 3;
  }
  return result;
}
