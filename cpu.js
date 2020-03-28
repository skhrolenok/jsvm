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
const instructions = require('./instructions');

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

    debug() {
        this.registerNames.forEach(name => {
            const registerValue =  this.getRegister(name);

            console.log(`${name}: 0x${registerValue.toString(16).padStart(4, '0')}`);
        });
        console.log();
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

    decode() {

    }

    execute(instruction) {
        switch (instruction) {
            // Move literal into r1 register
            case instructions.MOV_LIT_R1: {
                const literal = this.fetch16();
                this.setRegister(REGISTER_1, literal);
                break;
            }

            // Move literal into r2 register
            case instructions.MOV_LIT_R2: {
                const literal = this.fetch16();
                this.setRegister(REGISTER_2, literal);
                break;
            }

            // Move literal into r2 register
            case instructions.ADD_REG_REG: {
                const register1 = this.fetch();
                const register2 = this.fetch();
                const registerValue1 = this.registers.getUint16(register1 * 2);
                const registerValue2 = this.registers.getUint16(register2 * 2);
                const result = registerValue1 + registerValue2;
                
                this.setRegister(ACCUMULATOR, result);
                break;
            }
        }
    }

    step() {
        const instruction = this.fetch();

        return this.execute(instruction);
    }
}

module.exports = CPU;