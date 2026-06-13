const dgram = require('dgram');
const { serializeCommand, deserializeAck } = require('./protocol');

const PORT = 41234;
const HOST = '127.0.0.1';

const client = dgram.createSocket('udp4');

const cmdId = 1;
const steer = -45;
const speed = 120;
const lights = 1;

const messageStr = serializeCommand(cmdId, steer, speed, lights);
const buffer = Buffer.from(messageStr);

console.log(`[КЛІЄНТ] Сформовано пакет для відправки: "${messageStr}" (Довжина: ${messageStr.length} симв.)`);

client.send(buffer, 0, buffer.length, PORT, HOST, (err) => {
    if (err) {
        console.error('[КЛІЄНТ] Помилка відправки:', err);
        client.close();
    } else {
        console.log(`[КЛІЄНТ] Пакет успішно відправлено на ${HOST}:${PORT}`);
    }
});

client.on('message', (msg) => {
    const rawAck = msg.toString();
    console.log(`[КЛІЄНТ] Отримано сиру відповідь від сервера: "${rawAck}"`);

    const ack = deserializeAck(rawAck);
    if (ack && ack.cmdId === cmdId) {
        console.log(`[КЛІЄНТ] УСПІХ! Сервер підтвердив отримання команди №${ack.cmdId}.`);
    } else {
        console.log('[КЛІЄНТ] Отримано некоректне підтвердження.');
    }

    client.close();
});