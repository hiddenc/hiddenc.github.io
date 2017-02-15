/**
 * Created by Administrator on 2016/8/6.
 */
/*var $ = function (el) {
    return document.querySelector(el);
};
var data = [];
function randomList(n) {
    data = [];
    var n = 50;
    for (var i = 0; i < n; i++) {
        data.push(Math.floor(Math.random() * 90) + 10);
    }
    render();
}
function sort() {
    console.log(data);
    for (var j = 0; j < data.length; j++) {
        for (var i = 0; i < (data.length - 1); i++) {
            if (data[i] > data[i + 1]) {
                var value = data[i];
                data[i] = data[i + 1];
                data[i + 1] = value;

            }
        }
    }
    render();
}

function clear(){
    data = [];
    render();
}

function render() {
    var widthValue = 1 / data.length * 100 * 2 / 3;
    if (widthValue > 10) widthValue = 5;
    var interval = widthValue / 4;
    $('#result').innerHTML =
        data.map(function (d) {
            return "<div style=height:" + d * 3 + "px;width:" + widthValue + "%;margin-left:" + interval + "%;margin-right:" + interval + "%>" + "</div>";
        }).join('');
}

function deal(func, succ) {
    var args = [].slice.call(arguments, 2);//onclick事件所带参数，从第三位开始
    return function (e) {
        try {
            var arg = args.map(function (item) {
                return typeof item === "function" ? item(e) : item;
            });
            var result = func.apply(data, arg);
            if (succ != null) {
                succ(result);
            }
        } catch (ex) {
            alert(ex.message);
        }
        render();
    };
}

function getInputValue() {
    var numStr = $('input').value;
    if (!validate(numStr)) throw new Error('input error');
    return parseInt(numStr);
}

function getClickIndex(e) {
    var node = e.target;
    return [].indexOf.call(node.parentNode.children, node);
}

function validate(str) {
    return /^\d+$/.test(str);
}

$('#left-in').onclick = deal([].unshift, null, getInputValue);
$('#right-in').onclick = deal([].push, null, getInputValue);
$('#left-out').onclick = deal([].shift, window.alert);
$('#right-out').onclick = deal([].pop, window.alert);
$('#result').onclick = deal([].splice, null, getClickIndex, 1);
$('#random').onclick = randomList;
$('#sort').onclick = sort;
$('#clear').onclick = clear;
*/
/* copy from five-african */
$ = function (el) { return document.querySelector(el); };
$$ = function (el) { return document.querySelectorAll(el); };
var data = [];
var sizeFactor = 5; // 大，大，大  柱子高度倍数
var aniQue = delay(function(){}, 0); // = animationQueue
var inAnimation = false; // true: 不要动，举起手来，离开鼠标和键盘
var renderInterval = 10; // 设成10才是真快感

/!* delay还是queue？ *!/
function delay(fn, t) {
    var queue = [], self, timer; // 声明变量
    function schedule(fn, t) { // 函数声明
        timer = setTimeout(function() { // 函数声明
            timer = null;
            fn();
            if (queue.length) {
                var next = queue.shift();
                schedule(next.fn, next.t);
            }
        }, t);
    }
    self = {
        delay: function(fn, t) {
            if (queue.length || timer) {
                queue.push({fn: fn, t: t});
            } else {
                schedule(fn, t);
            }
            return self;
        },
        cancel: function() {
            clearTimeout(timer);
            queue = [];
        }
    }
    return self.delay(fn, t);
}

/!* 为什么你怎么快 *!/
function sort_partition(left, right) {
    var p = data[left];
    renderSortRange(left, right, false);
    while (left < right) {
        renderSort(right);
        while (left < right && data[right] >= p) {
            right--;
            renderSort(right);
        }
        data[left] = data[right];
        renderSort(left, data[left]);
        while (left < right && data[left] <= p) {
            left++;
            renderSort(left);
        }
        data[right] = data[left];
        renderSort(right, data[right]);
    }
    data[left] = p;
    renderSort(left, data[left]);
    renderSortRange(left, right, true);
    return left;
}

/!* 为什么你怎么快 *!/
function sort(left, right) {
    if (left >= right) return;

    var idx = sort_partition(left, right);
    if (left < idx - 1) {
        sort(left, idx - 1);
    }
    if (idx < right) {
        sort(idx + 1, right);
    }
}

/!* 动起来，哈压库哈压库 *!/
function renderSort(idx, value) {
    aniQue.delay(function() {
        $$('#result div')[idx].className = 'blue';
    }, 0);

    if (value != null) {
        aniQue.delay(function() {
            $$('#result div')[idx].style.height = value * sizeFactor + 'px';
            $$('#result div')[idx].title = value.toString();
        }, 0);
    }

    aniQue.delay(function() {
        $$('#result div')[idx].className = 'red';
    }, renderInterval);
}

/!* 就决定排你们了 *!/
function renderSortRange(start, end, cancel) {
    aniQue.delay(function() {
        for (var i = start; i <= end; i++) {
            $$('#result div')[i].className = cancel ? 'red' : 'green';
        }
    }, 0);
}

/!* 天赐神数 *!/
function randomForTest() {
    if (inAnimation) {
        alert('in animation');
        return;
    }
    data = [];
    for (var i = 0; i < 50; i++) {
        data.push(Math.floor(Math.random() * 91 + 10));
    }
    render();
}

/!* 我要看所有的 *!/
function render() {
    $('#result').innerHTML =
        data.map(function(d) { return "<div class='red' style='height:" + d * sizeFactor + "px' title='" + d + "'></div>"; })
            .join('');
}

/!* 帮我绑定好回调。sort和random要插进去就太丑了，暂时舍弃 *!/
function deal(func, succ) {
    var args = [].slice.call(arguments, 2);
    return function(e) {
        if (inAnimation) {
            alert('in animation');
            return;
        }

        try {
            var arg = args.map(function(item) {
                return typeof item === "function" ? item(e) : item;
            });
            var result = func.apply(data, arg);

            if (succ != null) {
                succ(result);
            }
        } catch (ex) {
            if (ex.message != '')
                alert(ex.message);
        }
        render();
    };
}

/!* 你输了什么？ *!/
function getInputValue() {
    var numStr = $('input').value;
    if (!validateStr(numStr)) throw new Error('input error');
    if (data.length > 59) throw new Error('no room');
    var val = parseInt(numStr);
    if (val < 10 || val > 100) throw new Error('out of range');
    return val;
}

/!* 你单击了什么？ *!/
function getClickIndex(e) {
    var node = e.target;
    if (node.id == "result") throw new Error(''); // 中断你们，破坏流程，毁灭世界
    return [].indexOf.call(node.parentNode.children, node);
}

/!* 不要太勤奋，lazy *!/
function getLastIndex() {
    return data.length - 1;
}

/!* 过滤掉万恶的QA和小白 *!/
function validateStr(str) {
    return /^\d+$/.test(str);
}

/!* 全部都绑起来 *!/
$('#left-in').onclick = deal([].unshift, null, getInputValue);
$('#right-in').onclick = deal([].push, null, getInputValue);
$('#left-out').onclick = deal([].shift, window.alert);
$('#right-out').onclick = deal([].pop, window.alert);
$('#result').onclick = deal([].splice, null, getClickIndex, 1);
$('#sort').onclick = function(){
    if (inAnimation) {
        alert('in animation');
        return;
    }
    inAnimation = true;
    renderInterval = parseInt($('#renderInterval').value);
    renderInterval = renderInterval || 150;
    sort(0, getLastIndex());
    aniQue.delay(function(){
        inAnimation = false;
    }, 0);
};
$('#random').onclick = randomForTest;