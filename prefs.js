import Adw from "gi://Adw";
import Gtk from "gi://Gtk";
import Gio from "gi://Gio";
import { ExtensionPreferences, gettext as _ } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

function getNoAppsRow() {
    return new Adw.ActionRow({ title: _("No hidden apps") });
}

class GnomeAppHiderExtensionPrefs extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const settings = this.getSettings();

        const page = new Adw.PreferencesPage();
        const group = new Adw.PreferencesGroup();
        page.add(group);
    
        const hiddenApps = settings.get_strv("hidden-apps");
        let hiddenSearchApps = settings.get_strv("hidden-search-apps");
        
        if (hiddenApps.length === 0) {
            group.add(getNoAppsRow());
        } else {
            for (const appId of hiddenApps) {
                const appInfo = Gio.DesktopAppInfo.new(appId);
    
                let row;
    
                if (appInfo == null) {
                    console.error(`Could not find app info for app with id ${appId}`);
                    row = new Adw.ActionRow({
                        icon_name: "application-x-executable",
                        title: appId,
                        subtitle: _("Missing app info"),
                    });
                } else {
                    const appIcon = appInfo.get_icon() == null ? "application-x-executable" : appInfo.get_icon().to_string();
    
                    row = new Adw.ActionRow({
                        icon_name: appIcon,
                        title: appInfo.get_name(),
                        subtitle: appInfo.get_description(),
                    });
                }
    
                const button = new Gtk.Button({
                    icon_name: "edit-delete-symbolic",
                    tooltip_text: _("Unhide"),
                });
    
                button.connect("clicked", (self) => {
                    const index = hiddenApps.indexOf(appId);
                    if (index > -1) {
                        hiddenApps.splice(index, 1);
                    }
                    settings.set_strv("hidden-apps", hiddenApps);
                    group.remove(row);
    
                    if (hiddenApps.length === 0) {
                        group.add(getNoAppsRow());
                    }
                });
    
                const tooltip_text = hiddenSearchApps.includes(appId) ? _("Unhide from search") : _("Hide from search");
                
                const hideSearchButton = new Gtk.Button({
                    icon_name: hiddenSearchApps.includes(appId) ? "edit-clear-symbolic" : "system-search-symbolic",
                    tooltip_text,
                });
    
                hideSearchButton.connect("clicked", (self) => {
                    const index = hiddenSearchApps.indexOf(appId);
                    if (index > -1) {
                        hiddenSearchApps.splice(index, 1);
                    } else {
                        hiddenSearchApps.push(appId);
                    }
    
                    settings.set_strv("hidden-search-apps", hiddenSearchApps);
                    hideSearchButton.set_icon_name(hiddenSearchApps.includes(appId) ? "edit-clear-symbolic" : "system-search-symbolic");
                    hideSearchButton.set_tooltip_text(tooltip_text);
                });
    
                const buttonBox = new Gtk.Box({
                    orientation: Gtk.Orientation.HORIZONTAL,
                    spacing: 6,
                    margin_top: 8,
                    margin_bottom: 8,
                });
    
                buttonBox.append(hideSearchButton);
                buttonBox.append(button);
    
                row.add_suffix(buttonBox);
                
                group.add(row);
            }
        }
    
        window.add(page);
    }
}

export default GnomeAppHiderExtensionPrefs;