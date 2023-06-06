const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Main = imports.ui.main;

const { AppMenuPatcher } = Me.imports.patches.appMenuPatcher;
const { AppDisplayPatcher } = Me.imports.patches.appDisplayPatcher;

var GnomeAppHiderExtension = class Extension {
    constructor() {}
    
    enable() {
        this.settings = ExtensionUtils.getSettings();

        this.settings.connect("changed::hidden-apps", () => {
            Main.overview._overview.controls.appDisplay._redisplay();
        });

        this.appMenuPatcher = new AppMenuPatcher(this.settings);
        this.appDisplayPatcher = new AppDisplayPatcher(this.settings);

        this.appMenuPatcher.enable();
        this.appDisplayPatcher.enable();
    }

    disable() {
        this.appMenuPatcher.disable();
        this.appDisplayPatcher.disable();

        this.appMenuPatcher = null;
        this.appDisplayPatcher = null;
        this.settings = null;
    }
}

function init() {
    ExtensionUtils.initTranslations(Me.metadata.uuid);

    return new GnomeAppHiderExtension();
}
