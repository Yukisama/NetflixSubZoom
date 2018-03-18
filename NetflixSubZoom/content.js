var subdiv = null;
var bc = null;
var observer = null;
var bcinit = true;
var _zoomSize = 1.5;
var _bgColor = "#000000";
var _bgOpacity = 0.6;
var _fixedBottom = true;
var _bottomOffset = 0.02;

//make svg
function makeSVG(tag, attrs) {
    let el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (let k in attrs) {
        el.setAttribute(k, attrs[k]);
    }
    return el;
}

//subtitle background color
function backColor(x, y, w, h, rgb, opacity) {
    let rect = makeSVG("rect", {
        "x": x,
        "y": y,
        "width": w,
        "height": h,
        "stroke": "none",
        "fill": rgb,
        "fill-opacity": opacity,
        "class": "backfc"
    });
    bc.appendChild(rect);
}

//subtitle zoom
function subtitleZoom(size) {
    
    if (subdiv === null) { return; }
    
    let targets = subdiv.querySelectorAll("svg[viewBox]");
    if (targets.length==0) { return; }
    let target = targets[targets.length - 1];
    
    let sublist = target.querySelectorAll("svg image[x][y][width][height]");
    if (sublist.length == 1) {
        sublist.forEach((sub) => {
            let svgw = target.viewBox.baseVal.width;
            let svgh = target.viewBox.baseVal.height;
            let subx = parseFloat(sub.getAttribute("x")) || 0;
            let suby = parseFloat(sub.getAttribute("y")) || 0;
            let subw = parseFloat(sub.getAttribute("width")) || 0;
            let subh = parseFloat(sub.getAttribute("height")) || 0;

            subw = (subw * size).toFixed();
            subh = (subh * size).toFixed();
            subx = ((svgw - subw) / 2).toFixed();
            suby = (_fixedBottom === true) ? (svgh - subh - (svgh * _bottomOffset)).toFixed() : (suby + ((subh * (1 - size)) / 2)).toFixed();

            if (subx <= 0) { subx = 0; }
            if (subx >= (svgw - subw) && subw <= svgw) { subx = (svgw - subw); }
            if (suby <= 0) { suby = 0; }
            if (suby >= (svgh - subh) && suby <= svgh) { suby = (svgh - subh); }

            sub.setAttribute("x", subx);
            sub.setAttribute("y", suby);
            sub.setAttribute("width", subw);
            sub.setAttribute("height", subh);
            backColor(subx, suby, subw, subh, _bgColor, _bgOpacity);
        });
    }
}

//subtitle change
function subtitleChange(mutations) {
    clearChange();
    subtitleZoom(_zoomSize);
    executeCommand({
        cmd: commonLookup.actlist.playing
    });
}

//clear change
function clearChange() {
    if (observer !== undefined && observer !== null && observer.disconnect !== undefined) {
        observer.disconnect();
    }
    if (bc != null && bc.querySelectorAll !== undefined) {
        bc.querySelectorAll(".backfc").forEach((f) => {
            bc.removeChild(f);
        });
    }
}

//execute command
function executeCommand(msg) {
    if (msg.cmd === commonLookup.actlist.init) {
        clearChange();
        commonLookup.getUserNszSetting().then((nsz) => {
            _zoomSize = nsz.userNszSetting.zoomSize;
            _bgColor = nsz.userNszSetting.bgColor;
            _bgOpacity = (nsz.userNszSetting.bgOpacity/100);
            _fixedBottom = nsz.userNszSetting.fixedBottom;
            _bottomOffset = (nsz.userNszSetting.bottomOffset/100);
        });
        subdiv = null;
        bc = null;
        observer = null;
        bcinit = true;
    }
    
    let targets = document.querySelectorAll("div.image-based-timed-text svg[viewBox]");
    if (targets.length === 0) { 
        window.setTimeout(function () { executeCommand({ cmd: commonLookup.actlist.playing });  }, 2000);
        return;
    }

    let target = targets[targets.length - 1];
    if (bcinit == true) {
        bcinit = false;
        subdiv = document.querySelector("div.image-based-timed-text");
        document.querySelectorAll("#backfc").forEach((old) => {
            subdiv.removeChild(old);
        });
        bc = target.cloneNode(false);
        bc.setAttribute("id", "backfc");
        subdiv.insertBefore(bc, target);
    }

    let config = {
        attributes: true,
        childList: true,
        characterData: true
    };
    observer = new MutationObserver(subtitleChange);
    observer.observe(target, config);
}

//page listener
browser.runtime.onMessage.addListener(executeCommand);