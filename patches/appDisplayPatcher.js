const { BaseAppView, AppDisplay, FolderView } = imports.ui.appDisplay;
const Main = imports.ui.main;

var AppDisplayPatcher = class AppDisplayPatcher {
    constructor(settings) {
        this.settings = settings;
    }

    _patchAppView() {
        let SETTINGS = this.settings;

        AppDisplay.prototype._hider_originalLoadApps = AppDisplay.prototype._loadApps;
        AppDisplay.prototype._loadApps = function() {
            let apps = this._hider_originalLoadApps();
            return apps.filter(app => !SETTINGS.get_strv("hidden-apps").includes(app.id));
        }

        FolderView.prototype._hider_originalLoadApps = FolderView.prototype._loadApps;
        FolderView.prototype._loadApps = function() {
            let apps = this._hider_originalLoadApps();
            return apps.filter(app => !SETTINGS.get_strv("hidden-apps").includes(app.id));
        }

        Main.overview._overview.controls.appDisplay._redisplay();
    }

    _unpatchAppView() {
        FolderView.prototype._loadApps = FolderView.prototype._hider_originalLoadApps;
        delete FolderView.prototype._hider_originalLoadApps;

        AppDisplay.prototype._loadApps = AppDisplay.prototype._hider_originalLoadApps;
        delete AppDisplay.prototype._hider_originalLoadApps;

        Main.overview._overview.controls.appDisplay._redisplay();
    }

    enable() {
        this._patchAppView();
    }

    disable() {
        this._unpatchAppView();
    }
}