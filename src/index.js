const { createMemory } = require('./memory');
const CPU = require('./cpu');
const instructions = require('./instructions');

const MEMORY_SIZE = 256; // bytes of memory

const memory = createMemory(MEMORY_SIZE);
const writableBytes = new Uint8Array(memory.buffer);

const cpu = new CPU(memory);

// instructions
writableBytes[0] = instructions.MOV_LIT_R1.value;
writableBytes[1] = 0x12; // 0x1234
writableBytes[2] = 0x34;

writableBytes[3] = instructions.MOV_LIT_R2.value;
writableBytes[4] = 0xAB; // 0xABCD
writableBytes[5] = 0xCD;

writableBytes[6] = instructions.ADD_REG_REG.value;
writableBytes[7] = 2; // r1 index
writableBytes[8] = 3; // r2 index

cpu.step();
cpu.step();
cpu.step();
cpu.step();