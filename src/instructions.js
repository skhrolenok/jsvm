const MOV_LIT_REG = {
    value: 0x10,
    label: 'Move literal into register'
}
const MOV_REG_REG = {
    value: 0x11,
    label: 'Move register into register'
};
const MOV_REG_MEM = {
    value: 0x12,
    label: 'Move register into memory'
};
const MOV_MEM_REG = {
    value: 0x13,
    label: 'Move memory into register'
};
const ADD_REG_REG = {
    value: 0x14,
    label: 'Adds register to register'
}
const JMP_NOT_EQ = {
    value: 0x15,
    label: 'Jump if not equal'
}

module.exports = {
    MOV_LIT_REG,
    MOV_REG_REG,
    MOV_REG_MEM,
    MOV_MEM_REG,
    ADD_REG_REG,
    JMP_NOT_EQ
}