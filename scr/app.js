const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { Worker, isMainThread } = require('worker_threads');
const indicesGroups = require('./config/indicesGroups');
const JsonDataService = require('./services/json.service');
const AxiosCustomInstance = require('./util/AxiosCustomInstance');
const globalState = require('./config/globalState');
const { Util } = require('./config/import.util');
require('dotenv').config();

async function createWorker(workerData) {
    const worker = new Worker(path.resolve(__dirname, 'worker', 'worker.js'), {
        workerData,
    });

    return new Promise((resolve, reject) => {
        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`Worker stopped with exit code ${code}`));
            }
        });
    });
}

async function startWorkers() {
    const jsonDataService = new JsonDataService();
    const data_wallet = jsonDataService.getJson();
    //console.log('data_wallet', data_wallet);
    if (data_wallet.length === 0) {
        console.error('Không có địa chỉ nào trong file Json.');
        return;
    }

    indicesGroups.otherGroup = []
    const maxThreads = parseInt(process.env.MAX_THREADS, 10) || 5;
    const results = [];
    indicesGroups.otherGroup = [83]
    const groups = [
        // indicesGroups.otherGroup,
        indicesGroups.group1to5,
        // indicesGroups.group6to10,
        // indicesGroups.group11to15,
        // indicesGroups.group16to20,
        // indicesGroups.group21to25,
        // indicesGroups.group26to30,
        // indicesGroups.group31to35,
        // indicesGroups.group36to40,
        // indicesGroups.group41to45,
        // indicesGroups.group46to50,
        // indicesGroups.group51to55,
        // indicesGroups.group56to60,
        // indicesGroups.group61to65,
        // indicesGroups.group66to70,
        // indicesGroups.group71to75,
        // indicesGroups.group76to80,
        // indicesGroups.group81to85,
        // indicesGroups.group86to90,
        // indicesGroups.group91to95,
        // indicesGroups.group96to100,
    ]

    let currentGroupIndex = 0;
    async function processGroup(indicesToRun) {
        let activeWorkers = 0;
        let currentIndex = 0;
        const groupResults = [];

        async function processNextWorker() {
            if (currentIndex >= data_wallet.length) return;

            if (indicesToRun.length > 0 && !indicesToRun.includes(currentIndex)) {
                currentIndex++;
                return processNextWorker();
            }

            const { profile, proxy, EVM, twitter, discord, pharos } = data_wallet[currentIndex];

            const workerData = { i: currentIndex, indicesToRun, profile, proxy, EVM, twitter, discord, pharos };
            console.log('indicesToRun', indicesToRun);
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

        const initialWorkers = Math.min(maxThreads, data_wallet.length);
        const workerPromises = [];
        for (let i = 0; i < initialWorkers; i++) {
            workerPromises.push(processNextWorker());
        }

        await Promise.allSettled(workerPromises);
        if (globalState.closeWorker) {
            const closeChromePath = path.resolve(__dirname, 'util', 'close_chrome.bat');
          //  const cleanupTempPath = path.resolve(__dirname, 'util', 'cleanup_temp_folders.bat');
            exec(closeChromePath, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Lỗi khi chạy close_chrome.bat: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.error(`Stderr khi chạy close_chrome.bat: ${stderr}`);
                    return;
                }
                console.log(`Output từ close_chrome.bat:\n${stdout}`);

                // exec(cleanupTempPath, (error, stdout, stderr) => {
                //     if (error) {
                //         console.error(`Lỗi khi chạy cleanup_temp_folders.bat: ${error.message}`);
                //         return;
                //     }
                //     if (stderr) {
                //         console.error(`Stderr khi chạy cleanup_temp_folders.bat: ${stderr}`);
                //         return;
                //     }
                //     console.log(`Output từ cleanup_temp_folders.bat:\n${stdout}`);
                // });
            });
        }
        return groupResults;
    }

    while (currentGroupIndex < groups.length) {
        const indicesToRun = groups[currentGroupIndex];
        console.log(`Chạy nhóm: ${currentGroupIndex + 1}`);
        const groupResults = await processGroup(indicesToRun);

        // Kiểm tra kết quả của nhóm hiện tại
        const allSuccess = groupResults.every((result) => result.status === 'Success');
        results.push({ group: currentGroupIndex + 1, results: groupResults });

        if (!allSuccess) {
            console.error(`Nhóm ${currentGroupIndex + 1} không thành công hoàn toàn.`);
            break;
        }

        currentGroupIndex++; // Chuyển sang nhóm tiếp theo
    }

    console.log('Kết quả từ tất cả các nhóm:', results);
}

if (isMainThread) {
    startWorkers()
        .then(() => console.log('Hoàn thành tất cả công việc.'))
        .catch((error) => console.error('Lỗi trong luồng chính:', error));
}