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

function hexGroupToValue(group) {
    const groupValue = group.join('');
    const hexValue = Number(`0x${groupValue}`);

    return hexValue;
}

module.exports = {
    decimalToHexGroups,
    hexGroupToValue
}