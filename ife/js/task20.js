var $ = function (el) { return document.querySelector(el);};
var data = [];

function render(e) {
    if(e){
        console.log(e);
        var reg = new RegExp(e,"g");
        $('#result').innerHTML =  data.map(function(item){
            var r = item.replace(reg,"<span class='select'>"+e+"</span>");
            return "<div>" + r + "</div>";
        }).join("");
    }else{
        $('#result').innerHTML =
            data.map(function(d) { return "<div>" + d + "</div>";}).join('');
    }
}

function deal(func,succ){
    var args = [].slice.call(arguments,2);//onclick事件所带参数，从第三位开始
    return function(e) {
        try {
            var arg = args.map(function(item){
                return typeof item === "function" ? item(e) : item;
            });
            if(succ == '1'){
                var result = func.apply(data,arg);
            }else{
                var result = func.apply(data,arg[0]);
                if (succ != null){
                    succ(result);
                }
            }
        } catch (ex){
            alert(ex.message);
        }
        render();
    };
}

function getInputValue(){
    var inputStr = $('textarea').value;
    if(!validate(inputStr)) throw new Error('input error');
    return validate(inputStr);
}

function getClickIndex(e){
    var node = e.target;
    return [].indexOf.call(node.parentNode.children,node);
}

function validate(str) {
    var str = "".replace.call(str,/\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?\n+|\,+|\，+|\s+|\、+/g,"\n");
    str = "".split.call(str,/\n+/);
    str = str.filter(function(e){
        return /\S+/.test(e);
    });
    return str;
}

$('#left-in').onclick = deal([].unshift, null, getInputValue);
$('#right-in').onclick = deal([].push, null, getInputValue);
$('#left-out').onclick = deal([].shift, window.alert);
$('#right-out').onclick = deal([].pop, window.alert);
$('#result').onclick = deal([].splice, 1, getClickIndex, 1);
$('#search').onclick = function(){
    render($('#search-text').value);
};
