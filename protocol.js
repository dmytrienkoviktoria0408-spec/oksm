function padLeft(value, length, padChar = '0') {
    return String(value).padStart(length, padChar);
}

function serializeCommand(cmdId, steer, speed, lights) {
    const idStr = padLeft(cmdId, 5);
    
    const sign = steer >= 0 ? '+' : '-';
    const steerStr = sign + padLeft(Math.abs(steer), 3);
    
    const speedStr = padLeft(speed, 3);
    
    const lightsStr = String(lights);

    return idStr + steerStr + speedStr + lightsStr;
}

function deserializeCommand(msgStr) {
    if (msgStr.length !== 13) return null;

    return {
        cmdId: parseInt(msgStr.substring(0, 5), 10),
        steer: parseInt(msgStr.substring(5, 9), 10),
        speed: parseInt(msgStr.substring(9, 12), 10),
        lights: parseInt(msgStr.substring(12, 13), 10)
    };
}

function serializeAck(cmdId) {
    return 'ACK' + padLeft(cmdId, 5);
}

function deserializeAck(msgStr) {
    if (msgStr.length !== 8 || !msgStr.startsWith('ACK')) return null;
    return {
        status: 'ACK',
        cmdId: parseInt(msgStr.substring(3, 8), 10)
    };
}

module.exports = {
    serializeCommand,
    deserializeCommand,
    serializeAck,
    deserializeAck
};