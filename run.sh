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
cp -rf ./rbfx.wasm.apps.site/dist/* ./rbfx.wasm.apps.server/web
#
cd ./rbfx.wasm.apps.server
npm install
# 
