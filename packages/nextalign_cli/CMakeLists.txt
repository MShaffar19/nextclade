cmake_minimum_required(VERSION 3.10)
cmake_policy(SET CMP0069 NEW)

set(CMAKE_MODULE_PATH "${CMAKE_SOURCE_DIR}/packages/cmake" ${CMAKE_MODULE_PATH})
include(CFlags)
include(Quiet)
include(Sanitizers)

project(nextalign_cli)
file(STRINGS "VERSION" PROJECT_VERSION)

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
set(CMAKE_INSTALL_MESSAGE LAZY)

find_package(Boost 1.75.0 COMPONENTS headers REQUIRED)
find_package(TBB REQUIRED)
find_package(cxxopts 2.2.1 REQUIRED)
find_package(fmt 7.1.0 REQUIRED)
find_package(ghcFilesystem 1.4.0 REQUIRED)

if (${NEXTALIGN_STATIC_BUILD} AND NOT APPLE)
  if (MINGW)
    set(STATIC_BUILD_FLAGS "-static -static-libstdc++ -static-libgcc -lrt -ltbbmalloc -ltbbmalloc_proxy")
  else ()
    set(STATIC_BUILD_FLAGS "-static -static-libstdc++ -static-libgcc")
  endif ()
endif ()

set(SYSTEM_NAME ${CMAKE_SYSTEM_NAME})
set(PROCESSOR_NAME ${CMAKE_SYSTEM_PROCESSOR})
if (APPLE)
  if (NOT DEFINED NEXTALIGN_MACOS_ARCH)
    set(NEXTALIGN_MACOS_ARCH "Unknown")
  endif ()

  set(SYSTEM_NAME "MacOS")
  set(PROCESSOR_NAME "${NEXTALIGN_MACOS_ARCH}")
endif ()

add_executable(${PROJECT_NAME}
  src/cli.cpp
  src/description.h
  src/filesystem.h
  )

set_property(TARGET ${PROJECT_NAME} PROPERTY
  OUTPUT_NAME nextalign-${SYSTEM_NAME}-${PROCESSOR_NAME})

set_property(TARGET ${PROJECT_NAME} PROPERTY C_STANDARD 11)
set_property(TARGET ${PROJECT_NAME} PROPERTY CXX_STANDARD 17)

target_compile_definitions(${PROJECT_NAME}
  PRIVATE
  -DPROJECT_NAME="${PROJECT_NAME}"
  -DPROJECT_VERSION="${PROJECT_VERSION}"
  )

target_include_directories(${PROJECT_NAME}
  PRIVATE "${CMAKE_CURRENT_SOURCE_DIR}/src"
  )

target_include_directories(${PROJECT_NAME} SYSTEM
  PRIVATE
  "${CMAKE_SOURCE_DIR}/3rdparty/boost/include"
  )

target_link_libraries(${PROJECT_NAME}
  PRIVATE
  nextalign
  Boost::headers
  TBB::tbb
  cxxopts::cxxopts
  fmt::fmt
  ghcFilesystem::ghc_filesystem
  ${STATIC_BUILD_FLAGS}
  )

install(
  TARGETS ${PROJECT_NAME}
  CONFIGURATIONS Release
  RUNTIME DESTINATION bin
)
