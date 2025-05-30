const globalState = require('../../../config/globalState');
const { ElementService, PageService } = require('../../../config/import.service');
const { Util } = require('../../../config/import.util');
const { sleep } = require('../../../util/util');

require('dotenv').config();

class OkxWallet {
    constructor() {}
    //chua
    static async Unblock(close = false) {
        let target
        while (true) {
            target = await PageService.findPageByUrl('chrome-extension://eolinmfaipidhbkpjcbeebkkpdfnbmhc')
            if (target.check) {
                await PageService.closePageWhenUrlMatches('https://www.okx.com/web3/extension/welcome')
                const OKX = await PageService.getTargetPage(target.url)
                if (await ElementService.HandlefindAndElementText(OKX, "Unlock", 1)) {
                    await ElementService.HandlefindAndTypeElement(
                        OKX,
                        '//*[@id="app"]/div/div[1]/div/div[3]/form/div[1]/div/div/div/div/div/input',
                        'hunghung', 1
                    )
                    await ElementService.HandlefindAndClickElement(
                        OKX,
                        '//*[@id="app"]/div/div[2]/button',
                        1
                    )
                    close ? await OKX.close() : null
                    return
                }
            }
            if (globalState.isPageClosed) {
                console.log("thoat");
                return;
            }
            await Util.sleep(3000)  
        }
    }
    static async Connect(close = false) {
        let target
        while (true) {
            target = await PageService.findPageByUrl('chrome-extension://eolinmfaipidhbkpjcbeebkkpdfnbmhc')
            if (target.check) 
            {
                
                const OKX = await PageService.getTargetPage(target.url)
                if (await ElementService.HandlefindAndElementText(OKX, "Unlock", 2)) continue
                await ElementService.clickButton1(
                    OKX,
                    '//*[@id="app"]/div/div/div/div/div[5]/div[2]/button[2]',
                    1
                )
            }
            if (globalState.isPageClosed) {
                console.log("thoat");
                return;
            }
            await Util.sleep(3000)  
        }
        
        if (close) {
            await OKX.close()
        }
    }
    static async Confirm(close = false) {
        let target
        while (true) {
            target = await PageService.findPageByUrl('chrome-extension://eolinmfaipidhbkpjcbeebkkpdfnbmhc')
            if (target.check) break
            await Util.sleep(3000)
            
        }
        const OKX = await PageService.getTargetPage(target.url)
        await ElementService.HandlefindAndClickElement(
            OKX,
            '//*[@id="app"]/div/div/div/div/div[5]/div[2]/button[2]',
            1
        )
        
        if (close) {
            await OKX.close()
        }
    }
    static async Approve(close = false) {
        let target
        while (true) {
            target = await PageService.findPageByUrl('chrome-extension://eolinmfaipidhbkpjcbeebkkpdfnbmhc')
            if (target.check) break
            await Util.sleep(3000)
            
        }
        const OKX = await PageService.getTargetPage(target.url)
        await ElementService.HandlefindAndClickElement(
            OKX,
            '//*[@id="app"]/div/div/div/div/div/div[5]/div[2]/button[2]',
            1
        )
        
        if (close) {
            await OKX.close()
        }
    }
    static async ConnectOKX(maxAttempts = Infinity) {
        let attempts = 0;

        while (true) {
            if (globalState.isPageClosed) return
            if (attempts >= maxAttempts) {
                console.log(`Reached maximum attempts (${maxAttempts}). Exiting loop.`);
                return;
            }

            await Promise.all([
                this.Unblock(),
                this.Connect(),
                this.Approve(),
                this.Confirm()
            ]);

            attempts++;
            console.log(`Attempt ${attempts}${maxAttempts === Infinity ? '' : `/${maxAttempts}`}`);
            await Util.sleep(5000);
        }
    }
    
    static async CreateWallet(close = false) {
        let target
        while (true) {
            if (globalState.isPageClosed) return
            target = await PageService.findPageByUrl('chrome-extension://eolinmfaipidhbkpjcbeebkkpdfnbmhc')
            if (target.check) break
            await Util.sleep(100)
            
        }
        const OKX = await PageService.getTargetPage(target.url)
        async function Await (){
            while(true){
                if (globalState.isPageClosed) return
                const check = await ElementService.HandlefindAndClickElementText(OKX, 'Import wallet', 1)
                if(check)
                {
                    console.log("tim thấy")
                    break
                } 
                await Util.sleep(100)            
            }
        }
        await Await()
        
        await ElementService.HandlefindAndClickElement(
            OKX,
            '//button[@data-testid="okd-button"]',
        ) 
        await ElementService.HandlefindAndClickElement(
            OKX,
            '//*[@id="app"]/div/div/div/div[3]/div/div[1]',
        )
        const mnemonics = globalState.workerData.mnemonic.split(' '); 

        const xpaths = [
            '//*[@id="app"]/div/div[1]/div/div[2]/div/div[2]/div/div/form/div[1]/div[2]/div[1]/div[2]/input',
            '//*[@id="app"]/div/div[1]/div/div[2]/div/div[2]/div/div/form/div[1]/div[2]/div[2]/div[2]/input',
            '//*[@id="app"]/div/div[1]/div/div[2]/div/div[2]/div/div/form/div[1]/div[2]/div[3]/div[2]/input',
            '//*[@id="app"]/div/div[1]/div/div[2]/div/div[2]/div/div/form/div[1]/div[2]/div[4]/div[2]/input',
            '//*[@id="app"]/div/div[1]/div/div[2]/div/div[2]/div/div/form/div[1]/div[2]/div[5]/div[2]/input',
            '//*[@id="app"]/div/div[1]/div/div[2]/div/div[2]/div/div/form/div[1]/div[2]/div[6]/div[2]/input',
            '//*[@id="app"]/div/div[1]/div/div[2]/div/div[2]/div/div/form/div[1]/div[2]/div[7]/div[2]/input',
            '//*[@id="app"]/div/div[1]/div/div[2]/div/div[2]/div/div/form/div[1]/div[2]/div[8]/div[2]/input',
            '//*[@id="app"]/div/div[1]/div/div[2]/div/div[2]/div/div/form/div[1]/div[2]/div[9]/div[2]/input',
            '//*[@id="app"]/div/div[1]/div/div[2]/div/div[2]/div/div/form/div[1]/div[2]/div[10]/div[2]/input',
            '//*[@id="app"]/div/div[1]/div/div[2]/div/div[2]/div/div/form/div[1]/div[2]/div[11]/div[2]/input',
            '//*[@id="app"]/div/div[1]/div/div[2]/div/div[2]/div/div/form/div[1]/div[2]/div[12]/div[2]/input',
        ];
        

        for (let i = 0; i < xpaths.length; i++) {
            const xpath = xpaths[i];
            const value = mnemonics[i] || '';
        
            await ElementService.HandlefindAndTypeElement(
                OKX,
                xpath,
                value,
                20 
            );
        }
        await Util.sleep(5000)
        await ElementService.HandlefindAndClickElement(
            OKX,
            '//*[@id="app"]/div/div[2]/div/button',
            20
        )


        await ElementService.HandlefindAndClickElement(
            OKX,
            '//*[@id="app"]/div/div/div/div[2]/div[5]/div/button',
            20
        )

        await ElementService.HandlefindAndTypeElement(
            OKX,
            '//*[@id="app"]/div/div[1]/div/div[2]/form/div[1]/div[2]/div/div/div/div/input',
            'hunghung', 20
        )

        await ElementService.HandlefindAndTypeElement(
            OKX,
            '//*[@id="app"]/div/div[1]/div/div[2]/form/div[3]/div[2]/div/div/div/div/input',
            'hunghung', 20
        )

        await ElementService.HandlefindAndClickElement(
            OKX,
            '//*[@id="app"]/div/div[2]/div/button',
            20
        )
        await ElementService.HandlefindAndClickElement(
            OKX,
            '//*[@id="app"]/div/div/div/div[4]/div/button',
            20
        )

        while (true) {
            if (globalState.isPageClosed) return
            const check =  await ElementService.HandlefindAndElementText(OKX, "NFT", 1)
            if (check){
                break
            }
            await new Promise(resolve => setTimeout(resolve, 100)); 
        }
        
        await OKX.close()
    }
    
    static async download() {
       // https://chromewebstore.google.com/search/OKX%20Wallet

        const okx  = await PageService.openFirstPage('https://chromewebstore.google.com/detail/okx-wallet/eolinmfaipidhbkpjcbeebkkpdfnbmhc')
        
        // await ElementService.HandlefindAndClickElement(
        //     okx,
        //     '//*[@id="yDmH0d"]/c-wiz[1]/div/div/div/main/section/div[1]/div[1]/a',
        //     20
        // )
       await Util.sleep(10000)
        await ElementService.HandleWaitForSelectorClickElement(
            okx,
            '#yDmH0d > c-wiz > div > div > main > div > section.VWBXhd > section > div.OdjmDb > div > button',
            20
        )

    
        

    }
}

module.exports = OkxWallet;