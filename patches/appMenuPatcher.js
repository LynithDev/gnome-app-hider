import { AppMenu } from "resource:///org/gnome/shell/ui/appMenu.js";
import * as PopupMenu from "resource:///org/gnome/shell/ui/popupMenu.js";
import * as Main from "resource:///org/gnome/shell/ui/main.js";

import { gettext } from 'resource:///org/gnome/shell/extensions/extension.js';

export class AppMenuPatcher {
    constructor(settings) {
        this.settings = settings;
    }

    enable() {
        AppMenu.prototype._hider_isMenuItemAdded = false;
        AppMenu.prototype._hider_updateDetailsVisibility = AppMenu.prototype._updateDetailsVisibility;
        
        let SETTINGS = this.settings;
        const _ = gettext;
        AppMenu.prototype._updateDetailsVisibility = function() {
            if (this.sourceActor && !Object.keys(this.sourceActor).includes("_hider_displayPatchedMenu")) {
                return;
            }
            
            if (this._hider_isMenuItemAdded) {
                return;
            }
            
            this._hider_isMenuItemAdded = true;
            this.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
            this._hider_menuItem = this.addAction(_("Hide"), () => {
                const hiddenApps = SETTINGS.get_strv("hidden-apps");
                if (hiddenApps.includes(this._app.get_id())) { return; }
                hiddenApps.push(this._app.get_id());
                SETTINGS.set_strv("hidden-apps", hiddenApps);
                Main.overview._overview.controls.appDisplay._redisplay();
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

export default AppMenuPatcher;