#!/usr/bin/env node

const { Command } = require('commander');
const {
  createProject,
  createModule,
  deleteModule,
  renameModule,
  startProject,
  buildProject
} = require('./commands');
const config = require('./config');

const program = new Command();

program
  // 版本信息
  .version(config.thisVersion, '-v, --version')
  .name(config.mainCommand)
  // 用法说明
  .usage('[command] [options] [params]')

// 命令-创建项目
program
  .command('create')
  .description(`init a new ${config.mainName} project.`)
  // 创建模块时不自动安装依赖
  .option('-ni, --notInstall', 'DO NOT install packages automaticly when create a new SyncMe project.')
  .action(createProject);

// 命令-启动项目
program
  .command('start')
  .description(`start a ${config.mainName} project from current directory.`)
  .action(startProject);

// 命令-构建项目
program
  .command('build')
  .description('bundle the current project for product mode.')
  .action(buildProject);

// 命令-模块相关操作
program
  .command('m')
  .description('modify a module below src/pages.')
  // 创建模块
  .option('-c, --create <name>', 'create a new module below src/pages.')
  // 删除模块
  .option('-d, --delete <name>', 'delete a new module below src/pages.')
  // 重命名模块
  .option('-r, --rename <names...>', 'rename an existed module below src/pages.')
  .action(options => {
    if (options.create !== undefined) return createModule(options.create);
    if (options.delete !== undefined) return deleteModule(options.delete);
    if (options.rename !== undefined) return renameModule(options.rename);
  });

program.parseAsync(process.argv);
