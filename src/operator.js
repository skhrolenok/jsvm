const {decimalToHexGroups, hexGroupToValue} = require('./utils/numbers');
const instructions = require('./instructions');
const {ACCUMULATOR} = require('./registers');

const IP = 0;
const ACC = 1;
const R1 = 2;
const R2 = 3;

class Operator {
    constructor(cpu, memoryTape) {
        this.cpu = cpu;
        this.memoryTape = memoryTape;
    }

    add(a, b) {
        console.log(`Run add with arguments ${a}, ${b}`)

        if ((a > 0xffff) || (b > 0xffff) || (a < 0) || (b < 0)) {
            console.log('Wrong input, only values from 0 to 65535');
            return;
        }
    
        const [firstHexGroup, secondHexGroup] = decimalToHexGroups(a);
        const [thirdHexGroup, fourthHexGroup] = decimalToHexGroups(b);
        const firstHexGroupValue = hexGroupToValue(firstHexGroup);
        const secondHexGroupValue = hexGroupToValue(secondHexGroup);
        const thirdHexGroupValue = hexGroupToValue(thirdHexGroup);
        const fourthHexGroupValue = hexGroupToValue(fourthHexGroup);
        let i = 0;
    
        this.memoryTape[i++] = instructions.MOV_LIT_REG.value;
        this.memoryTape[i++] = firstHexGroupValue;
        this.memoryTape[i++] = secondHexGroupValue;
        this.memoryTape[i++] = R1;
    
        this.memoryTape[i++] = instructions.MOV_LIT_REG.value;
        this.memoryTape[i++] = thirdHexGroupValue;
        this.memoryTape[i++] = fourthHexGroupValue;
        this.memoryTape[i++] = R2;
    
        this.memoryTape[i++] = instructions.ADD_REG_REG.value;
        this.memoryTape[i++] = R1;
        this.memoryTape[i++] = R2;

        this.memoryTape[i++] = instructions.MOV_REG_MEM.value;
        this.memoryTape[i++] = ACC;
        this.memoryTape[i++] = 0x01;
        this.memoryTape[i++] = 0x00;

        this.runExecutionLoop();
        this.clearMemory();

        const result = this.cpu.getRegister(ACCUMULATOR);

        return result;
    }

    substract(a, b) {
        console.log('Run substraction with arguments ${a, b}');

        return b >= a
            ? 0
            : this.add(a, -b);
    }

    runExecutionLoop() {
        let isLastIteration = false;
    
        while(true) {
            const instruction = this.cpu.step();
            isLastIteration = instruction === 0;

            if (isLastIteration) {
                break;
            }
        }
    }

    clearMemory() {
        this.memoryTape.fill(0);
    }
}

module.exports = Operator;