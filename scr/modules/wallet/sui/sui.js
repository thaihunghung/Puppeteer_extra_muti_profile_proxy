const globalState = require('../../../config/globalState');
const { ElementService, PageService } = require('../../../config/import.service');
const { Util } = require('../../../config/import.util');
const { sleep } = require('../../../util/util');
const clipboardy = require('clipboardy');
const fs = require('fs');

// Tên file để lưu lịch sử clipboard
const fileName = './SuiPrintr/12.txt';
const fileNamekey = './SuiPrintr/key.txt';
require('dotenv').config();

class SuiWallet {

    static async Inport(close = false) {
        let target
        while (true) {
            target = await PageService.findPageByUrl('chrome-extension://fplapjhmamlfnblgccljmdinfhjlhhia/index.html#/Welcome')
            if (target.check) break
            await Util.sleep(3000)

        }
        const SUI = await PageService.getTargetPage(target.url)
        await ElementService.HandlefindAndClickElement(
            SUI,
            '//*[@id="root"]/div/div/div/div/div/div/div[2]/div/div/div/div/div/div[3]/div/div/div/div[2]/div[3]/button[2]',
            1
        )
        await Util.sleep(5000)
        await ElementService.HandlefindAndClickElement(
            SUI,
            '//*[@id="root"]/div/div/div/div/div/div/div[3]/div/div[2]/div/div/div/div/div[2]/div[1]',
            1
        )
        await Util.sleep(5000)
        const mnemonics = globalState.workerData.mnemonic.split(' ');

        const index = '//*[@id="root"]/div/div/div/div/div/div/div[2]/div/div[2]/div[2]/div/div/div[2]/div/div/div/div/div[1]/div[2]/div[index]/div/div/div/input';

        const length = 12; // Số lượng phần tử trong mảng
        const xpaths = [];

        for (let i = 1; i <= length; i++) {
            xpaths.push(index.replace('[index]', `[${i}]`));
        }


        for (let i = 0; i < xpaths.length; i++) {
            const xpath = xpaths[i];
            const value = mnemonics[i] || '';

            await ElementService.HandlefindAndTypeElement(
                SUI,
                xpath,
                value,
                20
            );
        }
        await ElementService.HandlefindAndClickElement(
            SUI,
            '//*[@id="root"]/div/div/div/div/div/div/div[2]/div/div[2]/div[2]/div/div/div[2]/div/div/div/div/div[2]/button',
            1
        )

        await ElementService.HandlefindAndTypeElement(
            SUI,
            '//*[@id="root"]/div/div/div/div/div/div/div[2]/div/div[3]/div[2]/div/div/div[2]/div/div/div/div/div[1]/div[2]/div[1]/div/div/div/input',
            'Hunghung123',
            20
        );
        await ElementService.HandlefindAndTypeElement(
            SUI,
            '//*[@id="root"]/div/div/div/div/div/div/div[2]/div/div[3]/div[2]/div/div/div[2]/div/div/div/div/div[1]/div[2]/div[2]/div/div/div/input',
            'Hunghung123',
            20
        );
        await ElementService.HandlefindAndClickElement(
            SUI,
            '//*[@id="root"]/div/div/div/div/div/div/div[2]/div/div[3]/div[2]/div/div/div[2]/div/div/div/div/div[2]/button',
            1
        )
        await ElementService.HandlefindAndClickElement(
            SUI,
            '//*[@id="root"]/div/div/div/div/div/div/div[2]/div/div[4]/div[2]/div/div/div[2]/div/div/div[2]/div[2]/button/div[2]/input',
            1
        )

        await ElementService.HandlefindAndClickElement(
            SUI,
            '//*[@id="root"]/div/div/div/div/div/div/div[2]/div/div[4]/div[2]/div/div/div[2]/div/div/div[3]/button',
            1
        )
        await Util.sleep(5000)
        await ElementService.HandlefindAndClickElement(
            SUI,
            '//*[@id="root"]/div/div/div/div/div/div/div[2]/div/div/div/div/div/div[1]/div/div/div/div/div/div[2]/div/div/div/div/div/div[2]/div/div[1]',
            1
        )


        if (close) {
            await SUI.close()
        }
    }
    static async Create(close = false) {
        async function safeReadClipboard() {
            try {
                const content = await clipboardy.read();
                if (!content.trim()) {
                    console.warn('Clipboard is empty.');
                    return null;
                }
                return content;
            } catch (err) {
                console.error('Failed to read from clipboard:', err.message);
                return null;
            }
        }

        async function retryReadClipboard(retries = 3, delay = 1000) {
            for (let attempt = 0; attempt < retries; attempt++) {
                const content = await safeReadClipboard();
                if (content) return content;

                console.log(`Retrying clipboard read (${attempt + 1}/${retries})...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
            throw new Error('Unable to read clipboard after retries.');
        }


        const Save = async (fileName) => {
            const currentContent = await retryReadClipboard();
            if (!currentContent) {
                console.error('No content to save.');
                return;
            }

            fs.open(fileName, 'a', (err, fd) => {
                if (err) {
                    console.error('Error opening file:', err);
                    return;
                }

                fs.readFile(fileName, 'utf8', (err, data) => {
                    if (err) {
                        console.error('Error reading file:', err);
                        return;
                    }

                    if (!data.includes(currentContent)) {
                        fs.appendFile(fileName, currentContent + '\n', 'utf8', (err) => {
                            if (err) {
                                console.error('Error appending content:', err);
                            } else {
                                console.log('Clipboard content saved:', currentContent);
                            }
                        });
                    } else {
                        console.log('Content already exists in file.');
                    }
                });
            });
        };

        let target
        while (true) {
            target = await PageService.findPageByUrl('chrome-extension://fplapjhmamlfnblgccljmdinfhjlhhia/index.html#/Welcome')
            if (target.check) break
            await Util.sleep(3000)

        }
        const SUI = await PageService.getTargetPage(target.url)
        await ElementService.HandlefindAndClickElement(
            SUI,
            '//*[@id="root"]/div/div/div/div/div/div/div[2]/div/div/div/div/div/div[3]/div/div/div/div[2]/div[3]/button[1]',
            1
        )
        await Util.sleep(3000)
        await ElementService.HandlefindAndClickElement(
            SUI,
            '//*[@id="root"]/div/div/div/div/div/div/div[2]/div/div[2]/div[2]/div/div/div[2]/div/div/div[1]/div[2]/div[1]/div[2]/div/div/div[2]/button[2]',
            2
        )
        await Util.sleep(3000)


        const value1 = await SUI.$eval(
            'div.css-146c3p1.break-keep.text-body.text-content-tertiary.font-sans-medium',
            (element) => element.textContent
        );

        const value = `${globalState.workerData.i}:__ ${value1} __`
        await Util.sleep(3000)
        const fileName = '12sui.txt';

        // Ghi chuỗi vào tệp
        fs.open(fileName, 'a', (err, fd) => {
            if (err) {
                console.error('Lỗi khi mở file:', err);
                return;
            }

            // Đọc nội dung trong file
            fs.readFile(fileName, 'utf8', (err, data) => {
                if (err) {
                    console.error('Lỗi khi đọc file:', err);
                    return;
                }

                // Kiểm tra xem currentContent đã có trong file hay chưa
                if (!data.includes(value)) {
                    // Nếu không có trong file, ghi thêm vào file mà không ghi đè
                    fs.appendFile(fileName, value + '\n', 'utf8', (err) => {
                        if (err) {
                            console.error('Lỗi khi ghi nội dung vào file:', err);
                        } else {
                            console.log('Đã thêm vào lịch sử clipboard:', value);
                        }
                    });
                } else {
                    console.log('Nội dung đã có trong lịch sử clipboard:', value);
                }
            });
        });

        await ElementService.HandlefindAndClickElement(
            SUI,
            '//*[@id="root"]/div/div/div/div/div/div/div[2]/div/div[2]/div[2]/div/div/div[2]/div/div/div[2]/button',
            1
        )
        await Util.sleep(3000)
        await ElementService.HandlefindAndTypeElement(
            SUI,
            '//*[@id="root"]/div/div/div/div/div/div/div[2]/div/div[3]/div[2]/div/div/div[2]/div/div/div/div/div[1]/div[2]/div[1]/div/div/div/input',
            'Hunghung123',
            2
        );
        await ElementService.HandlefindAndTypeElement(
            SUI,
            '//*[@id="root"]/div/div/div/div/div/div/div[2]/div/div[3]/div[2]/div/div/div[2]/div/div/div/div/div[1]/div[2]/div[2]/div/div/div/input',
            'Hunghung123',
            2
        );
        await ElementService.HandlefindAndClickElement(
            SUI,
            '//*[@id="root"]/div/div/div/div/div/div/div[2]/div/div[3]/div[2]/div/div/div[2]/div/div/div/div/div[2]/button',
            1
        )
        await Util.sleep(3000)
        await ElementService.HandlefindAndClickElement(
            SUI,
            '//*[@id="root"]/div/div/div/div/div/div/div[2]/div/div[4]/div[2]/div/div/div[2]/div/div/div[2]/div[2]/button/div[2]/input',
            1
        )
        await ElementService.HandlefindAndClickElement(
            SUI,
            '//*[@id="root"]/div/div/div/div/div/div/div[2]/div/div[4]/div[2]/div/div/div[2]/div/div/div[2]/div[3]/button/div[2]/input',
            1
        )

        await ElementService.HandlefindAndClickElement(
            SUI,
            '//*[@id="root"]/div/div/div/div/div/div/div[2]/div/div[4]/div[2]/div/div/div[2]/div/div/div[3]/button',
            1
        )
        
        await Util.sleep(5000)
        if (close) {
            await SUI.close()
        }
    }
}

module.exports = SuiWallet;