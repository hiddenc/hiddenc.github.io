/**
 * Created by Administrator on 2016/8/6.
 */
//事件绑定函数，兼容浏览器差异
/* 我的

 function addEvent(element, event, listener) {
 if (element.addEventListener) {
 element.addEventListener(event, listener, false);
 }
 else if (element.attachEvent) {
 element.attachEvent("on" + event, listener);
 }
 else {
 element["on" + event] = listener;
 }
 }
 //getById事件
 var $ = function(id){
 return document.getElementById(id);
 };

 var content = document.getElementsByTagName('input')[0].value;
 var createSpan = document.createElement('span');
 var text = document.createTextNode('content');
 var insertSpan = creatSpan.appendChild(text);

 var container = $('container');

 container.innerHTML = insertSpan;*/



/**
 * Created by five-african
 */
var $ = function (el) { return document.querySelector(el);};
var data = [];

function render() {
    $('#result').innerHTML =
        data.map(function(d) { return "<div>" + d + "</div>";}).join('');
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
