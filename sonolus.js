function addLoadEvent(f) {
    var old = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = f;
    } else {
        window.onload = function () {
            old();
            f();
        }
    }
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function readComponent(path) {
    var request = new XMLHttpRequest();
    request.open('GET', path, false);
    request.send(null);
    return request.responseText;
}

function htmlToElement(html) {
    var template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstChild;
}

function str_replace(source, args) {
    var result = source;
    for (k in args) result = result.replace(new RegExp('\\{{' + k + '\\}}', 'g'), args[k]);
    return result;
}

async function readBinaryFile(FileObject) {
    var reader = new FileReader();
    var result; var finish = false;
    reader.readAsArrayBuffer(FileObject);
    reader.onload = function(e) {
        finish = true;
        result = this.result;
    }
    while (!finish) await sleep(10);
    return result;
}

async function uploader(data) {
    var blob = new Blob([data], {type: "application/octet-stream"});
    return URL.createObjectURL(blob);
}

var searchConfig = {};
var enableResetClass = "flex select-none space-x-2 p-2 transition-colors sm:space-x-3 sm:p-3 cursor-pointer bg-sonolus-ui-button-normal hover:bg-sonolus-ui-button-highlighted active:bg-sonolus-ui-button-pressed";
var disableResetClass = "flex select-none space-x-2 p-2 transition-colors sm:space-x-3 sm:p-3 pointer-events-none bg-sonolus-ui-button-disabled text-sonolus-ui-text-disabled";
var i18nYes = "Yes";
var i18nNo = "No";
var classYes = "h-full w-1/2 transition-all translate-x-full bg-sonolus-success";
var classNo = "h-full w-1/2 transition-all bg-sonolus-warning";

function searchText(query, name, placeholder, def, isMargin, e) {
    var source = readComponent("./components/searchText.html");
    e.appendChild(htmlToElement(str_replace(source, {
        "search.query": query,
        "search.name": name,
        "search.placeholder": placeholder,
        "search.isMargin": isMargin ? "style=\"margin-top: 12px;\"" : "",
        "search.default": def,
    })));
    const D = def;
    searchConfig[query] = D;
    document.getElementById("search-reset-" + query).onclick = function(){
        searchConfig[query] = D;
        document.getElementById("search-" + query).value = D;
        document.getElementById("search-reset-" + query).className = disableResetClass;
    };
    document.getElementById("search-clear-" + query).onclick = function(){
        searchConfig[query] = "";
        document.getElementById("search-" + query).value = "";
        document.getElementById("search-reset-" + query).className = (String(D) === "") ? disableResetClass : enableResetClass;
    };
    document.getElementById("search-" + query).oninput = function(){
        searchConfig[query] = this.value;
        document.getElementById("search-reset-" + query).className = (String(this.value) === String(D)) ? disableResetClass : enableResetClass;
    };
}

function searchToggle(query, name, def, isMargin, e) {
    var source = readComponent("./components/searchToggle.html");
    e.appendChild(htmlToElement(str_replace(source, {
        "search.query": query,
        "search.name": name,
        "search.isMargin": isMargin ? "style=\"margin-top: 12px;\"" : "",
        "search.default": def,
    })));
    const D = def;
    searchConfig[query] = 0;
    document.getElementById("search-" + query).onclick = function(){
        searchConfig[query] = 1 - searchConfig[query];
        document.getElementById("search-info-" + query).innerHTML = searchConfig[query] ? i18nYes : i18nNo;
        if (searchConfig[query] == D) document.getElementById("search-reset-" + query).className = disableResetClass;
        else document.getElementById("search-reset-" + query).className = enableResetClass;
        if (searchConfig[query]) document.getElementById("search-button-" + query).className = classYes;
        else document.getElementById("search-button-" + query).className = classNo;

    };
    document.getElementById("search-reset-" + query).onclick = function(){
        if (searchConfig[query] != D) document.getElementById("search-" + query).click();
    };
    if (D == 1) document.getElementById("search-" + query).click();
}

function searchSelect(query, name, options, def, isMargin, e) {
    var source = readComponent("./components/searchSelect.html");
    var searchOptions = "";
    for (var i = 0; i < options.length; i++) {
        var E = document.createElement("option");
        E.className = "bg-sonolus-ui-surface";
        E.id = "search-" + query + "-" + i;
        E.value = i;
        E.innerHTML = options[i];
        if (i == def) E.setAttribute("selected", "selected");
        searchOptions += E.outerHTML;
    }
    e.appendChild(htmlToElement(str_replace(source, {
        "search.query": query,
        "search.name": name,
        "search.isMargin": isMargin ? "style=\"margin-top: 12px;\"" : "",
        "search.defaultValues": def < options.length && def >= 0 ? options[def] : "",
        "search.default": def,
        "search.options": searchOptions,
    })));
    const D = def;
    searchConfig[query] = D;
    document.getElementById("search-" + query).oninput = function(){
        searchConfig[query] = this.value;
        document.getElementById("search-info-" + query).innerHTML = document.getElementById("search-" + query + "-" + searchConfig[query]).innerHTML;
        if (searchConfig[query] == D) document.getElementById("search-reset-" + query).className = disableResetClass;
        else document.getElementById("search-reset-" + query).className = enableResetClass;
    }
    document.getElementById("search-reset-" + query).onclick = function(){
        searchConfig[query] = D;
        document.getElementById("search-" + query).value = D;
        document.getElementById("search-info-" + query).innerHTML = document.getElementById("search-" + query + "-" + searchConfig[query]).innerHTML;
        document.getElementById("search-reset-" + query).className = disableResetClass;
    }
}

function searchSlider(query, name, def, min, max, step, isMargin, e) {
    var source = readComponent("./components/searchSlider.html");
    e.appendChild(htmlToElement(str_replace(source, {
        "search.query": query,
        "search.name": name,
        "search.isMargin": isMargin ? "style=\"margin-top: 12px;\"" : "",
        "search.default": def,
        "search.min": min,
        "search.max": max,
        "search.step": step,
    })));
    const D = def;
    const min2 = min;
    const max2 = max;
    const step2 = step;
    searchConfig[query] = D;
    const block = document.getElementById("search-block-" + query);
    const nMax = document.getElementById("search-block-full-" + query).clientWidth;
    const info = document.getElementById("search-info-" + query);
    const reset = document.getElementById("search-reset-" + query);
    const siz = Math.round((max2 - min2) / step2);
    block.style.setProperty("--tw-scale-x", (D - min2) / (max2 - min2));
    document.getElementById("search-" + query).onmousedown = function(event){
        var nWidth = block.getBoundingClientRect().left;
        var nX = event.clientX - nWidth;
        if (nX > nMax) nX = nMax;
        if (nX < 0) nX = 0;
        var value = Math.round(nX / nMax * siz);
        info.innerHTML = value + min2;
        if (value + min2 == D) reset.className = disableResetClass;
        else reset.className = enableResetClass;
        searchConfig[query] = value + min2;
        block.style.setProperty("--tw-scale-x", value / siz);
        document.onmousemove = function(event){
            event.preventDefault();
            var nX = event.clientX - nWidth;
            if (nX > nMax) nX = nMax;
            if (nX < 0) nX = 0;
            var value = Math.round(nX / nMax * siz);
            info.innerHTML = value + min2;
            if (value + min2 == D) reset.className = disableResetClass;
            else reset.className = enableResetClass;
            searchConfig[query] = value + min2;
            block.style.setProperty("--tw-scale-x", value / siz);
        };
        document.onmouseup = function(event){
            document.onmousemove = null;
            document.onmouseup = null;
        }
    };
    document.getElementById("search-left-" + query).onclick = function(){
        if (searchConfig[query] == min2) return false;
        var s = --searchConfig[query];
        block.style.setProperty("--tw-scale-x", (s - min2) / (max2 - min2));
        info.innerHTML = searchConfig[query];
        if (searchConfig[query] == D) reset.className = disableResetClass;
        else reset.className = enableResetClass;
    };
    document.getElementById("search-right-" + query).onclick = function(){
        if (searchConfig[query] == max2) return false;
        var s = ++searchConfig[query];
        block.style.setProperty("--tw-scale-x", (s - min2) / (max2 - min2));
        info.innerHTML = searchConfig[query];
        if (searchConfig[query] == D) reset.className = disableResetClass;
        else reset.className = enableResetClass;
    };
    document.getElementById("search-reset-" + query).onclick = function(){
        searchConfig[query] = D;
        block.style.setProperty("--tw-scale-x", (D - min2) / (max2 - min2));
        info.innerHTML = searchConfig[query];
        reset.className = disableResetClass;
    };
}

function searchFile(query, name, isMargin, e, callback = uploader) {
    var source = readComponent("./components/searchFile.html");
    e.appendChild(htmlToElement(str_replace(source, {
        "search.query": query,
        "search.name": name,
        "search.isMargin": isMargin ? "style=\"margin-top: 12px;\"" : "",
    })));
    const D = "";
    searchConfig[query] = "";
    document.getElementById("search-reset-" + query).onclick =
    document.getElementById("search-clear-" + query).onclick = function(){
        searchConfig[query] = D;
        document.getElementById("search-" + query).value = D;
        document.getElementById("search-reset-" + query).className = disableResetClass;
    };
    document.getElementById("search-" + query).oninput = function(){
        searchConfig[query] = this.value;
        if (this.value == D) document.getElementById("search-reset-" + query).className = disableResetClass;
        else document.getElementById("search-reset-" + query).className = enableResetClass;
    };
    document.getElementById("search-file-" + query).oninput = async function(){
        document.getElementById("search-" + query).value = await callback(await readBinaryFile(this.files[0]));
        searchConfig[query] = document.getElementById("search-" + query).value;
        document.getElementById("search-reset-" + query).className = enableResetClass;
        document.getElementById("search-file-" + query).value = "";
    }
    document.getElementById("search-upload-" + query).onclick = function() {
        document.getElementById("search-file-" + query).click();
    };
}

function searchTitle(name, level, isMargin, e) {
    var source = readComponent("./components/searchTitle.html");
    e.appendChild(htmlToElement(str_replace(source, {
        "search.name": name,
        "search.level": level,
        "search.isMargin": isMargin ? "style=\"margin-top: 12px;\"" : "",
        "search.isStyle": isMargin ? "style=\"padding-top: " + to_string((7 - level) * 12) + "px\"" : ""
    })));
}

function searchColor(query, name, def, isMargin, e) {
    var source = readComponent("./components/searchColor.html");
    e.appendChild(htmlToElement(str_replace(source, {
        "search.query": query,
        "search.name": name,
        "search.isMargin": isMargin ? "style=\"margin-top: 12px;\"" : "",
        "search.default": def
    })));
    const D = def; searchConfig[query] = D;
    document.getElementById("search-reset-" + query).onclick =
    document.getElementById("search-clear-" + query).onclick = function(){
        searchConfig[query] = D;
        document.getElementById("search-choose-" + query).value = D;
        document.getElementById("search-" + query).value = D;
        document.getElementById("search-reset-" + query).className = disableResetClass;
    };
    document.getElementById("search-color-" + query).onclick = function(){
        document.getElementById("search-choose-" + query).click();
    }
    document.getElementById("search-" + query).oninput = function(){
        searchConfig[query] = this.value;
        document.getElementById("search-choose-" + query).value = this.value;
        if (this.value == D) document.getElementById("search-reset-" + query).className = disableResetClass;
        else document.getElementById("search-reset-" + query).className = enableResetClass;
    }
    document.getElementById("search-choose-" + query).oninput = function(){
        searchConfig[query] = this.value;
        document.getElementById("search-" + query).value = this.value;
        if (this.value == D) document.getElementById("search-reset-" + query).className = disableResetClass;
        else document.getElementById("search-reset-" + query).className = enableResetClass;
    }
}

function search(config, e) {
    for (var i = 0; i < config.length; i++) {
        if (config[i].type == "text") searchText(config[i].query, config[i].name, config[i].placeholder, config[i].def, i == 0, e);
        else if (config[i].type == "toggle") searchToggle(config[i].query, config[i].name, config[i].def, i == 0, e);
        else if (config[i].type == "select") searchSelect(config[i].query, config[i].name, config[i].options, config[i].def, i == 0, e);
        else if (config[i].type == "slider") searchSlider(config[i].query, config[i].name, config[i].def, config[i].min, config[i].max, config[i].step, i == 0, e);
        else if (config[i].type == "file") searchFile(config[i].query, config[i].name, i == 0, e);
        else if (config[i].type == "title") searchTitle(config[i].name, config[i].level, i == 0, e);
        else if (config[i].type == "color") searchColor(config[i].query, config[i].name, config[i].def, i == 0, e);
    }
}