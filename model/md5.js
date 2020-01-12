const crypto = require('crypto');
function md5(pwd) {
    const md5 = crypto.createHash('md5');
    const password = md5.update(pwd).digest('base64')
    return password;
}
function type1(pwd) {
    return md5(md5(pwd).substr(4, 7) + md5(pwd))
}
module.exports = {
    base: md5,
    type1: type1
}