// 导入所有接口(使用时使用文件名就行，方便之后添加不再逐一导入)
const module = require.context('./modules', false, /\.js$/);
const api = {};
module.keys().forEach(key => {
    api[key.replace(/(\.\/|\.js)/g, '')] = module(key); //导出模块时直接用export，别用default
})
console.log(api)
export default api