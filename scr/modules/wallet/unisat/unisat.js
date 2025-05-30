const globalState = require('../../../config/globalState');
const { ElementService, PageService } = require('../../../config/import.service');
const { Util } = require('../../../config/import.util');

require('dotenv').config();

class UnisatWallet {
    constructor() {}
    //chua
    static async Unblock(close = false) {
        const pagePartalWallet = await PageService.openNewPage('chrome-extension://ieldiilncjhfkalnemgjbffmpomcaigi/popup.html#/unlock')
        await ElementService.HandlefindAndTypeElement(
            pagePartalWallet,
            '//*[@id="main"]/div/div[2]/div/div[1]/div/div/div/div/div/div/div[5]/div/div[1]/input',
            process.env.PASS_PORTAL, 20
        )

        await ElementService.HandlefindAndClickElement(
            pagePartalWallet,
            '//*[@id="main"]/div/div[2]/div/div[1]/div/div/div/div/div/div/div[6]/div/button/div/div/div[1]',
            20
        )

        if (close) {
            await pagePartalWallet.close()
        }
    }


    static async CreateWallet(close = false) {
        const pagePartalWallet = await PageService.openFirstPage('chrome-extension://ppbibelpcjmhbdihakflkdcoccbgbkpo/index.html#/welcome')

        await ElementService.HandlefindAndClickElement(
            pagePartalWallet,
            '//*[@id="root"]/div[1]/div/div/div/div[2]/div[3]',
            20
        )

        await ElementService.HandlefindAndTypeElement(
            pagePartalWallet,
            '//*[@id="root"]/div[1]/div/div/div/div/div[3]/div/input',
            process.env.PASS_PORTAL, 20
        )

        await ElementService.HandlefindAndTypeElement(
            pagePartalWallet,
            '//*[@id="root"]/div[1]/div/div/div/div/div[4]/div/input',
            process.env.PASS_PORTAL, 20
        )

        await pagePartalWallet.keyboard.press("Enter");

        await ElementService.HandlefindAndClickElement(
            pagePartalWallet,
            '//*[@id="root"]/div[1]/div/div[2]/div[2]/div[2]',
            20
        )

        const mnemonics = globalState.workerData.mnemonic.split(' '); 

        const xpaths = [
            '//*[@id="root"]/div[1]/div/div[2]/div[2]/div[4]/div/div[1]/div/div[2]/input',
            '//*[@id="root"]/div[1]/div/div[2]/div[2]/div[4]/div/div[2]/div/div[2]/input',
            '//*[@id="root"]/div[1]/div/div[2]/div[2]/div[4]/div/div[3]/div/div[2]/input',
            '//*[@id="root"]/div[1]/div/div[2]/div[2]/div[4]/div/div[4]/div/div[2]/input',
            '//*[@id="root"]/div[1]/div/div[2]/div[2]/div[4]/div/div[5]/div/div[2]/input',
            '//*[@id="root"]/div[1]/div/div[2]/div[2]/div[4]/div/div[6]/div/div[2]/input',
            '//*[@id="root"]/div[1]/div/div[2]/div[2]/div[4]/div/div[7]/div/div[2]/input',
            '//*[@id="root"]/div[1]/div/div[2]/div[2]/div[4]/div/div[8]/div/div[2]/input',
            '//*[@id="root"]/div[1]/div/div[2]/div[2]/div[4]/div/div[9]/div/div[2]/input',
            '//*[@id="root"]/div[1]/div/div[2]/div[2]/div[4]/div/div[10]/div/div[2]/input',
            '//*[@id="root"]/div[1]/div/div[2]/div[2]/div[4]/div/div[11]/div/div[2]/input',
            '//*[@id="root"]/div[1]/div/div[2]/div[2]/div[4]/div/div[12]/div/div[2]/input',
        ];
        

        for (let i = 0; i < xpaths.length; i++) {
            const xpath = xpaths[i];
            const value = mnemonics[i] || '';
        
            await ElementService.HandlefindAndTypeElement(
                pagePartalWallet,
                xpath,
                value,
                20 
            );
        }
        
        await ElementService.HandlefindAndClickElement(
            pagePartalWallet,
            '//*[@id="root"]/div[1]/div/div[2]/div[2]/div[5]/div[2]/div',
            20
        )
        await ElementService.HandlefindAndClickElement(
            pagePartalWallet,
            '//*[@id="root"]/div[1]/div/div[2]/div[2]/div[10]/div[2]/div',
            20
        )
        
        await ElementService.HandlefindAndClickElement(
            pagePartalWallet,
            '//*[@id="root"]/div[1]/div/div[2]/div[3]/div/div/div[3]/div[2]/label/span[1]/input',
            20
        )
        await ElementService.HandlefindAndClickElement(
            pagePartalWallet,
            '//*[@id="root"]/div[1]/div/div[2]/div[3]/div/div/div[3]/div[4]/label/span[1]/input',
            20
        )
        await ElementService.HandlefindAndClickElement(
            pagePartalWallet,
            '//*[@id="root"]/div[1]/div/div[2]/div[3]/div/div/div[4]/div',
            20
        )
      
        
        if (close) {
            await pagePartalWallet.close()
        }
    }
    
}

module.exports = UnisatWallet;