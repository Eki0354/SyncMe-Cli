#!/usr/bin/env node

const { Command } = require('commander');
const {
  createProject,
  createModule,
  deleteModule,
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

program
  .command('create')
  .description(`init a new ${config.mainName} project.`)
  .action(createProject);

program
  .command('start')
  .description(`start a ${config.mainName} project from current directory.`)
  .action(startProject);

program
  .command('build')
  .description('bundle the current project for product mode.')
  .action(buildProject);

program
  .command('m')
  .description('modify a module below src/pages.')
  .option('-c, --create <name>', 'create a new module below src/pages.')
  .option('-d, --delete <name>', 'delete a new module below src/pages.')
  .action(options => {
    console.log(options.create)
    if (options.create !== undefined) return createModule(options.create);
    if (options.delete !== undefined) return deleteModule(options.delete);
  });

program.parseAsync(process.argv);
