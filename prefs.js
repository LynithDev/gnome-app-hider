const { Adw, Gio, Gtk } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

function init() {
}

function buildPrefsWidget() {
    const window = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        border_width: 12,
        spacing: 12,
    });

    fillPreferencesWindow(window);

    window.show_all();
    return window;
}

function fillPreferencesWindow(window) {
    const settings = ExtensionUtils.getSettings("dev.lynith.gnome.app-hider");

    const page = new Adw.PreferencesPage();
    const group = new Adw.PreferencesGroup();
    page.add(group);

    const hiddenApps = settings.get_strv("hidden-apps");
    
    if (hiddenApps.length === 0) {
        const row = new Adw.ActionRow({ title: "No hidden apps" });
        group.add(row);
    } else {
        hiddenApps.forEach(appId => {
            const appInfo = Gio.DesktopAppInfo.new(appId);

            const row = new Adw.ActionRow({
                icon_name: appInfo.get_icon().to_string(),
                title: appInfo.get_name(),
                subtitle: appInfo.get_description(),
            });
    
            const button = new Gtk.Button({
                icon_name: "list-remove",
                tooltip_text: "Unhide",
            });
    
            button.connect("clicked", () => {
                const index = hiddenApps.indexOf(appId);
                if (index > -1) {
                    hiddenApps.splice(index, 1);
                }
                settings.set_strv("hidden-apps", hiddenApps);
                group.remove(row);
            });
    
            row.add_suffix(button);
            group.add(row);
        });
    }

    window.add(page);
    
}