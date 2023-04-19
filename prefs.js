const { Adw, Gio, Gtk } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

function init() {}

function getNoAppsRow() {
    return new Adw.ActionRow({ title: "No hidden apps" });
}

function fillPreferencesWindow(window) {
    const settings = ExtensionUtils.getSettings();

    const page = new Adw.PreferencesPage();
    const group = new Adw.PreferencesGroup();
    page.add(group);

    const hiddenApps = settings.get_strv("hidden-apps");
    
    if (hiddenApps.length === 0) {
        group.add(getNoAppsRow());
    } else {
        for (const appId of hiddenApps) {
            const appInfo = Gio.DesktopAppInfo.new(appId);
            const appIcon = appInfo.get_icon() == null ? "application-x-executable" : appInfo.get_icon().to_string();

            const row = new Adw.ActionRow({
                icon_name: appIcon,
                title: appInfo.get_name(),
                subtitle: appInfo.get_description(),
            });

            const button = new Gtk.Button({
                icon_name: "list-remove",
                tooltip_text: "Unhide",
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

            row.add_suffix(button);
            group.add(row);
        }
    }

    window.add(page);
}
