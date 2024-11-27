#
clear
reset
#
export FmDev=$(pwd)
echo $ FmDev
#
export app_name="common.sevice"
#
cmake -B build -S ./rbfx.wasm.sevice -DCMAKE_TOOLCHAIN_FILE=/Users/kevin.jiang/Dev/tools/vcpkg/scripts/buildsystems/vcpkg.cmake -DCGAL_USE_BASIC_VIEWER=1 -DCMAKE_BUILD_TYPE=Release
cd build
make
#
cd ..
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
