/**
* author:ls
* email:liusaint@gmail.com
* date:2016年4月9日
*/

function SD() {
    this.sdArr = [];//生成的数独数组	
    this.errorArr = [];//错误的格子。
    this.blankNum = 30;//空白格子数量 
    this.backupSdArr = [];//数独数组备份。
    this.blankArr = [];//空白格子的坐标
}

SD.prototype = {
    constructor: SD,
    init: function (blankNum) {
        this.createDoms();
        //开始时间
        var beginTime = new Date().getTime();
        this.createSdArr();
        console.log("数独生成完毕，耗时：" + ((new Date().getTime()) - beginTime) / 1000 + "秒！");
        //获取当前空白盒子数量
        this.blankNum = this.setLevel() || blankNum || this.blankNum;
        this.drawCells();
        this.createBlank(this.blankNum);
        this.createBlankCells();
    },
    //生成九宫格。
    createDoms: function () {
        var html = '<ul class="sd clearfix">';
        //通过数组的join方法查人当前字符串所以如果是9个需要+1；
        String.prototype.times = String.prototype.times || function (n) { return (new Array(n + 1)).join(this); };
        html = html + ('<li class="sdli">' + '<span class="sdspan"></span>'.times(9) + '</li>').times(9) + '</ul>';
        $("#cc").prepend(html);
        // for (var k = 0; k < 9; k++) {
        //     $(".sdli:eq(" + k + ") .sdspan").eq(2).addClass('br');
        //     $(".sdli:eq(" + k + ") .sdspan").eq(5).addClass('br');
        //     $(".sdli:eq(" + k + ") .sdspan").eq(3).addClass('bl');
        //     $(".sdli:eq(" + k + ") .sdspan").eq(6).addClass('bl');
        // }

        // $(".sdli:eq(2) .sdspan,.sdli:eq(5) .sdspan").addClass('bb');
        // $(".sdli:eq(3) .sdspan,.sdli:eq(6) .sdspan").addClass('bt');
    },
    //为对角线上的三个三宫格随机生成。
    setThird: function (i, j) {
        var numArr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        //把numArr重新排序
        var sortedNumArr = numArr.sort(function () { return Math.random() - 0.5 > 0 ? -1 : 1 });
        //获取当前的位置如（2,2）
        var cenNum = parseInt(i + '' + j);
        //获取当前九宫格的固定一个的index，11,21,31,12,22,32,13,23,33
        var thIndexArr = [cenNum - 11, cenNum - 1, cenNum + 9, cenNum - 10, cenNum, cenNum + 10, cenNum - 9, cenNum + 1, cenNum + 11];
        for (var a = 0; a < 9; a++) {
            this.sdArr[thIndexArr[a]] = sortedNumArr[a];
        }
    },
    //获取所在列的值。
    getYArr: function (i, sdArr) {
        var arr = [];
        for (var a = 1; a <= 9; a++) {
            if (sdArr[parseInt(i + '' + a)]) {
                arr.push(sdArr[parseInt(i + '' + a)])
            }
        }
        return arr;
    },
    //获取所在行的值。
    getXArr: function (j, sdArr) {
        var arr = [];
        for (var a = 1; a <= 9; a++) {
            if (this.sdArr[parseInt(a + "" + j)]) {
                arr.push(sdArr[parseInt(a + "" + j)])
            }
        }
        return arr;
    },
    //获取所在三宫格的中间位坐标。
    getTh: function (i, j) {
        // var cenArr = [22, 52, 82, 25, 55, 85, 28, 58, 88];
        // var index = (Math.ceil(j / 3) - 1) * 3 + Math.ceil(i / 3) - 1;
        // var cenNum = cenArr[index];
        // return cenNum;
        //可以获取当前数值都是由2.5.8组成，可以通过除以3向上取整-1获取
        return parseInt((Math.ceil(i / 3) * 3 - 1) + '' + (Math.ceil(j / 3) * 3 - 1));
    },
    //获取所在三宫格的值。
    getThArr: function (i, j, sdArr) {
        var arr = [];
        //获取所在三宫格的中间位坐标。
        var cenNum = this.getTh(i, j);
        //获取所在三宫格的所有坐标。
        var thIndexArr = [cenNum - 11, cenNum - 1, cenNum + 9, cenNum - 10, cenNum, cenNum + 10, cenNum - 9, cenNum + 1, cenNum + 11];
        //获取已经有数值的三宫格值
        for (var a = 0; a < 9; a++) {
            if (sdArr[thIndexArr[a]]) {
                arr.push(sdArr[thIndexArr[a]]);
            }
        }
        return arr;
    },
    //生成数独数组
    createSdArr: function () {
        var that = this;
        try {
            this.sdArr = [];
            this.setThird(2, 2);
            this.setThird(5, 5);
            this.setThird(8, 8);
            var allNum = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            outer:
            for (var i = 1; i <= 9; i++) {
                inner:
                for (var j = 1; j <= 9; j++) {
                    if (this.sdArr[parseInt(i + '' + j)]) {
                        continue inner;
                    }
                    //获取当前行使用的数值
                    var XArr = this.getXArr(j, this.sdArr);
                    //获取当前列已使用的数值
                    var YArr = this.getYArr(i, this.sdArr);
                    //获取当前三宫格已使用的数值
                    var thArr = this.getThArr(i, j, this.sdArr);
                    //数组合并去重
                    var arr = Array.from(new Set(XArr.concat(YArr, thArr)))
                    //数组合并去重
                    // var arr = getConnect(getConnect(XArr, YArr), thArr);
                    //查找两个数组的非交集
                    var ableArr = arrMinus(allNum, arr);
                    //当非交集不存在的时候，但有坐标没有赋值，所以需要重新去执行
                    if (ableArr.length == 0) {
                        this.createSdArr();
                        return;
                        break outer;
                    }
                    var item;
                    //如果生成的重复了就重新生成。
                    do {
                        item = ableArr[getRandom(ableArr.length) - 1];
                    } while (arr.includes(item));
                    //给当前的坐标赋值
                    this.sdArr[parseInt(i + '' + j)] = item;
                }
            }
            this.backupSdArr = this.sdArr.slice();
        } catch (e) {
            //如果因为超出浏览器的栈限制出错，就重新运行。
            that.createSdArr();
        }
    },
    setLevel: function () {
        //用户输入难度。
        var num = prompt("请输入空白格数（5-50）");
        if (!isNaN(num)) {
            num = parseInt(num);
            num = num < 5 ? 5 : num;
            num = num > 50 ? 50 : num;
        } else {
            num = false;
        }
        return num;
    },
    drawCells: function () {
        //将生成的数组填写到九宫格
        for (var j = 1; j <= 9; j++) {
            for (var i = 1; i <= 9; i++) {
                $(".sdli").eq(j - 1).find(".sdspan").eq(i - 1).html(this.sdArr[parseInt(i + '' + j)]);
            }
        }
    },
    createBlank: function (num) {
        //生成指定数量的空白格子的坐标。
        var blankArr = [];
        var numArr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        var item;
        for (var a = 0; a < num; a++) {
            do {
                item = parseInt(numArr[getRandom(9) - 1] + '' + numArr[getRandom(9) - 1]);
            } while (blankArr.includes(item));
            blankArr.push(item);
        }
        this.blankArr = blankArr;
    },
    //在创建好的数独中去除一部分格子的值，给用户自己填写。把对应格子变成可编辑,并添加事件。
    createBlankCells: function () {
        var blankArr = this.blankArr, len = this.blankArr.length, x, y, dom;
        for (var i = 0; i < len; i++) {
            x = parseInt(blankArr[i] / 10);
            y = blankArr[i] % 10;
            dom = $(".sdli").eq(y - 1).find(".sdspan").eq(x - 1);
            //contenteditable="true"实现编辑器,光标、输入法处理
            dom.attr('contenteditable', true).html('').addClass('blankCell');
            this.backupSdArr[blankArr[i]] = undefined;
        }
        $(".sdspan[contenteditable=true]").keyup(function (event) {
            var val = $(this).html();
            var reStr = /^[1-9]{1}$/;
            if (!reStr.test(val)) {
                $(this).html('');
            };
        });
    },
    //将用户输入的结果添加到数组中。
    getInputVals: function () {
        var blankArr = this.blankArr, len = this.blankArr.length, i, x, y, dom, theval;
        for (i = 0; i < len; i++) {
            x = parseInt(blankArr[i] / 10);
            y = blankArr[i] % 10;
            dom = $(".sdli").eq(y - 1).find(".sdspan").eq(x - 1);
            theval = parseInt(dom.html()) || undefined;
            this.backupSdArr[blankArr[i]] = theval;
        }
    },
    checkCell: function (i, j) {
        //检测一个格子中输入的值，在横竖宫里是否已存在。
        var index = parseInt(i + '' + j);
        var backupSdArr = this.backupSdArr;
        var XArr = this.getXArr(j, backupSdArr);
        var YArr = this.getYArr(i, backupSdArr);
        var thArr = this.getThArr(i, j, backupSdArr);
        var arr = Array.from(new Set(XArr.concat(YArr, thArr)))
        // var arr = getConnect(getConnect(XArr, YArr), thArr);
        var val = parseInt($(".sdli").eq(j - 1).find(".sdspan").eq(i - 1).html());
        if (arr.includes(val)) {
            this.errorArr.push(index);
        }
    },
    //检测是否全部空格都有输入。
    isAllInputed: function () {
        var blankArr = this.blankArr, len = this.blankArr.length, i, x, y, dom;
        for (i = 0; i < len; i++) {
            x = parseInt(blankArr[i] / 10);
            y = blankArr[i] % 10;
            dom = $(".sdli").eq(y - 1).find(".sdspan").eq(x - 1);
            if (dom.text() == '') {
                return false
            }
        }
        return true;
    },
    showErrors: function () {
        //把错误显示出来。
        var errorArr = this.errorArr, len = this.errorArr.length, x, y, dom;
        $(".bg_red").removeClass('bg_red');
        for (var i = 0; i < len; i++) {
            x = parseInt(errorArr[i] / 10);
            y = errorArr[i] % 10;
            dom = $(".sdli").eq(y - 1).find(".sdspan").eq(x - 1);
            dom.addClass('bg_red');
        }
    },
    checkRes: function () {
        //检测用户输入结果。检测前将输入加入数组。检测单个的时候将这一个的值缓存起来并从数组中删除，检测结束在赋值回去。
        var blankArr = this.blankArr, len = this.blankArr.length, x, y, dom, done, temp;
        //把输入的空格放入this.backupSdArr数组中
        this.getInputVals();
        this.errorArr = [];
        for (var i = 0; i < len; i++) {
            x = parseInt(blankArr[i] / 10);
            y = blankArr[i] % 10;
            temp = this.backupSdArr[blankArr[i]];
            this.backupSdArr[blankArr[i]] = undefined;
            this.checkCell(x, y);
            this.backupSdArr[blankArr[i]] = temp;
        }
        done = this.isAllInputed();
        if (this.errorArr.length == 0 && done) {
            alert('you win!');
            $(".bg_red").removeClass('bg_red');
        } else {
            if (!done) {
                alert("你没有完成游戏！");
            }
            this.showErrors();
        }
    },
    reset: function () {
        //重置程序。
        this.errorArr = [];
        $(".sdspan").removeClass('bg_red blankCell');
        var beginTime = new Date().getTime();
        this.createSdArr();
        console.log("数独生成完毕，耗时：" + ((new Date().getTime()) - beginTime) / 1000 + "秒！");
        this.blankNum = this.setLevel() || this.blankNum;
        $(".sdspan[contenteditable=true]").prop('contenteditable', false);
        this.drawCells();
        this.createBlank(this.blankNum);
        this.createBlankCells();
    },
    again: function () {
        //重玩本局
        this.errorArr = [];
        $(".sdspan").removeClass('bg_red blankCell');
        this.createBlankCells();
    },
}
//生成随机正整数
function getRandom(n) {
    return Math.floor(Math.random() * n + 1)
}

//两个简单数组的并集。
function getConnect(arr1, arr2) {
    var i, len = arr1.length, resArr = arr2.concat();
    for (i = 0; i < len; i++) {
        let val = arr1[i];
        if (!arr2.includes(val)) {
            resArr.push(val);
        }
    }
    return resArr;
}

//两个简单数组差集，arr1为大数组
function arrMinus(arr1, arr2) {
    var resArr = [], len = arr1.length;
    for (var i = 0; i < len; i++) {
        if ($.inArray(arr1[i], arr2) < 0) {
            resArr.push(arr1[i]);
        }
    }
    return resArr;
}




