#
clear
reset
#
export FmDev=$(pwd)
echo $ FmDev
export out_libs="/Users/kevin.jiang/Dev/src/github-res/rbfx.wasm.apps/libs"

#
export app_name="common.sevice"
#
cmake -B build -S ./rbfx.wasm.sevice -DCMAKE_TOOLCHAIN_FILE=/Users/kevin.jiang/Dev/tools/vcpkg/scripts/buildsystems/vcpkg.cmake -DCGAL_USE_BASIC_VIEWER=1 -DCMAKE_BUILD_TYPE=Release
cd build
make
#
cd ../bin
./common.sevice
