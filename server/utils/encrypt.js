const crypto = require('crypto');
/**
 * aes-128-cbc    aes-128-ecb    aes-192-cbc    aes-192-ecb    aes-256-cbc
 * aes-256-ecb    base64         bf             bf-cbc         bf-cfb
 * bf-ecb         bf-ofb         cast           cast-cbc       cast5-cbc
 * cast5-cfb      cast5-ecb      cast5-ofb      des            des-cbc
 * des-cfb        des-ecb        des-ede        des-ede-cbc    des-ede-cfb
 * des-ede-ofb    des-ede3       des-ede3-cbc   des-ede3-cfb   des-ede3-ofb
 * des-ofb        des3           desx           rc2            rc2-40-cbc
 * rc2-64-cbc     rc2-cbc        rc2-cfb        rc2-ecb        rc2-ofb
 * rc4            rc4-40         seed           seed-cbc       seed-cfb
 * seed-ecb       seed-ofb
 */
const type = 'aes-128-cbc';
const key = Buffer.alloc(16, '859bf2bd9377e7fe2');
const iv = Buffer.alloc(16, 'd93c43a1c77f16265');
const encrypt = function (key, iv, data) {
    var cipher = crypto.createCipheriv(type, key, iv);
    var crypted = cipher.update(data, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
};
const decrypt = function (key, iv, crypted) {
    var decipher = crypto.createDecipheriv(type, key, iv);
    var decoded = decipher.update(crypted, 'hex', 'utf8');
    decoded += decipher.final('utf8');
    return decoded;
};
module.exports = {
  encrypt: function(data) { return encrypt(key, iv, data);},
  decrypt: function(data) { return decrypt(key, iv, data);},
}
