#!/usr/bin/env bash

# Add android platform
ionic cordova platform add android --no-interactive --confirm 

# fixes the cordova conceal gradle before buddybuild builds the apk
sed -i 's/1.0.0@aar/2.0.1@aar/g' /tmp/sandbox/workspace/platforms/android/cordova-safe/starter-conceal.gradle