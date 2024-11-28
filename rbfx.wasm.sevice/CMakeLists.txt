cmake_minimum_required(VERSION 3.18)
project(fm.common.sevice)

#
set(app_name $ENV{app_name})

#
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY $ENV{FmDev}/bin)

# --------------------------------------------------------------------------------------------------------------
#
find_package(httplib CONFIG REQUIRED)
find_package(boost CONFIG REQUIRED)
find_package(PkgConfig REQUIRED)
pkg_check_modules(gmpxx REQUIRED IMPORTED_TARGET gmpxx)

#
find_package(CGAL CONFIG REQUIRED)
find_package(CGAL REQUIRED COMPONENTS Core OPTIONAL_COMPONENTS Qt5)
# add_definitions(-DCGAL_USE_BASIC_VIEWER -DQT_NO_KEYWORDS)
find_package(GEOS CONFIG REQUIRED)
find_package(glfw3 CONFIG REQUIRED)

# --------------------------------------------------------------------------------------------------------------

#
file(GLOB app_src
    src/*.cpp
)

#
# 生成
add_executable(${app_name}
    ${app_src}
)
# 
target_include_directories(${app_name} PUBLIC
    ./libs
)
# 
target_compile_definitions(${app_name} PUBLIC
#    CGAL_USE_BASIC_VIEWER
#    QT_NO_KEYWORDS
)
#
target_link_libraries(${app_name} PRIVATE
    CGAL::CGAL
    glfw
    httplib::httplib
    PkgConfig::gmpxx
    # CGAL::CGAL_Basic_viewer
)

