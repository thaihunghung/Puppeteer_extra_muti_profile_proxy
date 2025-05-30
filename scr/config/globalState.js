const path = require('path');
const { closeBrowser } = require("../services/browser.service");

const dataDir = path.resolve(__dirname, '..', 'data');

const globalState = {
    workerData: null,
    browser: null,
    stopfaucet: false,
    swap: false,
    checkCountTimePartal: false,
    timeout: 10000,
    Worker: [],
    showXpath: false,
    showPage: false,
    MetaOpen: true,
    MangoOpen: true,
    ProxyOpen: false,
    jsonPath: [
        path.join(dataDir, 'data.wallet.json'),
        path.join(dataDir, 'data.proxy.json'),
        path.join(dataDir, 'data.discord.json'),
        path.join(dataDir, 'data.twitter.json'),
        path.join(dataDir, 'data.google.json'),
        path.join(dataDir, 'data.pharos.json'),
    ],
    jsontwitterPath: path.join(dataDir, 'data.twitter.json'),
    jsondiscordPath: path.join(dataDir, 'data.discord.json'),
    jsonproxyPath: path.join(dataDir, 'data.proxy.json'),
    jsonwalletPath: path.join(dataDir, 'data.wallet.json'),
    jsonpharosPath: path.join(dataDir, 'data.pharos.json'),
    excelPath: '',
    closeWorker: true,
    isPageClosed: false,
    start: false
};

module.exports = globalState;
