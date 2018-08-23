const crc = require('../utils/crc');
const zlib = require('zlib'); // 我们需要对png数据块进行deflate压缩

// png的头部——0x89+'PNG'+0x0d0a1a0a
// 所有png文件的开头都有固定的8字节，用来让读取它的程序知道这是个png文件：
// Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

// 第一个数据块——IHDR
// png文件的第一个数据块，固定13字节信息，包含了png文件的基本信息
// width 4字节 图片宽度
// height 4字节 图片高度
// Bit depth	1字节 图像位深，这里我们固定设置为8(RGBA每通道各占8位(0~255))
// Colour type	1字节 颜色类型，这里我们固定设置为6(RGBA带透明度的彩图)
// Compression method	1字节 不用管
// Filter method	1字节 不用管
// Interlace method	1字节 不用管

// 另一个数据块——IDAT
// 这是用来储存图像内容的数据块，结构很简单
// LENGTH：我们现在暂时不知道，留着
// CHUNK TYPE：Buffer.from('IDAT')简单粗暴
// CHUNK DATA：我们设置的是每通道8位（每像素32位=4字节）的图片，所以要申请的内存大小：宽*高*每像素4字节+图像高度
// 在png图片中，每一行像素开头会有1字节的行标志位0x00，所以我们需要额外的height字节
// idat数据块应包含的是被deflate压缩后的数据，所以我们现在只能先初始化一下这个数据块，留到最后再处理：

// 结束标志
// 简单粗暴：Buffer.from('IEND')

// png图片信息
exports.ihdr = function (width = 0, height = 0) {
  const buf = Buffer.allocUnsafe(17);
  buf.write('IHDR', 0);
  buf.writeUInt32BE(width, 4);
  buf.writeUInt32BE(height, 8);
  buf.writeUInt8(8, 12);
  buf.writeUInt8(6, 13);
  buf.writeUInt8(0, 14);
  buf.writeUInt8(0, 15);
  buf.writeUInt8(0, 16);
  const ihdrCrc = Buffer.allocUnsafe(4);
  ihdrCrc.writeInt32BE(crc(buf));
  return Buffer.concat([Buffer.from([0, 0, 0, 13]), buf, ihdrCrc]);
}
// png图片内容
exports.idat = function (width, height) {
  const data = Buffer.alloc(width * height + 1, 255);
  // 数据块名
  const idatName = Buffer.from('IDAT');
  // idat数据块内容需要进行一次deflate压缩
  const idatData = zlib.deflateSync(data);
  // 长度
  const idatLen = Buffer.alloc(4);
  idatLen.writeUInt32BE(data.byteLength);
  // crc
  const idatCrc = Buffer.allocUnsafe(4);
  idatCrc.writeInt32BE(crc(Buffer.concat([idatName, data])));
  return Buffer.concat([idatLen, idatName, idatData, idatCrc]);
}
