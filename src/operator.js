const {decimalToHexGroups, hexGroupToValue} = require('./utils/numbers');
const instructions = require('./instructions');
const {ACCUMULATOR} = require('./registers');

class Operator {
    constructor(cpu, memoryTape) {
        this.cpu = cpu;
        this.memoryTape = memoryTape;
    }

    add(a, b) {
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
    
        this.memoryTape[0] = instructions.MOV_LIT_R1.value;
        this.memoryTape[1] = firstHexGroupValue;
        this.memoryTape[2] = secondHexGroupValue;
    
        this.memoryTape[3] = instructions.MOV_LIT_R2.value;
        this.memoryTape[4] = thirdHexGroupValue;
        this.memoryTape[5] = fourthHexGroupValue;
    
        this.memoryTape[6] = instructions.ADD_REG_REG.value;
        this.memoryTape[7] = 2;
        this.memoryTape[8] = 3;
    
        this.runExecutionLoop();
        this.clearMemory();

        const result = this.cpu.getRegister(ACCUMULATOR);

        return result;
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