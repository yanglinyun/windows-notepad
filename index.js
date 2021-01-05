var content = "";
var textarea = document.getElementsByTagName("textarea")[0];
//文本大小显示
var sizeBox = document.getElementById("size");
//选中内容大小显示
var selected = document.getElementById("selected");
//文字编码显示
var charSet = document.getElementById("charSet");
//列数
var textarea_content_width = css(textarea,"width");
var textarea_fontSize = css(textarea,"fontSize");
var col_max_char = Math.floor(textarea_content_width/textarea_fontSize);

//文本区域内容变化
textarea.addEventListener("keyup",function(e){
    content = this.value;
    //更新列位置
    //console.log(content,col_max_char,content.length/col_max_char+"行",content.length%col_max_char+"列");
    //更新字节大小
    //中文2字节 其余1字节
    
    sizeBox.innerText=getStringSize(textarea.value);
    charSet.innerText = hasChinese(textarea.value)?"UTF-8":"ANSI";
});
//选中文本框文字
textarea.addEventListener("select",function(e){
    var selectedText = window.getSelection().toString();
    selected.innerText = getStringSize(selectedText);
});
//清除选中
textarea.addEventListener("click",function(e){
    selected.innerText = 0;
});
textarea.addEventListener("touch",function(e){
    selected.innerText = 0;
});

//获取css属性函数
function css(obj,attr){
    var res = window.getComputedStyle(obj,null)[attr];
    return isNaN(parseFloat(res))?res:parseFloat(res);
}

function getStringSize(content){
    var part = /[0-9a-zA-Z!@#$%^&*()_+-/.~`/[/]/g;
    var arr = content.match(part);
    var noChineseCount = arr==null?0:arr.length;
    return content.length*2 - noChineseCount;
}
function hasChinese(content){
    return getStringSize(content)>content.length;
}

//菜单逻辑
var menu = document.getElementsByClassName("menu")[0];
var menuBtns = menu.getElementsByClassName("menu_btn");
//菜单按钮绑定点击事件
addEvent(menuBtns,"click",(e)=>{
   var curObj = e.target;
   var curObjLeft = curObj.getBoundingClientRect().left;
   var data_menu = curObj.getAttribute("data-menu");
   var curMenu = document.getElementsByClassName(data_menu)[0];
   if(curMenu){
       var appLeft = document.getElementById("app").getBoundingClientRect().left;
       var allMenu = document.getElementsByClassName("curMenu");
       
       var curDispaly = css(curMenu,"display");
       setTimeout(()=>{
        curMenu.style.display=(curDispaly=="block"?"none":"block");
       },210);
       for(var i=0;i<allMenu.length;i++){
        var cur = allMenu[i];
        var fn = (function(cur){
         cur.style.display="none";
        })(cur);//闭包
        setTimeout(fn,210);
    }
      
       curMenu.style.left = curObjLeft-appLeft+"px";
   }
});
//菜單选项点击事件
var menu_items = document.getElementsByClassName("menu_item");
addEvent(menu_items,"click",(e)=>{
    var curObj = e.target;
    var curDialogName = curObj.getAttribute("data-class");
    var curDialog = document.getElementsByClassName(curDialogName)[0];
    if(curDialog){
        var curDisplay = css(curDialog,"display");
        setTimeout(()=>{
            curDialog.style.display=(curDisplay=="block"?"none":"block");
        },210);
     }
 });
 //对话框关闭按钮点击事件
 var closeBtns = document.getElementsByClassName("closeBtn");
 addEvent(closeBtns,"click",(e)=>{
    var curObj = e.target.parentNode.parentNode.parentNode.parentNode.parentNode;
    if(curObj){
        curObj.style.display="none";
    }
 });


//批量注册事件函数
function addEvent(objs,event,fn){
    console.log("addEvent");
    for(var i=0;i<objs.length;i++){
        objs[i].addEventListener(event,fn);
    }
}
//fadeInt