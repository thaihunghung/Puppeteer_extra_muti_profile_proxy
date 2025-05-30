const globalState = require('../../config/globalState');
const { PageService, ElementService, axiosService } = require('../../config/import.service');
const { UtilTwitter } = require('../../config/import.util');
const axios = require('axios');
const { faker, da } = require('@faker-js/faker');
const Util = require('../../util/util');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { safeToString } = require('tough-cookie/dist/utils');
const API_KEY = process.env.YESCAPTRA;
const API_URL = 'https://api.yescaptcha.com';

async function solveFunCaptcha({
    websiteURL,
    websitePublicKey,
    funcaptchaApiJSSubdomain = null,
    userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    arkoseBlob = null,
}) {
    try {
        const task = {
            type: "FunCaptchaTaskProxylessM1",
            websiteURL,
            websitePublicKey,
            userAgent
        };

        if (funcaptchaApiJSSubdomain) task.funcaptchaApiJSSubdomain = funcaptchaApiJSSubdomain;
        //if (arkoseBlob) task.data = JSON.stringify({ blob: arkoseBlob });

        const createTaskResponse = await axios.post(`${API_URL}/createTask`, {
            clientKey: API_KEY,
            task
        });

        const { taskId, errorId, errorDescription } = createTaskResponse.data;

        if (errorId !== 0) {
            throw new Error(`Create task error: ${errorDescription}`);
        }

        console.log(`✅ Task created: ${taskId}`);

        while (true) {
            await new Promise(res => setTimeout(res, 5000)); // đợi 5 giây
            const resultResponse = await axios.post(`${API_URL}/getTaskResult`, {
                clientKey: API_KEY,
                taskId
            });

            const result = resultResponse.data;

            if (result.status === 'processing') {
                console.log('⌛ Đang xử lý...');
                continue;
            }

            if (result.status === 'ready') {
                console.log('🎉 Captcha solved!');
                console.log('Result token:', result.solution.token);
                return result.solution.token;
            }

            if (result.errorId && result.errorId !== 0) {
                console.error('❌ Task Result Error');
                console.error('🧾 taskId:', taskId);
                console.error('📄 Config:', JSON.stringify(task, null, 2));
                console.error('🚨 errorId:', result.errorId);
                console.error('🚨 errorCode:', result.errorCode);
                console.error('🚨 errorDescription:', result.errorDescription || 'Không rõ lỗi');
                throw new Error(`Task result error: ${result.errorDescription || 'Không rõ lỗi'}`);
            }


            if (!result.status) {
                throw new Error(`API không trả về trạng thái hợp lệ: ${JSON.stringify(result)}`);
            }
        }
    } catch (error) {
        console.error('❌ Error solving captcha:', error.message);
        return null;
    }
}
function saveTwitterCookies(username, cookies) {
    const dir = path.resolve(__dirname, './cookies/twitter');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    const filePath = path.join(dir, `${username}.json`);
    fs.writeFileSync(filePath, JSON.stringify(cookies, null, 2), 'utf8');
    console.log(`Đã lưu cookies vào: ${filePath}`);
}

class Twitter {
    static async Create(email = null, fakeName = null, proxy = null, retries = 3) {
        try {
            let arkoseBlob = null;
            const page = await PageService.openNewPage('https://x.com/i/flow/signup', 'load');
            const fakeFirstName = faker.person.firstName();
            const fakeLastName = faker.person.lastName();
            const randomSuffix = Math.floor(Math.random() * 100000);
            const fakeName = `${fakeFirstName}${fakeLastName}${randomSuffix}`;
            // Tạo file txt chứa thông tin theo định dạng yêu cầu
            const line = `${globalState.workerData.i + 1}|${fakeName}|${email}\n`;
            fs.appendFileSync(`twitter${globalState.workerData.i + 1}.txt`, line, { encoding: 'utf8' });

            console.log('Generated username:', fakeName);
            console.log('Email:', email);

            // Click through signup steps
            await ElementService.waitAndClickByXpath(page, '/html/body/div/div/div/div[1]/div[2]/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/div/div/div/button[2]');
            await ElementService.waitAndClickByXpath(page, '/html/body/div/div/div/div[1]/div[2]/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/div[1]/div/div[2]/button/span');
            await ElementService.waitAndClickByXpath(page, '/html/body/div/div/div/div[1]/div[2]/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/div[1]/div/div[2]/div[1]/label/div/div[2]/div/input');
            await ElementService.waitAndType(page, '#layers > div:nth-child(2) > div > div > div > div > div > div.css-175oi2r.r-1ny4l3l.r-18u37iz.r-1pi2tsx.r-1777fci.r-1xcajam.r-ipm5af.r-g6jmlv.r-1awozwy > div.css-175oi2r.r-1wbh5a2.r-htvplk.r-1udh08x.r-1867qdf.r-kwpbio.r-rsyp9y.r-1pjcn9w.r-1279nm1 > div > div > div.css-175oi2r.r-1ny4l3l.r-6koalj.r-16y2uox.r-kemksi.r-1wbh5a2 > div.css-175oi2r.r-16y2uox.r-1wbh5a2.r-f8sm7e.r-13qz1uu.r-1ye8kvj > div.css-175oi2r.r-16y2uox.r-1wbh5a2.r-1dqxon3 > div > div:nth-child(2) > div:nth-child(1) > label > div > div.css-175oi2r.r-18u37iz.r-16y2uox.r-1wbh5a2.r-1wzrnnt.r-1udh08x.r-xd6kpl.r-is05cd.r-ttdzmv > div > input', fakeName);
            await ElementService.waitAndClickByXpath(page, '/html/body/div/div/div/div[1]/div[2]/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/div[1]/div/div[2]/div[2]/label/div/div[2]/div/input');
            await ElementService.waitAndType(page, 'input[name="email"]', email);

            // Random birth date
            const randomMonth = Math.floor(Math.random() * 12) + 1;
            const randomDay = Math.floor(Math.random() * 27) + 1;
            const randomYear = Math.floor(Math.random() * (2005 - 1990 + 1)) + 1990;
            await ElementService.HandleWaitForSelectorClickElement(page, '#SELECTOR_1');
            await page.select('#SELECTOR_1', `${randomMonth}`);
            await Util.sleep(1500);
            await ElementService.HandleWaitForSelectorClickElement(page, '#SELECTOR_2');
            await page.select('#SELECTOR_2', `${randomDay}`);
            await Util.sleep(1500);
            await ElementService.HandleWaitForSelectorClickElement(page, '#SELECTOR_3');
            await page.select('#SELECTOR_3', `${randomYear}`);
            await ElementService.waitAndClickByXpath(page, '/html/body/div/div/div/div[1]/div[2]/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/div[2]/div/div/div/button');
            await Util.sleep(10000);
            console.log('Đang chờ iframe #arkoseFrame...');
            await page.waitForSelector('#arkoseFrame', { timeout: 20000 });
            const arkoseFrameElement = await page.$('#arkoseFrame');
            if (!arkoseFrameElement) {
                throw new Error('Không tìm thấy #arkoseFrame');
            }
            console.log('Đã tìm thấy #arkoseFrame');
            const arkoseFrame = await arkoseFrameElement.contentFrame();
            if (!arkoseFrame) {
                throw new Error('Không lấy được contentFrame của #arkoseFrame');
            }
            console.log('Đã truy cập contentFrame của #arkoseFrame');

            // Kiểm tra iframe enforcement: iframe.PbRoleerFjplRBGoiUNB
            console.log('Đang chờ iframe enforcement...');
            await arkoseFrame.waitForSelector('iframe.PbRoleerFjplRBGoiUNB', { timeout: 10000 });
            const enforcementFrameElement = await arkoseFrame.$('iframe.PbRoleerFjplRBGoiUNB');
            if (!enforcementFrameElement) {
                throw new Error('Không tìm thấy iframe.PbRoleerFjplRBGoiUNB');
            }
            console.log('Đã tìm thấy iframe.PbRoleerFjplRBGoiUNB');
            const enforcementFrame = await enforcementFrameElement.contentFrame();
            if (!enforcementFrame) {
                throw new Error('Không lấy được contentFrame của iframe.PbRoleerFjplRBGoiUNB');
            }
            console.log('Đã truy cập contentFrame của iframe.PbRoleerFjplRBGoiUNB');

            // Kiểm tra iframe game-core: #game-core-frame
            console.log('Đang chờ iframe #game-core-frame...');
            await enforcementFrame.waitForSelector('#game-core-frame', { timeout: 10000 });
            const gameCoreFrameElement = await enforcementFrame.$('#game-core-frame');
            if (!gameCoreFrameElement) {
                throw new Error('Không tìm thấy #game-core-frame');
            }
            console.log('Đã tìm thấy #game-core-frame');
            const gameCoreFrame = await gameCoreFrameElement.contentFrame();
            if (!gameCoreFrame) {
                throw new Error('Không lấy được contentFrame của #game-core-frame');
            }
            console.log('Đã truy cập contentFrame của #game-core-frame');

            const button = await gameCoreFrame.evaluateHandle(() => {
                const buttons = Array.from(document.querySelectorAll('button'));
                return buttons.find(btn => btn.textContent.trim() === 'Authenticate');

            });
            if (button.asElement()) {
                await button.click();
                console.log('Đã nhấp vào nút Authenticate bằng text');
            } else {
                throw new Error('Không tìm thấy nút Authenticate bằng text');
            }
            console.log('Đã nhấp vào nút Authenticate');
        } catch (error) {
            console.error(error.message);
        }
    }

    static async Login(user, pass, auth2fa) {
        const page = await PageService.openNewPage('https://x.com/i/flow/login', 'load');
        try {
            await ElementService.waitAndClickByXpath(page, "//input[@name='text' and @type='text' and @autocomplete='username']");
            await ElementService.HandlefindAndTypeElement(page, "//input[@name='text' and @type='text' and @autocomplete='username']", user);
            await ElementService.HandlefindAndClickElement(page, "//button[@role='button' and .//span/span[text()='Next']]");
            await ElementService.HandlefindAndTypeElement(page, "//input[@type='password' and @name='password' and @autocomplete='current-password']", pass);
            await ElementService.HandlefindAndClickElement(page, "//button[@role='button' and .//span/span[text()='Log in']]");
            console.log('auth2fa', auth2fa);
            await Util.sleep(5000);
            const inputSelector = '[data-testid="ocfEnterTextTextInput"]';
            const inputelement = await ElementService.ElementWaitForSelector(page, inputSelector, 10);
            if (inputelement.found) {
                await Util.waitFor1sAnd30s();
                const auth = await axiosService.get2faToken(auth2fa);
                await inputelement.element.type(auth);
            }
            await ElementService.HandlefindAndClickElement(page, "//button[@role='button' and .//span/span[text()='Next']]", 10);
            await Util.sleep(10000);
            const cookies = await PageService.getCookiesByOrder(page, ['auth_token', 'twid'])
            saveTwitterCookies(user, cookies);
            return true;
        } catch (err) {
            console.error('Lỗi khi xử lý cookie:', err);
            if (close && page) await page.close();
            return false;
        }
        return false;
    }

    async follow(nameUser) {
        const page = await PageService.openNewPage(`https://x.com/${nameUser}`);
        await ElementService.HandlefindAndClickElement(page, '[data-testid*="follow"]', 10);
        await page.close();
    }

    async report(url) {
        const page = await PageService.openNewPage(url);
        await ElementService.HandlefindAndClickElement(page, '[aria-label*="reposts. Repost"]', 10);
        await page.close();
    }

    async like(url) {
        const page = await PageService.openNewPage(url);
        await ElementService.HandleWaitForSelectorClickElement(page, '[data-testid="like"]', 10);
        await page.close();
    }

    async unLike(url) {
        const page = await PageService.openNewPage(url);
        await ElementService.HandleWaitForSelectorClickElement(page, '[data-testid="unlike"]', 10);
        await page.close();
    }
}

module.exports = Twitter;








