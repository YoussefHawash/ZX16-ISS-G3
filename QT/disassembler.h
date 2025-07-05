#ifndef DISASSEMBLER_H
#define DISASSEMBLER_H


#include <QUrl>
#include <qcontainerfwd.h>
#include <string>
#include <stdexcept>
#include <vector>
using namespace std;
inline int binaryToDecimal(const string &bits, bool isSigned) {
    if (bits.empty()) return 0;
    // parse as unsigned
    unsigned long val = std::stoul(bits, nullptr, 2);
    if (isSigned && bits[0] == '1') {
        // subtract 2^N to get negative two's-complement value
        val -= (1UL << bits.size());
    }
    return static_cast<int>(val);
}
struct Token {
    enum class Type { Imm, Reg, Inst };
    Type        type;
    string name;
    string binaryValue;
    int         signedValue{};
    unsigned    unsignedValue{};

    Token(Type t, const string &value)
        : type(t)
    {
        switch (t) {
        case Type::Inst:
            name = value;
            break;

        case Type::Imm:
        case Type::Reg:
            binaryValue   = value;
            signedValue   = binaryToDecimal(value, true);
            unsignedValue = static_cast<unsigned>(binaryToDecimal(value, false));
            break;

        default:
            throw logic_error("Unknown Token::Type");
        }
    }
};
class Disassembler
{
public:
    QStringList AssemblyCode;
    vector<vector<Token>> Instructions;
    Disassembler();
    QStringList Disassemble(const QVector<quint16> &);
    QString getName(quint8,quint8,quint8 funct4 = 0 ,quint8 shftID = 7);
    void ParseRType(quint16);
    void ParseIType(quint16);
    void ParseBType(quint16);
    void ParseSType(quint16);
    void ParseLType(quint16);
    void ParseJType(quint16);
    void ParseUType(quint16);
    void ParseSysType(quint16);
};

#endif // DISASSEMBLER_H
