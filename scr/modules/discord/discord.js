const globalState = require('../../config/globalState');
const { PageService, ElementService, axiosService } = require('../../config/import.service');
const { UtilTwitter } = require('../../config/import.util');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

const Util = require('../../util/util');

class Discord {

    static async LoginToken(token) {
        const page = await globalState.browser.newPage();
        const discordToken = token
        const defaultOptions = {
            timeout: 100000,
            waitUntil: 'domcontentloaded',
        };
        //console.log('discordToken', discordToken)
        const bypassLocalStorageOverride = (page) =>
            page.evaluateOnNewDocument(() => {
                let __ls = localStorage;
                Object.defineProperty(window, "localStorage", {
                    writable: false,
                    configurable: false,
                    value: __ls,
                });
            });


        bypassLocalStorageOverride(page);
        await Util.sleep(9999)
        await page.goto("https://discord.com/app", defaultOptions);

        await page.evaluate((token) => {
            localStorage.setItem("token", `"${token}"`);
        }, discordToken);

        var token = null

        page.on('request', (request) => {
            let tokenLogged = false;
            const headers = request.headers();
            if (headers.authorization && !tokenLogged) {
                //console.log(`Token:`, headers.authorization);
                token = headers.authorization
                tokenLogged = true;
            }
        });
        //console.log(`var:`, token);
        await page.goto('https://discord.com/channels/@me', defaultOptions);
        //await page.close()
    }

    static async LoginDiscord2auth() {
        const data = globalState.workerData.discord
        let token = null
        const discord = await PageService.openFirstPage('https://discord.com/login')
        discord.on('request', (request) => {
            let tokenLogged = false;
            const headers = request.headers();
            if (headers.authorization && !tokenLogged) {
                //console.log(`${workerData.profile}`, headers.authorization);
                token = headers.authorization
                tokenLogged = true;
            }
        });
        console.log(`var:`, token);
        while (true) {
            const input = await discord.$('#uid_32');
            if (input) {
                await input.type(data.email)
                break;
            }
            await Util.sleep(500)
        }
        while (true) {
            const input = await discord.$('#uid_34');
            if (input) {
                await input.type(data.pass)
                await discord.keyboard.press("Enter");
                break;
            }
            await Util.sleep(500)
        }
        while (true) {
            const text = await ElementService.HandlefindAndElementText(discord, 'Enter Discord Auth Code', 1)
            if (text) {
                break;
            }
            await Util.sleep(500)
        }
        const page = await PageService.openNewPage('https://2fa.live/')
        await page.waitForSelector('#listToken', { timeout: 10000 });
        while (true) {
            const input = await page.$('#listToken');
            if (input) {
                await input.type(data.auth2fa)
                break;
            }
            await Util.sleep(500)
        }
        await Util.waitFor1sAnd30s()
        await page.waitForSelector('#submit', { timeout: 10000 });
        while (true) {
            const button = await page.$('#submit');
            if (button) {
                await button.click()
                break;
            }
            await Util.sleep(500)
        }
        await page.waitForSelector('#output', { timeout: 10000 });
        await Util.sleep(3000)
        const outputValue = await page.$eval('#output', el => el.value);
        const value = outputValue.split('|');
        console.log(value[1]);
        await page.close()

        while (true) {
            const input = await discord.$('.inputDefault__0f084.input__0f084');
            if (input) {
                await input.type(value[1])
                await discord.keyboard.press("Enter");
                break;
            }
            await Util.sleep(3000)
        }
        while (true) {
            if (token) {
                const jsonObject = {
                    profile: workerData.profile,
                    updatedFields: {
                        discord: {
                            token_discord: token,
                        },
                    },
                };
                await JsonDataService.updateJsonFields(jsonObject.profile, jsonObject.updatedFields);
                break
            }
            await Util.sleep(3000)
        }
    }

    static async authorizationScroll() {

        const pagePartalWallet = await PageService.getTargetPage('https://discord.com/oauth2/authorize?client_id=1283243979562811482&redirect_uri=https://chainopera.ai/quest&response_type=code&scope=guilds+identify+guilds.join')
        //await Util.sleep(5000)

        await ElementService.HandlefindAndClickElement(
            pagePartalWallet,
            '//*[@id="app-mount"]/div[2]/div[1]/div[1]/div/div/div/div/div[1]/div[1]/div/div/div[3]/div[4]/div',
            1
        )
        await ElementService.HandlefindAndClickElementText(
            pagePartalWallet,
            //'//*[@id="root"]/div/div[1]/div/div[2]/div/button[2]',
            'Authorize',
            1
        )

    }

    static async saveTokenToProfile(token) {
        try {
            const profileName = globalState.workerData.profile;
            // Đường dẫn chính xác tuyệt đối
            //const jsonPath = path.join(__dirname, '..', 'data.discord.json');
            // Hoặc dùng đường dẫn tuyệt đối luôn:
            const jsonPath = 'E:/puppeteer-auto-meta-proxy/scr/data.discord.json';

            const data = await fs.readFile(jsonPath, 'utf8');
            let profiles = JSON.parse(data);

            let found = profiles.find(p => p.profile === profileName);
            if (!found) {
                found = { profile: profileName, discord: {} };
                profiles.push(found);
            }
            found.discord = found.discord || {};
            found.discord.token_discord = token;

            await fs.writeFile(jsonPath, JSON.stringify(profiles, null, 2), 'utf8');
            console.log(`Đã cập nhật token cho profile: ${profileName}`);
        } catch (err) {
            console.error('Lỗi khi cập nhật token Discord:', err);
        }
    }

    static async getAndSaveDiscordTokenToProfile(discordPage) {
        let token = null;
        let tokenLogged = false;

        discordPage.on('request', async (request) => {
            const headers = request.headers();
            if (headers.authorization && !tokenLogged) {
                token = headers.authorization;
                tokenLogged = true;
                await Discord.saveTokenToProfile(token);
            }
        });

        // Chờ mãi đến khi có token
        let waited = 0;
        while (!token) {
            await Util.sleep(500);
            waited += 500;
            if (waited % 60000 === 0) { // mỗi 1 phút log 1 lần
                console.log('Vẫn chưa lấy được token Discord, tiếp tục chờ...');
            }
        }
        return token;
    }

}

module.exports = Discord;
