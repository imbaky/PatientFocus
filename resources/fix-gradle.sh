#!/bin/bash
filePath="./platforms/android/build.gradle"
gradleRes="configurations.all {resolutionStrategy {eachDependency { DependencyResolveDetails details ->if (details.requested.group == 'com.android.support') {details.useVersion '27.1.0'}}}}"
if [ ! -d platforms ]; then
  echo "Error: platform/android does not exist, please run ~ionic cordova build android~ first"
  else
    if grep -q "$gradleRes" $filePath ;then
            echo "Warning: Script ignored, already applied once !"
        else
            sed -i 's/1.0.0@aar/2.0.1@aar/g' platforms/android/cordova-safe/starter-conceal.gradle
            echo "$gradleRes" >> $filePath
    fi
fi
