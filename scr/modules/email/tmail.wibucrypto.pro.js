const globalState = require('../../config/globalState');
const { PageService, ElementService, axiosService } = require('../../config/import.service');
const { UtilTwitter } = require('../../config/import.util');
const axios = require('axios');
const { faker, da } = require('@faker-js/faker');
const Util = require('../../util/util');
const waitUntil = {
    load: 'load',
    domcontentloaded: 'domcontentloaded',
    networkidle0: 'networkidle0',
    networkidle2: 'networkidle2'
}
async function find_element(page, selector) {
    try {
        console.log(`[find_element] Chờ tìm phần tử: ${selector}`);
        await page.waitForSelector(selector, { visible: true, timeout: 10000 });

        const element = await page.$(selector);
        if (element) {
            console.log(`[find_element] Tìm thấy phần tử: ${selector}`);

            // Lấy textContent của phần tử
            const text = await page.evaluate(el => el.textContent.trim(), element);
            
            console.log(`[find_element] Nội dung lấy được: "${text}"`);
            return text;
        } else {
            console.error(`[find_element] Không tìm thấy phần tử: ${selector}`);
            return null;
        }
    } catch (error) {
        console.error(`[find_element] Lỗi khi lấy nội dung: ${error.message}`);
        return null;
    }
}


class Tmail_wibucrypto_pro {

    static async GetEmail() {
        const tmail = await PageService.openFirstPage('https://tmail.wibucrypto.pro/mailbox', waitUntil.load)

        while (true) {
            await Util.sleep(5000)
            const text = await find_element(tmail, "#email_id");
            console.log("Nội dung lấy được:", text);

            if (text !== "") {
                //await tmail.close()
                return text;
            }

            console.log("Chưa có email, thử lại...");
        }
    }

    static async CreateEmail() {
        const tmail = await PageService.openNewPage('https://tmail.wibucrypto.pro/mailbox', waitUntil.load)
        
    }
}



// https://tmail.wibucrypto.pro/mailbox

module.exports = Tmail_wibucrypto_pro;
