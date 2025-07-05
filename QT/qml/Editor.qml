// Editor.qml
import QtQuick 2.15
import QtQuick.Controls.Fusion 2.15

Rectangle {
    id: editor
    width: 400; height: 300
    color: "#1e1e1e"

    property int currentLine: -1
    property var codeLines: ["Upload To Start"]
    property int lineHeight: 20
    property int gutterWidth: 40

    ListView {
        id: list
        anchors.fill: parent
        model: editor.codeLines
        clip: true
        spacing: 0
        highlightFollowsCurrentItem: false
        snapMode: ListView.NoSnap

        // bind the ListView's concept of "currentIndex" to our currentLine
        currentIndex: editor.currentLine

        // whenever currentLine changes, scroll it into view
        onCurrentIndexChanged: {
            if (currentIndex >= 0 && currentIndex < count) {
                positionViewAtIndex(currentIndex, ListView.Beginning)
            }
        }

        ScrollBar.vertical: ScrollBar { }

        delegate: Rectangle {
            width: parent.width
            height: editor.lineHeight
            color: index === editor.currentLine ? "#2d2d44" : "transparent"

            Row {
                anchors.fill: parent
                spacing: 8

                Text {
                    width: gutterWidth
                    text: index + 1
                    font.family: "Consolas"; font.pixelSize: 14
                    color: index === editor.currentLine ? "#fff" : "#858585"
                    horizontalAlignment: Text.AlignRight
                    verticalAlignment: Text.AlignVCenter
                }

                Text {
                    text: modelData
                    font.family: "Consolas"; font.pixelSize: 14
                    color: index === editor.currentLine ? "#fff" : "#d4d4d4"
                    verticalAlignment: Text.AlignVCenter
                }
            }
        }
    }
}
