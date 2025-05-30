const xlsx = require('xlsx');
const { sleep } = require('../../util/util');
const { connect } = require('puppeteer');
const PuppeteerAuto = require('../../browser/auto_chromium');

const Auto = PuppeteerAuto();
const WalletLoader = function (filePath) {
    //        chrome-extension://ppbibelpcjmhbdihakflkdcoccbgbkpo/index.html#/welcome
    return {
        loadFile: function () {
            try {
                const workbook = xlsx.readFile(filePath);
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
        },

        findMnemonicByAddress: function (address) {
            const data = this.loadFile();
            const match = data.find((row) => row.Address === address);
            return match ? match.Mnemonic : null;
        },

        getAddressesFromExcel: function () {
            const workbook = xlsx.readFile(filePath);
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            if (!sheet) {
                console.error('Không tìm thấy sheet trong workbook Excel.');
                return [];
            }
            const addressColumn = 'A';
            const addresses = [];

            let rowIndex = 2;
            while (sheet[`${addressColumn}${rowIndex}`]) {
                addresses.push(sheet[`${addressColumn}${rowIndex}`].v);
                rowIndex++;
            }

            return addresses;
        },

        getProxiesFromExcel: function () {
            const workbook = xlsx.readFile(filePath);
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            if (!sheet) {
                console.error('Không tìm thấy sheet trong workbook Excel.');
                return [];
            }
            const proxyColumn = 'B';
            const proxies = [];

            let rowIndex = 2;
            while (sheet[`${proxyColumn}${rowIndex}`]) {
                proxies.push(sheet[`${proxyColumn}${rowIndex}`].v);
                rowIndex++;
            }

            return proxies;
        },

        getWalletData: function () {
            const data = this.loadFile();
            const addresses = [];
            const Mnemonics = [];
            const proxies = [];
            const x = [];
            const Googles = [];
            const Discords = [];
            const Profiles = [];
            const token_discords = [];
            const hot_mails = []
            const proxie_logs = []
            // Duyệt qua từng dòng trong dữ liệu để trích xuất Address và Proxy
            data.forEach((row) => {
                if (row.Profile) Profiles.push(row.Profile);
                if (row.Address) addresses.push(row.Address);
                if (row.Proxy) proxies.push(row.Proxy);
                if (row.Mnemonic) Mnemonics.push(row.Mnemonic);
                if (row.X) x.push(row.X);
                if (row.Google) Googles.push(row.Google);
                if (row.Discord) Discords.push(row.Discord);
                if (row.token_discord) token_discords.push(row.token_discord);
                if (row.hot_mail) hot_mails.push(row.hot_mail);
                if (row.proxy_log_acc) proxie_logs.push(row.proxy_log_acc);
            });
            //console.log('hot_mails', hot_mails)
            //console.log(Googles)
            // console.log({ addresses, proxies, x })
            return { Profiles, addresses, proxies, x, Mnemonics, Googles, Discords, token_discords, hot_mails, proxie_logs };
        },
        inputMnemonic: async function (page, formattedMnemonic) {
            if (formattedMnemonic.length !== 12) {
                throw new Error("Invalid mnemonic: Expected 12 words.");
            }
            for (let i = 0; i < formattedMnemonic.length; i++) {
                await page.waitForSelector(`xpath=//*[@id="import-srp__srp-word-${i}"]`);
                await page.type(`xpath=//*[@id="import-srp__srp-word-${i}"]`, formattedMnemonic[i]);
            }
        },

        inputPasswordMetaMask: async function (page, password) {
            let xpath
            xpath = await page.waitForSelector('xpath=//*[@id="app-content"]/div/div[2]/div/div/div/div[2]/form/div[1]/label/input');
            await xpath.type(password);
            xpath = await page.waitForSelector('xpath=//*[@id="app-content"]/div/div[2]/div/div/div/div[2]/form/div[2]/label/input');
            await xpath.type(password);
            xpath = await page.waitForSelector('xpath=//*[@id="app-content"]/div/div[2]/div/div/div/div[2]/form/div[3]/label/span[1]/input');
            await xpath.click();
            xpath = await page.waitForSelector('xpath=//*[@id="app-content"]/div/div[2]/div/div/div/div[2]/form/button');
            await xpath.click();
            xpath = await page.waitForSelector('xpath=//*[@id="app-content"]/div/div[2]/div/div/div/div[3]/button');
            await xpath.click();
            xpath = await page.waitForSelector('xpath=//*[@id="app-content"]/div/div[2]/div/div/div/div[2]/button');
            await xpath.click();
            xpath = await page.waitForSelector('xpath=//*[@id="app-content"]/div/div[2]/div/div/div/div[2]/button');
            await xpath.click();
            await sleep(5000)
            page.close()
        },

        CloseblankAndExtension: async function (pages) {
            for (const page of pages) {
                const url = await page.url();
                if (url === 'about:blank') {
                    await page.close();
                }
            }
        },
        inputInfo: async function (page, formattedMnemonic, state = { stage1: false, stage2: false, stage3: false }) {
            // Giai đoạn 1
            let xpath
            if (!state.stage1) {
                console.log("Running stage 1...");
                xpath = await page.waitForSelector('xpath=//*[@id="onboarding__terms-checkbox"]');
                await xpath.click();
                xpath = await page.waitForSelector('xpath=//*[@id="app-content"]/div/div[2]/div/div/div/ul/li[3]/button');
                await xpath.click();
                xpath = await page.waitForSelector('xpath=//*[@id="app-content"]/div/div[2]/div/div/div/div[2]/button[2]');
                await xpath.click();
                state.stage1 = true;
            } else {
                console.log("Stage 1 already completed. Skipping...");
            }

            // Giai đoạn 2
            if (!state.stage2) {
                console.log("Running stage 2...");
               // await page.reload({ waitUntil: "networkidle0" });
                if (formattedMnemonic.length !== 12) {
                    throw new Error("Invalid mnemonic: Expected 12 words.");
                }
                for (let i = 0; i < formattedMnemonic.length; i++) {
                    const key = await page.waitForSelector(`xpath=//*[@id="import-srp__srp-word-${i}"]`);
                    await key.type(formattedMnemonic[i]);
                }
                xpath = await page.waitForSelector('xpath=//*[@id="app-content"]/div/div[2]/div/div/div/div[4]/div/button');
                await xpath.click();
                state.stage2 = true;
            } else {
                console.log("Stage 2 already completed. Skipping...");
            }
            // Giai đoạn 3
            if (!state.stage3) {
                console.log("Running stage 3...");
                //await page.reload({ waitUntil: "networkidle0" });
                xpath = await page.waitForSelector('xpath=//*[@id="app-content"]/div/div[2]/div/div/div/div[2]/form/div[1]/label/input');
                await xpath.type('hunghung');
                xpath = await page.waitForSelector('xpath=//*[@id="app-content"]/div/div[2]/div/div/div/div[2]/form/div[2]/label/input');
                await xpath.type('hunghung');
                xpath = await page.waitForSelector('xpath=//*[@id="app-content"]/div/div[2]/div/div/div/div[2]/form/div[3]/label/span[1]/input');
                await xpath.click();
                xpath = await page.waitForSelector('xpath=//*[@id="app-content"]/div/div[2]/div/div/div/div[2]/form/button');
                await xpath.click();
                xpath = await page.waitForSelector('xpath=//*[@id="app-content"]/div/div[2]/div/div/div/div[3]/button');
                await xpath.click();
                xpath = await page.waitForSelector('xpath=//*[@id="app-content"]/div/div[2]/div/div/div/div[2]/button');
                await xpath.click();
                xpath = await page.waitForSelector('xpath=//*[@id="app-content"]/div/div[2]/div/div/div/div[2]/button');
                await xpath.click();
                await sleep(6000)
                //page.close()
                state.stage3 = true;
            } else {
                console.log("Stage 3 already completed. Skipping...");
            }
        },

        interactWithMetaMask: async function (browser, formattedMnemonic) {
            const pages = await browser.pages();
            await sleep(3000)
            await pages[0].goto("chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/home.html#onboarding/welcome");
            await sleep(3000)
            let attempts = 0;
            const maxAttempts = 5;
            state = { stage1: false, stage2: false, stage3: false }
            while (attempts < maxAttempts) {
                try {
                    console.log(`Attempt ${attempts + 1} to import`);
                    await this.inputInfo(pages[0], formattedMnemonic,state);
                    console.log("Login successful!");
                    return;
                } catch (error) {
                    console.log(`import attempt ${attempts + 1} failed. Retrying...`);
                    attempts++;
                    if (attempts < maxAttempts) {
                        await sleep(5000);
                    }
                }
            }
            console.log("Login import after multiple attempts. Connection might be slow.");
        },

        inputInfoTrust: async function (page, formattedMnemonic,  state = { stage1: false, stage2: false, stage3: false }) {
            const key = formattedMnemonic.split(' ');
            // Giai đoạn 1
            
            if (!state.stage1) {
                
                state.stage1 = true;
            } else {
                console.log("Stage 1 already completed. Skipping...");
            }

            // Giai đoạn 2
            if (!state.stage2) {
                


               
                //*[@id="root"]/div/div/div[2]/div/div/div[2]/form/div[1]/div[2]/div[1]/div[1]/div/input
                //*[@id="root"]/div/div/div[2]/div/div/div[2]/form/div[1]/div[2]/div[1]/div[2]/div/input
                //*[@id="root"]/div/div/div[2]/div/div/div[2]/form/div[1]/div[2]/div[1]/div[3]/div/input
                //*[@id="root"]/div/div/div[2]/div/div/div[2]/form/div[1]/div[2]/div[1]/div[4]/div/input
                //*[@id="root"]/div/div/div[2]/div/div/div[2]/form/div[1]/div[2]/div[1]/div[5]/div/input
                //*[@id="root"]/div/div/div[2]/div/div/div[2]/form/div[1]/div[2]/div[1]/div[6]/div/input


                //*[@id="root"]/div/div/div[2]/div/div/div[2]/form/div[1]/div[2]/div[2]/div[1]/div/input
                //*[@id="root"]/div/div/div[2]/div/div/div[2]/form/div[1]/div[2]/div[2]/div[2]/div/input
                //*[@id="root"]/div/div/div[2]/div/div/div[2]/form/div[1]/div[2]/div[2]/div[3]/div/input
                //*[@id="root"]/div/div/div[2]/div/div/div[2]/form/div[1]/div[2]/div[2]/div[4]/div/input
                //*[@id="root"]/div/div/div[2]/div/div/div[2]/form/div[1]/div[2]/div[2]/div[5]/div/input
                //*[@id="root"]/div/div/div[2]/div/div/div[2]/form/div[1]/div[2]/div[2]/div[6]/div/input

                
                state.stage2 = true;
            } else {
                console.log("Stage 2 already completed. Skipping...");
            }
            // Giai đoạn 3
            if (!state.stage3) {
                console.log("Running stage 3...");
                await sleep(20000)
                
                //page.close()
                state.stage3 = true;
            } else {
                console.log("Stage 3 already completed. Skipping...");
            }
        },
        interactWithTruct: async function (browser, formattedMnemonic) {
            const pages = await browser.pages();

            await pages[0].goto("chrome-extension://egjidjbpglichdcondbcbdnbeeppgdph/home.html#/onboarding");

            let attempts = 0;
            const maxAttempts = 5;
            let xpath
            let element
            console.log("Running stage 1...");
            xpath = '//*[@id="root"]/div/div[2]/div/div/div/div/div[3]/div';
            element = await Auto.ElementXpath(pages[0], xpath, 20);
            if (element) {
                await element.click();  // Click vào nút
            }
            xpath = '//*[@id="root"]/div[2]/div/div/div[2]/form/div[1]/div/div/input';
            element = await Auto.ElementXpath(pages[0], xpath, 2);
            if (element) {
                await element.type('Hunghung123@'); 
            }
            xpath = '//*[@id="root"]/div[2]/div/div/div[2]/form/div[2]/div/div/input';
            element = await Auto.ElementXpath(pages[0], xpath, 2);
            if (element) {
                await element.type('Hunghung123@'); 
            }
            xpath = '//*[@id="root"]/div[2]/div/div/div[2]/form/div[3]/div/label';
            element = await Auto.ElementXpath(pages[0], xpath, 2);
            if (element) {
                await element.click();  
            }
            xpath = '//*[@id="root"]/div[2]/div/div/div[2]/form/div[4]/div[2]/button';
            element = await Auto.ElementXpath(pages[0], xpath, 2);
            if (element) {
                await element.click();  
            }

            await sleep(3000)
            console.log("Running stage 2...");

            for (let i = 0; i < 12; i++) {
                const row = i < 6 ? 1 : 2; // Xác định hàng
                const col = i < 6 ? i + 1 : i - 5; // Xác định cột
                const xpath = `xpath=//*[@id="root"]/div/div/div[2]/div/div/div[2]/form/div[1]/div[2]/div[${row}]/div[${col}]/div/input`;
        
                console.log(`Typing word "${formattedMnemonic[i]}" into field at row ${row}, column ${col}.`);
                const element = await pages[0].waitForSelector(xpath, { visible: true }); // Chờ selector xuất hiện
                await element.type(formattedMnemonic[i]); // Nhập từ vào input
            }
            
            xpath = '//*[@id="root"]/div/div/div[2]/div/div/div[2]/form/div[2]/div[2]/button';
            element = await Auto.ElementXpath(pages[0], xpath, 2);
            
            if (element) {
                await element.click();  
            }
            xpath = '//*[@id="root"]/div[2]/div/div/div/div[2]/div[2]/button';
            element = await Auto.ElementXpath(pages[0], xpath, 15);
            if (element) await element.click(); 
        },
        connectOrApprove: async function (browser){
            let target = await browser.waitForTarget(target => target.url() === 'chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/notification.html');
            let pageTarget = await target.page();
            await sleep(3000)
            let retries = 6; 
            let elementMetaMask = null;
            while (retries > 0) {
                try {

                    elementMetaMask = await pageTarget.waitForSelector('xpath=//*[@id="password"]', { timeout: 3000 });
                    if (elementMetaMask) {
                        await elementMetaMask.type('hunghung');
                        await pageTarget.keyboard.press("Enter");
                        console.log("Element found and typed!");
                        break; 
                    }
                } catch (error) {
                    console.log("Element not found, retrying...");
                    retries--; 
                    if (retries === 0) {
                        console.log("Error: Element not found after 3 retries");
                    }
                }
                await sleep(3000);
            }

            xpath = await pageTarget.waitForSelector('xpath=//*[@id="app-content"]/div/div/div/div[2]/div/div[3]/div/div[2]/button[2]');
            xpath.click()

            // aprove mạng
            await sleep(3000)
            /// can vuot o day
            let ButtonAprove = null
            try {
                ButtonAprove = await pageTarget.waitForSelector('xpath=//*[@id="app-content"]/div/div/div/div[2]/div[3]/button[2]', { timeout: 3000 });
            } catch (e) {
                console.log("Button not found, skipping...");
            }
            if (ButtonAprove) {
               await ButtonAprove.click();
            }
        },
        ChangeNetWork: async function (page, ChainID) {
            await page.goto(`https://chainlist.org/chain/${ChainID}`);
            await new Promise(resolve => setTimeout(resolve, 3000));
            await page.waitForSelector("#__next > div > div.dark\:bg-\[\#181818\].bg-\[\#f3f3f3\].p-5.relative.flex.flex-col.gap-5 > div:nth-child(2) > button", { visible: true });
            await page.click("#__next > div > div.dark\:bg-\[\#181818\].bg-\[\#f3f3f3\].p-5.relative.flex.flex-col.gap-5 > div:nth-child(2) > button");
        },

        GetAddressByMnemonic: async function (browser, Mnemonic) {
            await new Promise(resolve => setTimeout(resolve, 10000));
            const formattedMnemonic = Mnemonic.split(' ');
            const pages = await browser.pages();
            const newPage = await browser.newPage();
            const WEBSITE_URL = 'chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/home.html#'
            await newPage.goto('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/home.html#onboarding/welcome');
            const context = browser.defaultBrowserContext();
            await context.overridePermissions(WEBSITE_URL, [
                "clipboard-read",
                "clipboard-write",
                "clipboard-sanitized-write",
            ]);
            this.CloseblankAndExtension(pages)
            //await newPage.waitForSelector("#onboarding__terms-checkbox", { visible: true, timeout: 5000 });

            await new Promise(resolve => setTimeout(resolve, 5000));
            await newPage.waitForSelector("#onboarding__terms-checkbox", { visible: true, timeout: 10000 });
            await newPage.evaluate(() => {
                document.querySelector("#onboarding__terms-checkbox").scrollIntoView();
            });
            await newPage.click("#onboarding__terms-checkbox");

            // Tương tự cho các nút tiếp theo
            await newPage.waitForSelector('#app-content > div > div.mm-box.main-container-wrapper > div > div > div > ul > li:nth-child(3) > button', { visible: true, timeout: 10000 });
            await newPage.click('#app-content > div > div.mm-box.main-container-wrapper > div > div > div > ul > li:nth-child(3) > button');

            // Và nút cuối cùng
            await newPage.waitForSelector('#app-content > div > div.mm-box.main-container-wrapper > div > div > div > div.mm-box.onboarding-metametrics__buttons.mm-box--display-flex.mm-box--gap-4.mm-box--flex-direction-row.mm-box--width-full > button.mm-box.mm-text.mm-button-base.mm-button-base--size-lg.mm-button-primary.mm-text--body-md-medium.mm-box--padding-0.mm-box--padding-right-4.mm-box--padding-left-4.mm-box--display-inline-flex.mm-box--justify-content-center.mm-box--align-items-center.mm-box--color-primary-inverse.mm-box--background-color-primary-default.mm-box--rounded-pill', { visible: true, timeout: 10000 });
            await newPage.click('#app-content > div > div.mm-box.main-container-wrapper > div > div > div > div.mm-box.onboarding-metametrics__buttons.mm-box--display-flex.mm-box--gap-4.mm-box--flex-direction-row.mm-box--width-full > button.mm-box.mm-text.mm-button-base.mm-button-base--size-lg.mm-button-primary.mm-text--body-md-medium.mm-box--padding-0.mm-box--padding-right-4.mm-box--padding-left-4.mm-box--display-inline-flex.mm-box--justify-content-center.mm-box--align-items-center.mm-box--color-primary-inverse.mm-box--background-color-primary-default.mm-box--rounded-pill');

            await this.inputMnemonic(newPage, formattedMnemonic);
            await newPage.waitForSelector("#app-content > div > div.mm-box.main-container-wrapper > div > div > div > div.import-srp__actions > div > button", { visible: true });
            await newPage.click("#app-content > div > div.mm-box.main-container-wrapper > div > div > div > div.import-srp__actions > div > button");
            const password = 'hunghung'
            await this.inputPasswordMetaMask(newPage, password)
            await new Promise(resolve => setTimeout(resolve, 10000));

            // buton copy address in metamask
            await newPage.waitForSelector("#app-content > div > div.mm-box.multichain-app-header.mm-box--margin-bottom-0.mm-box--display-flex.mm-box--align-items-center.mm-box--width-full.mm-box--background-color-background-alternative > div > div.mm-box.mm-text.mm-text--body-md.mm-text--ellipsis.mm-box--display-flex.mm-box--flex-direction-column.mm-box--align-items-center.mm-box--color-text-default > div > div > button", { visible: true });
            await newPage.click("#app-content > div > div.mm-box.multichain-app-header.mm-box--margin-bottom-0.mm-box--display-flex.mm-box--align-items-center.mm-box--width-full.mm-box--background-color-background-alternative > div > div.mm-box.mm-text.mm-text--body-md.mm-text--ellipsis.mm-box--display-flex.mm-box--flex-direction-column.mm-box--align-items-center.mm-box--color-text-default > div > div > button");
            // -- how to get address 
            // -- how to get address 
            const clipboardContent = await newPage.evaluate(async () => {
                const text = navigator.clipboard.readText();
                return text;
            });

            //console.log("Clipboard content:", clipboardContent)
        },



    };
};

module.exports = WalletLoader;

