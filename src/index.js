const { createMemory } = require('./memory');
const CPU = require('./cpu');
const instructions = require('./instructions');

const MEMORY_SIZE = 256; // bytes of memory

const memory = createMemory(MEMORY_SIZE);
const writableBytes = new Uint8Array(memory.buffer);

const cpu = new CPU(memory);

function decimalToHexGroups(decimalValue) {
    return decimalValue.toString(16).padStart(4, '0').split('').reduce((res, value, index) => {
        const groupIndex = index >= 2
           ? 1
           : 0;
        let group = res[groupIndex];
      
        if (!group) {
          group = [];
      
          res.push(group);
        }
      
        group.push(value);
      
        return res;
      }, []);
}

function add(a, b) {
    if ((a > 0xffff) || (b > 0xffff) || (a < 0) || (b < 0)) {
        console.log('Wrong input, only values from 0 to 65535');
        return;
    }

    const [firstHexGroup, secondHexGroup] = decimalToHexGroups(a);
    const [thirdHexGroup, fourthHexGroup] = decimalToHexGroups(b);
    const firstHexGroupValue = firstHexGroup.join('');
    const secondHexGroupValue = secondHexGroup.join('');
    const thirdHexGroupValue = thirdHexGroup.join('');
    const fourthHexGroupValue = fourthHexGroup.join('');

    writableBytes[0] = instructions.MOV_LIT_R1.value;
    writableBytes[1] = Number(`0x${firstHexGroupValue}`);
    writableBytes[2] = Number(`0x${secondHexGroupValue}`);

    writableBytes[3] = instructions.MOV_LIT_R2.value;
    writableBytes[4] = Number(`0x${thirdHexGroupValue}`);
    writableBytes[5] = Number(`0x${fourthHexGroupValue}`);

    writableBytes[6] = instructions.ADD_REG_REG.value;
    writableBytes[7] = 2; // r1 index
    writableBytes[8] = 3; // r2 index

    runExecutionLoop();
}

function runExecutionLoop() {
    let isLastIteration = false;
    
    while(true) {
        const instruction = cpu.step();
        isLastIteration = instruction === 0;

        if (isLastIteration) {
            break;
        }
    }
}

add(4, 24);