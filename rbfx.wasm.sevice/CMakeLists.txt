cmake_minimum_required(VERSION 3.18)
project(fm.common.sevice)

#
set(app_name $ENV{app_name})
set(CMAKE_CXX_STANDARD 17)

#
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY $ENV{FmDev}/bin)

# --------------------------------------------------------------------------------------------------------------
#
find_package(httplib CONFIG REQUIRED)
find_package(Boost CONFIG REQUIRED)
find_package(PkgConfig REQUIRED)
pkg_check_modules(gmpxx REQUIRED IMPORTED_TARGET gmpxx)
find_package(nlohmann_json CONFIG REQUIRED)

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
    src/op/*.cpp
    src/expand/*.cpp
)

#
# 生成
add_executable(${app_name}
    ${app_src}
)

#
target_include_directories(${app_name} PUBLIC
    ./src
)

#
target_compile_definitions(${app_name} PUBLIC

    # CGAL_USE_BASIC_VIEWER
    # QT_NO_KEYWORDS
    # CGAL_LINKED_WITH_TBB
)

#
target_link_libraries(${app_name} PRIVATE
    CGAL::CGAL
    glfw
    httplib::httplib
    nlohmann_json::nlohmann_json

    # PkgConfig::gmpxx
    Boost::boost

    # CGAL::CGAL_Basic_viewer
)
