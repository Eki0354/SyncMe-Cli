const { exec } = require('child_process');
const path = require('path');
const {
  mkdirSync,
  writeFileSync,
  statSync,
  readdirSync,
  rmSync,
  rmdirSync,
  existsSync,
  copyFileSync,
  renameSync
} = require('fs');
const config = require('./config');

/**
 * 执行命令，并同步显示输出
 * @param {string} cmd 需要执行的命令
 */
module.exports.execProcess = cmd => {
  const workerProcess = exec(cmd, {});

  workerProcess.stdout.on('data', function (data) {
      console.log(data);
  });

  workerProcess.stderr.on('data', function (data) {
      console.log(data);
  });
}

/**
 * 执行命令的同步方法
 * @param {string} cmd 需要执行的命令
 */
async function execSync(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) reject(error);
      resolve(stdout);
    });
  });
}

module.exports.execSync = execSync;

/**
 * 删除目录
 * @param {string} path 文件夹路径
 * @param {boolean} isRemoveSelf 是否删除自身，为否则只删除子目录及目录下文件
 */
module.exports.removeDir = function(path, isRemoveSelf = false) {
  readdirSync(path).forEach(p => {
    p = path + '/' + p;
    const stat = statSync(p);
    if (stat.isDirectory()) {
      removeDir(p, true);
    } else {
      rmSync(p);
    }
  });
  if (isRemoveSelf) rmdirSync(path);
}

/**
 * 递归复制模块文件夹的文件
 * @param {string} src 源目录
 * @param {string} dist 目标目录
 * @param {string} srcName 源模块名称
 * @param {string} distName 目标模块名称
 */
function copyDir(src, dist, srcName, distName = srcName) {
  readdirSync(src).forEach(p => {
    const fullPath = src + '/' + p;
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      copyDir(fullPath, dist + '/' + p, srcName);
    } else {
      if (!existsSync(dist)) mkdirSync(dist, { recursive: true });
      copyFileSync(fullPath, dist + '/' + p.replace(srcName, distName));
    }
  });
}

/**
 * 创建模块文件夹并复制模板文件
 * @param {string} name 将要创建的模块名称
 */
function createModule(projectName, moduleName) {
  if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(moduleName)) throw new Error('将要创建的模块名称不正确！仅可包含英文字母、数字及下划线，且必须以英文字母开头。');
  const packagePath = path.resolve(process.cwd(), projectName, 'package.json');
  if (!existsSync(packagePath)) throw new Error(`未在当前目录发现${config.mainName}项目！`);
  const { devDependencies: ddp = {} } = require(packagePath) || {};
  if (!ddp[config.mainPackageName]) throw new Error(`未在当前目录发现${config.mainName}项目！`);

  const isBG = moduleName === 'background';
  const srcName = isBG ? 'background' : 'test';

  const src = path.resolve(__dirname, `./template/pages/${srcName}`);
  const dist = path.resolve(process.cwd(), projectName, 'src/pages', moduleName);
  if (existsSync(dist)) return console.log(`模块已存在：${moduleName}`);
  mkdirSync(dist, { recursive: true });
  copyDir(src, dist, srcName, moduleName);
}

module.exports.createModule = createModule;

/**
 * 创建默认项目模板
 * @param {object} inputInfo 用户输入数据
 * @param {string} defaultModuleName 默认的模块名称
 */
module.exports.createProject = function(inputInfo, defaultModuleName = config.defaultModuleName) {
  const {
    name,
    version,
    description,
    author,
    license
  } = inputInfo;
  
  // 创建项目根目录
  const projectRoot = path.resolve(process.cwd(), name);
  mkdirSync(projectRoot);

  // 保存项目信息
  const packageInfo = {
    name,
    version,
    description,
    scripts: {
      test: 'echo \"Error: no test specified\" && exit 1',
      start: `${config.mainCommand} start`,
      build: `${config.mainCommand} build`
    },
    author,
    license,
    devDependencies: {
      [config.mainPackageName]: config.mainVersion,
      [config.thisPackageName]: config.thisVersion
    }
  }

  writeFileSync(path.resolve(projectRoot, 'package.json'), JSON.stringify(packageInfo));

  // 创建项目默认模块文件
  createModule(name, defaultModuleName);

  // 创建项目配置文件
  const manifestFileName = 'manifest.json';
  const manifest = require(path.resolve(__dirname, 'template', manifestFileName));

  Object.assign(manifest, {
    name,
    version,
    description
  });

  writeFileSync(path.resolve(projectRoot, 'src', manifestFileName), JSON.stringify(manifest, null, 2));
}

async function getVersionOfSyncMe() {
  const res = await execSync(`npm view ${config.mainPackageName} versions`);
  console.log(res)
}

module.exports.getVersionOfSyncMe = getVersionOfSyncMe;

module.exports.renameModule = function(oldname, newname) {
  const pagesSrc = path.resolve(process.cwd(), 'src/pages');
  const moduleSrc = path.resolve(pagesSrc, oldname);
  readdirSync(moduleSrc).forEach(p => {
    if (!p.startsWith(oldname)) return;
    const src = path.resolve(moduleSrc, p)
    const stat = statSync(src);
    if (stat.isDirectory()) return;
    renameSync(
      src,
      path.resolve(moduleSrc, p.replace(new RegExp(`^${oldname}`), newname))
    );
  });
  renameSync(moduleSrc, path.resolve(pagesSrc, newname));
}
