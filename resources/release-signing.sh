#!/bin/bash
if [ ! -d platforms ]; then
  echo "Error: platform/android does not exist, please run ~ionic cordova build android~ first"
  else
    if [ -e $1 ]; then
      echo "Warning: File $1 already exists, Contents will be overwritten!!"
    fi
    echo "target=android-25" > $1
    echo "android.library.reference.1=CordovaLib" >> $1
    echo "storePassword=$2">> $1
    echo "keyAlias=$3">> $1
    echo "storeFile=../../resources/android/my-release-key.keystore">> $1
fi