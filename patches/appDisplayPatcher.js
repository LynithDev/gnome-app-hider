const { BaseAppView } = imports.ui.appDisplay;
const Main = imports.ui.main;

var AppDisplayPatcher = class AppDisplayPatcher {
    constructor(settings) {
        this.settings = settings;
    }

    _patchAppView() {
        BaseAppView.prototype._hider_originalRedisplay = BaseAppView.prototype._redisplay;
        let SETTINGS = this.settings;

        BaseAppView.prototype._redisplay = function() {
            this.hiddenApps = SETTINGS.get_strv("hidden-apps");
            let oldApps = this._orderedItems.slice();
            let oldAppIds = oldApps.map(icon => icon.id);
    
            // Filter out hidden apps
            let newApps = this._loadApps().filter(icon => !this.hiddenApps.includes(icon.id)).sort(this._compareItems.bind(this));
            let newAppIds = newApps.map(icon => icon.id);
    
            let addedApps = newApps.filter(icon => !oldAppIds.includes(icon.id));
            let removedApps = oldApps.filter(icon => !newAppIds.includes(icon.id));
    
            // Remove old app icons
            removedApps.forEach(icon => {
                this._removeItem(icon);
                icon.destroy();
            });
    
            // Add new app icons, or move existing ones
            newApps.forEach(icon => {
                const [page, position] = this._getItemPosition(icon);
                if (addedApps.includes(icon)) {
                    // If there's two pages, newly installed apps should not appear
                    // on page 0
                    if (page === -1 && position === -1 && this._grid.nPages > 1)
                        this._addItem(icon, 1, -1);
                    else
                        this._addItem(icon, page, position);
                } else if (page !== -1 && position !== -1) {
                    this._moveItem(icon, page, position);
                } else {
                    // App is part of a folder
                }
            });
    
            this.emit('view-loaded');
        }

        Main.overview._overview.controls.appDisplay._redisplay();
    }

    _unpatchAppView() {
        BaseAppView.prototype._redisplay = BaseAppView.prototype._hider_originalRedisplay;
        delete BaseAppView.prototype._hider_originalRedisplay;
        delete BaseAppView.prototype.hiddenApps;

        Main.overview._overview.controls.appDisplay._redisplay();
    }

    enable() {
        this._patchAppView();
    }

    disable() {
        this._unpatchAppView();
    }
}