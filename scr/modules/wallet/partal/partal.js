const { Page } = require('puppeteer');
const globalState = require('../../../config/globalState');
const { PageService, ElementService, KeyboardService, axiosService } = require('../../../config/import.service');
const { Util } = require('../../../config/import.util');
const { axios } = require('../../../config/module.import');
//https://aurelia.portaltobitcoin.com/address/
require('dotenv').config();
class PartalWallet {
    constructor() { }
    static async Create(close = false) {
        const page = await PageService.openFirstPage('chrome-extension://ieldiilncjhfkalnemgjbffmpomcaigi/popup.html#/welcome')
        const waitForValidElement = async (page) => {
            while (true) {
                const importWalletCheck = await ElementService.HandlefindAndElementText(page, "Import wallet");
                const unlockCheck = await ElementService.HandlefindAndElementText(page, "Unlock");

                if (importWalletCheck) {
                    console.log("Found 'Import wallet'");
                    break;
                }

                if (unlockCheck) {
                    console.log("Found 'Unlock'. Closing page.");
                    await page.close();
                    break;
                }

                await Util.sleep(5000);
            }
        };
        await waitForValidElement(page);

        await ElementService.HandlefindAndClickElement(page,
            '//*[@id="main"]/div/div[2]/div/div[1]/div/div/div/div/div[2]/div/div/div/div/div[2]/div/div/div/button'
        );
        await ElementService.HandlefindAndClickElement(page,
            '//*[@id="main"]/div/div[2]/div/div[1]/div/div/div/div[2]/div/div[3]/div/div'
        );
        await ElementService.HandlefindAndClickElement(page,
            '//*[@id="main"]/div/div[2]/div/div[1]/div/div/div/div[2]/div/div/div[3]/div/div'
        );

        const mnemonics = globalState.workerData.mnemonic.split(' ');
        for (let i = 0; i < mnemonics.length; i++) {
            const xpath = `//input[@data-testid="secret-input-${i + 1}"]`;
            await ElementService.HandlefindAndTypeElement(page, xpath, mnemonics[i])
        }
        await page.keyboard.press("Enter");
        await Util.sleep(5000);
        //pass
        await ElementService.HandlefindAndTypeElement(page,
            '//input[@data-testid="password-input"]',
            process.env.PASS_PORTAL
        );
        await ElementService.HandlefindAndTypeElement(page,
            '//*[@id="main"]/div/div[2]/div/div[1]/div/div/div/div[2]/div/div[1]/div[2]/div/div[2]/div/div[2]/div/div[1]/div/div[1]/input',
            process.env.PASS_PORTAL
        );
        await page.keyboard.press("Enter");
        await Util.sleep(5000);
        await ElementService.HandlefindAndClickElement(page,
            '//img[@alt="check button"]'
        );

        await ElementService.HandlefindAndClickElementText(page,
            'I acknowledge'
        );

        await page.goto('chrome-extension://ieldiilncjhfkalnemgjbffmpomcaigi/popup.html#/home')
        if (close) {
            await page.close()
        }
    }
    static async Unblock(close = false) {
        const portaltobitcoin = await PageService.openFirstPage('https://portaltobitcoin.bonusblock.io?r=vkrCDEYy')
        await PageService.openNewPage('https://x.com/')

        // const page = await PageService.openNewPage('chrome-extension://ieldiilncjhfkalnemgjbffmpomcaigi/popup.html#/unlock')
        // await page.reload()
        // const waitForValidElement = async (page) => {
        //     while (true) {
        //         const unlockCheck = await ElementService.HandlefindAndElementText(page, "Unlock");
        //         if (unlockCheck) {
        //             console.log("Found 'Unlock'. Closing page.");
        //             await Util.sleep(5000);
        //             await ElementService.HandlefindAndTypeElement(
        //                 page,
        //                 '//*[@id="main"]/div/div[2]/div/div[1]/div/div/div/div/div/div/div[5]/div/div[1]/input',
        //                 process.env.PASS_PORTAL, 1
        //             )
        //             await page.keyboard.press("Enter");
        //             break;
        //         }

        //         await Util.sleep(1000);
        //     }
        // };

        // await waitForValidElement(page);

        // const portaltobitcoin = await PageService.openFirstPage('https://portaltobitcoin.bonusblock.io?r=vkrCDEYy')
        // await PageService.openNewPage('https://x.com/')
        // if (close) {
        //     await page.close()
        // }
        while (true) {



            await ElementService.HandlefindAndClickElement(portaltobitcoin,
                '//*[@id="radix-:r6:"]/div/div[5]/div[2]/div/div[2]/button',
            );

            await Util.sleep(20000);
        }
        // main https://portaltobitcoin.bonusblock.io?r=vkrCDEYy
        // 5 https://portaltobitcoin.bonusblock.io?r=DzjHcQE2 chua lam
        // 11 https://portaltobitcoin.bonusblock.io?r=y4KMGKaH lam roi
        // 12 https://portaltobitcoin.bonusblock.io?r=qr62bnwu lam roi
        // 13 https://portaltobitcoin.bonusblock.io?r=aRftcd4v lam roi

        // 14 https://portaltobitcoin.bonusblock.io?r=P5vXwsvv lam roi

        // await Util.sleep(5000); 
        // const warningText = "CONNECT WALLET";
        // if (await ElementService.HandlefindAndElementText(portaltobitcoin, warningText)) {
        //     await ElementService.HandlefindAndClickElement(portaltobitcoin,
        //         '//*[@id="root"]/div[2]/div[1]/div[3]/button[1]',
        //     );
        //     await Util.sleep(5000);
        //     await ElementService.HandlefindAndClickElement(portaltobitcoin,
        //         '//*[@id="root"]/div[2]/div[2]/div/div[3]/div/div[2]/button',
        //     );
        //     while (true) {
        //         try {
        //             let page = await PageService.findPageByUrl('chrome-extension://ieldiilncjhfkalnemgjbffmpomcaigi/popup.html#/home');
        //             if (page.check) {
        //                 page = await PageService.getTargetPage('chrome-extension://ieldiilncjhfkalnemgjbffmpomcaigi/popup.html#/home');
        //                 await ElementService.HandlefindAndClickElement(page,
        //                     '//*[@id="tab-bar"]/div[2]/div/div[1]/div/div[2]', 2
        //                 );
        //             }
        //         } catch (error) {
        //             console.error("Error while viewing page:", error.message);
        //         }
        //         await Util.sleep(10000);
        //     }
        // }
        // await PageService.openNewPage('https://discord.com/channels/@me');
        // await PageService.openNewPage('https://discord.com/channels/836487882981769237/1323859425047609374');

        //await PageService.openNewPage('chrome-extension://ieldiilncjhfkalnemgjbffmpomcaigi/popup.html#/swap')
        //await PageService.openFirstPage('https://discord.com/channels/836487882981769237/1301060999063011349')

        // fnfbonxl:3u02c3h2w0n8


        // const count = await axiosService.checkTimeTransactionsportal(globalState.workerData.portal.ETH)
        // if (count > 2) {
        //     globalState.checkCountTimePartal = true 
        // } 
    }
    static async RestartExtension(close = false) {
        const page = await PageService.openNewPage('chrome://extensions/?id=ieldiilncjhfkalnemgjbffmpomcaigi')
        // 
        const selectors = [
            "body > extensions-manager",
            "#viewManager > extensions-detail-view",
            "#enableToggle",
            "#bar"
        ];

        const shadowElement = await ElementService.queryShadowSelector(page, selectors);
        if (shadowElement) {
            await shadowElement.click();
            await shadowElement.click();
        } else {
            console.log("Không tìm thấy phần tử trong shadow DOM");
        }





        //await PageService.openFirstPage('https://portaltobitcoin.bonusblock.io/?r=vkrCDEYy')
        // await Util.sleep(5000);
        // const warningText = "CONNECT WALLET";
        // if (await ElementService.HandlefindAndElementText(portaltobitcoin, warningText)) {
        //     await ElementService.HandlefindAndClickElement(portaltobitcoin,
        //         '//*[@id="root"]/div[2]/div[1]/div[3]/button[1]',
        //     );
        //     await Util.sleep(5000);
        //     await ElementService.HandlefindAndClickElement(portaltobitcoin,
        //         '//*[@id="root"]/div[2]/div[2]/div/div[3]/div/div[2]/button',
        //     );
        //     while (true) {
        //         try {
        //             let page = await PageService.findPageByUrl('chrome-extension://ieldiilncjhfkalnemgjbffmpomcaigi/popup.html#/home');
        //             if (page.check) {
        //                 page = await PageService.getTargetPage('chrome-extension://ieldiilncjhfkalnemgjbffmpomcaigi/popup.html#/home');
        //                 await ElementService.HandlefindAndClickElement(page,
        //                     '//*[@id="tab-bar"]/div[2]/div/div[1]/div/div[2]', 2
        //                 );
        //             }
        //         } catch (error) {
        //             console.error("Error while viewing page:", error.message);
        //         }
        //         await Util.sleep(10000);
        //     }
        // }
        // await PageService.openNewPage('https://discord.com/channels/@me');
        // await PageService.openNewPage('https://discord.com/channels/836487882981769237/1323859425047609374');
        const count = await axiosService.checkTimeTransactionsportal(globalState.workerData.portal.ETH)
        if (count > 2) {
            globalState.checkCountTimePartal = true
        }

        if (close) {
            await page.close()
        }
    }
    //
    //await Util.sleep(5000);
    // const TextBug = "Kindly restart your extension. If the issue persists, kindly consider reinstalling the wallet or disabling and re-enabling the extension";
    // if (await ElementService.HandlefindAndElementText(page, TextBug)) {
    //     while (true) {
    //         const TextBug = "Kindly restart your extension. If the issue persists, kindly consider reinstalling the wallet or disabling and re-enabling the extension";
    //         const find = await ElementService.HandlefindAndElementText(page, TextBug)
    //         if (!find) {
    //             break
    //         }
    //         await page.reload()
    //         await Util.sleep(10000);
    //         await page.goto('chrome-extension://ieldiilncjhfkalnemgjbffmpomcaigi/popup.html#/swap')
    //         await Util.sleep(10000);
    //     }
    // }
    static async Swap() {
        const totalPages = 4;
        const url = 'chrome-extension://ieldiilncjhfkalnemgjbffmpomcaigi/popup.html#/swap';
        const pages = [];
        const check = globalState.checkCountTimePartal
        if (!check) {
            for (let i = 0; i < totalPages; i++) {
                const page = await PageService.openNewPage(url);

                pages.push(page);
            }
            const performSwap = async (page, index) => {
                console.log(`Tab ${index + 1}: Bắt đầu`);
                while (true) {
                    if (globalState.checkCountTimePartal) {
                        console.log(`Dừng do "đủ 15 swap: ${globalState.workerData.portal.ETH}"`);
                        break
                    }
                    await page.reload()
                    const wait = async () => {
                        while (true) {
                            const TextBug = "Network is experiencing lots of traffic. Please try later";
                            const check = await ElementService.HandlefindAndElementText(page, TextBug);
                            if (!check) {
                                break;
                            }
                            await page.keyboard.down('Control');
                            await page.keyboard.press('F5');
                            await page.keyboard.up('Control');

                            await Util.sleep(20000);
                        }
                    };

                    await wait();

                    await Util.sleep(5000);
                    await ElementService.HandlefindAndTypeElement(page,
                        '//*[@id="main"]/div/div[2]/div/div[1]/div/div/div/div[1]/div[3]/div/div/div/div[1]/div/div[1]/div[1]/input',
                        '0.0001'
                    );
                    const warningText = "Not Enough Sending Capacity";
                    if (await ElementService.HandlefindAndElementText(page, warningText)) {
                        //console.log(`Tab ${index + 1}: Cảnh báo hiển thị, thực hiện điều chỉnh`);
                        await ElementService.HandlefindAndClickElement(page,
                            '//*[@id="main"]/div/div[2]/div/div[1]/div/div/div/div[1]/div[3]/div/div/div/div[2]/div'
                        );
                    }
                    //
                    await Util.sleep(5000);
                    const ChannelText = "Kindly restart your extension. If the issue persists, kindly consider reinstalling the wallet or disabling and re-enabling the extension";

                    const Channel = await ElementService.HandlefindAndElementText(page, ChannelText)
                    if (Channel) {
                        continue
                    }

                    const networktext = "Network is experiencing lots of traffic. Please try later"
                    const network = await ElementService.HandlefindAndElementText(page, networktext)
                    if (network) {
                        continue
                    }
                    const waitForSwap = async () => {
                        while (true) {
                            if (globalState.swap || globalState.checkCountTimePartal) {
                                break;
                            }
                            await Util.sleep(5000);
                        }
                    };
                    await waitForSwap()
                    await ElementService.HandleWaitForSelectorClickElement(page,
                        '#main > div > div._1749zdr0._1749zdr6c._1749zdrjo.lt-dc.dt-dc > div > div:nth-child(1) > div > div > div > div.lt-dc.dt-dc > div._1749zdr0._1749zdrjo.lt-dc.dt-dc > div > div > div > div._1749zdr0._1749zdrhv._1749zdrea._1749zdr75._1749zdr79._1749zdr7x > div._1749zdrj4.bx-button-wrapper > button'
                    );
                    await Util.sleep(5000);
                    const waitForValidSecond = async () => {
                        let count = 0;
                        while (true) {
                            const check = await ElementService.HandlefindAndElementText(page, "Creating");
                            if (!check) {
                                break;
                            }
                            if (await ElementService.HandlefindAndElementText(page, "Matching swap")) break;

                            await Util.sleep(5000);

                            count++;
                            if (count >= 15) break;
                            if (globalState.checkCountTimePartal) break;
                        }
                    };


                    await waitForValidSecond();
                }
                console.log(`Tab ${index + 1}: Hoàn thành`);

            };


            await Promise.all(pages.map((page, index) => performSwap(page, index)));
            for (const page of pages) {
                await page.close();
            }
        }
        console.log('Tất cả các tab đã hoàn thành công việc.');
    }

    static async swaptest() {
        const url = 'chrome-extension://ieldiilncjhfkalnemgjbffmpomcaigi/popup.html#/swap';
        const page = await PageService.openNewPage(url);
        await page.reload()
        await Util.sleep(5000);
        await ElementService.HandlefindAndTypeElement(page,
            '//*[@id="main"]/div/div[2]/div/div[1]/div/div/div/div[1]/div[3]/div/div/div/div[1]/div/div[1]/div[1]/input',
            '0.0001'
        );

        await Util.sleep(5000);
        const warningText = "Not Enough Sending Capacity";
        if (await ElementService.HandlefindAndElementText(page, warningText)) {
            //console.log(`Tab ${index + 1}: Cảnh báo hiển thị, thực hiện điều chỉnh`);

            await ElementService.HandlefindAndClickElement(page,
                '//*[@id="main"]/div/div[2]/div/div[1]/div/div/div/div[1]/div[3]/div/div/div/div[2]/div'
            );
            await Util.sleep(5000);
        }
        // const waitForSwap = async () => {
        //     while (true) {
        //         if (globalState.swap) {
        //             break;
        //         }
        //     }
        // };
        // await waitForSwap()

        // await ElementService.HandlefindAndClickElement(page,
        //     '//*[@id="main"]/div/div/div[1]/div/div/div/div[1]/div[3]/div/div/div/div[5]/div[1]/button'
        // );
        await ElementService.HandleWaitForSelectorClickElement(page,
            '#main > div > div._1749zdr0._1749zdr6c._1749zdrjo.lt-dc.dt-dc > div > div:nth-child(1) > div > div > div > div.lt-dc.dt-dc > div._1749zdr0._1749zdrjo.lt-dc.dt-dc > div > div > div > div._1749zdr0._1749zdrhv._1749zdrea._1749zdr75._1749zdr79._1749zdr7x > div._1749zdrj4.bx-button-wrapper > button'
        );



        await Util.sleep(10000);

        // const waitForValidSecond = async () => {
        //     while (true) {
        //         const check = await ElementService.HandlefindAndElementText(page, "Creating");
        //         if (!check) {
        //             break;
        //         }
        //         await Util.sleep(5000);
        //     }
        // };

        // await waitForValidSecond();

        // const ChannelText = "Channel not confirmed";
        // if (await ElementService.HandlefindAndElementText(page, ChannelText)) {
        //     console.log(`${globalState.workerData.portal.ETH}: Dừng do "Channel not confirmed"`);

        //     globalState.checkCountTimePartal = true
        // }
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
        const totalPages = 10;
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
        const pagePartalWallet = await PageService.openFirstPage('chrome-extension://ieldiilncjhfkalnemgjbffmpomcaigi/popup.html#/home')

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
            const target = await PageService.getTargetPageByIncludes('chrome-extension://ieldiilncjhfkalnemgjbffmpomcaigi/popup.html#')
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
            "chrome-extension://ieldiilncjhfkalnemgjbffmpomcaigi/popup.html#/faucets"
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
            try {
                //console.log('randomViewPageIndexrandomViewPageIndexrandomViewPageIndexrandomViewPageIndex', globalState.checkCountTimePartal)
                if (globalState.checkCountTimePartal) {
                    break
                }
                const pages = await globalState.browser.pages();
                const totalTabs = pages.length;

                await Util.sleep(10000);
                currentIndex = (currentIndex + 1) % totalTabs;

                const page = await PageService.switchToPageByIndex(currentIndex);
                // await page.keyboard.down('Control');
                // await page.keyboard.press("Enter");
                // await page.keyboard.up('Control');
                // if (page) {
                //     const url = await page.url();
                //     //console.log(`Switched to tab ${currentIndex} with URL: ${url}`);
                // } else {
                //     //console.log(`No page found at index ${currentIndex}.`);
                // }
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
                let page = await PageService.findPageByUrl('chrome-extension://ieldiilncjhfkalnemgjbffmpomcaigi/popup.html#/home');
                if (page.check) {
                    page = await PageService.getTargetPage('chrome-extension://ieldiilncjhfkalnemgjbffmpomcaigi/popup.html#/home');
                    await ElementService.HandlefindAndClickElement(page,
                        '//*[@id="tab-bar"]/div[2]/div/div[1]/div/div[2]', 2
                    );
                }
            } catch (error) {
                console.error("Error while viewing page:", error.message);
            }
            await Util.sleep(2000);
        }
    }

    static async checkCountTime() {
        while (true) {
            if (globalState.checkCountTimePartal) {
                break
            }

            try {
                const count = await axiosService.checkTimeTransactionsportal(globalState.workerData.portal.ETH)
                if (count > 1) {
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

    static async PromiseAllPartal() {
        await Promise.all([
            // faucet
            // this.Gohome(),
            // this.faucet(),
            // this.randomViewPageIndex()
            // swap
            this.checkGas(),
            this.checkCountTime(),
            this.Swap(),
            this.randomViewPageIndex(),
            this.checkPageHome(),
        ]);
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

                globalState.swap = data?.gas_prices?.average <= 1500 || false;
                //console.log(globalState.swap)
                console.log('average_gas', data?.gas_prices?.average)
            } catch (error) {
                console.error('Error fetching gas prices:', error.message);
            }
        }
    }

}

module.exports = PartalWallet;