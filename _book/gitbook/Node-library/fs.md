# fs模块

## 介绍：

Node.js 文件系统（fs 模块）模块中的方法均有异步和同步版本，例如读取文件内容的函数有异步的 fs.readFile() 和同步的 fs.readFileSync()。异步的方法函数最后一个参数为回调函数，回调函数的第一个参数包含了错误信息(error)。最好使用异步方法，比起同步，异步方法性能更高，速度更快，而且没有阻塞(重点)。对于流量较大的服务器，最好还是采用异步操作，同步操作时，只有前一个操作结束，才会开始后一个操作，如果某个操作特别耗时（常常发生在读写数据时），会导致整个程序停顿.


## 常用方法

<table>
    <thead>
        <tr class="header">
            <th>操作</th>
            <th>异步方法</th>
            <th>同步方法</th>
        </tr>
    </thead>
    <tbody>
        <tr class="odd">
            <td>打开文件</td>
            <td>fs.open(path, flags[, mode], callback)</td>
            <td>fs.openSync(path, flags[, mode])</td>
        </tr>
        <tr class="even">
            <td>文件信息</td>
            <td>fs.stat(path[, options], callback)</td>
            <td>fs.statSync(path[, options])</td>
        </tr>
        <tr class="odd">
            <td>新建文件</td>
            <td>fs.appendFile(path, data[, options], callback)</td>
            <td>fs.appendFileSync(path, data[, options])</td>
        </tr>
        <tr class="even">
            <td>写入文件</td>
            <td>fs.writeFile(file, data[, options], callback)</td>
            <td>fs.writeFileSync(file, data[, options])</td>
        </tr>
        <tr class="odd">
            <td>读取文件</td>
            <td>fs.read()</td>
            <td></td>
        </tr>
        <tr class="even">
            <td>读取文件</td>
            <td>fs.readFile(path[, options], callback)</td>
            <td>fs.readFileSync(path[, options])</td>
        </tr>
        <tr class="odd">
            <td>重命名文件</td>
            <td>fs.rename(oldPath, newPath, callback)</td>
            <td>fs.renameSync(oldPath, newPath)</td>
        </tr>
        <tr class="even">
            <td>关闭文件</td>
            <td>fs.close(fd, callback)</td>
            <td>fs.closeSync(fd)</td>
        </tr>
        <tr class="odd">
            <td>截取文件</td>
            <td>fs.ftruncate(fd[, len], callback)</td>
            <td>fs.ftruncateSync(fd[, len])</td>
        </tr>
        <tr class="even">
            <td>删除文件</td>
            <td>fs.unlink(path, callback)</td>
            <td>fs.unlinkSync(path)</td>
        </tr>
        <tr class="odd">
            <td>文件存在</td>
            <td>fs.stat() / fs.access()</td>
            <td>fs.existsSync(path)</td>
        </tr>
        <tr class="even">
            <td>监听文件</td>
            <td>fs.watchFile(filename[, options], listener)</td>
            <td></td>
        </tr>
        <tr class="odd">
            <td>停止监听</td>
            <td>fs.unwatchFile(filename[, listener])</td>
            <td></td>
        </tr>
        <tr class="even">
            <td>打开大文件</td>
            <td>fs.createReadStream(path[, options])</td>
            <td></td>
        </tr>
        <tr class="odd">
            <td>写入大文件</td>
            <td>fs.createWriteStream(path[, options])</td>
            <td></td>
        </tr>
        <tr class="even">
            <td>创建目录</td>
            <td>fs.mkdir(path[, options], callback)</td>
            <td>fs.mkdirSync(path[, options])</td>
        </tr>
        <tr class="odd">
            <td>读取目录</td>
            <td>fs.readdir(path[, options], callback)</td>
            <td>fs.readdirSync(path[, options])</td>
        </tr>
        <tr class="even">
            <td>删除目录</td>
            <td>fs.rmdir(path, callback)</td>
            <td>fs.rmdirSync(path)</td>
        </tr>
    </tbody>
</table>