#### 快速上手

+ 全局安装脚手架

```
npm install e-syncme-cli -g
```

+ 新建项目

    - 新建并自动安装依赖项

    ```
    syncme create
    ```

    - 选项 -ni | 添加此选项后，不会自动安装依赖项

    ```
    syncme create -ni
    ```

或者参考[手动搭建SyncMe框架](#手动搭建SyncMe框架项目)

+ 运行项目

```
syncme start
<!-- 或者在脚手架项目中 -->
npm run start
```

+ 构建项目生产版本

```
syncme build
<!-- 或者在脚手架项目中 -->
npm run build
```



##### 手动搭建SyncMe框架项目

+ 安装依赖包

```
npm install e-syncme -save--dev
```

+ 运行项目

```
gulp --watch
```

+ 打包项目生产版本

```
gulp
```

**建议在项目package.json中添加命令，使用npm run xxx运行**



##### 项目内命令

+ 创建模块

```
syncme m -c [name]
```

会以脚手架模板文件为基础，在项目根目录/src/pages下创建一个新的模块。
若键入名称为background，则按照background模块创建。
若指定位置已存在模块同名文件夹，则命令无效。

+ 删除模块

```
syncme m -d [name]
```

在项目根目录/src/pages下删除匹配name的模块文件夹。
若文件夹不存在，则会抛出错误。

+ 重命名模块

```
syncme m -r [oldname] [newname]
```

模块名称仅可包含英文字母、数字和下划线，并且以英文字母开头。
