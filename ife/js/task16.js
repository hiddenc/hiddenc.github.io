/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};
var $ = function(id){
    return document.getElementById(id);
}

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
    var cityName = $('aqi-city-input').value;
    var myNum = $('aqi-value-input').value;
    aqiData[cityName] = myNum;
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {


    /*function allpro(obj){
        var keys=[];
        var values=[];
        for(var key in obj){
            //只遍历对象自身的属性，而不包含继承于原型链上的属性。
            if (obj.hasOwnProperty(key) === true){
                keys.push(key);
                values.push(obj[key]);
            }
        }
        alert("keys is ："+keys+" and values is ："+values);
    }
    Object.prototype.bar = 1;// 修改Object.prototype
    var o={"name":"wjy","age":26,"sex":"female"};//定义一个object对象
    allpro(o);*/

    for(var i in aqiData){
        console.log(i);
        console.log(aqiData[i]);
        $('aqi-table').innerHTML +='<tr><td>'+i+'</td><td>'+aqiData[i]+'</td><td><button>删除</button></td></tr>';
    }
}
/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
    addAqiData();
    renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle() {
    // do sth.

    renderAqiList();
}

function init() {

    // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
    $('add-btn').onclick = function(){
        addBtnHandle();
    }
    // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数

}

init();
