/**
 * Created by Administrator on 2017/2/17.
 */
    "use strict";
var $ = function(e){return document.querySelector(e);};
var divList = [],
    divAll = [],
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

var addClassName = function(className,ele){
    if(ele.className){
        ele.className = ele.className + " " + className;
    }else{
        ele.className = className;
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

var nodeAll = function(node){
    if(node!=null){
        divAll.push(node);
        if(node.children.length != 0){
            for(var i =0;i<node.children.length;i++){
                nodeAll(node.children[i]);
            }
        }
    }
};

var modifyStyle = function(){
    for(var i =0;i<divAll.length;i++){

        if(divAll[i].childElementCount > 0){
            divAll[i].className = 'node-header';
        }
    }
};

var selectedNode;
var addEventClick = function(){
    for(var i=0;i<divAll.length;i++){
        divAll[i].addEventListener('mouseover',function(e){
            showBtn(this);//滑过显示添加和删除按键
            e.stopPropagation();//阻止冒泡
        });
        divAll[i].addEventListener('mouseout',function(e){
            hiddenBtn(this);//滑过显示添加和删除按键
            e.stopPropagation();//阻止冒泡
        });
        if(divAll[i].childElementCount > 0){//所有含有子项的节点
            var node = document.createElement("p");
            divAll[i].insertBefore(node,divAll[i].childNodes[0]);
            divAll[i].addEventListener('click',function(e){
                chosed(this);//进行选中状态，返回selectedNode值
                e.stopPropagation();//阻止冒泡
            });
        }else{
            divAll[i].addEventListener('click',function(e){
                e.stopPropagation();//阻止冒泡
            });
        }
        addAction(divAll[i]);
    }
};

function stopPro(){
    var btns = document.querySelectorAll("button");
    for(var i= 0;i<btns.length;i++){
        btns[i].addEventListener('click',function(e){
            e.stopPropagation();
        });
    }
}

var chosed = function(e){
    //for(var i=0;i<divAll.length;i++){
    //    divAll[i].removeAttribute('style');
    //}
    if(e.getElementsByTagName('p')[0].className != 'unfold'){
        e.getElementsByTagName('p')[0].className = 'unfold';
        for(var i=1;i<e.childElementCount;i++){
            if(e.children[i].nodeName !=='P'){
                e.children[i].className = 'node-bottom-show';
            }
        }
    }else{
        e.getElementsByTagName('p')[0].removeAttribute('class');
        for(var i=1;i<e.childElementCount;i++){
            if(e.children[i].nodeName !=='P'){
                e.children[i].className = 'node-bottom-hidden';
            }
        }
    }
    selectedNode = e;
};

var showBtn = function(e){
    e.getElementsByTagName('button')[0].style.display = 'block';
    e.getElementsByTagName('button')[1].style.display = 'block';
};

var hiddenBtn = function(e){
    e.getElementsByTagName('button')[0].removeAttribute('style');
    e.getElementsByTagName('button')[1].removeAttribute('style');
};

var addAction = function(e){
    var node = document.createElement('button');
    node.textContent = '删除';
    node.setAttribute('id','delete');
    var node2 = document.createElement('button');
    node2.textContent = '添加';
    node2.setAttribute('id','add');
    e.insertBefore(node,e.childNodes[0]);
    e.insertBefore(node2,e.childNodes[0]);
};

var addDel = function(){
    var btns = document.getElementsByTagName('button');
    for(var i =0;i<btns.length;i++){
        if(btns[i].id == 'add'){
            btns[i].addEventListener('click',function(){
                var element = document.createElement('div');
                element.className ='node-bottom-show';
                var name=prompt("输入节点名称","");
                if (name!=null && name!="")
                {
                    element.textContent = name;
                    this.parentElement.appendChild(element);
                    this.parentElement.click();
                }
            });
        }else if(btns[i].id == 'delete'){
            btns[i].addEventListener('click',function(){
                this.parentElement.parentElement.removeChild(this.parentElement);
            });
        }
    }
};

//初始化点击及添加事件
nodeAll(root);
modifyStyle();
addEventClick();
stopPro();
addDel();
