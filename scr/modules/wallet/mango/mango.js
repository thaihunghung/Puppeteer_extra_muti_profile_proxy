const { Page } = require('puppeteer');
const globalState = require('../../../config/globalState');
const { PageService, ElementService, KeyboardService, axiosService } = require('../../../config/import.service');
const { Util } = require('../../../config/import.util');
const { axios } = require('../../../config/module.import');
const { HandlefindAndClickElementText, HandlefindAndClickElement } = require('../../../services/element.service');
const PhantomWallet = require('../phantom/phantom');
const MetaWallet = require('../metamask/meta');

require('dotenv').config();
class MangoWallet {
    constructor() { }
    static async Create(close = false) {
        while (true) {
            const page = await PageService.findPageByUrl('chrome-extension://dppaompgmpfnhedcbfapomacoalkplkl/ui.html#/accounts/add-account')
            if (page.check) break
            await Util.sleep(3000)
        }
        const page = await PageService.getTargetPage('chrome-extension://dppaompgmpfnhedcbfapomacoalkplkl/ui.html#/accounts/add-account')
        if (page) {
            await page.goto('chrome-extension://dppaompgmpfnhedcbfapomacoalkplkl/ui.html#/accounts/import-passphrase')
            const mnemonics = globalState.workerData.mnemonic.split(' ');
            for (let i = 0; i < mnemonics.length; i++) {
                const xpath = `//input[@id="recoveryPhrase.${i}"]`;
                await ElementService.HandlefindAndTypeElement(page, xpath, mnemonics[i])
            }
            await page.keyboard.press("Enter");
            await ElementService.HandlefindAndTypeElement(page, `//input[@name="password.input"]`, process.env.PASS_DISCORD)
            await ElementService.HandlefindAndTypeElement(page, `//input[@name="password.confirmation"]`, process.env.PASS_DISCORD)
            await ElementService.HandlefindAndClickElement(page, `//*[@id="acceptedTos"]`)
            await ElementService.HandlefindAndClickElement(page, `//button[@type="submit"]`)
            await Util.sleep(15000)

        }
        if (close) {
            await page.close()
        }
    }
    static async Unblock(close = false) {
        while (true) {
            const page = await PageService.findPageByUrl('chrome-extension://dppaompgmpfnhedcbfapomacoalkplkl/ui.html#/tokens')
            if (page.check) break
            await Util.sleep(3000)
        }
        const page = await PageService.getTargetPage('chrome-extension://dppaompgmpfnhedcbfapomacoalkplkl/ui.html#/tokens')
        if (page) {
            await ElementService.HandlefindAndClickElement(page,
                '//*[@id="root"]/div/div[1]/div/div/main/div[2]/div/div/button'
            );
            await ElementService.HandlefindAndTypeElement(page, `//input[@name="password"]`, process.env.PASS_DISCORD)
            await page.keyboard.press("Enter");
            await ElementService.HandlefindAndClickElement(page,
                '//*[@id="root"]/div/div[1]/div/div/main/div[2]/div/div/div[2]/div[2]/div[2]/div[3]'
            );
        }
        if (close) {
            await page.close()
        }
    }

    static async Brigh(close) {
        const stop = async (page) => {
            const button = 'div.sc-beySPh.sc-dmyCSP.jjRyOK.eLwzbZ button[disabled]'
            while (true) {
                await ElementService.HandlefindAndTypeElement(page, `//*[@id="root"]/div[3]/div/div[1]/div[2]/div/div/div[3]/input`, '1', 1)
                const input = await ElementService.HandleFindWithWaitForSelectorElement(page, button, 1)
                if (!input) {
                    break
                }
                await Util.sleep(5000)
            }
        }

        const page = await PageService.openNewPage('https://cross.testnet.mangonetwork.io/')
        //await page.reload()
        if (await ElementService.HandlefindAndElementText(page, 'Connect Wallet', 1)) {
            await ElementService.HandlefindAndClickElementText(page, 'Connect Wallet', 1)
            if (await ElementService.HandlefindAndClickElement(page, `//button[@class="c-isyYnr"]`, 1)) {
                await Util.sleep(1000)
                await this.ConnectAddress(1)
            }
        }
        //Coin bright
        //ETH: 1, BTC: 2, Mango: 3, Sui: 4, BSC: 5
        ////*[@id="root"]/div[4]/div[1]/div[2]/div/div[__index__]/div
        const ButonConectMeta = async (page) => {
            await ElementService.HandlefindAndClickElement(page, `//*[@id="root"]/div[4]/div[1]/div[2]/div/div[2]/div/div`, 1)
            await this.ConnectMetaMask(3)
        }

        const BSCToMango = async (page) => {
            await ElementService.HandleWaitForSelectorClickElement(page, 'div.sc-beySPh.sc-dmyCSP.qPSxK.eLwzbZ')
            await ElementService.HandlefindAndClickElement(page, `//*[@id="root"]/div[4]/div[1]/div[2]/div/div[5]/div`, 1)
            //buton conect 
            await ElementService.HandlefindAndClickElement(page, `//*[@id="root"]/div[3]/div/div[1]/div[1]/button`, 1)
            await ButonConectMeta(page)
            await ElementService.HandlefindAndClickElement(page, `//*[@id="root"]/div[3]/div/div[1]/div[2]/div/div/div[2]/div[2]/div`, 1)
            await ElementService.HandlefindAndClickElement(page, `//*[@id="root"]/div[4]/div[1]/div[2]/div[2]`, 1)
            await ElementService.HandlefindAndTypeElement(page, `//*[@id="root"]/div[3]/div/div[1]/div[2]/div/div/div[3]/input`, '0.01', 1)

            // end quá trình chọn coin bright
            await Util.sleep(3000)
            //buton conect 
            await ElementService.HandlefindAndClickElement(page, `//*[@id="root"]/div[3]/div/div[3]/div[1]/button`, 1)
            //await this.ConnectMetaMask(3)
            await Util.sleep(3000)
            await ElementService.HandlefindAndClickElement(page, `//*[@id="root"]/div[3]/div/div[4]/div[2]/button`, 1)
            await this.ConnectMetaMask(3)
            await Util.sleep(10000)
        }
        const ETHToMango = async (page) => {
            await ElementService.HandleWaitForSelectorClickElement(page, 'div.sc-beySPh.sc-dmyCSP.qPSxK.eLwzbZ')
            await ElementService.HandlefindAndClickElement(page, `//*[@id="root"]/div[4]/div[1]/div[2]/div/div[1]/div`, 1)
            //buton conect 
            await ElementService.HandlefindAndClickElement(page, `//*[@id="root"]/div[3]/div/div[1]/div[1]/button`, 1)
            await ButonConectMeta(page)
            await ElementService.HandlefindAndClickElement(page, `//*[@id="root"]/div[3]/div/div[1]/div[2]/div/div/div[2]/div[2]/div`, 1)
            await ElementService.HandlefindAndClickElement(page, `//*[@id="root"]/div[4]/div[1]/div[2]/div[2]`, 1)
            await ElementService.HandlefindAndTypeElement(page, `//*[@id="root"]/div[3]/div/div[1]/div[2]/div/div/div[3]/input`, '0.01', 1)

            // end quá trình chọn coin bright
            await Util.sleep(3000)

            await ElementService.HandlefindAndClickElement(page, `//*[@id="root"]/div[3]/div/div[3]/div[2]/div/div/div[1]`, 1)
            await ElementService.HandlefindAndClickElement(page, `//*[@id="root"]/div[4]/div[1]/div[2]/div/div/div`, 1)
            await ElementService.HandlefindAndClickElement(page, `//*[@id="root"]/div[3]/div/div[3]/div[2]/div/div/div[2]/div[2]/div`, 1)
            await ElementService.HandlefindAndClickElement(page, `//*[@id="root"]/div[4]/div[1]/div[2]/div`, 1)

            //buton conect 
            await ElementService.HandlefindAndClickElement(page, `//*[@id="root"]/div[3]/div/div[3]/div[1]/button`, 1)
            //await this.ConnectMetaMask(3)
            await Util.sleep(5000)
            await ElementService.HandlefindAndTypeElement(page, `//*[@id="root"]/div[3]/div/div[1]/div[2]/div/div/div[3]/input`, '0.01', 1)
            await ElementService.HandlefindAndClickElement(page, `//*[@id="root"]/div[3]/div/div[4]/div[2]/button`, 1)
            await this.ConnectMetaMask(5)
            await Util.sleep(10000)
        }
        const MangoToBSCandETH = async (page) => {
            await ElementService.HandleWaitForSelectorClickElement(page, 'div.sc-beySPh.sc-dmyCSP.qPSxK.eLwzbZ')
            await ElementService.HandlefindAndClickElement(page, `//*[@id="root"]/div[4]/div[1]/div[2]/div/div[3]/div`, 1)

            //buton conect 
            await ElementService.HandlefindAndClickElement(page, `//*[@id="root"]/div[3]/div/div[1]/div[1]/button`, 1)
            await ElementService.HandlefindAndClickElement(page, `//*[@id="root"]/div[3]/div/div[1]/div[2]/div/div/div[2]/div[2]/div`, 1)
            await ElementService.HandlefindAndClickElement(page, `//*[@id="root"]/div[4]/div[1]/div[2]/div[2]`, 1)
            await ElementService.HandlefindAndTypeElement(page, `//*[@id="root"]/div[3]/div/div[1]/div[2]/div/div/div[3]/input`, '1', 1)

            // end quá trình chọn coin bright
            await Util.sleep(3000)
            //buton conect 
            await ElementService.HandlefindAndClickElement(page, `//*[@id="root"]/div[3]/div/div[3]/div[1]/button`, 1)
            await ElementService.HandlefindAndClickElement(page, `//*[@id="root"]/div[4]/div[1]/div[2]/div/div[2]/div/div`, 1)
            await this.ConnectMetaMask(3)
            await ElementService.HandlefindAndClickElement(page, `//*[@id="root"]/div[3]/div/div[4]/div[2]/button`, 1)
            await this.ConnectAddress(3)
            await Util.sleep(10000)
            await stop(page)
            await ElementService.HandlefindAndTypeElement(page, `//*[@id="root"]/div[3]/div/div[1]/div[2]/div/div/div[3]/input`, '1', 1)
            await ElementService.HandlefindAndClickElement(page, `//*[@id="root"]/div[3]/div/div[3]/div[2]/div/div/div[1]/div/div`, 1)
            await ElementService.HandlefindAndClickElement(page, `//*[@id="root"]/div[4]/div[1]/div[2]/div/div[1]/div`, 1)
            await ElementService.HandlefindAndClickElement(page, `//*[@id="root"]/div[3]/div/div[3]/div[2]/div/div/div[2]/div[2]/div`, 1)
            await ElementService.HandlefindAndClickElement(page, `//*[@id="root"]/div[4]/div[1]/div[2]/div`, 1)
            await ElementService.HandlefindAndClickElement(page, `//*[@id="root"]/div[3]/div/div[4]/div[2]/button`, 1)
            await Util.sleep(10000)
            await this.ConnectAddress(3)
        }

        const reset = async (page) => {
            await ElementService.HandlefindAndClickElement(page, `//*[@id="root"]/div[2]/div/div/div/div[2]`, 1)
            await ElementService.HandlefindAndClickElement(page, `//*[@id="root"]/div[2]/div/div/div/div[1]`, 1)
        }


        await MangoToBSCandETH(page)
        // await stop(page)
        // await reset(page)
        // await Util.sleep(10000)
        // await BSCToMango(page)
        // await stop(page)
        // await reset(page)
        // await Util.sleep(10000)
        // await ETHToMango(page)
        // await page.close()
        // await this.Submit(4)
        if (close) {
            await page.close()
        }
    }

    static async CreateMetaMask() {
        // while (true) {
        //     const page = await PageService.findPageByUrl('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/home.html#onboarding/welcome')
        //     if (page.check) break
        //     await Util.sleep(3000)
        // }
        const page = await PageService.openFirstPage('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/home.html#onboarding/welcome')
        if (page) {
            await ElementService.HandlefindAndClickElement(page, `//input[@id="onboarding__terms-checkbox"]`)
            await ElementService.HandlefindAndClickElement(page, `//*[@id="app-content"]/div/div[2]/div/div/div/ul/li[3]/button`)
            await ElementService.HandlefindAndClickElementText(page, 'I agree')
            await Util.sleep(5000)

            const mnemonics = globalState.workerData.mango_mnemonic.split(' ');
            for (let i = 0; i < mnemonics.length; i++) {
                const xpath = `//input[@data-testid="import-srp__srp-word-${i}"]`;
                await ElementService.HandlefindAndTypeElement(page, xpath, mnemonics[i])
            }
            await ElementService.HandlefindAndClickElementText(page, 'Confirm Secret Recovery Phrase')
            await Util.sleep(5000)
            await ElementService.HandlefindAndTypeElement(page, `//input[@data-testid="create-password-new"]`, process.env.PASS_PORTAL)
            await ElementService.HandlefindAndTypeElement(page, `//input[@data-testid="create-password-confirm"]`, process.env.PASS_PORTAL)
            await ElementService.HandlefindAndClickElement(page, `//input[@data-testid="create-password-terms"]`)
            await ElementService.HandlefindAndClickElement(page, `//*[@id="app-content"]/div/div[2]/div/div/div/div[2]/form/button`)
            await Util.sleep(5000)
            await ElementService.HandlefindAndClickElement(page, `//input[@data-testid="onboarding-complete-done"]`)


        }

    }
    static async WebMangonetwork() {
        const page = await PageService.openNewPage('https://task.testnet.mangonetwork.io/?invite=BtshI9')
        if (await ElementService.HandlefindAndElementText(page, 'Connect Wallet', 1)) {
            await ElementService.HandlefindAndClickElementText(page, 'Connect Wallet', 1)
            await ElementService.HandlefindAndClickElement(page, `//button[@class="c-isyYnr"]`, 1)
            await Util.sleep(1000)
            await this.ConnectAddress(2)
        }
    }
    static async CheckinMango() {
        const page = await PageService.openNewPage('https://task.testnet.mangonetwork.io/events')
        if (await ElementService.HandlefindAndElementText(page, 'Connect Wallet', 1)) {
            await ElementService.HandlefindAndClickElementText(page, 'Connect Wallet', 1)
            await ElementService.HandlefindAndClickElement(page, `//button[@class="c-isyYnr"]`, 1)
            await Util.sleep(1000)
            await this.ConnectAddress(2)
        }
        const xpaths = [
            '//*[@id="airdrop"]/div[2]/div[2]/div[1]/div[2]/div[4]/img',
            '//*[@id="airdrop"]/div[2]/div[2]/div[1]/div[2]/div[4]/div[1]',
            '//*[@id="airdrop"]/div[2]/div[2]/div[1]/div[2]/div[4]/div[2]'
        ];

        function getRandomXPath(xpaths) {
            const randomIndex = Math.floor(Math.random() * xpaths.length);
            return xpaths[randomIndex];
        }

        const randomXPath = getRandomXPath(xpaths);
        await ElementService.HandlefindAndClickElement(page, randomXPath);

        const Sign = await ElementService.HandlefindAndClickElement(page, '//*[@id="airdrop"]/div[3]/div/div[2]/div/div[1]/div/div/div/div[2]')
        await this.ConnectAddress(2)
        //await Util.sleep(10000)
        await page.close()
    }
    static async faucetMango() {
        const faucet = await PageService.openNewPage('https://discord.com/channels/1199663960392224769/1322383092153057311')
        await Util.sleep(5000)
        const value = globalState.workerData.mango

        await ElementService.HandlefindAndTypeElement(faucet,
            '//*[@id="app-mount"]/div[2]/div[1]/div[1]/div/div[2]/div/div/div/div/div[3]/div[2]/main/form/div[1]/div[1]/div[2]/div/div[1]/div/div[2]',
            `@mgo-faucet ${value}`
        )
        await faucet.keyboard.press("Enter")
        await Util.sleep(5000)
        //await faucet.close()
        await this.Submit(3)
    }
    static async faucetETH() {

        const faucet = await PageService.openNewPage("https://cloud.google.com/application/web3/faucet/ethereum/sepolia")
    }
    static async BNB() {
        const faucet = await PageService.openNewPage("https://www.bnbchain.org/en/testnet-faucet")
        await Util.sleep(5000)
        await ElementService.HandlefindAndClickElement(faucet, `#field-\:R1aa8plt6\:`)
        await ElementService.HandlefindAndClickElement(faucet, `//*[@id="drip"]/cw3-faucet-drip-form/form/button`)

    }

    static async Swap() {
        async function changeCoin(page, textchange) {
            const xpathMap = {
                //'MGO': '/html/body/div[2]/div[2]/div/div[2]/div[1]',
                //'USDT': '/html/body/div[2]/div[2]/div/div[2]/div[2]',
                //'MAI': '/html/body/div[2]/div[2]/div/div[2]/div[3]',
                'MGO': 'body > div.adm-popup > div.adm-popup-body.adm-popup-body-position-bottom > div > div.poplist > div:nth-child(1)',
                'USDT': 'body > div.adm-popup > div.adm-popup-body.adm-popup-body-position-bottom > div > div.poplist > div:nth-child(2)',
                'MAI': 'body > div.adm-popup > div.adm-popup-body.adm-popup-body-position-bottom > div > div.poplist > div:nth-child(3)',
            };

            const xpath = xpathMap[textchange]

            try {
                //await Util.sleep(3500)
                await ElementService.HandleWaitForSelectorClickElement(page, xpath);
                console.log(`Successfully clicked element for coin: ${textchange}`);
            } catch (error) {
                console.error(`Error changing coin: ${textchange}. Details:`, error);
            }
        }

        async function ChonCoinSwap(page, textchange) {
            await ElementService.HandleWaitForSelectorClickElement(page,
                '#root > div.sc-lnsjTu.dFarmc > div > div > div.sc-blmEgr.iFiIMW > div:nth-child(1) > div > div > button'
            );
            const selector = 'div.adm-popup-body.adm-popup-body-position-bottom[style="height: 90vh; pointer-events: unset; transform: translate(0px, 0%);"]';

            while (true) {
                const test = await ElementService.HandleFindWithWaitForSelectorElement(page, selector, 1)
                if (test) {
                    break
                }
                await Util.sleep(1000)
            }
            // await Util.sleep(1000)
            await changeCoin(page, textchange)
        }

        async function ChonCoinMuonSwap(page, textchange) {
            await ElementService.HandleWaitForSelectorClickElement(page,
                '#root > div.sc-lnsjTu.dFarmc > div > div > div.sc-blmEgr.iFiIMW > div:nth-child(3) > div > div > button'
            );
            const selector = 'div.adm-popup-body.adm-popup-body-position-bottom[style="height: 90vh; pointer-events: unset; transform: translate(0px, 0%);"]';
            while (true) {
                const test = await ElementService.HandleFindWithWaitForSelectorElement(page, selector, 1)
                if (test) {
                    break
                }
                await Util.sleep(1000)
            }
            await changeCoin(page, textchange)
        }

        async function MGO_USDT(page, inputToken) {
            await ChonCoinSwap(page, 'MGO')
            const selector = 'div.adm-popup-body.adm-popup-body-position-bottom[style="height: 90vh; pointer-events: none; transform: translate(0px, 100%);"]';
            while (true) {
                const test = await ElementService.HandleFindWithWaitForSelectorElement(page, selector, 1)
                if (test) {
                    break
                }
                await Util.sleep(1000)
            }

            await ChonCoinMuonSwap(page, 'USDT')
            await ElementService.HandlefindAndTypeElement(page,
                `//*[@id="root"]/div[3]/div/div/div[2]/div[1]/label/input`,
                inputToken
            )
        }
        async function USDT_MAI(page, inputToken) {
            await ChonCoinSwap(page, 'USDT')
            const selector = 'div.adm-popup-body.adm-popup-body-position-bottom[style="height: 90vh; pointer-events: none; transform: translate(0px, 100%);"]';
            while (true) {
                const test = await ElementService.HandleFindWithWaitForSelectorElement(page, selector, 1)
                if (test) {
                    break
                }
                await Util.sleep(1000)
            }
            await ChonCoinMuonSwap(page, 'MAI')

            await ElementService.HandlefindAndTypeElement(page,
                `//*[@id="root"]/div[3]/div/div/div[2]/div[1]/label/input`,
                inputToken
            )
        }
        async function MAI_USDT(page, inputToken) {
            await ChonCoinSwap(page, 'MAI')

            const selector = 'div.adm-popup-body.adm-popup-body-position-bottom[style="height: 90vh; pointer-events: none; transform: translate(0px, 100%);"]';
            while (true) {
                const test = await ElementService.HandleFindWithWaitForSelectorElement(page, selector, 1)
                if (test) {
                    break
                }
                await Util.sleep(1000)
            }
            await ChonCoinMuonSwap(page, 'USDT')

            await ElementService.HandlefindAndTypeElement(page,
                `//*[@id="root"]/div[3]/div/div/div[2]/div[1]/label/input`,
                inputToken
            )
        }

        async function Submit(page) {
            while (true) {
                const butonSumit = await ElementService.HandlefindAndClickElement(page, '//*[@id="root"]/div[3]/div/div/div[2]/button[text() = "Submit"]')
                if (!butonSumit) {
                    break
                }
                await Util.sleep(1000)
            }
        }
        async function Reset(page) {
            await ElementService.HandlefindAndClickElement(page,
                '//*[@id="root"]/div[1]/img'
            )
        }


        const page = await PageService.openNewPage("https://swap.testnet.mangonetwork.io/swap")
        if (await ElementService.HandlefindAndElementText(page, 'Connect Wallet', 1)) {
            await ElementService.HandlefindAndClickElementText(page, 'Connect Wallet', 1)
            await ElementService.HandlefindAndClickElement(page, `//button[@class="c-isyYnr"]`, 1)
            await Util.sleep(1000)
            await this.ConnectAddress(2)
        }
        const randomMGO = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
        const MGO = `0.0${randomMGO}`;
        const randomUSDT = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
        const USDT = `0.00${randomUSDT}`;
        const randomMAI = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
        const MAI = `0.0000${randomMAI}`;

        // if (await ElementService.HandlefindAndClickElement(page, '//*[@id="root"]/div[3]/div/div/div[2]/div[1]/div/div[1]/button/img[@src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAexJREFUWEfFl+1RwzAMhtVJoJugSaCT0E4CTKJ2EsokkDdn+5TEsmSXXnPX648k0iP51Ud29OBrN+JfRJ7Te/mfmPk8YisMkJy+EtEbERXHK6fX6d4nEV2iQC6AcnzsjBAgJ2YGlHk1AUQE0X50OtaPzxlh5pNlwwQQkffppd6oLT+AONRuVgECzjPYZdIEooQm8AO0pY8qxAZARF6ISIxQ4OxgCSygl+P6OGoAv4bzMzNzRA8iggAQSO2CmVKyCwARgeAgPPfFJNCnlPIvbTRl4jsSyBogFL1RHTgalN58TTqybOF2yUIBcEpuISDD+JWZ9woAGXAFqQFa51YAGqARyMxXYDVAK2W5xcJArRWvo480sD26ZBSgJf5FdTgC1HZmHcwATu3fwzlszqLNABCLVTYmwNRUdAZbDaxm42aAHtGZfeUWDZS2Ojg1NyJslWEtgqJ8p/VabXUOXmdgZPzmSRgZEfqZcnwaYEiIvZ7T89tWnMqxNYzWvjDR8pKB7FlDbPOenqrrYdSThRJFR/NZDKKFBtQQibTR0kg6G5m/kCSDEUHm+fDjrGI5tupCY+2EOAp8A/zXUmpuU95aHsmEVwibtOsX7vlh0lxgM4QLoMSZjwVDx1o4sy6wIza/iLoBdNoe8nHqHfTo/T9qxQQwIpCEgAAAAABJRU5ErkJggg=="]', 1)) {

        // }
        //await Reset(page)
        await Util.sleep(2000)
        await MGO_USDT(page, MGO)
        await Submit(page)
        await this.ConnectAddress(2)
        //await Util.sleep(5000)
        await Reset(page)
        await USDT_MAI(page, USDT)
        await Submit(page)
        await this.ConnectAddress(2)
        //await Util.sleep(5000)
        await Reset(page)
        await MAI_USDT(page, MAI)
        await Submit(page)
        await this.ConnectAddress(2)
        // await Util.sleep(5000)
        await Reset(page)

        //await page.close()
        await this.Submit(2)
    }
    static async Dex() {
        // Hàm thay đổi giá trị slider
        const moveSlider = async () => {
            const sliderHandle = await page.$('#root > div > div:nth-child(3) > div.px-5.pb-5.gridto11 > div:nth-child(2) > div:nth-child(5) > div > div.ant-slider-handle');
            const boundingBox = await sliderHandle.boundingBox();
            await page.mouse.move(boundingBox.x + boundingBox.width / 2, boundingBox.y + boundingBox.height / 2);
            await page.mouse.down();
            await page.mouse.move(boundingBox.x + randomMove, boundingBox.y);
            await page.mouse.up();
        };
        async function Submit(page, text) {
            while (true) {
                const butonSumit = await ElementService.HandlefindAndClickElement(page, `//*[@id="root"]/div/div[3]/div[2]/div[2]/div[9]/button/span[text() = "${text}"]`)
                if (!butonSumit) {
                    break
                }
                await Util.sleep(1000)
            }
        }
        const page = await PageService.openNewPage("https://dex.testnet.mangonetwork.io/#/trade/0xd481053e669ba570a83b72b5b0662bc66ff1449a25b214468e81b1957f452139");
        //await Util.sleep(10000)
        //await ElementService.HandlefindAndClickElement(page, `//*[@id="root"]/div/div[2]/div[2]/div[3]/div"]`)

        if (await ElementService.HandlefindAndElementText(page, 'Connect Wallet', 1)) {
            await ElementService.HandlefindAndClickElementText(page, 'Connect Wallet', 1)
            await ElementService.HandlefindAndClickElement(page, `//button[@class="c-isyYnr"]`, 1)
            await Util.sleep(1000)
            await this.ConnectAddress(1)
        }
        const randomMove = Math.floor(Math.random() * (400 - 70 + 1)) + 70;
        //await page.reload()
        await ElementService.HandleWaitForSelectorClickElement(page, '#root > div > div:nth-child(3) > div.px-5.pb-5.gridto11 > div:nth-child(2) > div:nth-child(2) > div', 2);
        await Util.sleep(3000);
        await ElementService.HandlefindAndClickElementText(page, 'Market Order');
        await moveSlider();
        await Util.sleep(1000);
        await Submit(page, 'Buy')
        await this.ConnectAddress(2);
        const selector = 'div.ant-slider-handle[role="slider"][aria-valuenow="0"][style="left: 0%; transform: translateX(-50%);"]';
        while (true) {
            const test = await ElementService.HandleFindWithWaitForSelectorElement(page, selector, 1)
            if (test) {
                break
            }
            await Util.sleep(1000)
        }
        await ElementService.HandlefindAndClickElementText(page, 'Sell');
        await Util.sleep(5000);
        await moveSlider();
        await Util.sleep(1000);
        await Submit(page, 'Sell')
        await this.ConnectAddress(2);

        await this.Submit(5)
    }
    static async Submit(id_task, number = 1) {
        const page = await PageService.openNewPage(`https://task.testnet.mangonetwork.io/taskDetail/${id_task}`);
        if (await ElementService.HandlefindAndElementText(page, 'Connect Wallet', 1)) {
            await ElementService.HandlefindAndClickElementText(page, 'Connect Wallet', 1)
            await ElementService.HandlefindAndClickElement(page, `//button[@class="c-isyYnr"]`, 1)
            await Util.sleep(1000)
            await this.ConnectAddress(2)
        }
        await Util.sleep(2000)
        const buttons = await page.$$('button.sc-d800fabc-26.icCofi');

        for (const button of buttons) {
            await button.click();
            console.log('Đã click vào một button!');
            await Util.sleep(500); // Đợi 0.5 giây
        }
        await Util.sleep(2000)
        await ElementService.HandleWaitForSelectorClickElement(page, '#airdrop > div.main-out-box > div.bodys > div.sc-d800fabc-0.LbXoB.common-px > div.sc-d800fabc-15.dVPftI > div.sc-d800fabc-17.cesHZN > img')

    }

    static async ConnectAddress(maxAttempts = Infinity) {
        let isTaskCompleted = false;
        let attempts = 0; // Đếm số lần lặp

        async function handleSign(pageTarget) {
            if (isTaskCompleted) return false;
            const result = await ElementService.HandlefindAndClickElement(pageTarget, '//button/div[text() = "Sign"]', 1);
            if (result) isTaskCompleted = true;
            return result;
        }

        async function handleApprove(pageTarget) {
            if (isTaskCompleted) return false;
            const result = await ElementService.HandlefindAndClickElement(pageTarget, '//button/div[text() = "Approve"]', 1);
            if (result) isTaskCompleted = true;
            return result;
        }

        async function handleConnect(pageTarget) {
            if (isTaskCompleted) return false;
            const result = await ElementService.HandlefindAndClickElement(pageTarget, '//button/div[text() = "Connect"]', 1);
            if (result) isTaskCompleted = true;
            return result;
        }

        async function handleUnlockToApprove(pageTarget) {
            if (isTaskCompleted) return false;
            const result = await ElementService.HandlefindAndClickElement(pageTarget, '//button/div[text() = "Unlock to Approve"]', 1);
            if (result) {
                await ElementService.HandlefindAndTypeElement(pageTarget, `//input[@name="password"]`, process.env.PASS_DISCORD);
                await pageTarget.keyboard.press("Enter");
                await ElementService.HandlefindAndClickElement(pageTarget, '//button/div[text() = "Sign"]');
                await ElementService.HandlefindAndClickElement(pageTarget, '//button/div[text() = "Approve"]');
                isTaskCompleted = true;
            }
            return result;
        }

        async function handleAllAccountsLocked(pageTarget) {
            if (isTaskCompleted) return false;
            const result = await ElementService.HandlefindAndElementText(pageTarget, 'All accounts are currently locked. Unlock accounts to connect.', 1);
            if (result) {
                await ElementService.HandlefindAndClickElement(pageTarget, '//*[@id="root"]/div/div[1]/div/div/main/div/div[1]/div[2]/div/div[2]/div[2]/div/div[2]/div/div');
                await ElementService.HandlefindAndTypeElement(pageTarget, `//input[@name="password"]`, process.env.PASS_DISCORD);
                await pageTarget.keyboard.press("Enter");
                await ElementService.HandlefindAndClickElement(pageTarget, '//*[@id="root"]/div/div[1]/div/div/main/div/div[1]/div[2]/div/div/button');
                await ElementService.HandlefindAndClickElement(pageTarget, '//button/div[text() = "Connect"]');
                isTaskCompleted = true;
            }
            return result;
        }

        while (true) {
            if (attempts >= maxAttempts) {
                console.log(`Reached maximum attempts (${maxAttempts}). Exiting loop.`);
                break;
            }

            const page = await PageService.findPageByUrl('chrome-extension://dppaompgmpfnhedcbfapomacoalkplkl/ui.html');
            if (page.check) {
                const pageTarget = await PageService.getTargetPage(`${page.url}`);

                // Chạy song song các tác vụ
                await Promise.all([
                    handleSign(pageTarget),
                    handleApprove(pageTarget),
                    handleConnect(pageTarget),
                    handleUnlockToApprove(pageTarget),
                    handleAllAccountsLocked(pageTarget),
                ]);

                if (isTaskCompleted) {
                    console.log('Operation completed successfully.');
                    break; // Thoát nếu hoàn thành nhiệm vụ
                }
            }

            attempts++;
            console.log(`Attempt ${attempts}${maxAttempts === Infinity ? '' : `/${maxAttempts}`}`);
            await Util.sleep(5000);
        }
    }
    static async ConnectMetaMask(maxAttempts = Infinity) {
        let attempts = 0;

        while (true) {
            if (attempts >= maxAttempts) {
                console.log(`Reached maximum attempts (${maxAttempts}). Exiting loop.`);
                break;
            }

            await Promise.all([
                MetaWallet.Unblock(),
                MetaWallet.Conect(),
                MetaWallet.Confirm(),
                MetaWallet.Confirm1()
            ]);

            attempts++;
            console.log(`Attempt ${attempts}${maxAttempts === Infinity ? '' : `/${maxAttempts}`}`);
            await Util.sleep(5000);
        }
    }
    static async PromiseAll() {
        await Promise.all([
            // this.Gohome(),
            this.ConnectAddress(),
        ]);
    }












    static async faucet() {
        const faucetBTC = async (page) => {
            await Util.sleep(5000)
            await ElementService.HandlefindAndTypeElement(page,
                '//*[@id="input-1"]',
                globalState.workerData.portal.BTC
            );
            await Util.sleep(5000)
            await ElementService.HandlefindAndClickElement(page,
                '//*[@id="card-1"]/div/button'
            );
            await Util.sleep(5000)
        }
        const faucetPT = async (page) => {
            await Util.sleep(5000)
            await ElementService.HandlefindAndTypeElement(page,
                '//*[@id="input-3"]',
                globalState.workerData.portal.ETH
            );
            await Util.sleep(5000)
            await ElementService.HandlefindAndClickElement(page,
                '//*[@id="card-3"]/div/button'
            );
            await Util.sleep(5000)
        }
        const totalPages = 5;
        const url = 'https://faucet-testnet.portaldefi.com';
        const pages = [];

        for (let i = 0; i < totalPages; i++) {
            const page = await PageService.openNewPage(url);
            pages.push(page);
        }

        const performfaucet = async (page, index) => {
            console.log(`Tab ${index + 1}: Bắt đầu`);
            let isClosed = false;

            page.on('close', () => {
                console.log(`Tab ${index + 1}: Đã bị đóng`);
                isClosed = true;
            });
            await page.evaluate(() => {
                window.scrollBy(0, 100);
            });
            let counter = 0;
            while (true) {
                if (isClosed) {
                    console.log(`Tab ${index + 1}: Kết thúc vòng lặp do tab đã đóng`);
                    break;
                }
                counter++;
                if (counter >= 15) {
                    console.log('Đã đạt giới hạn 15 lần lặp.');
                    break;
                }
                await Util.sleep(20000)
                await ElementService.HandlefindAndClickElementText(page, 'Sign & Verify')
                await Util.sleep(10000)
                const warningText = "✅ Identity Verified! You will receive your ETH in 3-5 minutes";
                if (await ElementService.HandlefindAndElementText(page, warningText)) {
                    break;
                }
            }
            console.log(`Tab ${index + 1}: Hoàn thành`);
        }
        await Promise.all(pages.map((page, index) => performfaucet(page, index)));
        console.log(`Hoàn thành`);
        await Util.sleep(10000)

        globalState.stopfaucet = true
        for (const page of pages) {
            await page.close();
        }
        console.log('Tất cả các tab đã hoàn thành công việc.');
    }

    static async Gohome(close = false) {
        const pagePartalWallet = await PageService.openFirstPage('chrome-extension://ognaedodaplpjafdhdnofpiffhjgfdmh/popup.html#/home')

        while (true) {
            await Util.sleep(10000)
            if (globalState.stopfaucet) {
                console.log('Dừng Enter')
                break
            }
            await pagePartalWallet.keyboard.down('Control');
            await pagePartalWallet.keyboard.press("Enter");
            await pagePartalWallet.keyboard.up('Control');
        }

    }

    static async approveRequest() {
        while (true) {
            // if (globalState.stopfaucet){
            //     break
            // }
            const target = await PageService.getTargetPageByIncludes('chrome-extension://ognaedodaplpjafdhdnofpiffhjgfdmh/popup.html#')
            if (target) {
                await target.keyboard.down('Control');
                await target.keyboard.press("Enter");
                await target.keyboard.up('Control');
            }
        }
    }

    static async randomViewPage() {
        const urls = [
            "https://faucet-testnet.portaldefi.com/",
            "chrome-extension://ognaedodaplpjafdhdnofpiffhjgfdmh/popup.html#/faucets"
        ];

        let currentIndex = 0; // Khởi tạo chỉ số ban đầu

        while (true) {
            await Util.sleep(10000);

            const urlToVisit = urls[currentIndex]; // Lấy URL theo thứ tự
            currentIndex = (currentIndex + 1) % urls.length; // Tăng chỉ số và quay về đầu nếu vượt mảng

            try {
                const page = await PageService.switchToPage(urlToVisit);
                if (page) {
                    console.log(`Switched to page: ${urlToVisit}`);
                } else {
                    console.log(`Page with URL including "${urlToVisit}" not found.`);
                }
            } catch (error) {
                console.error("Error while viewing page:", error.message);
            }
        }
    }

    static async randomViewPageIndex() {
        let currentIndex = 0; // Khởi tạo chỉ số ban đầu

        while (true) {
            await Util.sleep(1000);
            if (globalState.checkCountTimePartal) {
                break
            }
            try {
                const pages = await globalState.browser.pages();
                const totalTabs = pages.length;

                if (totalTabs === 0) {
                    //console.log("No tabs available.");
                    continue;
                }

                // Xử lý chỉ số: Tăng dần và quay về 0 nếu vượt quá tổng số tab
                currentIndex = (currentIndex + 1) % totalTabs;

                const page = await PageService.switchToPageByIndex(currentIndex);
                await page.keyboard.down('Control');
                await page.keyboard.press("Enter");
                await page.keyboard.up('Control');
                if (page) {
                    const url = await page.url();
                    //console.log(`Switched to tab ${currentIndex} with URL: ${url}`);
                } else {
                    //console.log(`No page found at index ${currentIndex}.`);
                }
            } catch (error) {
                console.error("Error while switching tabs:", error.message);
            }
        }
    }

    static async checkPageHome() {
        while (true) {
            if (globalState.checkCountTimePartal) {
                break
            }
            try {
                let page = await PageService.findPageByUrl('chrome-extension://ognaedodaplpjafdhdnofpiffhjgfdmh/popup.html#/home');
                if (page.check) {
                    page = await PageService.getTargetPage('chrome-extension://ognaedodaplpjafdhdnofpiffhjgfdmh/popup.html#/home');
                    await ElementService.HandlefindAndClickElement(page,
                        '//*[@id="tab-bar"]/div[2]/div/div[1]/div/div[2]', 2
                    );
                }
            } catch (error) {
                console.error("Error while viewing page:", error.message);
            }
            await Util.sleep(10000);
        }
    }

    static async checkCountTime() {
        while (true) {
            if (globalState.checkCountTimePartal) {
                break
            }
            //console.log('globalState.checkCountTimePartal', globalState.checkCountTimePartal)


            try {
                const count = await axiosService.checkTimeTransactionsportal(globalState.workerData.portal.ETH)
                if (count === 15) {
                    globalState.checkCountTimePartal = true
                    break
                } else {
                    globalState.checkCountTimePartal = false
                }
            } catch (error) {
                console.error('Error fetching gas prices:', error.message);
            }
            await Util.sleep(20000);
        }
    }

    static async checkGas() {
        const apiUrl = 'https://aurelia.portaltobitcoin.com/api/v2/stats';

        while (true) {
            if (globalState.checkCountTimePartal) {
                break
            }
            await Util.sleep(5000);

            try {
                const { data } = await axios.get(apiUrl);

                globalState.swap = data?.gas_prices?.average <= 50 || false;
                console.log(globalState.swap)
                console.log(data?.gas_prices?.average)
            } catch (error) {
                console.error('Error fetching gas prices:', error.message);
            }
        }
    }

}

module.exports = MangoWallet;