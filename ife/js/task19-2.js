var $ = function (el) { return document.querySelector(el);},
$$ = function (el) { return document.querySelectorAll(el); };
var data = [];
var multiple = 5;
function render(){
    $('#result').innerHTML = data.map(function(e){
        return "<div class='red' style='height:"+e*multiple+"px'>"+e+"</div>";
    }).join('');
}

function random(){
    data.length = 0;
    var num = 50;
    for(var i =0;i<num;i++){
        data.push(Math.floor(Math.random()*90)+10);
    }
    render();
}
function sort(){
    for(var j=0;j<data.length-1;j++){
        for(var i=0;i<data.length-1;i++){
            var a = data[i],b=data[i+1];
            if(a>b){
                data[i] = b;
                data[i+1] = a;
            }
        }
    }
    render();
}
function sort2(a,b){
    if(a>=b){
        if(b<=1){
            return;
        }else{
            compare(0,b-1);
        }
    }else{
        compare(a,b);
    }
}
function compare(a,b){
    var left = data[a],right = data[a+1];
    $('#result').children[a].className = 'blue';
    $('#result').children[a+1].className = 'green';
    $('#result').children[a+1].className = 'red';
    setTimeout(function(){
        if(left>right){
            $('#result').children[a].innerHTML = right;
            $('#result').children[a].style.height = right*multiple+"px";
            $('#result').children[a+1].innerHTML = left;
            $('#result').children[a+1].style.height = left*multiple+"px";
            data[a] = right;
            data[a+1] =left;
        }
        sort2(a+1,b);
    },10);

}
function clear(){
    data.length = 0;
    render();
}
function getLastIndex(){
    return data.length-1;
}


$('#random').onclick = random;
$('#sort').onclick = function(){
   sort2(0,getLastIndex());
};
$('#clear').onclick = clear;