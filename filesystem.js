const arrowIcon = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 320 512\" class=\"icon\"><path d=\"M143 352.3 7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z\"></path></svg>";

function addFolder(faFloor, faId, id, icon, name, func) {
    var fa = document.getElementById("folder-" + faFloor + "-" + faId);
    if (fa == undefined) throw Error("你🏇不存在, ErrorNode: " + "folder-" + faFloor + "-" + faId);
    var son = document.createElement("div");
    son.id = "folder-" + (faFloor + 1) + "-" + id; son.className = "filesystem";
    // 构造信息
    var info = document.createElement("div"); info.className = "flex"; info.className = "filesystem_info flex";
    var icon2 = document.createElement("a"); icon2.innerHTML = arrowIcon;
    icon2.id = "folder-" + (faFloor + 1) + "-" + id + "-arrowIcon";
    icon2.style.transform = "rotate(-90deg)"; icon2.style.paddingTop = icon2.style.paddingBottom = "5px";
    info.appendChild(icon2);
    icon2 = document.createElement("a"); icon2.innerHTML = icon;
    icon2.id = "folder-" + (faFloor + 1) + "-" + id + "-icon";
    info.appendChild(icon2);
    var name2 = document.createElement("p"); name2.innerHTML = name;
    name2.id = "folder-" + (faFloor + 1) + "-" + id + "-name";
    name2.style.width = "calc(100% - " + (35 + faFloor * 20 + 5 + 25 * (func.length + 1)) + "px)";
    info.appendChild(name2);
    for (var i = 0; i < func.length; i++) {
        if (func[i]["icon"] == undefined || func[i]["func"] == undefined) throw Error("你🐦不存在, ErrorNode: folder-" + (faFloor + 1) + "-" + id + "-icon" + i);
        var icon = document.createElement("a"); icon.innerHTML = func[i]["icon"];
        icon.id = "folder-" + (faFloor + 1) + "-" + id + "-icon" + i;
        icon.style.opacity = 0;
        const floor = faFloor + 1, id2 = id, callback = func[i]["func"];
        icon.onclick = function(){
            callback(floor, id2);
            event.stopPropagation();
        }; info.appendChild(icon);
    }
    const icons = func;
    info.onmouseover = function(){
        for (var i = 0; i < icons.length; i++) {
            document.getElementById("folder-" + (faFloor + 1) + "-" + id + "-icon" + i).style.opacity = 1;
        }
    }
    info.onmouseleave = function(){
        for (var i = 0; i < icons.length; i++) {
            document.getElementById("folder-" + (faFloor + 1) + "-" + id + "-icon" + i).style.opacity = 0;
        }
    }
    son.setAttribute("opened", 0);
    if (fa.getAttribute("opened") == 1) son.style.display = "";
    else son.style.display = "none";
    info.onclick = function(){
        if (fa.getAttribute("opened") == 0) {
            fa.setAttribute("opened", 1);
            document.getElementById("folder-" + (faFloor + 1) + "-" + id + "-arrowIcon").style.transform = "rotate(0deg)";
            for (var i = 0; i < son.childNodes.length; i++) {
                if (son.childNodes[i].className == "filesystem") son.childNodes[i].style.display = "";
            }
        } else {
            fa.setAttribute("opened", 0);
            document.getElementById("folder-" + (faFloor + 1) + "-" + id + "-arrowIcon").style.transform = "rotate(-90deg)";
            for (var i = 0; i < son.childNodes.length; i++) {
                if (son.childNodes[i].className == "filesystem") son.childNodes[i].style.display = "none";
            }
        }
    }
    son.appendChild(info);
    fa.appendChild(son);
}

function addFile(faFloor, faId, id, icon, name, func) {
    var fa = document.getElementById("folder-" + faFloor + "-" + faId);
    if (fa == undefined) throw Error("你🏇不存在, ErrorNode: " + "folder-" + faFloor + "-" + faId);
    var son = document.createElement("div");
    son.id = "file-" + (faFloor + 1) + "-" + id; son.className = "filesystem";
    // 构造信息
    var info = document.createElement("div"); info.className = "flex"; info.className = "filesystem_info flex";
    var icon2 = document.createElement("a"); icon2.innerHTML = icon;
    icon2.id = "file-" + (faFloor + 1) + "-" + id + "-icon";
    info.appendChild(icon2);
    var name2 = document.createElement("p"); name2.innerHTML = name;
    name2.id = "file-" + (faFloor + 1) + "-" + id + "-name";
    name2.style.width = "calc(100% - " + (35 + faFloor * 20 + 5 + 25 * (func.length + 1)) + "px)";
    info.appendChild(name2);
    for (var i = 0; i < func.length; i++) {
        if (func[i]["icon"] == undefined || func[i]["func"] == undefined) throw Error("你🐦不存在, ErrorNode: folder-" + (faFloor + 1) + "-" + id + "-icon" + i);
        var icon = document.createElement("a"); icon.innerHTML = func[i]["icon"];
        icon.id = "file-" + (faFloor + 1) + "-" + id + "-icon" + i;
        icon.style.opacity = 0;
        const floor = faFloor + 1, id2 = id, callback = func[i]["func"];
        icon.onclick = function(){
            callback(floor, id2);
            event.stopPropagation();
        }; info.appendChild(icon);
    }
    const icons = func;
    info.onmouseover = function(){
        for (var i = 0; i < icons.length; i++) {
            document.getElementById("file-" + (faFloor + 1) + "-" + id + "-icon" + i).style.opacity = 1;
        }
    }
    info.onmouseleave = function(){
        for (var i = 0; i < icons.length; i++) {
            document.getElementById("file-" + (faFloor + 1) + "-" + id + "-icon" + i).style.opacity = 0;
        }
    }
    if (fa.getAttribute("opened") == 0) son.style.display = "none";
    son.appendChild(info);
    fa.appendChild(son);
}