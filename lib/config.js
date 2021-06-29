const { name, version, bin } = require('../package.json');

module.exports = {
  // 主包展示名称
  mainName: 'SyncMe',

  // 主包名称
  mainPackageName: 'e-syncme',

  // 使用主包的版本
  mainVersion: '0.1.0',

  // 当前Cli展示名称
  thisName: 'E-SyncMe-Cli',

  // 当前Cli名称
  thisPackageName: name,
  
  // 当前cli的版本
  thisVersion: version,
  
  // 当前cli的版本
  mainCommand: Object.keys(bin)[0],
  
  // 创建新项目时的默认模块名称
  defaultModuleName: 'syncme'
}