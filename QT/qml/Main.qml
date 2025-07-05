import QtQuick
import QtQuick.Window
import QtQuick.Layouts
import QtQuick.Controls
import QtQuick.Dialogs


ApplicationWindow {
    width: 600; height: 300
        title: "Custom 3-Pane Layout"
    visible: true
    id: app
    // ── new properties ──
    property bool running: false
    property int  frequency: 60      // default 60 Hz

    // ── timer to step the CPU ──
    Timer {
        id: execTimer
        interval: frequency > 0 ? 1000 / frequency : 1000
        repeat: true
        running: false
        onTriggered: {
            cpu.Execute(cpu.getPc())
            refreshSideMenu()
            editor.codeLines = cpu.getAssemblyCode()
            editor.currentLine = cpu.getPc()
        }
    }

    header: ToolBar {
        background: Rectangle { anchors.fill: parent; color: "#3b3b3b" }
        RowLayout {
            anchors.fill: parent
            spacing: 8
            ToolButton {
                            icon.name: "document-open"    // uses the built-in icon theme
                            text: qsTr("Load…")
                            onClicked: openDialog.open()
                        }
            // ── Run / Pause button ──
            ToolButton {
                id: runBtn
                text: running ? qsTr("Pause") : qsTr("Run")
                icon.name: running
                            ? "media-playback-pause"
                            : "media-playback-start"
                onClicked: {
                    running = !running
                    execTimer.running = running
                }
            }

            // ── Hz Slider ──
            Label { text: qsTr("Speed:") }
            Slider {
                id: hzSlider
                from: 1; to: 1000; stepSize: 1
                value: frequency
                Layout.preferredWidth: 200
                onValueChanged: {
                    frequency = value
                    // immediately adjust timer interval:
                    execTimer.interval = 1000 / frequency
                }
            }
            Label { text: frequency + " Hz" }

            // ── (optional) a spacer to push any other buttons to the right ──
            Item { Layout.fillWidth: true }
        }
    }

    GridLayout {
        id: grid
        anchors.fill: parent
        rows: 2; columns: 2
        rowSpacing: 0;
        columnSpacing: 0;

        // ─── A (top-left, 60% width × 60% height) ───

        Editor {
           id: editor
                   Layout.row: 0; Layout.column: 0
                   Layout.preferredWidth:  parent.width  * 0.6
                   Layout.preferredHeight: parent.height * 0.6

               }


        // ─── C (bottom-left, 60% width × remaining 40% height) ───
        Rectangle {
            Layout.row: 1; Layout.column: 0
            Layout.preferredWidth: grid.width * 0.6
            Layout.fillHeight:        true      // takes whatever vertical space is left
            color: "#9013fe"
           Text { anchors.centerIn: parent; text: "Panel"; color: "white" }
        }

        // ─── B (right side, spans both rows) ───
        SideMenu {
            id: sideMenu
            Layout.row:     0; Layout.column: 1
            Layout.rowSpan: 2             // cover both top and bottom
            Layout.fillWidth:  true       // take remaining 40% width
            Layout.fillHeight: true       // cover full height
        }
    }
    FileDialog {
           id: openDialog
           title: qsTr("Open Simulation Binary")
           nameFilters: [ "Binary files (*.bin)", "All files (*)" ]
           onAccepted: {
               if (cpu.load(selectedFile)) {
                   editor.codeLines = cpu.getAssemblyCode()
               }
           }
       }

    function refreshSideMenu() {
            // 1) pull back the registers as a JS array
            var regs = cpu.getregisters()    // e.g. [0, 5, 10, ...]
            var lines = []

            // 2) format each register as “R0: 0x0000”, etc.
            for (var i = 0; i < regs.length; ++i) {
                // toString(16) for hex, padStart(4,'0') to 4 digits
                var hex = regs[i].toString(16).toUpperCase().padStart(4, '0')
                lines.push("R" + i + ": 0x" + hex)
            }

            // 3) then tack on the PC
            var pcHex = cpu.getPc().toString(16).toUpperCase().padStart(4, '0')
            lines.push("PC: 0x" + pcHex)

            // 4) assign that array to your editor or sideMenu
            sideMenu.codeLines = lines

        }
}

