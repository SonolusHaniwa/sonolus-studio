const toggleConfig = [
    {
        title: "文件",
        subtoggle: [
            [
                {
                    text: "新建资源包",
                    shortcutText: "Ctrl + Alt + N",
                    callback: function(){
                        
                    },
                    shortcut: {
                        ctrl: true,
                        alt: true,
                        shift: false,
                        key: 78
                    }
                }, {
                    text: "打开资源包...",
                    shortcutText: "Ctrl + O",
                    callback: function(){
                        
                    },
                    shortcut: {
                        ctrl: true,
                        alt: false,
                        shift: false,
                        key: 79
                    }
                }, {
                    text: "保存资源包",
                    shortcutText: "Ctrl + S",
                    callback: function(){
                        
                    },
                    shortcut: {
                        ctrl: true,
                        alt: false,
                        shift: false,
                        key: 83
                    }
                }
            ]
        ]
    }, {
        title: "新建",
        subtoggle: [
            [
                {
                    text: "新建皮肤",
                    callback: function(){

                    }
                }, {
                    text: "新建背景",
                    callback: function(){

                    }
                }, {
                    text: "新建音效",
                    callback: function(){

                    }
                }, {
                    text: "新建粒子效果",
                    callback: function(){

                    }
                }
            ]
        ]
    }
];

function addKeyDownEvent(callback) {
    var oldonkeydown = window.onkeydown;
    if (typeof window.onkeydown != 'function') {
        window.onkeydown = callback;
    } else {
        window.onkeydown = function(e){
            oldonkeydown(e);
            callback(e);
        }
    }
}

function getPosition(id) {
    return document.getElementById(id).getBoundingClientRect();
}

function clearToggleState() {
    var toggles = document.getElementsByTagName("toggleContent");
    for (i = 0; i < toggles.length; i++) {
        toggles[i].style.opacity = 0;
        toggles[i].style.display = "";
    } var toggleRoots = document.getElementsByTagName("toggle");
    for (i = 0; i < toggleRoots.length; i++) {
        toggleRoots[i].style.backgroundColor = "";
    }
}

function createToggle(toggle, id) {
    // 构造 Toggle
    var toggleRoot = document.createElement("toggle");
    toggleRoot.innerHTML = toggle.title; toggleRoot.id = "toggle-#" + id;
    toggleRoot.onclick = function(){
        if (document.getElementById("toggleContent-#" + id).style.opacity == 0) {
            clearToggleState();
            document.getElementById("toggleContent-#" + id).style.opacity = 1;
            document.getElementById("toggleContent-#" + id).style.display = "flex";
            this.style.backgroundColor = "rgb(64, 64, 64)";
        } else {
            document.getElementById("toggleContent-#" + id).style.opacity = 0;
            document.getElementById("toggleContent-#" + id).style.display = "none";
            this.style.backgroundColor = "";
        }
    }; document.getElementById("toggleRoot").appendChild(toggleRoot);
    // 构造 ToggleContent
    var toggleContent = document.createElement("toggleContent");
    for (var i = 0; i < toggle.subtoggle.length; i++) {
        var item = toggle.subtoggle[i];
        for (var j = 0; j < item.length; j++) {
            var toggleItem = document.createElement("toggleItem");
            var toggleText = document.createElement("toggleText");
            toggleText.innerHTML = item[j].text;
            toggleItem.appendChild(toggleText);
            console.log(item[j]);
            if (item[j].shortcutText != undefined) {
                var toggleShortcut = document.createElement("toggleShortcut");
                toggleShortcut.innerHTML = item[j].shortcutText;
                toggleItem.appendChild(toggleShortcut);
            } if (item[j].callback != undefined) {
                const func = item[j].callback;
                toggleItem.onclick = function() {
                    clearToggleState();
                    func();
                };
                if (item[j].shortcut != undefined) {
                    addShortcut(item[j].shortcut.ctrl, item[j].shortcut.alt, item[j].shortcut.shift, item[j].shortcut.key, item[j].callback);
                }
            } else toggleItem.onclick = clearToggleState();
            toggleContent.appendChild(toggleItem);
        } if (i != toggle.subtoggle.length - 1) toggleContent.appendChild(document.createElement("hr"));
    }
    toggleRoot = getPosition("toggle-#" + id);
    toggleContent.id = "toggleContent-#" + id;
    toggleContent.style.left = toggleRoot.x + "px";
    toggleContent.style.top = (toggleRoot.y + toggleRoot.height) + "px";
    document.getElementById("toggleRoot").appendChild(toggleContent);
}

function addShortcut(ctrl, alt, shift, key, callback) {
    addKeyDownEvent(function(e){
        var keyCode = e.keyCode;
        var ctrlKey = e.ctrlKey || e.metaKey;
        var altKey = e.altKey;
        var shiftKey = e.shiftKey;
        if (ctrlKey == ctrl && altKey == alt && shiftKey == shift && keyCode == key) {
            callback();
            e.preventDefault();
        }
    });
}

addLoadEvent(function(){
    document.addEventListener("click", function(e){
        if (e.target.id != "toggleRoot" && e.target.localName != "toggle" &&
            e.target.localName != "togglecontent" && e.target.localName != "toggleitem" &&
            e.target.localName != "toggletext" && e.target.localName != "toggleshortcut") {
            clearToggleState();
        }
    });
});

addLoadEvent(function(){
    var nav = document.getElementById("toggleRoot");
    var favicon = document.createElement("img"); favicon.src = "/favicon.png";
    nav.appendChild(favicon);
    for (var i = 0; i < toggleConfig.length; i++) createToggle(toggleConfig[i], i);
    var title = document.createElement("toggleTitle"); title.innerHTML = "未命名.srp";
    nav.appendChild(title);
    nav.style.opacity = 1;
});