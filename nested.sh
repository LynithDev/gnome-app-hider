#!/usr/bin/env bash

if [ "$XDG_SESSION_TYPE" != "wayland" ]; then
    echo "This script is intended to be run in a Wayland session."
    exit 1
fi

clear
export MUTTER_DEBUG_DUMMY_MODE_SPECS=1366x768
dbus-run-session -- gnome-shell --nested --wayland