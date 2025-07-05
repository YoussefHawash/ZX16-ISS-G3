// Editor.qml
import QtQuick
import QtQuick.Controls.Fusion

Rectangle {
    id: registers
    width: 400; height: 300
    color: "#1e1e1e"

    property var codeLines: ["Upload To Start"]     // bound from QML
    property int lineHeight: 20
    property int gutterWidth: 40

    ListView {
        id: list
        anchors.fill: parent
        model: registers.codeLines
        clip: true
        interactive: true
        flickDeceleration: 2000
        spacing: 0
        highlightFollowsCurrentItem: false
        snapMode: ListView.NoSnap
        ScrollBar.vertical: ScrollBar {


              }
        delegate: Row {
            height: registers.lineHeight
            spacing: 8

            Text {
                width: gutterWidth
                text: (index+1)
                font.family: "Consolas"; font.pixelSize: 14
                color: "#858585"
                horizontalAlignment: Text.AlignRight
                verticalAlignment: Text.AlignVCenter
            }

            Text {
                text: modelData
                font.family: "Consolas"; font.pixelSize: 14
                color: "#d4d4d4"
                verticalAlignment: Text.AlignVCenter
            }
        }
    }
}
