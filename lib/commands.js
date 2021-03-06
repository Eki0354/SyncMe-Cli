const readline = require('readline-sync');
const path = require('path');
const { execSync, removeDir, createModule, createProject, getVersionOfSyncMe } = require('./utils');
const config = require('./config');

/**
 * 创建项目
 */
module.exports.createProject = async function() {
  console.log(`Thanks for using ${config.thisName}!\r\n\r\nThis utility will walk you through creating a ${config.mainName} project.\r\n\r\n`);

  // 获取需要用户输入的信息
  const name = readline.question('Project Name: ', {
    limit: /^[a-zA-Z0-9_\-]+$/,
    limitMessage: 'Invalid project name! It could contain a-z, A-Z, 0-9, "-" and "_".'
  });

  const defaultVersion = '1.0.0';
  const version = readline.question(`Version (${defaultVersion}): `, { defaultInput: defaultVersion });

  const description = readline.question(`Description: `, { defaultInput: '' });
  const author = readline.question(`Author: `, { defaultInput: '' });

  const defaultLicense = 'MIT';
  const license = readline.question(`License (${defaultLicense}): `, { defaultInput: defaultLicense });

  console.log('\nCreating. . .');

  // 创建模板项目相关文件
  const inputInfo = {
    name,
    version,
    description,
    author,
    license
  }
  createProject(inputInfo);

  let finalLogs = [
    'Please run commands below to start developing.',
    `  \`cd ${name}\``,
    '  \`npm install\`',
    `  \`${config.mainCommand} start\` or \`npm run start\`\n`
  ];

  // 自动安装npm包
  console.log('\nInstalling packages. . .');
  const projectRoot = path.resolve(process.cwd(), name);
  try {
    process.chdir(projectRoot);
    await execSync('npm install');
    finalLogs.splice(2, 1);
    finalLogs.unshift('\nFinished!\n');
  } catch (error) {
    console.log(error);
    finalLogs.unshift('Install packages unsuccessfully!\n');
  }

  finalLogs.forEach(line => console.log(line));
}

/**
 * 在已有项目中创建模块
 * @param {string} name 模块名称
 */
module.exports.createModule = name => createModule('', name);

/**
 * 在已有项目中删除模块
 * @param {string} name 要删除的模块名称
 */
module.exports.deleteModule = name => removeDir(path.resolve(process.cwd(), 'src/pages', name), true);

/**
 * 开发模式启动项目的回调
 */
module.exports.startProject = () => exec('gulp --watch');

/**
 * 生产模式启动项目的回调
 */
module.exports.buildProject = () => exec('gulp');
