const fs = require('fs');
const JsonDataService = require('../../services/json.service');
const { write } = require('xlsx');
const filePath = 'E:\\puppeteer-auto-meta-proxy\\scr\\modules\\discord\\D1ECOTZT1S.txt';

const processFile = async () => {
  try {
    const data = await fs.promises.readFile(filePath, 'utf8');

    // Loại bỏ ký tự \r và tách file thành các dòng
    const cleanedData = data.replace(/\r/g, '');
    const lines = cleanedData.split('\n');
    console.log(lines)
    // Phạm vi profile
    const startProfile = 55;
    const endProfile = 101;

    const result = [];
    let profileIndex = startProfile;
    for (const line of lines) {
      const linesSlip = line.trim().split('|');
      if (profileIndex <= endProfile && linesSlip.length >= 6) {
        const jsonObject = {
          profile: `__Profile _${profileIndex}`,
          updatedFields: {
            discord: {
              email: linesSlip[0],
              token_discord: null,
              pass: linesSlip[1],
              auth2fa: linesSlip[2],   
              readmail:  `${linesSlip[3]}|${linesSlip[4]}|${linesSlip[5]}` || '',
            },
          },
        };

        result.push(jsonObject); // Thêm vào mảng kết quả
        profileIndex++;
      }
    }
    
    for (const item of result) {
      await JsonDataService.updateJsonFields(item.profile, item.updatedFields);
    }

    console.log('Mảng kết quả JSON:', result);
  } catch (err) {
    console.error('Lỗi khi xử lý file:', err);
  }
};

// Gọi hàm xử lý file
processFile();
