// 导入类
const files = require.context('./modules', false, /\.js$/);
const Modules = {};
files.keys().forEach(key => {
    const fileName = files(key).default.name;
    Modules[fileName] = files(key).default;
});
module.exports = Modules;