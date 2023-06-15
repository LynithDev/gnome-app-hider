<div align="center">
  <img src="https://raw.githubusercontent.com/LynithDev/gnome-app-hider/master/.github/ghost_nobg.png" width="128">
  <h1>GNOME App Hider</h1>
  <p><i>Ever wished of being able to hide any apps you didn't like in GNOME's app menu? Well wish no more, as this is the extension for you!</i>
</div>

## Install
You can download it through [GNOME's extension website](https://extensions.gnome.org/extension/5895/app-hider/) or follow the list below
1. Download this as a zip file
2. Extract the zip
3. Next, you have to move it to `~/.local/share/gnome-shell/extensions/`
    1. You can do this by executing the command (or by moving it and renaming it to `app-hider@lynith.dev` manually):
```
mv ./gnome-app-hider-master ~/.local/share/gnome-shell/extensions/app-hider@lynith.dev
```
4. Press `ALT`+`F2` and type in `restart`. This will restart GNOME for you.
5. Open the extensions app and enable it

## Usage
![](https://raw.githubusercontent.com/LynithDev/gnome-app-hider/master/.github/showcase.mp4)
To hide an app, simply go to the apps menu and right click on an icon. There should be an option to "hide" it

To unhide an app, go to the extension's options and remove any entries from the list.

## Packing the extension
Run the `pack.sh` script

## Translations
| Language   | Contributor                                   |
|------------|-----------------------------------------------|
| 🇹🇷 Turkish | [qewer33](https://github.com/qewer33)         |
| 🇨🇳 Chinese | [xiaozhangup](https://github.com/xiaozhangup) |
| Occitan    | [Mejans](https://github.com/Mejans)           |
| 🇵🇱 Polish  | [LynithDev](https://github.com/LynithDev)     |
| 🇪🇸 Spanish | [arpia49](https://github.com/arpia49)         |
| 🇫🇷 French  | [gllmhyt](https://github.com/gllmhyt)         |

From the root project directory, run the following command to generate a `.pot` file for translators to use. You can edit this file with POEditor or any other translation software.

```
find . -iname "*.js" | xargs xgettext --from-code=UTF-8 --output=po/example.pot
```

## License
This project is licensed with GPLv2.

Click [here](./LICENSE) to see the full license.
