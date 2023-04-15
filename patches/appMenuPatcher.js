const { AppMenu } = imports.ui.appMenu;
const PopupMenu = imports.ui.popupMenu;
const Me = imports.misc.extensionUtils.getCurrentExtension().imports.extension;
const Main = imports.ui.main;

var AppMenuPatcher = class AppMenuPatcher {
    constructor() {}

    enable() {
        AppMenu.prototype._hider_isMenuItemAdded = false;
        AppMenu.prototype._hider_updateDetailsVisibility = AppMenu.prototype._updateDetailsVisibility;
        AppMenu.prototype._updateDetailsVisibility = function() {
            if (this._hider_isMenuItemAdded) {
                return;
            }
            
            this._hider_isMenuItemAdded = true;
            this.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
            this._hider_menuItem = this.addAction("Hide", () => {
                const hiddenApps = Me.settings.get_strv("hidden-apps");
                hiddenApps.push(this._app.get_id());
                Me.settings.set_strv("hidden-apps", hiddenApps);

                Main.overview._overview.controls.appDisplay._redisplay();
            });

            this._hider_updateDetailsVisibility.call(this);
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