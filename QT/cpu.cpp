// CPU.cpp
#include "cpu.h"
#include <QFile>
#include <QIODevice>
#include <QDebug>
CPU::CPU(QObject* parent)
    : QObject(parent)
{
    registers.resize(8,0);
}

vector<quint16> CPU::getregisters()
{
    return registers;
}

int CPU::getPc()
{
    return PC;
}

void CPU::Execute(int address)
{

    if(memory.isEmpty()) return;

    // Fetch our decoded token list for this PC
    const auto &instr = Instructions[address];
    const QString op = QString::fromStdString(instr[0].name);
    auto U = [&](int idx)->uint16_t { return instr[idx].unsignedValue; };
    auto S = [&](int idx)->int16_t  { return instr[idx].signedValue;   };

    if (op == "ADD") {
        registers[U(1)] = registers[U(1)] + registers[U(2)];
    }
    else if (op == "SUB") {
        registers[U(1)] = registers[U(1)] - registers[U(2)];
    }
    else if (op == "SLT") {
        registers[U(1)] = (int16_t)registers[U(1)] < (int16_t)registers[U(2)] ? 1 : 0;
    }
    else if (op == "SLTU") {
        registers[U(1)] = registers[U(1)] < registers[U(2)] ? 1 : 0;
    }
    else if (op == "SLL") {
        registers[U(1)] = registers[U(1)] << (registers[U(2)] & 0xF);
    }
    else if (op == "SRL") {
        registers[U(1)] = (uint16_t)registers[U(1)] >> (registers[U(2)] & 0xF);
    }
    else if (op == "SRA") {
        registers[U(1)] = registers[U(1)] >> (registers[U(2)] & 0xF);
    }
    else if (op == "OR") {
        registers[U(1)] = registers[U(1)] | registers[U(2)];
    }
    else if (op == "AND") {
        registers[U(1)] = registers[U(1)] & registers[U(2)];
    }
    else if (op == "XOR") {
        registers[U(1)] = registers[U(1)] ^ registers[U(2)];
    }
    else if (op == "MV") {
        registers[U(1)] = registers[U(2)];
    }
    else if (op == "JR") {
        PC = registers[U(1)];
        return;
    }
    else if (op == "JALR") {
        uint16_t rd = U(1);
        uint16_t rs = U(2);
        registers[rd] = PC + 1;
        PC = registers[rs];
        return;
    }

    // --- I-Type ---
    else if (op == "ADDI") {
        registers[U(1)] += S(2);
    }
    else if (op == "SLTI") {
        registers[U(1)] = registers[U(1)] < S(2) ? 1:0;
    }
    else if (op == "SLTUI") {
        registers[U(1)] = (uint16_t)registers[U(1)] < (uint16_t)U(2) ?1:0;
    }
    else if (op == "SLLI") {
        registers[U(1)] <<= U(2);
    }
    else if (op == "SRLI") {
        registers[U(1)] = (uint16_t)registers[U(1)] >> U(2);
    }
    else if (op == "SRAI") {
        registers[U(1)] >>= U(2);
    }
    else if (op == "ORI") {
        registers[U(1)] |= S(2);
    }
    else if (op == "ANDI") {
        registers[U(1)] &= S(2);
    }
    else if (op == "XORI") {
        registers[U(1)] ^= S(2);
    }
    else if (op == "LI") {
        registers[U(1)] = S(2);
    }

    // --- B-Type ---
    else if (op == "BEQ") {
        if (registers[U(1)] == registers[U(2)]) {
            PC += S(3)/2; return;
        }
    }
    else if (op == "BNE") {
        if (registers[U(1)] != registers[U(2)]) {
            PC += S(3)/2; return;
        }
    }
    else if (op == "BZ") {
        if (registers[U(1)] == 0) {
            PC += S(2)/2; return;
        }
    }
    else if (op == "BNZ") {
        if (registers[U(1)] != 0) {
            PC += S(2)/2; return;
        }
    }
    else if (op == "BLT") {
        if ((int16_t)registers[U(1)] < (int16_t)registers[U(2)]) {
            PC += S(3)/2; return;
        }
    }
    else if (op == "BGE") {
        if ((int16_t)registers[U(1)] >= (int16_t)registers[U(2)]) {
            PC += S(3)/2; return;
        }
    }
    else if (op == "BLTU") {
        if ((uint16_t)registers[U(1)] < (uint16_t)registers[U(2)]) {
            PC += S(3)/2; return;
        }
    }
    else if (op == "BGEU") {
        if ((uint16_t)registers[U(1)] >= (uint16_t)registers[U(2)]) {
            PC += S(3)/2; return;
        }
    }

    // --- S-Type ---
    else if (op == "SB") {
        uint16_t addr = registers[U(3)] + S(2);
        memory[addr] = registers[U(1)] & 0xFF;
    }
    else if (op == "SW") {
        uint16_t addr = registers[U(3)] + S(2);
        memory[addr]   = registers[U(1)] & 0xFF;
        memory[addr+1] = (registers[U(1)] >> 8) & 0xFF;
    }

    // --- L-Type ---
    else if (op == "LB") {
        uint16_t addr = registers[U(3)] + S(2);
        registers[U(1)] = (int8_t)memory[addr];
    }
    else if (op == "LBU") {
        uint16_t addr = registers[U(3)] + U(2);
        registers[U(1)] = memory[addr];
    }
    else if (op == "LW") {
        uint16_t addr = registers[U(3)] + S(2);
        registers[U(1)] = memory[addr] | (memory[addr+1] << 8);
    }

    // --- U-Type ---
    else if (op == "LUI") {
        registers[U(1)] = (uint16_t)(S(2) << 7);
    }
    else if (op == "AUIPC") {
        registers[U(1)] = PC + (S(2) << 7);
    }

    // --- J-Type ---
    else if (op == "J"){
        PC += S(1)/2; return;
    }
    else if (op == "JAL") {
        uint16_t rd = U(1);
        registers[rd] = PC + 1;
        PC += S(2)/2; return;
    }

    // --- Syscall / ECALL ---
    else if (op == "ECALL") {
        // handleSyscall(U(1));
    }

    // advance PC if we didn’t already jump
    ++PC;

}

void CPU::ERASE()
{
    memory.clear();
    words.clear();
    AssemblyCode.clear();
    registers.clear();
    registers.resize(8,0);
    PC = 0;
    halted = false;
}
void CPU::LittleEndianParse()
{
    for (int i = 0; i + 1 < memory.size(); i += 2) {
        quint8 low  = static_cast<quint8>(memory[i]);
        quint8 high = static_cast<quint8>(memory[i+1]);
        quint16 w = static_cast<quint16>(low) | (static_cast<quint16>(high) << 8);
        words.append(w);
    }
}

bool CPU::load(const QUrl &fileUrl)
{
    QFile file(fileUrl.toLocalFile());
    if (!file.open(QIODevice::ReadOnly))return false;
    ERASE();
    memory = file.readAll();

    file.close();
    LittleEndianParse();
    Disassembler *diss = new Disassembler;
    AssemblyCode= diss->Disassemble(words);
    Instructions = diss->Instructions;
    // for (const auto &instr : Instructions) {
    //     QStringList parts;
    //     for (const auto &tok : instr) {
    //         // assuming your Token has a .binaryValue or .name you want to see
    //         if (tok.type == Token::Type::Inst)
    //             parts << QString::fromStdString(tok.name);
    //         else
    //             parts << QString::fromStdString(tok.binaryValue);
    //     }
    //     qDebug() << parts.join("|");
    // }
    delete diss;
    return true;
}
QStringList CPU::getAssemblyCode() const
{
    return AssemblyCode;
}

void CPU::setPC(int x)
{
    PC= x;
}
