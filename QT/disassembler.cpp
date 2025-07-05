#include "disassembler.h"
#include <QFile>
#include <bitset>
Disassembler::Disassembler() {}

QStringList Disassembler::Disassemble(const QVector<quint16> &words)
{
    AssemblyCode.reserve(0xefff);
    int maxCount = qMin(words.size(), 0xefff);
    for (int i = 0; i < maxCount; ++i) {
        quint16 word = words[i];
        quint8 opcode = word & 0x07;
        switch (opcode) {
        case 0:
            ParseRType(word);
            break;
        case 1:
            ParseIType(word);
            break;
        case 2:
            ParseBType(word);
            break;
        case 3:
            ParseSType(word);
            break;
        case 4:
            ParseLType(word);
            break;
        case 5:
            ParseJType(word);
            break;
        case 6:
            ParseUType(word);
            break;
        case 7:
            ParseSysType(word);
            break;
        default:
            // unknown opcode—skip
            break;
        }
    }
    return AssemblyCode;
}


QString Disassembler::getName(quint8 opcode,
                     quint8 funct3,
                     quint8 funct4,
                     quint8 flagOrShftID)
{
    switch (opcode) {
    // ─── R-Type ─── opcode "000"
    case 0: {
        switch (funct3) {
        case 0:
            switch (funct4) {
            case  0: return "ADD";
            case  1: return "SUB";
            case 11: return "JR";
            case 12: return "JALR";
            default: return "UNK_R";
            }
        case 1:  return "SLT";     // funct4 == 2
        case 2:  return "SLTU";    // funct4 == 3
        case 3:                           // funct4 4,5,6
            switch (funct4) {
            case 4:  return "SLL";
            case 5:  return "SRL";
            case 6:  return "SRA";
            default: return "UNK_R";
            }
        case 4:  return "OR";      // funct4 == 7
        case 5:  return "AND";     // funct4 == 8
        case 6:  return "XOR";     // funct4 == 9
        case 7:  return "MV";      // funct4 == 10
        default: return "UNK_R";
        }
    }

    // ─── I-Type ─── opcode "001"
    case 1: {
        switch (funct3) {
        case 0:  return "ADDI";
        case 1:  return "SLTI";
        case 2:  return "SLTUI";
        case 3:  // shift immediates use flagOrShftID as shftID
            switch (flagOrShftID) {
            case 1: return "SLLI";
            case 2: return "SRLI";
            case 4: return "SRAI";
            default:return "UNK_I";
            }
        case 4:  return "ORI";
        case 5:  return "ANDI";
        case 6:  return "XORI";
        case 7:  return "LI";
        default: return "UNK_I";
        }
    }

    // ─── B-Type ─── opcode "010"
    case 2: {
        switch (funct3) {
        case 0: return "BEQ";
        case 1: return "BNE";
        case 2: return "BZ";
        case 3: return "BNZ";
        case 4: return "BLT";
        case 5: return "BGE";
        case 6: return "BLTU";
        case 7: return "BGEU";
        default:return "UNK_B";
        }
    }

    // ─── S-Type ─── opcode "011"
    case 3: {
        switch (funct3) {
        case 0: return "SB";
        case 1: return "SW";
        default:return "UNK_S";
        }
    }

    // ─── L-Type ─── opcode "100"
    case 4: {
        switch (funct3) {
        case 0: return "LB";
        case 1: return "LW";
        case 4: return "LBU";
        default:return "UNK_L";
        }
    }
    // ─── SYS ─── opcode "111"
    case 7:
        return "ECALL";

    default:
        return "UNK";
    }
}


#include "Disassembler.h"
#include <bitset>

void Disassembler::ParseRType(quint16 word)
{
    auto funct3 = (word >>  3) & 0x07;
    auto rd     = (word >>  6) & 0x07;
    auto rs2    = (word >>  9) & 0x07;
    auto funct4 = (word >> 12) & 0x0F;

    QString name = getName(0, funct3, funct4);
    QString assemblyLine;
    std::vector<Token> instruction;

    if (name == "JR") {
        assemblyLine = QString("%1 R%2").arg(name).arg(rd);
        instruction = {
            { Token::Type::Inst, name.toStdString() },
            { Token::Type::Reg,  std::bitset<3>(rd).to_string() }
        };
    } else {
        assemblyLine = QString("%1 x%2, x%3").arg(name).arg(rd).arg(rs2);
        instruction = {
            { Token::Type::Inst, name.toStdString() },
            { Token::Type::Reg,  std::bitset<3>(rd).to_string() },
            { Token::Type::Reg,  std::bitset<3>(rs2).to_string() }
        };
    }

    AssemblyCode.append(assemblyLine);
    Instructions.push_back(std::move(instruction));
}

void Disassembler::ParseIType(quint16 word)
{
    auto funct3 = (word >>  3) & 0x07;
    auto rd     = (word >>  6) & 0x07;
    auto imm7   = (word >>  9) & 0x7F;
    auto shftID = (imm7  >> 4) & 0x07;
    auto shamt  = (imm7      ) & 0x0F;

    QString name = getName(1, funct3, 0, shftID);
    QString assemblyLine;
    std::vector<Token> instruction;

    if (name == "SLLI" || name == "SRLI" || name == "SRAI") {
        assemblyLine = QString("%1 x%2, %3").arg(name).arg(rd).arg(shamt);
        instruction = {
            { Token::Type::Inst, name.toStdString() },
            { Token::Type::Reg,  std::bitset<3>(rd).to_string()    },
            { Token::Type::Imm,  std::bitset<4>(shamt).to_string() }
        };
    } else {
        // sign-extend imm7
        int simm = (imm7 & 0x40) ? int(imm7) - (1<<7) : int(imm7);
        assemblyLine = QString("%1 x%2, %3").arg(name).arg(rd).arg(simm);
        instruction = {
            { Token::Type::Inst, name.toStdString() },
            { Token::Type::Reg,  std::bitset<3>(rd).to_string()    },
            { Token::Type::Imm,  std::bitset<7>(imm7).to_string() }
        };
    }

    AssemblyCode.append(assemblyLine);
    Instructions.push_back(std::move(instruction));
}

void Disassembler::ParseBType(quint16 word)
{
    auto imm4    =  word        & 0x0F;         // bits[3:0]
    auto rs2     = (word >>  5) & 0x07;         // bits[7:5]
    auto rs1     = (word >>  8) & 0x07;         // bits[10:8]
    auto funct3  = (word >> 10) & 0x07;         // bits[12:10]
    int offset   = ((imm4<<1) & 0x10)
                     ? int((imm4<<1)) - (1<<5)
                     : int(imm4<<1);

    QString name = getName(2, funct3, 0, 0);
    QString assemblyLine;
    std::vector<Token> instruction;

    if (funct3 == 2 || funct3 == 3) { // BZ or BNZ
        assemblyLine = QString("%1 x%2, %3").arg(name).arg(rs1).arg(offset);
        instruction = {
            { Token::Type::Inst, name.toStdString()  },
            { Token::Type::Reg,  std::bitset<3>(rs1).to_string() },
            { Token::Type::Imm,  std::bitset<5>(imm4<<1).to_string() }
        };
    } else {
        assemblyLine = QString("%1 x%2, x%3, %4")
        .arg(name).arg(rs1).arg(rs2).arg(offset);
        instruction = {
            { Token::Type::Inst, name.toStdString()  },
            { Token::Type::Reg,  std::bitset<3>(rs1).to_string() },
            { Token::Type::Reg,  std::bitset<3>(rs2).to_string() },
            { Token::Type::Imm,  std::bitset<5>(imm4<<1).to_string() }
        };
    }

    AssemblyCode.append(assemblyLine);
    Instructions.push_back(std::move(instruction));
}

void Disassembler::ParseSType(quint16 word)
{
    auto imm4   =  word        & 0x0F;
    auto rs2    = (word >>  5) & 0x07;
    auto rs1    = (word >>  8) & 0x07;
    int offset  = (imm4 & 0x8) ? int(imm4) - (1<<4) : int(imm4);

    QString name = getName(3, 0, 0, 0);
    QString assemblyLine = QString("%1 x%2, %3(x%4)")
                               .arg(name).arg(rs2).arg(offset).arg(rs1);
    std::vector<Token> instruction = {
        { Token::Type::Inst, name.toStdString()        },
        { Token::Type::Reg,  std::bitset<3>(rs2).to_string() },
        { Token::Type::Reg,  std::bitset<3>(rs1).to_string() },
        { Token::Type::Imm,  std::bitset<4>(imm4).to_string() }
    };

    AssemblyCode.append(assemblyLine);
    Instructions.push_back(std::move(instruction));
}

void Disassembler::ParseLType(quint16 word)
{
    auto imm4   =  word        & 0x0F;
    auto rs2    = (word >>  5) & 0x07;
    auto rd     = (word >>  8) & 0x07;
    auto funct3 = (word >> 10) & 0x07;
    int offset  = (imm4 & 0x8) ? int(imm4) - (1<<4) : int(imm4);

    QString name = getName(4, funct3, 0, 0);
    QString assemblyLine = QString("%1 x%2, %3(x%4)")
                               .arg(name).arg(rd).arg(offset).arg(rs2);
    std::vector<Token> instruction = {
        { Token::Type::Inst, name.toStdString()        },
        { Token::Type::Reg,  std::bitset<3>(rd).to_string()  },
        { Token::Type::Reg,  std::bitset<3>(rs2).to_string() },
        { Token::Type::Imm,  std::bitset<4>(imm4).to_string() }
    };

    AssemblyCode.append(assemblyLine);
    Instructions.push_back(std::move(instruction));
}

void Disassembler::ParseJType(quint16 word)
{
    bool flag      = (word >> 15) & 0x1;
    auto imm9_4       = (word >>  9) & 0x3F;
    auto rd        = (word >>  6) & 0x07;
    auto imm3_1       = (word >>  3) & 0x07;
    quint16 imm10  = (imm9_4 << 4) | (imm3_1 << 1);
    int offset     = (imm10 & 0x200) ? int(imm10) - (1<<10) : int(imm10);

    QString name = flag ? "JAL" : "J";
    QString assemblyLine;
    std::vector<Token> instruction;

    if (flag) {
        assemblyLine = QString("%1 x%2, %3").arg(name).arg(rd).arg(offset);
        instruction = {
            { Token::Type::Inst, name.toStdString()        },
            { Token::Type::Reg,  std::bitset<3>(rd).to_string()  },
            { Token::Type::Imm,  std::bitset<10>(imm10).to_string() }
        };
    } else {
        assemblyLine = QString("%1 %2").arg(name).arg(offset);
        instruction = {
            { Token::Type::Inst, name.toStdString()       },
            { Token::Type::Imm,  std::bitset<10>(imm10).to_string() }
        };
    }

    AssemblyCode.append(assemblyLine);
    Instructions.push_back(std::move(instruction));
}

void Disassembler::ParseUType(quint16 word)
{
    bool flag      = (word >> 15) & 0x1;
    auto hi6       = (word >>  9) & 0x3F;
    auto rd        = (word >>  6) & 0x07;
    auto lo3       = (word >>  3) & 0x07;
    quint16 imm9   = (hi6 << 3) | lo3;
    int value      = (imm9 & 0x100) ? int(imm9) - (1<<9) : int(imm9);

    QString name = flag ? "AUIPC" : "LUI";
    QString assemblyLine = QString("%1 x%2, %3")
                               .arg(name).arg(rd).arg(value << 7);
    std::vector<Token> instruction = {
        { Token::Type::Inst, name.toStdString()         },
        { Token::Type::Reg,  std::bitset<3>(rd).to_string()   },
        { Token::Type::Imm,  std::bitset<9>(imm9).to_string() }
    };

    AssemblyCode.append(assemblyLine);
    Instructions.push_back(std::move(instruction));
}

void Disassembler::ParseSysType(quint16 word)
{
    auto funct3 = (word >> 10) & 0x07;
    quint16 svc  = word & 0x03FF;

    QString name = (funct3 == 0) ? "ECALL" : "UNKNOWN";
    QString assemblyLine = QString("%1 %2").arg(name).arg(svc);
    std::vector<Token> instruction = {
        { Token::Type::Inst, name.toStdString()        },
        { Token::Type::Imm,  std::bitset<10>(svc).to_string() }
    };

    AssemblyCode.append(assemblyLine);
    Instructions.push_back(std::move(instruction));
}


