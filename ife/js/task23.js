/**
 * Created by Administrator on 2017/2/17.
 */
    "use strict";
var $ = function(e){return document.querySelector(e);};
var divList = [],
    timer = null,
    root = $('#root'),
    button = $('button'),
    select = $('select'),
    depthSearch = $('#depth-search'),
    inSearch = $('#in-search');

var reset = function(){
    divList = [];
    clearInterval(timer);
    var divs = document.getElementsByTagName('div');
    for (var i =0;i<divs.length;i++){
        divs[i].removeAttribute('style');
    }
};

button.onclick = function(){
    switch(select.value) {
        case 'depthFirst':
            depthFirst();
            break;
        case 'in':
            inTraverse();
            break;
        case 'pro':
        default :
            proTraverse();
            break;
    }
};

depthSearch.onclick = function(){
    var inputValue = $('input').value.trim().toLowerCase();
    if(inputValue != ""){
        reset();
        preOrder(root);
        changeColor(inputValue);
    }else{
        alert('请输入搜索关键词');
    }
};

inSearch.onclick = function(){
    var inputValue = $('input').value.trim().toLowerCase();
    if(inputValue != ""){
        reset();
        inOrder(root);
        changeColor(inputValue);
    }else{
        alert('请输入搜索关键词');
    }
};

var depthFirst = function(){
    reset();
    preOrder(root);
    changeColor();
};

var inTraverse = function(){
    reset();
    inOrder(root);
    changeColor();
};

var proTraverse = function(){
    reset();
    proOrder(root);
    changeColor();
};

var preOrder = function(node){
    if(node!=null){
        divList.push(node);
        if(node.children.length != 0){
            for(var i =0;i<node.children.length;i++){
                preOrder(node.children[i]);
            }
        }
    }
};

var inOrder = function(node){
    var temp = []; //临时组
    temp.push(node); //插入根node
    do
    {
        var current_node = temp.shift(); //当前处理node
        divList.push(current_node); //加入到正式组
        for(var i=0;i<current_node.children.length;i++){ //将当前node的所有子node加入到临时组中
            temp.push(current_node.children[i]);
        }
    }while(temp.length != 0); //临时组不为空时循环
};

var proOrder = function(node){
    if(node!=null){
        divList.unshift(node);
        proOrder(node.lastElementChild);
        proOrder(node.firstElementChild);
    }
};

var changeColor = function(value){
    var i = 0;
    timer = setInterval(function(){
        if(i < divList.length){
            divList[i].style.backgroundColor = 'red';
            if(i>0){divList[i-1].removeAttribute('style')}
            if(value != null && divList[i].firstChild.textContent.toLowerCase().search(value) != -1){//不区分大小写
                clearInterval(timer);
                return;
            }
            i++;
        }else{
            clearInterval(timer);
            divList[divList.length-1].removeAttribute('style');
            if(value != null && value != ""){
                alert('未找到关键词：'+value);
            }
        }
    },400);
};