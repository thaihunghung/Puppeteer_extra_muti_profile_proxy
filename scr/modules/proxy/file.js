const fs = require('fs');
const JsonDataService = require('../../services/json.service');
const filePath = 'E:\\puppeteer-auto-meta-proxy\\scr\\modules\\proxy\\proxyHA.txt';

const processFile = async () => {
  try {
    const data = await fs.promises.readFile(filePath, 'utf8');

    // Loại bỏ ký tự \r và tách file thành các dòng
    const cleanedData = data.replace(/\r/g, '');
    const lines = cleanedData.split('\n');

    // Phạm vi profile
    const startProfile = 1;
    const endProfile = 50;

    const result = [];
    let profileIndex = startProfile;


    for (const line of lines) {
      const linesSlip = line.trim().split(':'); 
      if (profileIndex <= endProfile && linesSlip.length >= 3) {
        const jsonObject = {
          profile: `__Profile _${profileIndex}`,
          updatedFields: {
            proxy: `http://${linesSlip[2]}:${linesSlip[3]}@${linesSlip[0]}:${linesSlip[1]}`,
          },
        };

        result.push(jsonObject); 
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
