#NPM 


## 介绍
npm是随同nodejs 一起安装的包管理工具，能解决nodejs代码部署上的很多问题，常见的使用场景有一下几种：
1. 允许用户从npm服务器下载别人编写的第三方包到本地使用（下载包）
2. 允许用户从npm服务器下载并安装别人编写的命令行程序到本地使用（下载命令行程序）
3. 允许用户将自己编写的包或者命令行程序上传到npm服务上供别人使用（上传）




## 命令

1. `npm -v` 查看当前版本（也可以测试是否安装成功）

2. `npm init -y`   y 的含义：yes的意思，在init的时候省去了敲回车的步骤，生成的默认的package.json

3. `npm i`  i是install 的缩写，下载packjson中需要的所有包

4. `npm install（i）` xxx@版本号  安装xxx 包，当有@版本号 默认下载固定版本

5. `npm install xxx -g`  全局安装 xxx包

6. `npm install -S`   下载生产依赖包 -S就是--save的简写 会存放在 package.json 的 devDependencies（里面的插件只用于开发环境，不用于生产环境）

7. `npm install -D`  下载开发依赖包 -D就是--save-dev 会存放在 package.json 的 dependencies （需要发布到生产环境的）

8. `npm view xxx vesion`  查看xxx包的版本号

9. `npm uninstall xxx` 或者 `npm remove xxx`  卸载 xxx 包

10. `npm update xxx`   更新xxx 包

11. `npm info xxx` 查看xxx 包的 详情

12. `npm list`  查看项目安装了那些包

13. `npm root -g` 查看全局安装包的存放位置

14. `npm ls  xxx`  查看当前安装包的版本信息和安装目录

15. `npm run xxx` 运行packjson 中的script 的命令

16. `npm help `  查看帮助命令

17. `npm link`  执行 npm link 时候会将当前的文件软链接到node_modiles 上  在bin中配置 #!/usr/bin/env node  再在 packjson中bin 写上命令 指向当前文件 ，node为当前执行的环境

18. `npm i nrm -g ` 全局下载 nrm  , `nrm ls` 查看已安装镜像源  `npm test`测试那个速度快  `npm use xxx` 使用那个镜像


[更多查看](https://www.npmjs.cn)