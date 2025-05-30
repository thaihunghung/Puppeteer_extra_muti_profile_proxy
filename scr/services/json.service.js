const globalState = require('../config/globalState');
const { xlsx, fs } = require('../config/module.import');

require('dotenv').config(); 
function parseBoolean(value) {
  return value === 'true';
}
const isLoadData = parseBoolean(process.env.LOAD_DATA);

class JsonDataService {
  constructor() {
    this.data = JsonDataService.readJsonData();
    if (isLoadData) this.load = this.ExcelToJson();
  }

  getJson() {
    return this.data
  }

  /**
   * Đọc và gộp nhiều file JSON dựa vào trường profile.
   * @param {string[]} jsonPaths - Danh sách đường dẫn tới các file JSON.
   * @returns {Array} Mảng object đã gộp theo profile.
   */
  static readJsonData(jsonPaths = globalState.jsonPath) {
    console.log(`globalState.jsonPath: ${globalState.jsonPath}`);
    const paths = Array.isArray(jsonPaths) ? jsonPaths : [jsonPaths];
    const merged = {};

    paths.forEach(path => {
      if (fs.existsSync(path)) {
        const fileData = fs.readFileSync(path, 'utf-8');
        let arr = [];
        try {
          arr = JSON.parse(fileData);
        } catch (error) {
          console.error(`Lỗi khi phân tích cú pháp tệp JSON (${path}):`, error);
        }
        arr.forEach(item => {
          if (!item.profile) return;
          if (!merged[item.profile]) {
            merged[item.profile] = { ...item };
          } else {
            Object.assign(merged[item.profile], item);
          }
        });
      } else {
        console.log(`Tệp JSON không tồn tại: ${path}`);
      }
    });

    return Object.values(merged);
  }

  static writeJsonData(data) {
    try {
      fs.writeFileSync(globalState.jsonPath, JSON.stringify(data, null, 2));
      console.log("Dữ liệu JSON đã được ghi thành công!");
    } catch (error) {
      console.error("Lỗi khi ghi vào tệp JSON:", error);
    }
  }

  static async updateJsonFields(path, profileKey, updatedFields) {
    const data = JsonDataService.readJsonData(path);
    //console.log('data', data);
    const index = data.findIndex(item => item.profile === profileKey);

    if (index === -1) {
      console.log(`Không tìm thấy profile: ${profileKey}`);
      return;
    }

    Object.keys(updatedFields).forEach(field => {
      if (field in data[index]) {
        if (typeof updatedFields[field] === 'object' && data[index][field]) {
          Object.assign(data[index][field], updatedFields[field]);
        } else {
          data[index][field] = updatedFields[field];
        }
      } else {
        console.log(`Trường không tồn tại trong dữ liệu: ${field}`);
      }
    });

    JsonDataService.writeJsonData(data);
    console.log(`Dữ liệu cho profile '${profileKey}' đã được cập nhật!`);
  }

  async ExcelToJson() {
    const workerData = this.getDataExcel();

    if (!workerData || !workerData.profiles.length) {
      console.log("Dữ liệu Excel không hợp lệ hoặc không có dữ liệu.");
      return;
    }
    for (let i = 0; i < workerData.profiles.length; i++) {
      const newData = {
        profile: workerData.profiles[i] || '',
        mnemonic: workerData.mnemonics[i] || '',
        proxy: workerData.proxies[i] || '',
        google: {
          gmail: `${workerData.googles[i]?.split(' ')[0] || ''}@gmail.com`
        },
        discord: {
          email: `${workerData.discord[i]?.split(' ')[0] || ''}@${workerData.discord[i]?.split(' ')[1] || ''}`,
          token_discord: workerData.discord[i]?.split(' ')[2] || null
        },
        twitter: {
          user: workerData.x[i]?.split(' ')[0] || '',
          auth2fa: workerData.x[i]?.split(' ')[2] || '',
          backupcode: workerData.x[i]?.split(' ')[3] || '',
          cookies: []
        },
        hotmail: workerData.hotMails[i] || ''
      };

      const index = this.data.findIndex(item => item.profile === newData.profile);
      if (index !== -1) {
        this.data[index] = newData;
      } else {
        this.data.push(newData);
      }
    }

    this.writeJsonData(this.data);
  }

  loadFileExcel() {
    try {
      const workbook = xlsx.readFile(globalState.excelPath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      if (!sheet) {
        console.error('Không tìm thấy sheet trong workbook Excel.');
        return [];
      }
      return xlsx.utils.sheet_to_json(sheet);
    } catch (error) {
      console.error('Lỗi khi đọc file Excel:', error);
      return [];
    }
  }

  getDataExcel() {
    const data = this.loadFileExcel();
    const profiles = [];
    const mnemonics = [];
    const proxies = [];
    const x = [];
    const googles = [];
    const discord = [];
    const hotMails = [];

    data.forEach((row) => {
      if (row.Profile) profiles.push(row.Profile);
      if (row.Mnemonic) mnemonics.push(row.Mnemonic);
      if (row.Proxy) proxies.push(row.Proxy);
      if (row.X) x.push(row.X);
      if (row.Google) googles.push(row.Google);
      if (row.Discord) discord.push(row.Discord);
      if (row.hot_mail) hotMails.push(row.hot_mail);
    });

    return { profiles, mnemonics, proxies, x, googles, discord, hotMails };
  }
}

module.exports = JsonDataService;
