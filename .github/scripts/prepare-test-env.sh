#!/usr/bin/bash

echo "Downloading & Installing 🔥Firebase CLI"
curl -sSL https://firebase.tools | bash


echo "Install 🐍Python Dependencies"
python3 -m pip install -r requirements.txt

ls -al
cat .firebaserc

echo "Starting 🔥Firebase CLI"
firebase emulators:start --only hosting &

