cmake_minimum_required(VERSION 3.16)

project(appZ16 VERSION 0.1 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(Qt6 REQUIRED COMPONENTS Quick
QuickControls2
)

qt_standard_project_setup(REQUIRES 6.8)
qt6_add_resources(QML_RESOURCES qml.qrc)
qt_add_executable(appZ16
    main.cpp
 ${QML_RESOURCES}
 qml.qrc
 cpu.cpp
 cpu.h
 disassembler.h disassembler.cpp

)


# Qt for iOS sets MACOSX_BUNDLE_GUI_IDENTIFIER automatically since Qt 6.1.
# If you are developing for iOS or macOS you should consider setting an
# explicit, fixed bundle identifier manually though.
set_target_properties(appZ16 PROPERTIES
#    MACOSX_BUNDLE_GUI_IDENTIFIER com.example.appZ16
    MACOSX_BUNDLE_BUNDLE_VERSION ${PROJECT_VERSION}
    MACOSX_BUNDLE_SHORT_VERSION_STRING ${PROJECT_VERSION_MAJOR}.${PROJECT_VERSION_MINOR}
    MACOSX_BUNDLE TRUE
    WIN32_EXECUTABLE TRUE
)

target_link_libraries(appZ16
    PRIVATE Qt6::Quick
)

include(GNUInstallDirs)
install(TARGETS appZ16
    BUNDLE DESTINATION .
    LIBRARY DESTINATION ${CMAKE_INSTALL_LIBDIR}
    RUNTIME DESTINATION ${CMAKE_INSTALL_BINDIR}
)
