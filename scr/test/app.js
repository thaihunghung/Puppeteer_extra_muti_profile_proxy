const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { Worker, isMainThread } = require('worker_threads');
const indicesGroups = require('../config/indicesGroups');
const globalState = require('../config/globalState');
require('dotenv').config();
const outputFilePath = 'E:\\puppeteer-auto-meta-proxy\\scr\\modules\\proxy\\fomat.txt';
const maxThreads = 10;
// const groups = [
//     indicesGroups.group1to5, indicesGroups.group6to10, indicesGroups.group11to15,
//     indicesGroups.group16to20, indicesGroups.group21to25, indicesGroups.group26to30,
//     indicesGroups.group31to35, indicesGroups.group36to39, indicesGroups.group41to45,
//     indicesGroups.group46to50, indicesGroups.group51to55, indicesGroups.group56to60,
//     indicesGroups.group61to65, indicesGroups.group66to70, indicesGroups.group71to75,
//     indicesGroups.group76to80, indicesGroups.group81to85, indicesGroups.group86to90,
//     indicesGroups.group91to95, indicesGroups.group96to100, indicesGroups.group101to105,
//     indicesGroups.group106to110, indicesGroups.group111to115, indicesGroups.group116to120,
//     indicesGroups.group121to125, indicesGroups.group126to130, indicesGroups.group131to135,
//     indicesGroups.group136to140, indicesGroups.group141to145, indicesGroups.group146to150,
//     indicesGroups.group151to155, indicesGroups.group156to160, indicesGroups.group161to165,
//     indicesGroups.group166to170, indicesGroups.group171to175, indicesGroups.group176to180,
//     indicesGroups.group181to185, indicesGroups.group186to190, indicesGroups.group191to195,
//     indicesGroups.group196to200, indicesGroups.group201to205, indicesGroups.group206to210,
//     indicesGroups.group211to215, indicesGroups.group216to220, indicesGroups.group221to225,
//     indicesGroups.group226to230, indicesGroups.group231to235, indicesGroups.group236to240,
//     indicesGroups.group241to245, indicesGroups.group246to250
// ];
const groups = [
    indicesGroups.group1to10, indicesGroups.group11to20, indicesGroups.group21to30,
    indicesGroups.group31to40, indicesGroups.group41to50, indicesGroups.group51to60,
    indicesGroups.group61to70, indicesGroups.group71to80, indicesGroups.group81to90,
    indicesGroups.group91to100, indicesGroups.group101to110, indicesGroups.group111to120,
    indicesGroups.group121to130, indicesGroups.group131to140, indicesGroups.group141to150,
    indicesGroups.group151to160, indicesGroups.group161to170, indicesGroups.group171to180,
    indicesGroups.group181to190, indicesGroups.group191to200, indicesGroups.group201to210,
    indicesGroups.group211to220, indicesGroups.group221to230, indicesGroups.group231to240,
    indicesGroups.group241to250, indicesGroups.group251to260, indicesGroups.group261to270,
    indicesGroups.group271to280, indicesGroups.group281to290, indicesGroups.group291to300,
    indicesGroups.group301to310, indicesGroups.group311to320, indicesGroups.group321to330,
    indicesGroups.group331to340, indicesGroups.group341to350, indicesGroups.group351to360,
    indicesGroups.group361to370, indicesGroups.group371to380, indicesGroups.group381to390,
    indicesGroups.group391to400, indicesGroups.group401to410, indicesGroups.group411to420,
    indicesGroups.group421to430, indicesGroups.group431to440, indicesGroups.group441to450,
    indicesGroups.group451to460, indicesGroups.group461to470, indicesGroups.group471to480,
    indicesGroups.group481to490, indicesGroups.group491to500
];
function readTxtToArray(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    // Loại bỏ ký tự \r và dòng trống
    return content.replace(/\r/g, '').split('\n').filter(line => line.trim() !== '');
}

async function startWorkers() {
    const proxies = await getProxiesInRange(outputFilePath, 0, 99);
    let currentGroupIndex = 0;
    const twitterAccounts = readTxtToArray(path.resolve(__dirname, '../test/twitter.txt'));
    console.log(twitterAccounts[0]);
    const results = []; // <-- Thêm dòng này để khai báo biến results
    async function processGroup(indicesToRun) {
        let activeWorkers = 0;
        let currentIndex = 0;
        const groupResults = [];

        async function processNextWorker() {
            if (currentIndex >= proxies.length) return;

            if (indicesToRun.length > 0 && !indicesToRun.includes(currentIndex)) {
                currentIndex++;
                return processNextWorker();
            }
            const twitter = twitterAccounts[currentIndex]
            const proxy = proxies[currentIndex]
            const workerData = { i: 0 + currentIndex, proxy, twitter };
            currentIndex++;
            activeWorkers++;

            try {
                const result = await createWorker(workerData);
                groupResults.push(result);
            } catch (error) {
                console.error(`Lỗi trong worker ${workerData.i}:`, error);
                groupResults.push({ status: 'Failure', error: error.message });
            } finally {
                activeWorkers--;
                processNextWorker();
            }
        }
        const initialWorkers = Math.min(maxThreads, proxies.length);
        const workerPromises = [];
        for (let i = 0; i < initialWorkers; i++) {
            workerPromises.push(processNextWorker());
        }
        const results = await Promise.allSettled(workerPromises);

        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                console.error(`Worker ${index} failed:`, result.reason);
            } else {
                console.log(`Worker ${index} succeeded:`, result.value);
            }
        });

        if (globalState.closeWorker) {
            const { exec } = require('child_process');
            exec('E:\\puppeteer-auto-meta-proxy\\scr\\util\\cleanup_temp_folders.bat', (error, stdout, stderr) => {
                if (error) {
                    console.error(`Lỗi khi chạy cleanup_temp_folders.bat: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.error(`Stderr khi chạy cleanup_temp_folders.bat: ${stderr}`);
                    return;
                }
                console.log(`Output từ cleanup_temp_folders.bat:\n${stdout}`);
            });
        }
        return groupResults;
    }
    while (currentGroupIndex < groups.length) {
        const indicesToRun = groups[currentGroupIndex];
        console.log(`Chạy nhóm: ${currentGroupIndex + 1}`);
        const groupResults = await processGroup(indicesToRun);

        const allSuccess = groupResults.every((result) => result.status === 'Success');
        results.push({ group: currentGroupIndex + 1, results: groupResults });

        if (!allSuccess) {
            console.error(`Nhóm ${currentGroupIndex + 1} không thành công hoàn toàn.`);
            break;
        }

        currentGroupIndex++;
    }
    console.log('Kết quả từ tất cả các nhóm:', results);
}

if (isMainThread) {
    startWorkers()
        .then(() => console.log('Hoàn thành tất cả công việc.'))
        .catch((error) => console.error('Lỗi trong luồng chính:', error));
}
function getProxiesInRange(filePath, startIndex, endIndex) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject('Lỗi khi đọc file: ' + err);
                return;
            }

            // Loại bỏ tất cả ký tự \r để tránh lỗi format
            const proxyList = data.replace(/\r/g, '').trim().split('\n');

            // Đảm bảo index không vượt quá độ dài mảng
            if (startIndex >= proxyList.length) {
                reject('Start index vượt quá số lượng proxy');
                return;
            }

            const selectedProxies = proxyList.slice(startIndex, endIndex + 1); // Lấy từ start đến end
            resolve(selectedProxies);
        });
    });
}
async function createWorker(workerData) {
    const worker = new Worker(path.resolve(__dirname, 'worker.js'), { workerData });

    return new Promise((resolve) => {
        worker.on('message', resolve);
        worker.on('error', (err) => {
            console.error("Worker error:", err);
            resolve({ status: 'Failure', reason: err.message });
        });
        worker.on('exit', (code) => {
            if (code !== 0) {
                console.error(`Worker exited with code ${code}`);
                resolve({ status: 'Failure', reason: `Exit code ${code}` });
            }
        });
    });
}