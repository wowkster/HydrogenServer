import net from 'net';
import chalk from 'chalk';
//@ts-ignore
import jsStringEscape from 'js-string-escape';
const server = net.createServer();
server.on('connection', conn => {
    const remoteAddress = conn.remoteAddress + ':' + conn.remotePort;
    console.log(chalk.magentaBright('New client connection from:'), remoteAddress);
    // conn.setEncoding('utf-8')
    conn.on('data', d => {
        console.log(chalk.blueBright(`Connection data from ${remoteAddress}:`), buffToStr(d));
    });
    conn.once('close', () => {
        console.log(chalk.yellow(`Connection from ${remoteAddress} closed`));
    });
    conn.on('error', err => {
        console.log(chalk.redBright(`Connection ${remoteAddress} error:`), err.message);
    });
});
server.listen(25565, function () {
    console.log(chalk.greenBright('Server listening on'), server.address());
});
function buffToStr(buff) {
    const hex = buff.toString('hex');
    let hexStr = '';
    for (let i = 0; i < hex.length; i += 2) {
        hexStr += hex[i] + hex[i + 1] + ' ';
    }
    let charStr = '';
    const ascii = buff.toString('ascii');
    for (let c of ascii) {
        charStr += `${chalk.blackBright('\'')}${jsStringEscape(c)}${chalk.blackBright('\'')}, `;
    }
    return `[ ${hexStr}] [ ${charStr}]`;
}
