const fs = require('fs');
const path = 'E:/puppeteer-auto-meta-proxy/scr/modules/memory/mnemonics.txt';

// Đọc file JSON
fs.readFile('E:/puppeteer-auto-meta-proxy/scr/data.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Lỗi khi đọc file:', err);
    return;
  }

  try {
    // Chuyển dữ liệu JSON thành mảng
    const jsonData = JSON.parse(data);

    // Lọc và lấy danh sách mnemonic từ __Profile_1 đến __Profile_65
    const mnemonics = jsonData
      .filter(item => {
        const match = item.profile.match(/^__Profile\s*_(\d+)$/);
        return match && Number(match[1]) >= 1 && Number(match[1]) <= 65;
      })
      .map(item => item.mnemonic.replace(/\r?\n/g, '').trim()); // Loại bỏ '\r\n' và khoảng trắng

    // Chuyển danh sách mnemonic thành chuỗi, mỗi dòng là một mnemonic
    const mnemonicsText = mnemonics.join('\n');

    // Ghi vào file txt
    fs.writeFile(path, mnemonicsText, 'utf8', (writeErr) => {
      if (writeErr) {
        console.error('Lỗi khi ghi file:', writeErr);
      } else {
        console.log('Đã lưu danh sách mnemonic vào:', path);
      }
    });

  } catch (parseError) {
    console.error('Lỗi khi phân tích JSON:', parseError);
  }
});
