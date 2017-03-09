/**
 * Created by Administrator on 2017/3/9.
 */
// JavaScript Document
function GridViewColor(GridViewId, NormalColor, AlterColor, HoverColor, SelectColor) {
    //获取所有要控制的行 20140526 chrome issue to return --- chen_sj
//    var temp = document.getElementsByName(GridViewId);
//    if (temp.length == 0)
//        return;
    var AllRows = document.getElementById(GridViewId).getElementsByTagName("tr");
    //设置每一行的背景色和事件，循环从1开始而非0，可以避开表头那一行
    for (var i = 0; i < AllRows.length; i++) {
        //设定本行默认的背景色
        AllRows[i].style.background = i % 2 == 0 ? NormalColor : AlterColor;
        //如果指定了鼠标指向的背景色，则添加onmouseover/onmouseout事件
        //处于选中状态的行发生这两个事件时不改变颜色
        if (HoverColor != "") {
            AllRows[i].onmouseover = function() { if (!this.selected) this.style.background = HoverColor; }
            if (i % 2 == 0) {
                AllRows[i].onmouseout = function() { if (!this.selected) this.style.background = NormalColor; }
            }
            else {
                AllRows[i].onmouseout = function() { if (!this.selected) this.style.background = AlterColor; }
            }
        }
        //如果指定了鼠标点击的背景色，则添加onclick事件
        //在事件响应中修改被点击行的选中状态
        if (SelectColor != "") {
            AllRows[i].onclick = function() {
                var nodes = this.parentNode.childNodes;
                for (var i = 0; i < nodes.length; i++) {
                    if (i % 2 == 0) {
                        console.log(nodes[i]);
                        nodes[i].style.backgroundColor = NormalColor;
                    }
                    else
                        nodes[i].style.backgroundColor = AlterColor;
                    nodes[i].selected = false;
                }
                //alert(this.selected);
                this.style.background = SelectColor;
                this.selected = !this.selected;
            }
        }
    }
}

//全选操作
function setAll() {
    var temp = [];
    //兼容ie6
    document.getElementsByName("key").length > 0 ? temp = document.getElementsByName("key") : temp = $("#showlisttbody input");
    var count = 0;
    for (var i = 0; i < temp.length; i++) {
        if (temp[i].checked != true) {
            temp[i].checked = true;
            count++;
        }
    }
    if (count == 0) {
        for (var i = 0; i < temp.length; i++) {
            temp[i].checked = false;
        }
    }
}
//弹出窗口(页面内DIV窗口)
function win2() {

    var win = new Window({ id: "win2", className: "alphacube", title: "用户修改", width: 500, height: 400 });
    win.getContent().innerHTML = "<h1>Constraint inside page !!</h1>constraint: {top: 30, bottom:10}<br><a href='#' onclick='Windows.getWindow(\"win2\").maximize()'>Maximize me</a>";

    win.setDestroyOnClose();
    win.showCenter();
    win.setConstraint(true, { left: 0, right: 0, top: 30, bottom: 10 })
    win.toFront();
}

function newToWin(url,mytitle){
    jQuery.ajax({
        url: url+"?rand"+Math.random(),
        async: true,
        success: function(responseText, statusText){
            var win = new Window({ id: "win2", className: "alphacube", title: mytitle, width: 500, height: 400 });
            win.getContent().innerHTML = responseText;
            win.setDestroyOnClose();
            win.showCenter();
            win.setConstraint(true, { left: 0, right: 0, top: 30, bottom: 10 })
            win.toFront();
            getDeptNewDroplist();
        }});
}
function getDeptNewDroplist(){
    jQuery.ajax({
        url: '../System/systemio.aspx?mod=account&act=droplist',
        async: true,
        success: function(responseText, statusText) {
            jQuery('#myselectlist1').html(responseText);
        }
    });
    jQuery.ajax({
        url: '../System/systemio.aspx?mod=dept&act=droplist',
        async: true,
        success: function(responseText, statusText) {
            jQuery('#myselectlist2').html(responseText);
        }
    });
}


//从后台获取分页列表
function loadPagerlist(tablelist,url, mod, act, pagenum, pagesize) {
    jQuery.ajax({
        url: url + '?mod=' + mod + "&act=" + act + "&pagenum=" + pagenum + "&pagesize=" + pagesize+ "&modid=" + location.href.GetValue("mod") + "&pid=" + location.href.GetValue("pid")+"&rand="+Math.random(),
        async: true,
        success: function(responseText, statusText) {
            if (responseText == "1") {
                alert("未能收到信息");
            }
            else if (responseText == "2") {
                alert("获取数据出错");
            }
            else if(responseText=="Y"){
                alert("操作成功");
            }
            else {
                jQuery('#' + tablelist).html(responseText);
                //document.getElementById("TextArea1").value = responseText;
                GridViewColor('showlisttbody', '#FFFFFF', '#F6F6F6', '#FEF5CC', '#FECD00');
            }
        }
    });
}

//删除列表信息
function delRecordlist(url, mod, act, myid, pagenum, pagesize) {
    var mytem = confirm('删除后将不能恢复，确定删除该记录？')
    if(mytem == true){
        jQuery.ajax({
            url: url + '?mod=' + mod + "&act=" + act + "&myid=" + myid +"&rand="+Math.random(),
            async: true,
            success: function(responseText, statusText) {
                if (responseText == "1") {
                    alert("未能收到信息");
                }
                else if (responseText == "2") {
                    alert("获取数据出错");
                }
                else if (responseText == "99") {
                    alert("已被引用，不能删除");
                }
                else if(responseText=="Y"){
                    alert("删除成功");
                    var serchlist = document.getElementsByName("txtSearchList");
                    if(serchlist.length > 0){
                        loadAccountPager("tablelist", url, mod, "list", pagenum, pagesize, serchlist[0].value);
                    }
                    else
                        loadPagerlist("tablelist", url, mod, "list", pagenum, pagesize);

                    //loadPagerlist("tablelist", url, mod, "list", pagenum, pagesize);
                    //loadAccountPager("tablelist", url, mod, "list", "1", "12", document.getElementById("txtACCID").value);
                }
                else{
                    alert("未知错误");
                }
            }
        });
    }
}
function delAllRecord(url, mod, act){
    var mytem = confirm('删除后将不能恢复，确定删除该记录？')
    if(mytem == true){
        var temp = document.getElementsByName("key");
        var count = 0;

        var myid = "";
        for (var i = 0; i < temp.length; i++) {
            if (temp[i].checked == true) {
                if(count == 0){
                    myid += temp[i].md;
                }
                else
                    myid+= ","+temp[i].md;
                count++;
            }
        }
        jQuery.ajax({
            url: url + '?mod=' + mod + "&act=" + act + "&myid=" + myid +"&rand="+Math.random(),
            async: true,
            success: function(responseText, statusText) {
                if (responseText == "1") {
                    alert("未能收到信息");
                }
                else if (responseText == "2") {
                    alert("获取数据出错");
                }
                else if(responseText=="Y"){
                    alert("删除成功");
                    loadPagerlist("tablelist",url, mod, "list", document.getElementById("mynowpage").innerHTML, "12");
                }
                else{
                    alert("未知错误");
                }
            }
        });
    }
}
//删除XML
function setDelXml(temp) {
    //alert(temp);
    var mytem = confirm('删除后将不能恢复，确定删除该记录？')
    if (mytem == true) {
        if ((temp == "cn") || (temp == "en") || (temp == "tw")) {
            return;
        }
        jQuery.ajax({
            url: "../systemio.aspx?mod=langlist&act=del&myid=" + temp + "&rand=" + Math.random(),
            async: true,
            success: function(responseText, statusText) {
                if (responseText == "1") {
                    alert("未能收到信息");
                }
                else if (responseText == "2") {
                    alert("获取数据出错");
                }
                else if (responseText == "Y") {
                    alert("删除成功");
                    window.location.href = window.location.href;
                }
                else {
                    alert("未知错误");
                }
            }
        });
    }
}
//获取URL中的参数值
String.prototype.GetValue= function(para) {
    var reg = new RegExp("(^|&)"+ para +"=([^&]*)(&|$)");
    var r = this.substr(this.indexOf("\?")+1).match(reg);
    if (r!=null)
        return unescape(r[2]);
    return null;
}
//首页
function setFirstPage(tablelist,url,mod,pagesize){
    var itemlist = document.getElementsByName("ItemListinput");
    var act = "list";
    if(itemlist.length > 0)
        act="itemlist";
    var pagenum = 1;
    var temp = document.getElementById("mynowpage").innerHTML;
    if(temp == pagenum)
        return;

    var serchlist = document.getElementsByName("txtSearchList");
    if(serchlist.length > 0){
        loadAccountPager(tablelist, url, mod, act, pagenum, pagesize, serchlist[0].value);
    }
    else{
        loadPagerlist(tablelist,url, mod, act, pagenum, pagesize);
    }
}
//上一页
function setPrevPage(tablelist,url,mod,pagesize){
    var itemlist = document.getElementsByName("ItemListinput");
    var act = "list";
    if(itemlist.length > 0)
        act="itemlist";
    var pagenum = 1;
    var temp = document.getElementById("mynowpage").innerHTML;
    if(temp == pagenum)
        return;
    else if(parseInt(temp) > parseInt(pagenum)){
        pagenum = parseInt(temp)-1;
    }
    var serchlist = document.getElementsByName("txtSearchList");
    if(serchlist.length > 0){
        loadAccountPager(tablelist, url, mod, act, pagenum, pagesize, serchlist[0].value);
    }
    else{
        loadPagerlist(tablelist,url, mod, act, pagenum, pagesize);
    }
}
//下一页
function setNextPage(tablelist,url,mod,pagesize){
    var itemlist = document.getElementsByName("ItemListinput");
    var act = "list";
    if(itemlist.length > 0)
        act="itemlist";
    var pagenum = 1;
    var nowpage = document.getElementById("mynowpage").innerHTML;
    var temp = document.getElementById("mytotalpage").innerHTML;

    if(temp == nowpage)
        return;
    else if(parseInt(temp) > parseInt(nowpage)){
        pagenum = parseInt(nowpage)+1;
    }
    var serchlist = document.getElementsByName("txtSearchList");
    //alert(act);
    if(serchlist.length > 0){
        //alert(serchlist[0].value+"-"+pagesize);
        loadAccountPager(tablelist, url, mod, act, pagenum, pagesize, serchlist[0].value);
    }
    else{
        loadPagerlist(tablelist,url, mod, act, pagenum, pagesize);
    }
}
//尾页
function SetLastPage(tablelist,url,mod,pagesize){
    var itemlist = document.getElementsByName("ItemListinput");
    var act = "list";
    if(itemlist.length > 0)
        act="itemlist";
    var pagenum = 1;
    var nowpage = document.getElementById("mynowpage").innerHTML;
    var temp = document.getElementById("mytotalpage").innerHTML;
    if(parseInt(temp) == parseInt(nowpage))
        return;
    //alert(temp);
    var serchlist = document.getElementsByName("txtSearchList");
    if(serchlist.length > 0){
        loadAccountPager(tablelist, url, mod, act, temp, pagesize, serchlist[0].value);
    }
    else{
        loadPagerlist(tablelist, url, mod, act, temp, pagesize);
    }
}
//跳转页面
function setGotoPage(tablelist,url,mod,pagesize){
    var itemlist = document.getElementsByName("ItemListinput");
    var act = "list";
    if(itemlist.length > 0)
        act="itemlist";
    var temp = document.getElementById("mytotalpage").innerHTML;
    var gotopager = document.getElementById("gotopager").value;
    //alert(gotopager);
    if((parseInt(gotopager) >= 1) && (parseInt(gotopager) <= parseInt(temp))){
        var serchlist = document.getElementsByName("txtSearchList");
        if(serchlist.length > 0){
            loadAccountPager(tablelist, url, mod, act, gotopager, pagesize, serchlist[0].value);
        }
        else{
            loadPagerlist(tablelist,url, mod, act, gotopager, pagesize);
        }
    }
}
//打开一个全新的窗口
function openFullWindows(owurl) {
    var tmp = window.open("about:blank", "", "location=no,status=no,resizable=yes,scrollbars=yes ")
    tmp.moveTo(0, 0)
    tmp.resizeTo(screen.width + 20, screen.height-20)
    tmp.focus()
    tmp.location = owurl
}
//关闭窗口时无提示框
function closeWindow() { window.opener = null; window.open('', '_self', ''); window.close(); }

//按条件获取分页信息
function loadAccountPager(tablelist, url, mod, act, pagenum, pagesize, valuelist) {
    var mystr = setFormListByValue(valuelist);
    //alert(mystr);
    jQuery.ajax({
        url: url + '?mod=' + mod + "&act=" + act + "&pagenum=" + pagenum + "&pagesize=" + pagesize + "&modid=" + location.href.GetValue("mod") + "&pid=" + location.href.GetValue("pid") + "&rand=" + Math.random(),
        type: 'POST',
        data: eval("(" + mystr + ")"),
        async: true,
        success: function(responseText, statusText) {
            //alert(responseText);
            if (responseText == "1") {
                alert("未能收到信息");
            }
            else if (responseText == "2") {
                alert("获取数据出错");
            }
            else if (responseText == "Y") {
                alert("操作成功");
            }
            else if(responseText != "") {
                jQuery('#' + tablelist).html(responseText);
                //document.getElementById("TextArea1").value = responseText;
                GridViewColor('showlisttbody', '#FFFFFF', '#F6F6F6', '#FEF5CC', '#FECD00');
            }
        }
    });
}
//将得到的结果转换成json对象
function setFormListByValue(valuelist){
    var temp = valuelist.split(",");
    var mystr = "{";
    if(valuelist == ""){
        mystr += "a:"+"'a'";
    }
    else{
        var count = 1;
        if(temp.length > 0){
            for(var i = 0;i<temp.length;i++){
                if(count == 1)
                    mystr += "formlist"+count+":'"+temp[i]+"'";
                else
                    mystr += ",formlist"+count+":'"+temp[i]+"'";
                count++;
            }
        }
    }
    mystr += "}";

    return mystr;
}

function InitWindowsLoad(){
    //alert(top.body.clientHeight);
    //var clientheight = document.body.clientHeight;
//		var mycenter = document.getElementById("leftcenter");
//		mycenter.style.height = (clientheight - 107) + "px";
//		//var sitelist = document.getElementById("sitelist");
//		//sitelist.style.height = (clientheight - 93) + "px";
//		mycenter.style.overflowY = "scroll";
//
//		var clientheight = document.body.clientHeight;
//		var sitelist = document.getElementById("sitelist");
//		sitelist.style.height = (clientheight - 108) + "px";
}
//登陆过期
function setSamplelogin(depth) {
    var mystr = "";
    if (depth == 1)
        mystr = "../SysMng/SampleLogin.aspx";
    else if (depth == 2)
        mystr = "../../SysMng/SampleLogin.aspx";
    else if (depth == 3)
        mystr = "../../../SysMng/SampleLogin.aspx";
    else
        mystr = "/SysMng/SampleLogin.aspx";

    var time = Date();
    var k = window.showModalDialog(mystr + '?time=' + time, '', 'dialogWidth:300px;dialogHeight:250px;Help:No;Status:No;');

    if (k == "ok") {
        return true;
    }
    else {
        return false;
    }
}
//初始化高级搜索界面
function LoadSearchList(url,mod,act){
    var mystr = "<table>";
    mystr += "	<tr>";
    mystr += "    	<td>";
    mystr += "        	<select>";
    mystr += "            	<option value=\"\"></option>";
    mystr += "            	<option value=\"1\">(</option>";
    mystr += "            </select>";
    mystr += "        </td>";
    mystr += "    	<td>";
    mystr += "        	<select>";


    mystr += "            </select>";
    mystr += "        </td>";
    mystr += "        <td>";
    mystr += "        	<select>";
    mystr += "        		<option value=\"=\">等于</option>";
    mystr += "        		<option value=\">\">大于</option>";
    mystr += "        		<option value=\"<\">小于</option>";
    mystr += "        		<option value=\">=\">大于或等于</option>";
    mystr += "        		<option value=\"<=\">小于或等于</option>";
    mystr += "        		<option value=\"<>\">不等于</option>";
    mystr += "        		<option value=\"like\">模式匹配</option>";
    mystr += "        		<option value=\"in\">内含</option>";
    mystr += "            </select>";
    mystr += "        </td>";
    mystr += "        <td>";
    mystr += "        	<input id=\"txtData\" type=\"text\" />";
    mystr += "        </td>";
    mystr += "    	<td>";
    mystr += "        	<select>";
    mystr += "            	<option value=\"\"></option>";
    mystr += "            	<option value=\"1\">)</option>";
    mystr += "            </select>";
    mystr += "        </td>";
    mystr += "        <td>";
    mystr += "        	<select>";
    mystr += "            	<option value=\"\"></option>";
    mystr += "                <option value=\"and\">并且</option>";
    mystr += "                <option value=\"or\">或者</option>";
    mystr += "            </select>";
    mystr += "        </td>";
    mystr += "    </tr>";
    mystr += "</table>";


}
//获取高级搜索明细的数量
function getSearchNum(){
    var list = document.getElementById("HighSearchlist").childNodes;


}


//设定COOKIE，expireHours=过期多少小时
function addcookie(name,value,expireHours){
    var cookieString=name+"="+escape(value);
//判断是否设置过期时间
    if(expireHours>0){
        var date=new Date();
        date.setTime(date.getTime+expireHours*3600*1000);
        cookieString=cookieString+"; expire="+date.toGMTString();
    }
    document.cookie=cookieString;
}

//删除COOIKIE
function deletecookie(name){
    var date=new Date();
    date.setTime(date.getTime()-10000);
    document.cookie=name+"=v; expire="+date.toGMTString();
}

//得到COOKIE的值
function getcookie(name){
    var bikky = document.cookie;
    name += "=";
    var i = 0;
    while (i < bikky.length)
    {
        var offset = i + name.length;
        if (bikky.substring(i, offset) == name)
        {
            var endstr = bikky.indexOf(";", offset);
            if (endstr == -1) endstr = bikky.length;
            return unescape(bikky.substring(offset, endstr));
        }
        i = bikky.indexOf(" ", i) + 1;
        if (i == 0) break;
    }
    return null;
}
//获取radio的值
function GetRadioValue(RadioName){
    var obj;
    obj=document.getElementsByName(RadioName);
    if(obj!=null){
        var i;
        for(i=0;i<obj.length;i++){
            if(obj[i].checked){
                return obj[i].value;
            }
        }
    }
    return null;
}
function checkRate(input)
{
    var re = /^[0-9]+.?[0-9]*$/;   //判断字符串是否为数字     //判断正整数 /^[1-9]+[0-9]*]*$/
    //alert(!re.test(input));
    if (!re.test(input))
    {
        return false;
    }
}

//根据条件获取门店的select列表
function changeSearchACCID(accid, storeid) {
    //alert(storeid);
    jQuery.ajax({
        url: "../SYS/systemio.aspx?mod=store&act=search&accid=" + accid + "&storeid=" + storeid + "&rand=" + Math.random(),
        async:false,
        success: function(responseText, statusText) {
            //alert(responseText);
            if (responseText == "1") {
                alert("未能收到信息");
            }
            else if (responseText == "2") {
                alert("操作出错");
            }
            else if (responseText == "") {
                alert("未获得信息");
            }
            else {
                document.getElementById("txtsearchstore").innerHTML = responseText;
            }
        }
    });
}
//四舍五入
function formatNum(Num1,Num2){
    if(isNaN(Num1)||isNaN(Num2)){
        return(0);
    }else{
        Num1=Num1.toString();
        Num2=parseInt(Num2);
        if(Num1.indexOf('.')==-1){
            return(Num1);
        }else{
            var b=Num1.substring(0,Num1.indexOf('.')+Num2+1);
            var c=Num1.substring(Num1.indexOf('.')+Num2+1,Num1.indexOf('.')+Num2+2);
            if(c==""){
                return(b);
            }else{
                if(parseInt(c)<5){
                    return(b);
                }else{
                    return((Math.round(parseFloat(b)*Math.pow(10,Num2))+Math.round(parseFloat(Math.pow(0.1,Num2).toString().substring(0,Math.pow(0.1,Num2).toString().indexOf('.')+Num2+1))*Math.pow(10,Num2)))/Math.pow(10,Num2));
                }
            }
        }
    }
}
//显示进度条
function showLoading() {
    $("#loading").css("display", "block");
}

//隐藏进度条
function hidnLoading() {
    $("#loading").css("display", "none");
}

