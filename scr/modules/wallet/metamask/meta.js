const clipboardy = require('clipboardy');
const globalState = require('../../../config/globalState');
const { ElementService, PageService } = require('../../../config/import.service');
const { Util } = require('../../../config/import.util');
const { sleep } = require('../../../util/util');
const { fs } = require('../../../config/module.import');

require('dotenv').config();

class MetaWallet {
    constructor() { }
    static async Unblock(close = false) {
        const pageTarget = await PageService.findPageByUrl('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn')
        if (pageTarget.check) {
            const page = await PageService.getTargetPage(`${pageTarget.url}`)
            if (await ElementService.HandleWaitForSelectorTypeElement(
                page,
                '#password',
                'hunghung',
                1
            )) {
                await page.keyboard.press("Enter");
            }
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
    static async CreateMetaWallet(close = false) {
        function filterLinesByKeywords(filePath, keywords) {
            return new Promise((resolve, reject) => {
              // Đọc file
              fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                  reject(`Lỗi khi đọc file: ${err}`);
                  return;
                }
          
                // Tách từng dòng
                const lines = data.split('\n');
          
                // Lọc các dòng chứa đủ tất cả từ khóa (khớp chính xác)
                const filteredLines = lines.filter(line =>
                  keywords.every(keyword => new RegExp(`\\b${keyword}\\b`).test(line))
                );
          
                // Trả về kết quả qua Promise
                resolve(filteredLines);
              });
            });
          }
        async function Await() {
            while (true) {
                const page = await PageService.findPageByUrl('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/home.html#onboarding/welcome')
                if (page.check) {
                    console.log("tim thấy")
                    break
                }
                await Util.sleep(1000)
            }
        }
        await Await()
        const pagePartalWallet = await PageService.getTargetPage('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/home.html#onboarding/welcome')
        async function handleWorkerSleep() { 
            await Util.sleep(10000)
            console.log(globalState.Worker) 
        }
        await handleWorkerSleep()
        // while (true){
        //     if (workerData.noti.i  === 0){
        //         globalState.stop = true
        //         console.log( workerData.noti.i  + globalState.stop)
        //     }
            
        // } 
        // console.log( workerData.noti.i  + globalState.stop)
     
        await ElementService.HandlefindAndClickElement(
            pagePartalWallet,
            '//*[@id="onboarding__terms-checkbox"]',
            20
        )
        await ElementService.HandlefindAndClickElement(
            pagePartalWallet,
            '//*[@id="app-content"]/div/div[2]/div/div/div/ul/li[2]/button',
            20
        )

        await ElementService.HandlefindAndClickElement(
            pagePartalWallet,
            '//*[@id="metametrics-opt-in"]',
            20
        )
        await ElementService.HandlefindAndClickElement(
            pagePartalWallet,
            '//*[@id="app-content"]/div/div[2]/div/div/div/div[2]/button[2]',
            20
        )

        await ElementService.HandleWaitForSelectorTypeElement(
            pagePartalWallet,
            '#app-content > div > div.mm-box.main-container-wrapper > div > div > div > div.mm-box.mm-box--margin-top-3.mm-box--justify-content-center > form > div:nth-child(1) > label > input',
            'Hunghung123', 20
        )

        await ElementService.HandleWaitForSelectorTypeElement(
            pagePartalWallet,
            '#app-content > div > div.mm-box.main-container-wrapper > div > div > div > div.mm-box.mm-box--margin-top-3.mm-box--justify-content-center > form > div:nth-child(2) > label > input',
            'Hunghung123', 20
        )

        await ElementService.HandlefindAndClickElement(
            pagePartalWallet,
            '//*[@id="app-content"]/div/div[2]/div/div/div/div[2]/form/div[3]/label/span[1]/input',
            20
        )

        await ElementService.HandlefindAndClickElement(
            pagePartalWallet,
            '//*[@id="app-content"]/div/div[2]/div/div/div/div[2]/form/button',
            20
        )
        await handleWorkerSleep()
        await ElementService.HandlefindAndClickElement(
            pagePartalWallet,
            '//*[@id="app-content"]/div/div[2]/div/div/div/div[2]/button[2]',
            20
        )

        await ElementService.HandlefindAndClickElement(
            pagePartalWallet,
            '//*[@id="app-content"]/div/div[2]/div/div/div/div[6]/button',
            20
        )

        await ElementService.HandlefindAndClickElement(
            pagePartalWallet,
            '//*[@id="app-content"]/div/div[2]/div/div/div/div[6]/div/div/a[2]',
            20
        )


        await ElementService.HandlefindAndClickElement(
            pagePartalWallet,
            '//*[@id="app-content"]/div/div[2]/div/div/div/div[6]/div/button',
            20
        )
        // const keywords = ['west', 'trouble'];
        // const result = await filterLinesByKeywords('clipboard-history.txt', keywords);
        // console.log(result);

        await Util.sleep(5000)
        const ssssssss = await pagePartalWallet.$$('div[data-testid^="recovery-phrase-chip-"].recovery-phrase__chip');

        console.log('Số lượng phần tử:', ssssssss.length); // In ra số lượng phần tử
        
        const values = [];
        for (let i = 0; i < ssssssss.length; i++) {
            const value = await ssssssss[i].evaluate(el => el.textContent.trim()); // Lấy giá trị văn bản từ mỗi div
            if (value) {
                values.push(value); // Thêm giá trị vào mảng nếu không trống
            }
        }
        
        // In ra danh sách giá trị
        
        
        const find = await filterLinesByKeywords('E:\\puppeteer-auto-meta-proxy\\scr\\test\\clipboard-history.txt', values);
        const mnemonics = find[0].split(' ');
        //console.log('Danh sách giá trị:', find);
        // const clipboardContent = clipboardy.readSync();
        // 
        // const json = {
        //     mnemonics: clipboardContent,
        //     key: null
        // };
        // function appendToJsonFile(filePath, newData) {
        //     // Read the existing data from the file
        //     fs.readFile(filePath, 'utf8', (err, data) => {
        //         if (err) {
        //             console.error('Error reading the file:', err);
        //             return;
        //         }

        //         let fileContent = [];

        //         // If the file is not empty, parse it into a JavaScript object
        //         if (data.trim() !== '') {
        //             try {
        //                 fileContent = JSON.parse(data);
        //             } catch (parseError) {
        //                 console.error('Error parsing JSON:', parseError);
        //                 return;
        //             }
        //         }

        //         // Add the new JSON object to the array
        //         fileContent.push(newData);

        //         // Write the updated content back to the file
        //         fs.writeFile(filePath, JSON.stringify(fileContent, null, 2), (err) => {
        //             if (err) {
        //                 console.error('Error writing to the file:', err);
        //             } else {
        //                 console.log('New data successfully appended to the JSON file.');
        //             }
        //         });
        //     });
        // }
        // const path = 'E:/puppeteer-auto-meta-proxy/scr/NoProfile/data.json';
        // appendToJsonFile(path, json);

        console.log('Nội dung trong clipboard:', mnemonics);

        const elements = await pagePartalWallet.$$('[data-testid^="recovery-phrase-input-"].chip__input');
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const testId = await element.evaluate(el => el.getAttribute('data-testid'));
            console.log('Giá trị:', testId);
            const index = parseInt(testId.replace('recovery-phrase-input-', ''), 10);
            console.log('Giá trị index:', index);
            if (index < mnemonics.length) {
                const mnemonic = mnemonics[index];
                await element.type(mnemonic); // Type the mnemonic word into the input
                console.log(`Đã điền: ${mnemonic}`);
            } else {
                console.log('Không tìm thấy mnemonic cho chỉ số này:', index);
            }

        }
        await Util.sleep(5000)
        await ElementService.HandleWaitForSelectorClickElement(
            pagePartalWallet,
            '#app-content > div > div.mm-box.main-container-wrapper > div > div > div > div.recovery-phrase__footer__confirm > button',
            20
        )
        await ElementService.HandlefindAndClickElement(
            pagePartalWallet,
            '//*[@id="app-content"]/div/div[2]/div/div/div/div[3]/button',
            20
        )
        await ElementService.HandlefindAndClickElement(
            pagePartalWallet,
            '//*[@id="app-content"]/div/div[2]/div/div/div/div[2]/button',
            20
        )
        await ElementService.HandlefindAndClickElement(
           pagePartalWallet,
           '//*[@id="app-content"]/div/div[2]/div/div/div/div[2]/button',
           20
        )


        await Util.sleep(5000)
   /// await pagePartalWallet.goto('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/home.html#settings')

        
    async function Await1() {
        while (true) {
            const element = await ElementService.HandlefindAndElementText(pagePartalWallet, "Connecting to Ethereum Mainnet")
            if (!element) {
                break
            }
            await Util.sleep(1000)
        }
    }
    await Await1()
    await Util.sleep(5000)
    await ElementService.HandleWaitForSelectorClickElement(pagePartalWallet, `#app-content > div > div.mm-box.multichain-app-header.mm-box--margin-bottom-0.mm-box--display-flex.mm-box--align-items-center.mm-box--width-full.mm-box--background-color-background-alternative > div > div.mm-box.mm-box--display-flex.mm-box--justify-content-flex-end.mm-box--align-items-center > div > div > button`) 

        await ElementService.HandlefindAndClickElement(
            pagePartalWallet,
            '//*[@id="app-content"]/div/div[2]/div/div[3]/div[1]/div/button',
            20
         )
         await ElementService.HandlefindAndClickElement(
            pagePartalWallet,
            '//*[@id="app-content"]/div/div[2]/div/div[3]/div[2]/button[2]',
            20
         )

         await ElementService.HandlefindAndClickElement(
            pagePartalWallet,
            '/html/body/div[3]/div[3]/div/section/div/div/button',
            20
         )

         
         await Util.sleep(5000)
         await ElementService.HandlefindAndTypeElement(pagePartalWallet, `//input[@id="account-details-authenticate"]`, 'Hunghung123') 
         await pagePartalWallet.keyboard.press("Enter")
         await Util.sleep(10000)


         const buttonXPath = '/html/body/div[3]/div[3]/div/section/div/button';

        const button = await ElementService.ElementXpath(pagePartalWallet, buttonXPath)
        if (button.found) {
            
            const boundingBox = await button.element.boundingBox();

            if (boundingBox) {
                await pagePartalWallet.mouse.move(boundingBox.x + boundingBox.width / 2, boundingBox.y + boundingBox.height / 2);
                await pagePartalWallet.mouse.down();
                await Util.sleep(15000)
                await pagePartalWallet.mouse.up();
            } else {
                console.error('Không tìm thấy bounding box của nút.');
            }
        } else {
            console.error('Không tìm thấy nút tại XPath đã chỉ định.');
        }
        await ElementService.HandlefindAndClickElement(
            pagePartalWallet,
            '/html/body/div[3]/div[3]/div/section/div/div[2]/button',
            20
        )


        if (close) {
            await pagePartalWallet.close()
        }
    }
    static async Conect(close = false) {
        const pageTarget = await PageService.findPageByUrl('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn')
        if (pageTarget.check) {
            const page = await PageService.getTargetPage(`${pageTarget.url}`)
            await ElementService.HandlefindAndClickElement(page,
                '//*[@id="app-content"]/div/div/div/div[2]/div/div[3]/div/div[2]/button[2]',
                1
            );
        }
    }

    static async Confirm(close = false) {
        const pageTarget = await PageService.findPageByUrl('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn')
        if (pageTarget.check) {
            const page = await PageService.getTargetPage(`${pageTarget.url}`)
            await ElementService.HandlefindAndClickElement(
                page,
                '//*[@id="app-content"]/div/div/div/div/div[3]/button[2]',
                1
            )
        }
    }
    static async Confirm1(close = false) {
        const pageTarget = await PageService.findPageByUrl('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn')
        if (pageTarget.check) {
            const page = await PageService.getTargetPage(`${pageTarget.url}`)
            await ElementService.HandlefindAndClickElement(
                page,
                '//*[@id="app-content"]/div/div/div/div[3]/div[2]/footer/button[2]',
                1
            )
        }
    }
}

module.exports = MetaWallet;