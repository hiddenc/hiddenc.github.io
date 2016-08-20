/**
 * Created by Administrator on 2016/8/6.
 */
var $ = function (el) { return document.querySelector(el);};
var data = [];
function randomList(n){
    data = [];
    var n = 50;
    for(var i = 0; i < n; i++){
        data.push(Math.floor(Math.random()*90) + 10);
    }
    render();
}
function sort(){
    var data2 = [];
    for(var i = 1;i<data.lenght;i++){
        data2.push(data[i] <= data[i-1] ? data[i] : data[i-1]);
    }
    data = data2;
    console.log(data);
    render();
}
function render() {
    var widthValue = 1/data.length*100*2/3;
    if(widthValue > 10) widthValue = 5;
    var interval = widthValue/4;
    $('#result').innerHTML =
        data.map(function(d) { return "<div style=height:" + d*3 + "px;width:" + widthValue + "%;margin-left:" + interval + "%;margin-right:" + interval + "%>"  + "</div>";}).join('');
}

function deal(func,succ){
    var args = [].slice.call(arguments,2);//onclick事件所带参数，从第三位开始
    return function(e) {
        try {
            var arg = args.map(function(item){
                return typeof item === "function" ? item(e) : item;
            });
            var result = func.apply(data,arg);
            if (succ != null){
                succ(result);
            }
        } catch (ex){
            alert(ex.message);
        }
        render();
    };
}

function getInputValue(){
    var numStr = $('input').value;
    if(!validate(numStr)) throw new Error('input error');
    return parseInt(numStr);
}

function getClickIndex(e){
    var node = e.target;
    return [].indexOf.call(node.parentNode.children,node);
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