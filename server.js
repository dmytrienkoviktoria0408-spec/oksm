const dgram = require('dgram');
const { deserializeCommand, serializeAck } = require('./protocol');

const PORT = 41234;
const HOST = '192.168.56.1';

const server = dgram.createSocket('udp4');

server.on('listening', () => {
    const address = server.address();
    console.log(`[СЕРВЕР] Слухає UDP з'єднання на ${address.address}:${address.port}`);
});

server.on('message', (msg, rinfo) => {
    const rawMessage = msg.toString();
    console.log(`\n[СЕРВЕР] Отримано сирий пакет: "${rawMessage}" (Довжина: ${rawMessage.length} симв.) від ${rinfo.address}:${rinfo.port}`);

    const command = deserializeCommand(rawMessage);

    if (command) {
        console.log(`[ЗАГЛУШКА ОБРОБКИ] Керування машинкою:`);
        console.log(`  - ID команди: ${command.cmdId}`);
        console.log(`  - Поворот керма: ${command.steer}°`);
        console.log(`  - Швидкість: ${command.speed} км/год`);
        console.log(`  - Фари: ${command.lights === 1 ? 'ВВІМКНЕНО' : 'ВИМКНЕНО'}`);

        const ackMessage = serializeAck(command.cmdId);
        const responseBuffer = Buffer.from(ackMessage);

        server.send(responseBuffer, 0, responseBuffer.length, rinfo.port, rinfo.address, (err) => {
            if (err) console.error('[СЕРВЕР] Помилка відправки ACK:', err);
            else console.log(`[СЕРВЕР] Відправлено підтвердження: "${ackMessage}"`);
        });
    } else {
        console.log('[СЕРВЕР] Отримано пошкоджений пакет або пакет невідомого формату.');
    }
});

server.bind(PORT, HOST);