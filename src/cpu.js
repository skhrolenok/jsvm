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
const {MOV_LIT_R1, MOV_LIT_R2, ADD_REG_REG} = require('./instructions');

const AVAILABLE_INSTRUCTIONS = [
    MOV_LIT_R1, MOV_LIT_R2, ADD_REG_REG
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
            case MOV_LIT_R1.value: {
                const literal = this.fetch16();
                this.setRegister(REGISTER_1, literal);
                return instruction;
            }

            case MOV_LIT_R2.value: {
                const literal = this.fetch16();
                this.setRegister(REGISTER_2, literal);
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