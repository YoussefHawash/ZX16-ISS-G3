#include <QGuiApplication>
#include <QQmlApplicationEngine>
#include <QQmlContext>

#include "cpu.h"
int main(int argc, char *argv[])
{
    QGuiApplication app(argc, argv);
    QQmlApplicationEngine engine;

    CPU z16;
    engine.rootContext()->setContextProperty("cpu", &z16);
    engine.load(QUrl(QStringLiteral("qrc:/qml/Main.qml")));

    if (engine.rootObjects().isEmpty())
        return -1;
    return app.exec();
}
