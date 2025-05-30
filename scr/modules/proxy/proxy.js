const fs = require('fs');

const inputFilePath = 'E:\\puppeteer-auto-meta-proxy\\scr\\modules\\proxy\\proxyHA.txt';
const outputFilePath = 'E:\\puppeteer-auto-meta-proxy\\scr\\modules\\proxy\\fomat.txt';

// Đọc file
fs.readFile(inputFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Lỗi khi đọc file:', err);
        return;
    }

    // Xử lý từng dòng
    const formattedLines = data
        .trim()
        .split('\n')
        .map(line => {
            const linesSlip = line.trim().split(':'); // Loại bỏ khoảng trắng thừa
            if (linesSlip.length === 4) {
                return `http://${linesSlip[2]}:${linesSlip[3]}@${linesSlip[0]}:${linesSlip[1]}`;
            }
            return null;
        })
        .filter(Boolean);

    // Ghi vào file mà không có lỗi xuống dòng sai
    fs.writeFile(outputFilePath, formattedLines.join('\r\n'), 'utf8', (err) => {
        if (err) {
            console.error('Lỗi khi ghi file:', err);
        } else {
            console.log('Đã ghi thành công vào fomat.txt');
        }
    });
});
