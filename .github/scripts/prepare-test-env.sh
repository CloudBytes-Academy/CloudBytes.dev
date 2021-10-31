#!/usr/bin/bash

echo "Downloading & Installing Firebase CLI"
curl -sL https://firebase.tools | bash

echo "Starting Firebase CLI"
firebase emulators:start --only hosting &

echo "Install Python Dependencies"
python3 -m pip install -r requirements.txt