/**
 * Created by Administrator on 2016/8/3.
 */
/* 数据格式演示
 var aqiSourceData = {
 "北京": {
 "2016-01-01": 10,
 "2016-01-02": 10,
 "2016-01-03": 10,
 "2016-01-04": 10
 }
 };
 */
//跨浏览器事件绑定
function addEventHandler(ele,event,handler){
    if(ele.addEventHandler){
        ele.addEventHandler(event,handler,false);
    } else if(ele.attachEvent){
        ele.attachEvent("on"+ event,handler);
    } else {
        ele["on"+event] = handler;
    }
}
var $ = function(id){
    return document.getElementById(id);
};

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
    var y = dat.getFullYear();
    var m = dat.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = dat.getDate();
    d = d < 10 ? '0' + d : d;
    return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
    var returnData = {};
    var dat = new Date("2016-01-01");
    var datStr = '';
    for (var i = 1; i < 92; i++) {
        datStr = getDateStr(dat);
        returnData[datStr] = Math.ceil(Math.random() * seed);
        dat.setDate(dat.getDate() + 1);
    }
    return returnData;
}

var aqiSourceData = {
    "北京": randomBuildData(500),
    "上海": randomBuildData(300),
    "广州": randomBuildData(200),
    "深圳": randomBuildData(100),
    "成都": randomBuildData(300),
    "西安": randomBuildData(500),
    "福州": randomBuildData(100),
    "厦门": randomBuildData(100),
    "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
    nowSelectCity: "北京",
    nowGraTime: "day"
};
var formGraTime = $('form-gra-time');
var citySelect = $('city-select');
var aqiChartWrap = document.getElementsByClassName('aqi-chart-wrap')[0];
/**
 * 渲染图表
 */
function renderChart() {
    var text = '',color='';
    for(var item in chartData){
        color = '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
        text += '<div style="height:'+chartData[item]+'px;background:'+color+'" title="'+[item]+':'+chartData[item]+'"></div>';
    }
    aqiChartWrap.innerHTML = text;
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
    // 确定是否选项发生了变化
    if(pageState.nowGraTime == this.value){
        return;
    }else{
        pageState.nowGraTime = this.value;
    }
    // 设置对应数据
    initAqiChartData();
    // 调用图表渲染函数
    renderChart();
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
    // 确定是否选项发生了变化
    if(pageState.nowSelectCity == this.value){
        return;
    }else{
        pageState.nowSelectCity = this.value;
    }
    // 设置对应数据
    initAqiChartData();
    // 调用图表渲染函数
    renderChart()
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
    var pageRadio = formGraTime.getElementsByTagName('input');
    for(var i = 0;i< pageRadio.length;i++){
        addEventHandler(pageRadio[i],'click',graTimeChange);
    }
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
    // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
    var cityList = "";
    for(var item in aqiSourceData){
        cityList += '<option>'+[item]+'</optin>';
    }
    citySelect.innerHTML = cityList;
    // 给select设置事件，当选项发生变化时调用函数citySelectChange
    addEventHandler(citySelect,'change',citySelectChange)
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
    // 将原始的源数据处理成图表需要的数据格式
    var nowCityData = aqiSourceData[pageState.nowSelectCity];
    // 处理好的数据存到 chartData 中
    if(pageState.nowGraTime == 'day'){
        chartData = nowCityData;
    }else if(pageState.nowGraTime == 'week'){
        chartData = {};
        var countSum = 0,daySum = 0,week = 0;
        for(var item in nowCityData){
            countSum += nowCityData[item];
            daySum ++;
            if((new Date(item)).getDay() == 6){
                week ++;
                chartData['第'+ week +'周'] = Math.floor(countSum/daySum);
                countSum = 0;
                daySum = 0;
            }
        }
        if(daySum!=0){
            week++;
            chartData['第'+ week +'周'] = Math.floor(countSum/daySum);
        }
    }else if(pageState.nowGraTime == 'month'){
        chartData = {};
        var countSum = 0,daySum = 0,month = 0;
        for(var item in nowCityData){
            if((new Date(item)).getMonth() !== month){
                month++;
                chartData[month+'月'] = Math.floor(countSum/daySum);
                countSum = nowCityData[item];
                daySum = 1;
            }else{
                countSum += nowCityData[item];
                daySum ++;
            }
        }
        if(daySum!=0){
            month++;
            chartData[month+'月'] = Math.floor(countSum/daySum);
        }
    }
}

/**
 * 初始化函数
 */
function init() {
    initGraTimeForm();
    initCitySelector();
    initAqiChartData();
    renderChart();
}

init();