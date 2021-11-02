export function isOnekeyDevice(device) {
  // 过滤 BixinKeyxxx 和 Kxxxx

  //i 忽略大小写模式
  var re = /(BixinKey\d{10})|(K\d{4})/i;
  if (device && device.name && re.exec(device.name)) {
    return true;
  }
  return false;
}
