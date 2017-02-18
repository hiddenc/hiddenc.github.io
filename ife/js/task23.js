/**
 * Created by Administrator on 2017/2/17.
 */
var $ = function(e){return document.querySelector(e);};
var divList = [],
    timer = null,
    root = $('#root'),
    button = $('button'),
    select = $('select');

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
    if(node!=null){
        if(node.children.length != 0){
            divList.push(node);
            for(var i =0;i<node.children.length;i++){
                inOrder(node.children[i]);
            }
        }else{
            divList.push(node);
        }
    }
};

var proOrder = function(node){
    if(node!=null){
        divList.unshift(node);
        proOrder(node.lastElementChild);
        proOrder(node.firstElementChild);
    }
};

var changeColor = function(){
    var i = 0;
    divList[i].style.backgroundColor = 'red';
    timer = setInterval(function(){
        i++;
        if(i < divList.length){
            divList[i].style.backgroundColor = 'red';
            divList[i-1].removeAttribute('style');
        } else{
            clearInterval(timer);
            divList[divList.length-1].removeAttribute('style');
        }
    },200)
};