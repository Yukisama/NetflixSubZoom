//command lookup
const commonLookup = {
    actlist: {
        init: "1",
        playing: "2"
    },
    defaultNszSetting: {
        zoomSize: 1.5,
        bgColor: "#000000",
        bgOpacity: 60,
        fixedBottom: true,
        bottomOffset: 2
    },
    getUserNszSetting() {
        return browser.storage.local.get({
            userNszSetting: commonLookup.defaultNszSetting
        });
    }
};