Title: Compile Expo React Native application for Android
Date: 2025-05-21
Category: Snippets
Tags: android, react-native, javascript, typescript
Author: Rehan Haider
Summary: A guide to compiling a React Native application built using Expo framework for Android
Keywords: react-native, android, javascript, typescript, java, gradle


[React Native](https://reactnative.dev/docs/getting-started) is one of the most popular if not the most popular tool used to build Android applications at present and developers typically use [Expo framework](https://docs.expo.dev/get-started/introduction/) to build React Native applications. 

However, [Expo documentation](https://docs.expo.dev/guides/local-app-development/), for various reasons, is surreptitiously silent about how to compile your Expo React Native application for Android. 

In this guide, we will see how to compile your Expo React Native application for Android.

You need the following to complete this guide:
1. Setup a React Native application using Expo framework.
2. Install Android SDK
3. Install Java JDK
4. Configure Android SDK and Java JDK in your system environment variables
5. Build the React Native app


## 1. Setup a React Native application using Expo framework
If you have not already setup a React Native application using Expo framework, you can do so by following the steps below:

1. Open a terminal and run the following command to create an expo project:

```bash
npx create-expo-app@latest
```

## 2. Install Android SDK

You can install Android SDK using [these instructions](https://developer.android.com/studio).

## 3. Install Java JDK

You can install Java JDK using the following command:

```bash
sudo apt install openjdk-17-jdk
```


## 4. Configure Android SDK and Java JDK in your system environment variables

Add the below lines to your `~/.bashrc` file:

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk 
export PATH=$PATH:$ANDROID_HOME/emulator 
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

## 5. Build the React Native app

1. First start the prebuild process by running the following command:

```bash
npx expo prebuild
```

2. Now navigate to the `android` directory:

```bash
cd android
```

3. Now run the following command to build the app:

```bash
./gradlew assembleRelease
```

4. The compiled APK file will be available in the `android/app/build/outputs/apk/release` directory.