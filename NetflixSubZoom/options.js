//page ready
function pageReady() {
    //i18n message support for page elements
    let eles = Array.from(document.querySelectorAll("[data-i18n]"));
    eles.forEach(tag => {
        tag.textContent = browser.i18n.getMessage(tag.getAttribute("data-i18n"));
    });

    //get option settings
    commonLookup.getUserNszSetting().then((nsz)=>{showOptionSettings(nsz.userNszSetting);});    
}

//show option settings
function showOptionSettings(setting) {
    document.querySelector("#inpZoomSize").value = setting.zoomSize;
    document.querySelector("#inpBgColor").value = setting.bgColor;
    document.querySelector("#inpBgOpacity").value = setting.bgOpacity;
    document.querySelector("#inpFixedBottom").checked = setting.fixedBottom;
    document.querySelector("#inpBottomOffset").value = setting.bottomOffset;
    updateLabelData();
}

//set option settings
function setOptionSettings(e) {
    let nsz = {
        zoomSize: document.querySelector("#inpZoomSize").value,
        bgColor: document.querySelector("#inpBgColor").value,
        bgOpacity: document.querySelector("#inpBgOpacity").value,
        fixedBottom: document.querySelector("#inpFixedBottom").checked,
        bottomOffset: document.querySelector("#inpBottomOffset").value,
    }
    browser.storage.local.set({
        "userNszSetting": nsz
    });
    document.querySelector("#lblSaved").style.visibility = "visible";
    e.preventDefault();
}

//clear saved message
function clearSavedMessage() {
    document.querySelector("#lblSaved").style.visibility = "hidden";
    updateLabelData();
}

//update label data
function updateLabelData(){
    document.querySelector("#lblZoomSize").textContent = document.querySelector("#inpZoomSize").value;
    document.querySelector("#lblBgColor").textContent = document.querySelector("#inpBgColor").value;
    document.querySelector("#lblBgOpacity").textContent = document.querySelector("#inpBgOpacity").value;
    document.querySelector("#lblBottomOffset").textContent = document.querySelector("#inpBottomOffset").value;
}

//clear saved message
function resetOptionSettings() {
    clearSavedMessage();
    showOptionSettings(commonLookup.defaultNszSetting);
}

//page listener
document.addEventListener("DOMContentLoaded", pageReady);
document.querySelector("form").addEventListener("submit", setOptionSettings);
document.querySelector("#inpResetSettings").addEventListener("click", resetOptionSettings);
document.querySelectorAll("form input").forEach((e) => e.addEventListener("change", clearSavedMessage));
document.querySelectorAll("form input").forEach((e) => e.addEventListener("keypress", clearSavedMessage));
document.querySelectorAll("select").forEach((e) => e.addEventListener("change", clearSavedMessage));