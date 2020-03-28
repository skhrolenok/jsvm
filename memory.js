const createMemory = sizeInBytes => {
    const dataBuffer = new ArrayBuffer(sizeInBytes);
    const dataView = new DataView(dataBuffer);

    return dataView;
};

module.exports = {
    createMemory
};