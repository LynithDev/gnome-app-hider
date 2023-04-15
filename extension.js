const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Main = imports.ui.main;

const { AppMenuPatcher } = Me.imports.patches.appMenuPatcher;
const { AppDisplayPatcher } = Me.imports.patches.appDisplayPatcher;

var settings = null;

var GnomeAppHiderExtension = class Extension {
    constructor(id) {
        this._id = id;
    }
    
    enable() {
        settings = ExtensionUtils.getSettings(this._id);
        this.appMenuPatcher = new AppMenuPatcher();
        this.appDisplayPatcher = new AppDisplayPatcher();

        settings.connect("changed::hidden-apps", () => {
            Main.overview._overview.controls.appDisplay._redisplay();
        });

        this.appMenuPatcher.enable();
        this.appDisplayPatcher.enable();
    }

    disable() {
        this.appMenuPatcher.disable();
        this.appDisplayPatcher.disable();

        this.appMenuPatcher = null;
        this.appDisplayPatcher = null;
        settings = null;
    }
}

function init() {
    return new GnomeAppHiderExtension(Me.metadata["schema-id"]);
}
