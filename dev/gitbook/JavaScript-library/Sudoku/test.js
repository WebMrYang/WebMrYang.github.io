//坐标位置组成，左横轴右竖轴
function SD() {
    this.sdArr = [];//存放计算的坐标值
    this.backupSdArr = [];//存放坐标值
    this.blankNum = 5;//空白格数量
    this.blankArr = [];//空白格子的坐标
    this.errorArr = [];//错误的格子。
}
SD.prototype = {
    constructor: SD,
    init: function () {
        this.createDom();
        console.time('数独生成完毕，耗时')
        this.createSdArr();
        console.timeEnd('数独生成完毕，耗时');
        this.blankNum = this.setBlankNum() || this.blankNum;
        this.drawCells();
        this.createBlank();
        this.createBlankCells();
    },
    createDom: function () {
        let html = '<ul class="sd clearfix">';
        String.prototype.copeTimes = function (n) { return (new Array(n + 1)).join(this) };
        html += ('<li class="sdLi">' + '<span class="sdSpan"></span>'.copeTimes(9) + "</li>").copeTimes(9) + '</ul>'

        $('body').prepend(html)
    },
    //获取中间坐标
    getMidCoord(i, j) {
        return Number((Math.ceil(i / 3) * 3 - 1) + '' + (Math.ceil(j / 3) * 3 - 1))
    },
    //获取小九宫格坐标
    getSmallSauareCoord(i, j) {
        let coord = this.getMidCoord(i, j);
        let arr = [-11, -10, -9, -1, 0, +1, 9, 10, 11];
        let smallSauareCoord = [];
        arr.forEach(item => {
            smallSauareCoord.push(coord + item)
        })
        return smallSauareCoord;
    },
    //给当前坐标的小9宫格赋值
    setValue(i, j) {
        let value = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() > 0.5 ? -1 : 1)
        let smallSauareCoord = this.getSmallSauareCoord(i, j);
        smallSauareCoord.forEach((item, index) => {
            this.sdArr[item] = value[index]
        })
    },
    //获取横轴的已有值
    getXArr(j) {
        let arr = [];
        let sdArr = this.sdArr;
        for (var a = 1; a <= 9; a++) {
            let coord = Number(a + '' + j)
            if (sdArr[coord]) {
                arr.push(sdArr[coord])
            }
        }
        return arr;
    },
    //获取纵轴的已有值
    getYArr(i) {
        let arr = [];
        let sdArr = this.sdArr;
        for (var a = 1; a <= 9; a++) {
            let coord = Number(i + '' + a)
            if (sdArr[coord]) {
                arr.push(sdArr[coord])
            }
        }
        return arr;
    },
    //获取当前坐标下九宫格的已赋的值
    getSmallSauareUsed(i, j) {
        let arr = []
        let sdArr = this.sdArr;
        let smallSauareCoord = this.getSmallSauareCoord(i, j);
        smallSauareCoord.forEach(item => {
            if (sdArr[item]) {
                arr.push(sdArr[item])
            }
        })
        return arr;
    },
    //给所有坐标赋值
    createSdArr: function () {
        try {
            this.sdArr = [];
            this.setValue(2, 2);
            this.setValue(5, 5);
            this.setValue(8, 8);
            var value = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            outer:
            for (let i = 1; i <= 9; i++) {
                inner:
                for (let j = 1; j <= 9; j++) {
                    if (this.sdArr[i + '' + j]) {
                        continue  inner;//跳出到哪里
                    }
                    //获取横坐标的已有数据
                    let XArr = this.getXArr(j);
                    //获取纵坐标的已有数据
                    let YArr = this.getYArr(i);
                    //获取当前九宫格已使用的数值
                    let smallSauareUsed = this.getSmallSauareUsed(i, j);
                    //数组合并去重
                    var arr = Array.from(new Set(XArr.concat(YArr, smallSauareUsed)))
                    //查找两个数组的非交集
                    var ableArr = arrMinus(value, arr);
                    //存在坐标没值，但是又没有非交集，所有错误，重新执行
                    if (!ableArr.length) {
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
        } catch (error) {
            //如果因为超出浏览器的栈限制出错，就重新运行。
            this.createSdArr();
        }
    },
    //设置空格数量
    setBlankNum() {
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
    //给九宫格赋值
    drawCells() {
        //this.backupSdArr
        for (let i = 1; i <= 9; i++) {
            for (let j = 1; j <= 9; j++) {
                $('.sdLi').eq(j - 1).find('.sdSpan').eq(i - 1).html(this.backupSdArr[(i + '' + j)])
            }
        }
    },
    //创建九宫格空白的位置
    createBlank() {
        //this.blankNum
        let blankArr = [];
        do {
            let coord = getRandom(9) + "" + getRandom(9);
            if (!blankArr.includes(coord)) {
                blankArr.push(coord)
            }
        } while (blankArr.length < this.blankNum)
        this.blankArr = blankArr;
    },
    //把空白坐标下的数值清除掉
    createBlankCells() {
        let blankArr = this.blankArr;
        blankArr.forEach(item => {
            let i = Math.floor(item / 10);
            let j = item % 10;
            let dom = $('.sdLi').eq(j - 1).find('.sdSpan').eq(i - 1);
            //contenteditable="true"实现编辑器,光标、输入法处理
            dom.attr('contenteditable', true).html('').addClass('blankCell');
            this.backupSdArr[item] = undefined;
        })
        $(".sdSpan[contenteditable=true]").keyup(function (event) {
            var val = $(this).html();
            var reStr = /^[1-9]{1}$/;
            if (!reStr.test(val)) {
                $(this).html('');
            };
        });
    },
    //把空白的input的值赋给backupSdArr
    setInputVals() {
        let blankArr = this.blankArr;
        blankArr.forEach(item => {
            let i = Math.floor(item / 10);
            let j = item % 10;
            let html = $('.sdLi').eq(j - 1).find('.sdSpan').eq(i - 1).html();
            this.backupSdArr[item] = Number(html)
        });
    },
    getErrorCell(item, val) {
        let i = Math.floor(item / 10);
        let j = item % 10;
        //获取横坐标的已有数据
        let XArr = this.getXArr(j);
        //获取纵坐标的已有数据
        let YArr = this.getYArr(i);
        //获取当前九宫格已使用的数值
        let smallSauareUsed = this.getSmallSauareUsed(i, j);
        //数组合并去重
        var arr = Array.from(new Set(XArr.concat(YArr, smallSauareUsed)))
        console.log(arr, val)
        if (arr.includes(val)) {
            this.errorArr.push(item)
        }
    },
    //展示错误空格
    showErrors() {
        let errorArr = this.errorArr;
        $(".bg_red").removeClass('bg_red');
        errorArr.forEach(item => {
            let i = Math.floor(item / 10);
            let j = item % 10;
            let dome = $('.sdLi').eq(j - 1).find('.sdSpan').eq(i - 1);
            dome.addClass('bg_red')
        });
    },
    //点击完成后验证
    checkRes() {
        let blankArr = this.blankArr, done = true;
        this.setInputVals();
        blankArr.forEach(item => {
            let val = this.backupSdArr[item];
            if (!val) done = false;
            this.backupSdArr[item] = '';
            this.getErrorCell(item, val)
            this.backupSdArr[item] = val;
        });
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
    //重置
    reset() {
        $(".sdSpan").removeClass('bg_red blankCell');
        $(".sdSpan[contenteditable=true]").prop('contenteditable', false);
        console.time('数独生成完毕，耗时')
        this.createSdArr();
        console.timeEnd('数独生成完毕，耗时');
        this.blankNum = this.setBlankNum() || this.blankNum;
        this.drawCells();
        this.createBlank();
        this.createBlankCells();
    },
    //重玩本官
    again: function () {
        //重玩本局
        this.errorArr = [];
        $(".sdspan").removeClass('bg_red blankCell');
        this.createBlankCells();
    },
}


// 生成随机正整数
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