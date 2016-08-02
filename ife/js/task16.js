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
if (!String.prototype.trim){
    /*---------------------------------------
     * 清除字符串两端空格，包含换行符、制表符
     *---------------------------------------*/
    String.prototype.trim = function () {
        return this.replace(/(^[\s\n\t]+|[\s\n\t]+$)/g, "");
    }
}
/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */

function addAqiData() {
    var cityName = $('aqi-city-input').value.trim();
    var myNum = $('aqi-value-input').value.trim();
    var tipsName = '城市名必须为中英文字符(10个中文字符以内)';
    var tipsNum = '空气质量指数必须为1-500间的整数';
    var cityNameB = cityName.match(/^[\u4e00-\u9fa5]{1,10}$|^[A-Za-z]+\s?[A-Za-z]*$/);
    var myNumB = myNum.match(/^[1-9]$|^[0-9][0-9]$|^[1234][0-9][0-9]$|^500$/);
    if(cityNameB && myNumB){
        aqiData[cityName] = myNum;
        $('aqi-city-input').value = '';
        $('aqi-value-input').value = '';
    }else if(!cityNameB && !myNumB){
        alert(tipsName+','+tipsNum);
    }else if(!cityNameB){
        alert(tipsName);
    }else if(!myNumB){
        alert(tipsNum);
    }
}
/*function addAqiData() {
    var cityName = $('aqi-city-input').value.trim();
    var myNum = $('aqi-value-input').value.trim();

    if((cityName.match((/^[\u4e00-\u9fa5]{2,10}$|^\w+\s?\w*$/) && (myNum.match(/^[1-9]\d*$/)) ){
        aqiData[cityName] = myNum;
    }else{
        alert('wrong');
    }

}*/

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
    //将aqiData中的数据转换成keys和values中的两个数组
    function allpro(obj){
        var keys=[];
        var values=[];
        for(var key in obj){
            //只遍历对象自身的属性，而不包含继承于原型链上的属性。
            if (obj.hasOwnProperty(key) === true){
                keys.push(key);
                values.push(obj[key]);
            }
        }
        //判断数据是否为空，决定是否显示table头信息
        if(keys.length == 0) {
            $('aqi-table').innerHTML = '';
        }else{
            $('aqi-table').innerHTML = '<tr><td>城市</td><td>空气质量</td><td>操作</td></tr>';
        }
        for(i=0;i<keys.length;i++){
            $('aqi-table').innerHTML += '<tr><td>'+keys[i]+'</td><td>'+values[i]+'</td><td><button onclick="delBtnHandle(\'' + keys[i] + '\')">删除</button></td></tr>'};

    }
    Object.prototype.bar = 1;// 修改Object.prototype
    allpro(aqiData);

    /*for(var i in aqiData){
        console.log(i);
        console.log(aqiData[i]);
        $('aqi-table').innerHTML +='<tr><td>'+i+'</td><td>'+aqiData[i]+'</td><td><button>删除</button></td></tr>';
    }*/
}
/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
    //添加数据至aqiData对象
    addAqiData();
    renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(city) {
    // do sth.
    //删除aqiData对象中对应的数据
    delete aqiData[city];
    renderAqiList();

}

function init() {

    // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
    $('add-btn').onclick = function () {
        addBtnHandle();
    };
    // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
}
init();
