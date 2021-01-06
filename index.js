//当前内容
var content = "";
//历史10笔内容
var historyArr = [];
var historyIndex = 0; //还原指针位置
var textarea = document.getElementsByTagName("textarea")[0];
//文本大小显示
var sizeBox = document.getElementById("size");
//选中内容大小显示
var selected = document.getElementById("selected");
//文字编码显示
var charSet = document.getElementById("charSet");
//选中文本
var selectedText = "";
//列数
var textarea_content_width = css(textarea, "width");
var textarea_fontSize = css(textarea, "fontSize");
var col_max_char = Math.floor(textarea_content_width / textarea_fontSize);

//文本区域内容变化
textarea.addEventListener("keyup", function (e) {
  inputFn(this.value, false);
});
function inputFn(val, isReturn) {
  if (!isReturn) {
    historyArr = sizes_Ten_Queue(historyArr, val);
  }
  content = val;
  textarea.value = val;
  sizeBox.innerText = getStringSize(textarea.value);
  charSet.innerText = hasChinese(textarea.value) ? "UTF-8" : "ANSI";
}
//选中文本框文字
textarea.addEventListener("select", function (e) {
  selectedText = window.getSelection().toString();
  selected.innerText = getStringSize(selectedText);
});
//清除选中
textarea.addEventListener("click", function (e) {
  selected.innerText = 0;
});
textarea.addEventListener("touch", function (e) {
  selected.innerText = 0;
});

//获取css属性函数
function css(obj, attr) {
  var res = window.getComputedStyle(obj, null)[attr];
  return isNaN(parseFloat(res)) ? res : parseFloat(res);
}

function getStringSize(content) {
  var part = /[0-9a-zA-Z!@#$%^&*()_+-/.~`/[/]/g;
  var arr = content.match(part);
  var noChineseCount = arr == null ? 0 : arr.length;
  return content.length * 2 - noChineseCount;
}
function hasChinese(content) {
  return getStringSize(content) > content.length;
}

//菜单逻辑
var menu = document.getElementsByClassName("menu")[0];
var menuBtns = menu.getElementsByClassName("menu_btn");
//菜单按钮绑定点击事件
addEvent(menuBtns, "click", menuFn);
//菜单按钮绑定mouseover事件
addEvent(menuBtns, "mouseover", menuFn);
function menuFn(e) {
  var curObj = e.target;
  var curObjLeft = curObj.getBoundingClientRect().left;
  var data_menu = curObj.getAttribute("data-menu");
  var curMenu = document.getElementsByClassName(data_menu)[0];
  if (curMenu) {
    var appLeft = document.getElementById("app").getBoundingClientRect().left;
    var allMenu = document.getElementsByClassName("curMenu");

    var curDispaly = css(curMenu, "display");
    setTimeout(() => {
      curMenu.style.display = curDispaly == "block" ? "none" : "block";
    }, 210);
    for (var i = 0; i < allMenu.length; i++) {
      var cur = allMenu[i];
      var fn = (function (cur) {
        cur.style.display = "none";
      })(cur); //闭包
      setTimeout(fn, 210);
    }

    curMenu.style.left = curObjLeft - appLeft + "px";
  }
}
//菜單选项点击事件
var menu_items = document.getElementsByClassName("menu_item");
var menu_items_span = document.querySelectorAll(".menu_item>span");
//解决span点击事件不出发父级事件
addEvent(menu_items_span, "click", (e) => {
  e.target.parentNode.click();
});
addEvent(menu_items, "click", (e) => {
  var curObj = e.target;
  var curDialogName = curObj.getAttribute("data-class");
  var dialog = document.getElementsByClassName('dialog')[0];
  var curDialog = dialog.getElementsByClassName(curDialogName)[0];

  if (curDialog) {
    var curDisplay = css(curDialog, "display");
    //关闭其他dialog
    var diaLog = document.getElementsByClassName("dialog")[0];
    var diaLogItems = diaLog.getElementsByClassName("item");
    for (var i = 0; i < diaLogItems.length; i++) {
      diaLogItems[i].style.display = "none";
    }
    console.log("test");
    setTimeout(() => {
      curDialog.style.display = curDisplay == "block" ? "none" : "block";
    }, 210);
  } else if (curDialogName) {
    //无页面显示的功能

    eval(curDialogName + "()");
    // //打勾
    // if (curObj.parentNode.children.length > 2) {
    //   var menu_item_actived = curObj.parentNode.children[0];
    //   var menu_item_actived_visibility = css(menu_item_actived, "visibility");
    //   menu_item_actived.style.visibility =
    //     menu_item_actived_visibility == "visible" ? "hidden" : "visible";
    // }
  }
});
//-------------------------------------------------------
//功能区func点击事件
//file区
//file_paint
function file_new(){
    if(content!=''){
        if(confirm("是否保存当前文件!")){
            file_save();
            return;
        }
    }
    content="";
    textarea.value="";
}
function file_paint() {
  window.print();
}
function file_open() {
  var uploadText = document.getElementById("uploadText");
  uploadText.click();
}
var uploadText = document.getElementById("uploadText");
uploadText.addEventListener("change", (e) => {
  //新建一个fileReader
  var reader = new FileReader();
  if (!reader) {
    alert("你的浏览器不支持 FileReader ");
    return;
  }
  //file实在事件对象e中而是this
  var obj = e.target;
  if (obj.value == "") {
    alert("请选择文件");
    returns;
  }
  //获取文件
  var files = obj.files;
  var filesName = files[0].name;
  var title = document.getElementById("fileName");
  title.innerText = filesName;

  //读取文件
  reader.readAsText(files[0], "UTF-8");
  //文件读取完毕
  reader.onload = function (e) {
    content = e.target.result;
    textarea.value = content;
    sizeBox.innerText = files[0].size;
    charSet.innerText = "UTF-8";
  };
});
function file_save(){
    if(!(new Blob())){
        alert("你的浏览器不支持 Blob ");
        return;
    }
    saveAs(textarea.value,"text");
}
//文件保存函数
function saveAs(data,name){
   var link = document.createElement('a');
   link.download = name;
   link.style.display = "none";
   //内容转blob地址
   var blob = new Blob([data]);
   link.href = URL.createObjectURL(blob);
   //触发点击事件
   document.body.appendChild(link);
   link.click();
   //移除元素
   document.body.removeChild(link);
}
function file_close() {
  if (confirm("是否关闭记事本")) {
    window.opener = null;
    window.open("", "_self");
    window.close();
  }
}
//file_new
var func_file_new = document.getElementsByClassName("file_new")[0];
func_file_new.addEventListener("click", file_new);
//file_open
var func_file_open = document.getElementsByClassName("file_open")[0];
func_file_open.addEventListener("click", file_open);
//file_save
var func_file_save = document.getElementsByClassName("file_save")[0];
func_file_save.addEventListener("click", file_save);
//edit_return
var func_edit_return = document.getElementsByClassName("edit_return")[0];
func_edit_return.addEventListener("click", edit_return);
//edit_cut
var func_edit_cut = document.getElementsByClassName("edit_cut")[0];
func_edit_cut.addEventListener("click", edit_cut);
//edit_copy
var func_edit_copy = document.getElementsByClassName("edit_copy")[0];
func_edit_copy.addEventListener("click", edit_copy);
//edit_paste
var func_edit_paste = document.getElementsByClassName("edit_paste")[0];
func_edit_paste.addEventListener("click", edit_paste);

//------------------------------------------------------- 
//视图功能实现
function view_footerInfo() {
  var footerInfo = document.getElementsByClassName("footerInfo")[0];
  var footerInfo_display = css(footerInfo, "display");
  var textarea = document.getElementsByTagName("textarea")[0];
  if (footerInfo_display == "none") {
    footerInfo.style.display = "block";
    textarea.style.height = "87.2909699%";
  } else {
    footerInfo.style.display = "none";
    textarea.style.height = "89%";
  }
}
//编辑功能实现
function edit_return() {
  historyIndex = historyArr.length - 1;
  if (historyIndex < historyArr.length && historyIndex > 0) {
    inputFn(historyArr[historyIndex - 1], true);
    historyArr.pop();
  }
}
function edit_cut() {
  if (selectedText) {
    document.execCommand("cut");
    alert("已剪切");
  }
}
function edit_copy() {
  if (selectedText) {
    if (document.execCommand("copy", false, null)) {
      alert("已复制");
    }
  }
}
function edit_paste() {
  document.execCommand("paste");
}
//-------------------------------------------------------
//对话框关闭按钮点击事件
var closeBtns = document.getElementsByClassName("closeBtn");
addEvent(closeBtns, "click", (e) => {
  var curObj = e.target.parentNode.parentNode.parentNode.parentNode.parentNode;
  if (curObj) {
    curObj.style.display = "none";
  }
});

//批量注册事件函数
function addEvent(objs, event, fn) {
  for (var i = 0; i < objs.length; i++) {
    objs[i].addEventListener(event, fn);
  }
}

//点击页面任意地方菜单栏隐藏
function appHiddenMenu() {
  var app = document.getElementById("app");
  app.addEventListener("click", (e) => {
    var allMenu = document.getElementsByClassName("curMenu");
    for (var i = 0; i < allMenu.length; i++) {
      var cur = allMenu[i];
      var fn = (function (cur) {
        cur.style.display = "none";
      })(cur); //闭包
      setTimeout(fn, 210);
    }
  });
}
appHiddenMenu();
//维护一个10大小的队列
function sizes_Ten_Queue(arr, val) {
  if (arr.length >= 10) {
    arr.shift(); //删除第一个
  }
  arr.push(val);

  return arr;
}
function getCursortPosition(element) {
  var doc = element.ownerDocument || element.document;
  var win = doc.defaultView || doc.parentWindow;
  var sel;
  if (typeof win.getSelection != "undefined") {
    sel = win.getSelection();
    if (sel.rangeCount > 0) {
      var range = win.getSelection().getRangeAt(0);
      console.log(range);
    }
  }
  return range;
}
