const { workerData, parentPort } = require('worker_threads');
const { BrowserService, ElementService, PageService } = require('../config/import.service');
const globalState = require('../config/globalState');
const Twitter = require('../modules/twitter/twitter');
const { axios, path } = require('../config/module.import');
const axiosService = require('../services/axios.service');
const Util = require('../util/util');


async function run() {
    await Util.waitToRun(workerData)
    globalState.workerData = workerData
    const { browser, context, page } = await BrowserService.launchBrowserWithProfile({
        devtool: false,
        mobile: false,
        headless: false,
        profile: workerData.profile,
        profileDirectory: 'Profile 1',
        proxy: workerData.proxy,
    });
    globalState.browser = browser
    browser.on('disconnected', () => {
        globalState.isPageClosed = true;
    });
    const waitUntil = {
        load: 'load',
        domcontentloaded: 'domcontentloaded',
        networkidle0: 'networkidle0',
        networkidle2: 'networkidle2'
    }
    try {
    // demo
       await PageService.openFirstPage('chrome://extensions/')
       const testnet = await PageService.openNewPage("https://testnet.pharosnetwork.xyz/experience")
       await PageService.reloadPage(testnet, 60000)
       const username = 'TillerB66814'
       const password = 'nxoawNWv72Ou'
       const auth2fa  = 'CPOMJJLGUTJJCPAI'
       await Twitter.Login(username, password, auth2fa)

       

        while (true) {
            if (globalState.isPageClosed) 
            {
                console.log("thành công thoát")
                parentPort.postMessage({ status: 'Success' });
                return
            }        
            await Util.sleep(3000)
        }
    } catch (error) {
        console.log(`${workerData.Profile} that bai`, error)
        parentPort.postMessage({ status: 'Failure' });
    } finally {
        if (globalState.closeWorker) {
            await browser.close()
        }
    }
}

run()