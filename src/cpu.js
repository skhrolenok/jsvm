const { createMemory } = require('./memory');
const {
    INSTRUCTION_POINTER,
    ACCUMULATOR,
    REGISTER_1,
    REGISTER_2,
    REGISTER_3,
    REGISTER_4,
    REGISTER_5,
    REGISTER_6,
    REGISTER_7,
    REGISTER_8
} = require('./registers');
const {
    MOV_LIT_REG,
    MOV_REG_REG,
    MOV_REG_MEM,
    MOV_MEM_REG, 
    ADD_REG_REG,
    JMP_NOT_EQ
} = require('./instructions');

const AVAILABLE_INSTRUCTIONS = [
    MOV_LIT_REG, MOV_REG_REG, ADD_REG_REG
];
const DEBUG_SEPARATOR = '='.repeat(50);

class CPU {
    constructor(memory) {
        this.memory = memory;
        this.registerNames = [
            INSTRUCTION_POINTER, ACCUMULATOR,
            REGISTER_1, REGISTER_2, 
            REGISTER_3, REGISTER_4, 
            REGISTER_5, REGISTER_6,
            REGISTER_7, REGISTER_8
        ];

        this.registers = createMemory(this.registerNames.length * 2);
        this.registerMap = this.registerNames.reduce((map, name, index) => {
            map[name] = index * 2;

            return map;
        }, {})
    }

    showRegistersInfo() {
        this.registerNames.forEach((name) => {
            const registerValue =  this.getRegister(name);
            const formattedName = name.length === 2
                ? `${name}: `
                : `${name}:`;
            const hexRepresentation = `0x${registerValue.toString(16).padStart(4, '0')}`;
            const decimalRepresentation = `${registerValue.toString(10).padStart(8, '0')}`;

            console.log(`${formattedName} ${hexRepresentation} | ${decimalRepresentation}`);
        });
        console.log();
    }

    viewMemoryAt(address) {
        const nextEightBytes = Array
            .from({length: 8}, (_, i) => this.memory.getUint8(address + i))
            .map(value => `0x${value.toString(16).padStart(2, '0')}`);

        console.log(`|CMD |  VALUE  |REG |CMD |  VALUE  |REG |`.padStart(83, ' '));
        console.log(`Next 8 bytes of memory in address 0x${address.toString(16).padStart(4, '0')}: |${nextEightBytes.join('|')}|`);
    }

    showInstructionInfo(intructionValue) {
        const availableInstruction = AVAILABLE_INSTRUCTIONS.find(availableInstruction => {
            return availableInstruction.value === intructionValue;
        });

        if (availableInstruction) {
            console.log(`Executing instruction: ${availableInstruction.label}`);
        } else {
            console.log('No instruction available');
        }
    }

    getRegister(name) {
        if (!(this.haveRegisterName(name))) {
            throw new Error(`getRegister: No such register '${name}'`)
        }
        const byteOffset = this.registerMap[name];

        return this.registers.getUint16(byteOffset);
    }

    setRegister(name, value) {
        if (!(this.haveRegisterName(name))) {
            throw new Error(`setRegister: No such register '${name}'`)
        }
        const byteOffset = this.registerMap[name];

        return this.registers.setUint16(byteOffset, value);
    }

    haveRegisterName(name) {
        return name in this.registerMap;
    }

    fetch() {
        const nextInstructionAddress = this.getRegister(INSTRUCTION_POINTER);
        const instruction = this.memory.getUint8(nextInstructionAddress);

        this.setRegister(INSTRUCTION_POINTER, nextInstructionAddress + 1);
        return instruction;
    }

    fetch16() {
        const nextInstructionAddress = this.getRegister(INSTRUCTION_POINTER);
        const instruction = this.memory.getUint16(nextInstructionAddress);

        this.setRegister(INSTRUCTION_POINTER, nextInstructionAddress + 2);
        return instruction;
    }

    decode() { // Not implemented yet, 'execute' combines both decode and execution

    }

    execute(instruction) {
        switch (instruction) {
            case MOV_LIT_REG.value: {
                const literal = this.fetch16();
                const register = (this.fetch() % this.registerNames.length) * 2;
                this.registers.setUint16(register, literal);

                return instruction;
            }

            case MOV_REG_REG.value: {
                const registerFrom = (this.fetch() % this.registerNames.length) * 2;
                const registerTo = (this.fetch() % this.registerNames.length) * 2;
                const value = this.registers.getUint16(registerFrom);
                this.registers.setUint16(registerTo, value);

                return instruction;
            }

            case MOV_REG_MEM.value: {
                const registerFrom = (this.fetch() % this.registerNames.length) * 2;
                const address = this.fetch16();
                const value = this.registers.getUint16(registerFrom);
                this.memory.setUint16(address, value);

                return instruction;
            }

            case MOV_MEM_REG.value: {
                const address = this.fetch16();
                const registerTo = (this.fetch() % this.registerNames.length) * 2;
                const value = this.memory.getUint16(address);
                this.registers.setUint16(registerTo, value);

                return instruction;
            }

            case ADD_REG_REG.value: {
                const register1 = this.fetch();
                const register2 = this.fetch();
                const registerValue1 = this.registers.getUint16(register1 * 2);
                const registerValue2 = this.registers.getUint16(register2 * 2);
                const result = registerValue1 + registerValue2;
                
                this.setRegister(ACCUMULATOR, result);
                return instruction;
            }

            case JMP_NOT_EQ.value: {
                const value = this.fetch16();
                const address = this.fetch16();

                if (value !== this.getRegister('acc')) {
                    this.setRegister('ip', address);
                }

                return instruction;
            }

            default: {
                console.log('End of execution'); // TODO to logging info
                return instruction;
            }
        }
    }

    step(withDebug = true) {
        if (withDebug) {
            console.log(DEBUG_SEPARATOR);
            console.log(`New step iteration`);
            console.log(DEBUG_SEPARATOR);
            this.showRegistersInfo();
            this.viewMemoryAt(this.getRegister('ip'));
            this.viewMemoryAt(0x0100);
        }

        const instruction = this.fetch();

        if (withDebug) {
            this.showInstructionInfo(instruction);
            console.log();
        }

        return this.execute(instruction);
    }
}

module.exports = CPU;