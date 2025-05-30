const globalState = require("../config/globalState");
const { fs, proxyChain,
    puppeteer
} = require("../config/module.import");
require('dotenv').config(); 
const path = require('path');

class BrowserService {
    static browser = null;
    constructor() { }

    static context = null;

    static async launchBrowserWithProfile({
        devtool = false,
        mobile = false,
        headless = true,
        profile = 'default',
        profileDirectory = 'Profile 1',
        proxy = null, // Proxy dạng { url: 'http://username:password@host:port' } hoặc string
    } = {}) {

        const userDataDir = path.resolve(__dirname, '..', '..', 'profile', profile);
        if (!fs.existsSync(userDataDir)) {
            fs.mkdirSync(userDataDir, { recursive: true });
        }

        const extensions = [
            path.resolve(__dirname, '..', '..', 'extensions', 'MetaMask', 'nkbihfbeogaeaoehlefnkodbefgpgknn'),
            path.resolve(__dirname, '..', '..', 'extensions', 'token_discord'),
        ];
        const extensionsPaths = extensions.join(',');
        console.log('Extensions paths:', extensionsPaths);
        let proxyArg = '';
        if (proxy) {
            const proxyUrl = typeof proxy === 'string' ? proxy : proxy.url;
            try {
                const anonymizedProxy = await proxyChain.anonymizeProxy(proxyUrl);
                proxyArg = `--proxy-server=${anonymizedProxy}`;
                console.log('Using proxy:', anonymizedProxy);
            } catch (error) {
                console.error('Error anonymizing proxy:', error);
                throw error;
            }
        }

        try {
            BrowserService.browser = await puppeteer.launch({
             //   devtools: devtool,
                headless: headless ? true : false, 
                executablePath: process.env.CHROME_PATH || path.resolve('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'),
                userDataDir, 
                ignoreDefaultArgs: ['--disable-extensions', '--enable-automation'],
                args: [
                    `--profile-directory=${profileDirectory}`,
                    proxyArg,
                    '--disable-dev-shm-usage',
                    '--disable-gpu',
                    '--disable-software-rasterizer',
                    '--disable-background-networking',
                    '--disable-default-apps',
                    '--disable-sync',
                    '--disable-translate',
                    //`--disable-extensions-except=${extensionsPaths}`,
                    //`--load-extension=${extensionsPaths}`,
                ].filter(arg => arg),
                defaultViewport: mobile
                    ? { width: 500, height: 800 }
                    : null,
            });
            BrowserService.context = BrowserService.browser;

            const page = await BrowserService.context.newPage();

            if (proxy && proxy.username && proxy.password) {
                await page.authenticate({
                    username: proxy.username,
                    password: proxy.password,
                });
            }

            await page.setRequestInterception(true);
            page.on('request', (req) => {
                if (['image', 'stylesheet', 'font'].includes(req.resourceType())) {
                    req.abort();
                } else {
                    req.continue();
                }
            });

            const client = await page.target().createCDPSession();
            await client.send('Network.clearBrowserCache');
            console.log('Cache đã được xóa');
            await page.close();
            console.log('Browser launched successfully in normal mode');
            return { browser: BrowserService.browser, context: BrowserService.context };
        } catch (error) {
            console.error('Error launching呈 duyệt:', error);
            throw error;
        }
    }

    static async launchBrowser(devtool = false, headless = false) {
        try {
            BrowserService.browser = await puppeteer.launch({
                devtools: devtool,
                headless: headless,
                executablePath: process.env.CHROME_PATH || path.resolve('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'),
                ignoreDefaultArgs: ["--disable-extensions", "--enable-automation"],
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    `--load-extension=${path.resolve(__dirname, '..', '..', 'extensions', 'MetaMask', 'nkbihfbeogaeaoehlefnkodbefgpgknn')}`,
                    '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.91 Safari/537.36',
                ].filter(arg => arg),
                defaultViewport: null,
            });
            BrowserService.browser.on('targetcreated', async (target) => {
                const page = await target.page();
                if (page) {
                    // Sử dụng devtoolsProtocol để xóa cache
                    const client = await page.target().createCDPSession();
                    await client.send('Network.clearBrowserCache');
                    console.log('Cache đã được xóa');
                }
            });
            BrowserService.browser.on('disconnected', () => {
                globalState.isPageClosed = true;
            });

            console.log("Browser launched successfully");
            return BrowserService.browser;
        } catch (error) {
            console.error("Error launching browser:", error);
            throw error;
        }
    }

    static async closeBrowser() {
        if (BrowserService.browser) {
            await BrowserService.browser.close();
            BrowserService.browser = null;
            console.log("Browser closed");
        }
    }
}

module.exports = BrowserService
