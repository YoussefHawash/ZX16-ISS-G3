// Disassembler.h
#ifndef CPU_H
#define CPU_H
#include <QObject>
#include <QByteArray>
#include <QString>
#include <QUrl>
#include "disassembler.h"
class CPU : public QObject {
    Q_OBJECT
private:
    QByteArray memory;
    QVector<quint16>   words;
    QStringList AssemblyCode;
    vector<vector<Token>> Instructions;
    vector<quint16> registers;
    int PC = 0x000;
    bool halted = false;
public:
    explicit CPU(QObject* parent = nullptr);

    Q_INVOKABLE vector<quint16> getregisters();
    Q_INVOKABLE int getPc();
    Q_INVOKABLE void Execute(int);
    Q_INVOKABLE bool load(const QUrl &);
    Q_INVOKABLE QStringList getAssemblyCode() const;
    void setPC(int);

    //Utils
    void ERASE();
    void LittleEndianParse();
};

#endif // CPU_H
