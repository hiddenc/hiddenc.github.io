/**
 * Created by Administrator on 2017/2/17.
 */
var $ = function(e){return document.querySelector(e);};
var divList = [],
    timer = null;
    root = $('#root'),
    button = $('button'),
    select = $('select');
var reset = function(){
    divList = [];
    clearInterval(timer);
    var divs = document.getElementsByTagName('div');
    for (var i =0;i<divs.length;i++){
        divs[i].style.backgroundColor = 'white';
    }
};

button.onclick = function(){
    switch(select.value) {
        case 'pro':
            proTraverse();
            break;
        case 'in':
            inTraverse();
            break;
        case 'pre':
        default :
            preTraverse();
            break;
    }

};

var preTraverse = function(){
    reset();
    preOrder(root);
    changeColor();
};

var proTraverse = function(){
    reset();
    proOrder(root);
    changeColor();
};

var inTraverse = function(){
    reset();
    inOrder(root);
    changeColor();
};

var preOrder = function(node){
    if(node!=null){
        divList.push(node);
        preOrder(node.firstElementChild);
        preOrder(node.lastElementChild);
    }
};

var proOrder = function(node){
    if(node!=null){
        divList.unshift(node);
        proOrder(node.lastElementChild);
        proOrder(node.firstElementChild);
    }
};

var inOrder = function(node){
    if(node!=null){
        inOrder(node.firstElementChild);
        divList.push(node);
        inOrder(node.lastElementChild);
    }
};

var changeColor = function(){
    var i = 0;
    divList[i].style.backgroundColor = 'red';
    timer = setInterval(function(){
        i++;
        if(i < divList.length){
            divList[i].style.backgroundColor = 'red';
            divList[i-1].style.backgroundColor = 'white';
        } else{
            clearInterval(timer);
            divList[divList.length-1].style.backgroundColor = 'white';
        }
    },500)
};