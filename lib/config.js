const { name, version, bin } = require('../package.json');

// 主包展示名称
module.exports.mainName = 'SyncMe';

// 主包名称
module.exports.mainPackageName = 'e-syncme';

// 使用主包的版本
module.exports.mainVersion = '0.1.0';

// 当前Cli展示名称
module.exports.thisName = 'E-SyncMe-Cli';

// 当前Cli名称
module.exports.thisPackageName = name;

// 当前cli的版本
module.exports.thisVersion = version;

// 当前cli的版本
module.exports.mainCommand = Object.keys(bin)[0];

// 创建新项目时的默认模块名称
module.exports.defaultModuleName = 'syncme';
