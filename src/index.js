const { createMemory } = require('./memory');
const CPU = require('./cpu');
const Operator = require('./operator');

const MEMORY_SIZE = 256 * 256; // bytes of memory

const memory = createMemory(MEMORY_SIZE);
const writableBytes = new Uint8Array(memory.buffer);

const cpu = new CPU(memory);
const operator = new Operator(cpu, writableBytes);

operator.add(0x1234, 0xABCD);