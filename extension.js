const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Main = imports.ui.main;

const { AppMenuPatcher } = Me.imports.patches.appMenuPatcher;
const { AppDisplayPatcher } = Me.imports.patches.appDisplayPatcher;

class Extension {
    constructor() {
        this.settings = ExtensionUtils.getSettings("dev.lynith.gnome.app-hider");

        this.appMenuPatcher = new AppMenuPatcher();
        this.appDisplayPatcher = new AppDisplayPatcher();
    }

    enable() {
        this.settings.connect("changed::hidden-apps", () => {
            console.log("Hidden apps changed");
            Main.overview._overview.controls.appDisplay._redisplay();
        });

        this.appMenuPatcher.enable();
        this.appDisplayPatcher.enable();
    }

    disable() {
        this.appMenuPatcher.disable();
        this.appDisplayPatcher.disable();
    }
}

function init() {
    return new Extension();
}
