const { BaseAppView, AppDisplay, FolderView, AppSearchProvider } = imports.ui.appDisplay;
const Main = imports.ui.main;

var AppDisplayPatcher = class AppDisplayPatcher {
    constructor(settings) {
        this.settings = settings;
    }

    _patchAppSearchProvider() {
        AppSearchProvider.prototype._original_getInitialResultSet = AppSearchProvider.prototype.getInitialResultSet;

        let SETTINGS = this.settings;
        AppSearchProvider.prototype.getInitialResultSet = async function(terms, cancellable) {
            try {
                let resultSet = await this._original_getInitialResultSet(terms, cancellable);

                let hiddenSearchApps = SETTINGS.get_strv("hidden-search-apps");
                resultSet = resultSet.filter(app => !hiddenSearchApps.includes(app));

                return new Promise((resolve) => resolve(resultSet));
            } catch (e) {
                return this._original_getInitialResultSet(terms, cancellable);
            }
        }
    }

    _unpatchAppSearchProvider() {
        AppSearchProvider.prototype.getInitialResultSet = AppSearchProvider.prototype._original_getInitialResultSet;
        delete AppSearchProvider.prototype._original_getInitialResultSet;
    }

    _patchAppView() {
        let SETTINGS = this.settings;

        AppDisplay.prototype._hider_originalLoadApps = AppDisplay.prototype._loadApps;
        AppDisplay.prototype._loadApps = function() {
            return this._hider_originalLoadApps().filter(app => !SETTINGS.get_strv("hidden-apps").includes(app.id));
        }

        FolderView.prototype._hider_originalLoadApps = FolderView.prototype._loadApps;
        FolderView.prototype._loadApps = function() {
            const filtered = this._hider_originalLoadApps().filter(app => !SETTINGS.get_strv("hidden-apps").includes(app.id));
            this._apps = filtered;

            return filtered;
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
        this._patchAppSearchProvider();
        this._patchAppView();
    }

    disable() {
        this._unpatchAppSearchProvider();
        this._unpatchAppView();
    }
}