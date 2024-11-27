#
clear
reset
#
export FmDev=$(pwd)
echo $ FmDev
#
cd ./rbfx.wasm.apps.site
# npm install
npm run build
cd ..
#
rm -rf ./rbfx.wasm.apps.server/web/assets/*
cp -rf ./rbfx.wasm.apps.site/dist/* ./rbfx.wasm.apps.server/web
#
cd ./rbfx.wasm.apps.server
node server.js
#
