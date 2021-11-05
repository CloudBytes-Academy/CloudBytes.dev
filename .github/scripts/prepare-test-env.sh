#!/usr/bin/bash

echo "Downloading & Installing 🔥Firebase CLI"
curl -sSL https://firebase.tools | bash

echo "Starting 🔥Firebase CLI"
firebase emulators:start --only hosting &

echo "Install 🐍Python Dependencies"
python3 -m pip install -r requirements.txt


echo "Setting Test Environment"
export TEST_ENV=true