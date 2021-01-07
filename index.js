//当前内容
var content = "";
//历史10笔内容
var historyArr = [];
var historyIndex = 0; //还原指针位置
var textarea = document.getElementsByTagName("textarea")[0];
//选中区域信息
var selectRange = { data: "", start: 0, end: 0 };
//输入光标位置
var inputPointer = 0;
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
  upadateFooterInfo();
}
function upadateFooterInfo() {
  sizeBox.innerText = getStringSize(textarea.value);
  charSet.innerText = hasChinese(textarea.value) ? "UTF-8" : "ANSI";
}
//获取光标位置
textarea.addEventListener("keyup", getInputPointer);
textarea.addEventListener("click", getInputPointer);
function getInputPointer(e) {
  //this无效
  inputPointer = e.target.selectionStart;
}
//选中文本框文字
textarea.addEventListener("select", function (e) {
  selectedText = window.getSelection().toString();
  selected.innerText = getStringSize(selectedText);
  selectRange.start = this.selectionStart;
  selectRange.end = this.selectionEnd;
  selectRange.data =
    selectRange.start != selectRange.end
      ? content.substring(selectRange.start, selectRange.end)
      : "";
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
//获取元素属性
function getAttr(obj, attr) {
  return obj.getAttribute(attr);
}
//设置元素属性
function setAttr(obj, attr, value) {
  obj.setAttribute(attr, value);
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
  var dialog = document.getElementsByClassName("dialog")[0];
  var curDialog = dialog.getElementsByClassName(curDialogName)[0];

  if (curDialog) {
    var curDisplay = css(curDialog, "display");
    //关闭其他dialog
    var diaLog = document.getElementsByClassName("dialog")[0];
    var diaLogItems = diaLog.getElementsByClassName("item");
    for (var i = 0; i < diaLogItems.length; i++) {
      diaLogItems[i].style.display = "none";
    }
    setTimeout(() => {
      curDialog.style.display = curDisplay == "block" ? "none" : "block";
    }, 210);
  } else if (curDialogName) {
    //无页面显示的功能

    eval(curDialogName + "()");
    //打勾
    var menu_item_actived = curObj.getElementsByClassName(
      "menu_item_actived"
    )[0];

    if (menu_item_actived) {
      var menu_item_actived_visibility = css(menu_item_actived, "visibility");
      menu_item_actived.style.visibility =
        menu_item_actived_visibility == "visible" ? "hidden" : "visible";
    }
  }
});
//含有子菜单的选项事件函数
var has_sub_menu = document.getElementsByClassName("has_sub_menu");
addEvent(has_sub_menu, "click", has_sub_menu_handle);
// addEvent(has_sub_menu, "mouseover",(e)=>{
//     var cur_sub_menu = e.target.getElementsByClassName("subMenu")[0];

//     cur_sub_menu.style.display="block";
// });
// addEvent(has_sub_menu, "mouseout",(e)=>{
//     var cur_sub_menu = e.target.getElementsByClassName("subMenu")[0];
//     cur_sub_menu.style.display="none";
// });
function has_sub_menu_handle(e) {
  e.stopPropagation();
  var cur_sub_menu = e.target.getElementsByClassName("subMenu")[0];

  var cur_sub_menu_dispaly = css(cur_sub_menu, "display");
  console.log(cur_sub_menu_dispaly);
  if (cur_sub_menu_dispaly == "block") {
    cur_sub_menu.style.display = "none";
  } else {
    cur_sub_menu.style.display = "block";
  }
}
//-------------------------------------------------------
//功能区func点击事件
//file区
//file_paint
function file_new() {
  if (content != "") {
    if (confirm("是否保存当前文件!")) {
      file_save();
      return;
    }
  }
  content = "";
  textarea.value = "";
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
function file_save() {
  if (!new Blob()) {
    alert("你的浏览器不支持 Blob ");
    return;
  }
  saveAs(textarea.value, "text");
}
//文件保存函数
function saveAs(data, name) {
  var link = document.createElement("a");
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
//文件func功能区
//file_new
var func_file_new = document.getElementsByClassName("file_new")[0];
func_file_new.addEventListener("click", file_new);
//file_open
var func_file_open = document.getElementsByClassName("file_open")[0];
func_file_open.addEventListener("click", file_open);
//file_save
var func_file_save = document.getElementsByClassName("file_save")[0];
func_file_save.addEventListener("click", file_save);
var func_file_close = document.getElementsByClassName("file_close");
addEvent(func_file_close, "click", file_close);
//编辑func功能区
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
//edit_find
var func_edit_find = document.getElementsByClassName("edit_find_func")[0];

func_edit_find.addEventListener("click", () => {
  var item = document.getElementsByClassName("edit_find_item")[0];
  console.log(item);
  item.click();
});
//视图func功能区
var func_view_scale_zoom_in = document.getElementsByClassName(
  "view_scale_zoom_in"
)[0];
func_view_scale_zoom_in.addEventListener("click", view_scale_zoom_in);
var func_view_scale_zoom_out = document.getElementsByClassName(
  "view_scale_zoom_out"
)[0];
func_view_scale_zoom_out.addEventListener("click", view_scale_zoom_out);

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
function view_scale_zoom_in() {
  var newVal = css(textarea, "fontSize") + 2;
  if (newVal >= 80) {
    alert("朋友,这不是巨人国");
    return;
  }
  textarea.style.fontSize = newVal + "px";
}
function view_scale_zoom_out() {
  var newVal = css(textarea, "fontSize") - 2;
  if (newVal <= 10) {
    alert("朋友,这不是小人国");
    return;
  }
  textarea.style.fontSize = newVal + "px";
}
//换行
function view_wrap() {
  var textarea_wrap = getAttr(textarea, "wrap");
  if (textarea_wrap == "on") {
    setAttr(textarea, "wrap", "off");
  } else {
    setAttr(textarea, "wrap", "on");
  }
}
//编辑功能实现
function edit_return() {
  historyIndex = historyArr.length - 1;
  if (historyIndex < historyArr.length && historyIndex > 0) {
    inputFn(historyArr[historyIndex - 1], true);
    historyArr.pop();
  }
  upadateFooterInfo();
}
function edit_cut() {
  if (selectedText) {
    copy = selectRange.data;

    content =
      content.substring(0, selectRange.start) +
      content.substring(selectRange.end);
    inputFn(content, false);
    alert("已剪切");
  }
}
function edit_copy() {
  if (selectedText) {
    copy = selectRange.data;
    alert("已复制");
  }
}
function edit_paste() {
  content =
    content.substring(0, inputPointer) + copy + content.substring(inputPointer);
  inputFn(content, false);
}
function edit_del() {
  if (selectedText) {
    content =
      content.substring(0, selectRange.start) +
      content.substring(selectRange.end);
    inputFn(content, false);
  }
}
function edit_select_all() {
  selectText(textarea, 0, textarea.value.length);
}
function edit_insert_time() {
  var time = new Date();
  var hour = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
  var minte =
    time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
  var year = time.getFullYear();
  var month = time.getMonth() + 1; //月份0-11
  var day = time.getDate();
  content =
    content.substring(0, inputPointer) +
    `${hour}:${minte} ${year}/${month}/${day}` +
    content.substring(inputPointer);
  textarea.value = content;
  upadateFooterInfo();
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
//对话框取消按钮点击事件
var cancelFinds = document.getElementsByClassName("cancelFind");
addEvent(cancelFinds, "click", (e) => {
  // e.stopPropagation();
  e.preventDefault();

  var dialogName = getAttr(e.target, "data-dialog");
  var dialog = document.getElementsByClassName(dialogName)[0];
  if (dialog) {
    dialog.style.display = "none";
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
//设置选中文字
function selectText(obj, startIndex, stopIndex) {
  console.log("首部" + startIndex, "尾部" + stopIndex);
  if (obj.setSelectionRange) {
    obj.setSelectionRange(startIndex, stopIndex);
  } else if (obj.createTextRange) {
    var range = obj.createTextRange();
    range.collapse(true);
    range.moveStart("character", startIndex);
    range.moveEnd("character", stopIndex - startIndex);
    range.select();
  }
  obj.focus();
  inputPointer = startIndex;
  selectedText = content.substring(startIndex, stopIndex);
  selectRange.start = startIndex;
  selectRange.end = stopIndex;
}

//dialog事件处理函数
//edit_find处理事件
var searchInput = "";
var case_sensitive = false;
var direction = "down";
var replaceInput = "";
var isReplace = false;
function find_form_handle(form) {
  isReplace = false;
  const formDate = new FormData(form);
  //直接打印是没有内容的
  searchInput = formDate.get("searchInput");
  case_sensitive = formDate.getAll("case_sensitive").length == 0 ? false : true;
  direction = formDate.getAll("direction")[0];
  findStrFunc();
  return false;
}
//找上一个
function edit_find_prev() {
  findStrFunc();
}
function edit_find_next() {
  findStrFunc();
}
function find_replace_form_handle(form) {
  isReplace = true;
  const formDate = new FormData(form);
  //直接打印是没有内容的
  searchInput = formDate.get("searchInput");
  replaceInput = formDate.get("replaceInput");
  case_sensitive = formDate.getAll("case_sensitive").length == 0 ? false : true;
  direction = formDate.getAll("direction")[0];
  findStrFunc();
  return false;
}
//查找函数业务层
function findStrFunc(setDirection) {
  // console.log("当前光标位置"+inputPointer);
  if (searchInput == "") {
    alert("未找到!请输入查找内容!");
  }
  var direction_cur = direction;
  if (setDirection) {
    direction_cur = setDirection;
  }
  // console.log("------------------");
  // console.log("旧指针"+inputPointer);
  var findIndex = findStr(
    searchInput,
    case_sensitive,
    inputPointer,
    direction_cur,
    replaceInput
  );
  // console.log("发现位置"+findIndex);
  // console.log("查询字符串长度"+searchInput.length);
  selectText(textarea, findIndex, findIndex + searchInput.length);
  if (
    isReplace &&
    replaceInput != "" &&
    findIndex >= 0 &&
    searchInput.length > 0
  ) {
    console.log("当前光标位置" + inputPointer);
    edit_cut();
    copy = replaceInput;
    edit_paste();
  }
  // console.log("------------------");
  if (findIndex == -1) {
    alert("未找到!");
    if (direction_cur == "up") {
      inputPointer = 0;
    } else {
      inputPointer = content.length;
    }
  } else {
    if (direction_cur == "up") {
      inputPointer = findIndex - 1;
    } else {
      inputPointer = findIndex + 1;
    }
  }
}
//查找函数核心层
function findStr(search, caseSensitive, curIndex, direction, repalce) {
  var startIndex = 0;
  var endIndex = content.length;
  if (direction == "up") {
    endIndex = curIndex;
  } else {
    startIndex = curIndex;
  }
  //console.log("endIndex", endIndex);
  if (curIndex < 0 || endIndex < 0) {
    return -1;
  }
  //var tempStr = content.substring(startIndex,endIndex);
  if (caseSensitive) {
    if (direction == "up") {
      return content.lastIndexOf(search, endIndex);
    } else {
      return content.indexOf(search, startIndex);
    }
  } else {
    if (direction == "up") {
      return content.toLowerCase().lastIndexOf(search, endIndex);
    } else {
      return content.toLowerCase().indexOf(search, startIndex);
    }
  }
}
