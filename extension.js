import * as Main from "resource:///org/gnome/shell/ui/main.js";

import { AppMenuPatcher } from "./patches/appMenuPatcher.js";
import { AppDisplayPatcher } from "./patches/appDisplayPatcher.js";

import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

class GnomeAppHiderExtension extends Extension {
    enable() {
        this.settings = this.getSettings();

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

export default GnomeAppHiderExtension;