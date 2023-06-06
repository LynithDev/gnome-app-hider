const { AppMenu } = imports.ui.appMenu;
const PopupMenu = imports.ui.popupMenu;
const Main = imports.ui.main;

const Me = imports.misc.extensionUtils.getCurrentExtension();
const Domain = imports.gettext.domain(Me.metadata.uuid);

var AppMenuPatcher = class AppMenuPatcher {
    constructor(settings) {
        this.settings = settings;
    }

    enable() {
        AppMenu.prototype._hider_isMenuItemAdded = false;
        AppMenu.prototype._hider_updateDetailsVisibility = AppMenu.prototype._updateDetailsVisibility;
        
        let SETTINGS = this.settings;
        const _ = Domain.gettext;
        AppMenu.prototype._updateDetailsVisibility = function() {
            if (this._hider_isMenuItemAdded) {
                return;
            }
            
            this._hider_isMenuItemAdded = true;
            this.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
            this._hider_menuItem = this.addAction(_("Hide"), () => { // WHY IS THIS NOT TRANSLATING???
                const hiddenApps = SETTINGS.get_strv("hidden-apps");
                if (hiddenApps.includes(this._app.get_id())) { return; }
                hiddenApps.push(this._app.get_id());
                SETTINGS.set_strv("hidden-apps", hiddenApps);
            });

            this._hider_updateDetailsVisibility(this);
        }

        Main.overview._overview.controls.appDisplay._redisplay();
    }

    disable() {
        AppMenu.prototype._updateDetailsVisibility = AppMenu.prototype._hider_updateDetailsVisibility;
        delete AppMenu.prototype._hider_updateDetailsVisibility;
        delete AppMenu.prototype._hider_isMenuItemAdded;
        delete AppMenu.prototype._hider_menuItem;

        Main.overview._overview.controls.appDisplay._redisplay();
    }
}