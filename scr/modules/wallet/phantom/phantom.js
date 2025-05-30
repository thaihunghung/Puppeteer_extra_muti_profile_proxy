const clipboardy = require('clipboardy');
const globalState = require('../../../config/globalState');
const { ElementService, PageService } = require('../../../config/import.service');
const { Util } = require('../../../config/import.util');
const { sleep } = require('../../../util/util');
const { fs } = require('../../../config/module.import');

require('dotenv').config();

class PhantomWallet {
    constructor() { }
    static async Unblock(close = false) {
        const pagePartalWallet = await PageService.openNewPage('chrome-extension://bfnaelmomeimhlpmgjnjophhpkkoljpa/popup.html')
        await ElementService.HandlefindAndTypeElement(
            pagePartalWallet,
            '//*[@id="unlock-form"]/div/div[2]/div/input',
            process.env.PASS_PORTAL, 20
        )

        await ElementService.HandlefindAndClickElement(
            pagePartalWallet,
            '//*[@id="root"]/div/div/div[1]/div/div[2]/div/button',
            20
        )

        if (close) {
            await pagePartalWallet.close()
        }
    }
    static async UnblockMeta(close = false) {
        const page = await PageService.openNewPage('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/popup.html#unlock')
        //await page.waitForSelector('[data-testid="unlock-password"]', { timeout: 10000 });
        while (true) {
            const input = await page.$('[data-testid="unlock-password"]');
            if (input) {
                await input.type('hunghung')
                break;
            }
            await Util.sleep(5000)
        }
        //await page.waitForSelector('[data-testid="unlock-submit"]', { timeout: 10000 });
        while (true) {
            const button = await page.$('[data-testid="unlock-submit"]');

            // Kiểm tra nếu button tồn tại và không bị disabled
            if (button) {
                const isDisabled = await button.evaluate((btn) => btn.disabled);
                if (!isDisabled) {
                    await button.click()
                    break;
                }
                await Util.sleep(5000)
            }
        }

        if (close) {
            await page.close()
        }
    }

    static async ImportWallet(close = false) {
        async function Await() {
            while (true) {
                const page = await PageService.findPageByUrl('chrome-extension://')
                if (page.check) {
                    console.log("tim thấy")
                    break
                }
                await Util.sleep(1000)
            }
        }
        await Await()
        const pagePartalWallet = await PageService.getTargetPage('chrome-extension://bfnaelmomeimhlpmgjnjophhpkkoljpa/onboarding.html')

        await ElementService.HandlefindAndClickElement(
            pagePartalWallet,
            '//*[@id="root"]/main/div[2]/div/div[2]/button[2]',
            20
        )
        await ElementService.HandleWaitForSelectorClickElement(
            pagePartalWallet,
            '#root > main > div._175sik91._51gazn1x._51gazn37._51gazn18p._51gazn5r > div > div.t8qixv0.t8qixv1._51gazn8._51gazn18w._51gazn1ak._51gazn1c3._51gazn129._51gazngj > button:nth-child(2)',
            20
        )

        const mnemonics = globalState.workerData.mnemonic.split(' ');

        const xpaths = [
            '//*[@id="root"]/main/div[2]/form/div/div[2]/div[1]/input',
            '//*[@id="root"]/main/div[2]/form/div/div[2]/div[2]/input',
            '//*[@id="root"]/main/div[2]/form/div/div[2]/div[3]/input',
            '//*[@id="root"]/main/div[2]/form/div/div[2]/div[4]/input',
            '//*[@id="root"]/main/div[2]/form/div/div[2]/div[5]/input',
            '//*[@id="root"]/main/div[2]/form/div/div[2]/div[6]/input',
            '//*[@id="root"]/main/div[2]/form/div/div[2]/div[7]/input',
            '//*[@id="root"]/main/div[2]/form/div/div[2]/div[8]/input',
            '//*[@id="root"]/main/div[2]/form/div/div[2]/div[9]/input',
            '//*[@id="root"]/main/div[2]/form/div/div[2]/div[10]/input',
            '//*[@id="root"]/main/div[2]/form/div/div[2]/div[11]/input',
            '//*[@id="root"]/main/div[2]/form/div/div[2]/div[12]/input',
        ]

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
        await Util.sleep(1000)

        await ElementService.HandlefindAndClickElement(
            pagePartalWallet,
            '//*[@id="root"]/main/div[2]/form/button',
            20
        )
        await ElementService.HandlefindAndClickElement(
            pagePartalWallet,
            '//*[@id="root"]/main/div[2]/form/button[2]',
            20
        )
        while (true) {
            const button = await pagePartalWallet.$('[data-testid="onboarding-form-password-input"]');
            if (button) {
                break;
            }
            await Util.sleep(500)
        }
        await ElementService.HandlefindAndTypeElement(
            pagePartalWallet,
            '//*[@id="root"]/main/div[2]/form/div[1]/div[2]/input',
            'Hunghung123', 20
        )

        await ElementService.HandlefindAndTypeElement(
            pagePartalWallet,
            '//*[@id="root"]/main/div[2]/form/div[1]/div[2]/div/div/input',
            'Hunghung123', 20
        )

        await ElementService.HandlefindAndClickElement(
            pagePartalWallet,
            '//*[@id="root"]/main/div[2]/form/div[2]/span/input',
            20
        )
        while (true) {
            const button = await pagePartalWallet.$('[data-testid="onboarding-form-submit-button"]');

            // Kiểm tra nếu button tồn tại và không bị disabled
            if (button) {
                const isDisabled = await button.evaluate((btn) => btn.disabled);
                if (!isDisabled) {
                    break;
                }
                await Util.sleep(500)
            }
        }

        await ElementService.HandlefindAndClickElement(
            pagePartalWallet,
            '//*[@id="root"]/main/div[2]/form/button',
            20
        )

        while (true) {
            const button = await pagePartalWallet.$('[data-testid="onboarding-form-submit-button"]');
            if (button) {
                break;
            }
            await Util.sleep(500)
        }
        while (true) {
            const button = await ElementService.HandlefindAndElementText(pagePartalWallet, 'Get Started', 1)
            if (!button) {
                break;
            }
            await ElementService.HandlefindAndClickElement(
                pagePartalWallet,
                '//*[@id="root"]/main/div[2]/form/button',
                1
            )
            await Util.sleep(500)
        }
        // await Util.sleep(5000)
        // const home = await PageService.openNewPage('chrome-extension://bfnaelmomeimhlpmgjnjophhpkkoljpa/popup.html')
        // async function clickButton(page, btnSelector) {
        //     try {
        //         await page.waitForSelector(btnSelector, { visible: true, timeout: 10000 });
        
        //         const btn = await page.$(btnSelector);
        //         if (btn) {
        //             const clicked = await page.evaluate(selector => {
        //                 const btn = document.querySelector(selector);
        //                 if (btn && btn.offsetWidth > 0 && btn.offsetHeight > 0 && !btn.disabled) {
        //                     btn.scrollIntoView();
        //                     const event = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
        //                     btn.dispatchEvent(event);
        //                     return true;  // ✅ Click thành công
        //                 }
        //                 return false;  // ❌ Nút bị ẩn hoặc disabled
        //             }, btnSelector);
        
        //             if (!clicked) {
        //                 console.error("Không thể click vì nút bị ẩn hoặc vô hiệu hóa:", btnSelector);
        //                 return false;
        //             }
        //             return true;
        //         } else {
        //             console.error("Không tìm thấy nút:", btnSelector);
        //             return false;
        //         }
        //     } catch (error) {
        //         console.error("Lỗi khi click:", error);
        //         return false;
        //     }
        // }
        // async function waitAndClick(umba, selector) {
        //     while (true) {
        //         const input = await umba.$(selector);
        
        //         if (input) {
        //             const success = await clickButton(umba, selector);
        //             if (success) break
        //         }
        
        //         await Util.sleep(500);
        //     }
        // }

        // await waitAndClick(home, '[data-testid="settings-menu-open-button"]')

        // while (true) {
        //     const element = await home.evaluate(() => {
        //         const el = document.querySelector('div.sc-kudmJA.cToUhH');
        //         return el && el.getAttribute('style') === 'transform: none;';
        //     });

        //     if (element) {
        //         console.log('Div đã xuất hiện với style="transform: none;"');
        //         break; // Thoát khỏi vòng while
        //     }

        //     await Util.sleep(500)
        // }

        // await waitAndClick(home, '[data-testid="sidebar_menu-button-settings"]')
        // while (true) {
        //     const element = await home.evaluate(() => {
        //         const el = document.querySelector('div.sc-kexyCK.dpHTec');
        //         return el && el.getAttribute('style') === 'transform: none;';
        //     });

        //     if (element) {
        //         console.log('Div đã xuất hiện với style="transform: none;"');
        //         break; // Thoát khỏi vòng while
        //     }

        //     await Util.sleep(500)
        // }
        // await waitAndClick(home, '[data-testid="settings-item-security-and-privacy"]')


  
        
        // if (close) {
        //     await pagePartalWallet.close()
        // }
    }
    static async ImportPrivateSolKey(close = false) {
        async function clickButton1(page, xpath) {
            try {
                // Chờ phần tử xuất hiện bằng XPath
                const elementHandle = await page.evaluateHandle((xpath) => {
                    return document.evaluate(
                        xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
                    ).singleNodeValue;
                }, xpath);
    
                if (!elementHandle) {
                    console.error("Không tìm thấy nút:", xpath);
                    return false;
                }
    
                // Click vào nút bằng evaluate
                const clicked = await page.evaluate((el) => {
                    if (el && el.offsetWidth > 0 && el.offsetHeight > 0 && !el.disabled) {
                        el.scrollIntoView();
                        el.click();
                        return true;
                    }
                    return false;
                }, elementHandle);
    
                if (clicked) {
                    console.log("✅ Click thành công:", xpath);
                    return true;
                } else {
                    console.error("Không thể click vì nút bị ẩn hoặc vô hiệu hóa:", xpath);
                    return false;
                }
            } catch (error) {
                console.error("Lỗi khi click:", error);
                return false;
            }
        }
    
        async function waitAndClick1(umba, selector) {
            while (true) {
                if (globalState.isPageClosed) return
                const elementHandle = await umba.evaluateHandle((xpath) => {
                    return document.evaluate(
                        xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
                    ).singleNodeValue;
                }, selector);
    
                if (elementHandle) {
                    const success = await clickButton1(umba, selector);
                    if (success) return true;
                }
    
                await Util.sleep(5000)
            }
        }
    
        async function clickButton(page, btnSelector) {
            try {
                console.log(`[clickButton] Chờ tìm nút: ${btnSelector}`);
                await page.waitForSelector(btnSelector, { visible: true, timeout: 10000 });
    
                const btn = await page.$(btnSelector);
                if (btn) {
                    console.log(`[clickButton] Tìm thấy nút: ${btnSelector}, kiểm tra trạng thái...`);
                    const clicked = await page.evaluate(selector => {
                        const btn = document.querySelector(selector);
                        if (btn && btn.offsetWidth > 0 && btn.offsetHeight > 0 && !btn.disabled) {
                            console.log(`[clickButton] Nút hợp lệ, thực hiện click: ${selector}`);
                            btn.scrollIntoView();
                            const event = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
                            btn.dispatchEvent(event);
                            return true;  // ✅ Click thành công
                        }
                        console.log(`[clickButton] Nút bị ẩn hoặc disabled: ${selector}`);
                        return false;  // ❌ Nút bị ẩn hoặc disabled
                    }, btnSelector);
    
                    if (!clicked) {
                        console.error(`[clickButton] Không thể click vì nút bị ẩn hoặc vô hiệu hóa: ${btnSelector}`);
                        return false;
                    }
                    console.log(`[clickButton] Click thành công: ${btnSelector}`);
                    return true;
                } else {
                    console.error(`[clickButton] Không tìm thấy nút: ${btnSelector}`);
                    return false;
                }
            } catch (error) {
                console.error(`[clickButton] Lỗi khi click: ${error.message}`);
                return false;
            }
        }
    
        async function typeInput(page, selector, text) {
            try {
                console.log(`[typeInput] Chờ tìm input: ${selector}`);
                await page.waitForSelector(selector, { visible: true, timeout: 10000 });
    
                console.log(`[typeInput] Tìm thấy input: ${selector}, chuẩn bị nhập dữ liệu...`);
                const input = await page.$(selector);
                if (input) {
                    console.log(`[typeInput] Bắt đầu nhập dữ liệu vào: ${selector}`);
                    await input.click({ clickCount: 3 }); // Chọn toàn bộ văn bản trước khi nhập
                    await page.type(selector, text); // Gõ văn bản
                    console.log(`[typeInput] Nhập thành công: ${text}`);
                    return true; // Nhập thành công
                } else {
                    console.error(`[typeInput] Không tìm thấy ô input: ${selector}`);
                    return false;
                }
            } catch (error) {
                console.error(`[typeInput] Lỗi khi nhập dữ liệu: ${error.message}`);
                return false;
            }
        }
    
        async function waitAndClick(umba, selector) {
            console.log(`[waitAndClick] Bắt đầu chờ và click: ${selector}`);
            while (true) {
                if (globalState.isPageClosed) return
                const input = await umba.$(selector);
                if (input) {
                    console.log(`[waitAndClick] Tìm thấy nút, thử click: ${selector}`);
                    const success = await clickButton(umba, selector);
                    if (success) {
                        console.log(`[waitAndClick] Click thành công: ${selector}`);
                        break;
                    }
                } else {
                    //console.log(`[waitAndClick] Chưa tìm thấy nút: ${selector}, thử lại sau...`);
                }
    
                await Util.sleep(500);
            }
        }
    
        async function waitAndType(page, selector, text) {
            console.log(`[waitAndType] Bắt đầu chờ và nhập dữ liệu vào: ${selector}`);
            while (true) {
                if (globalState.isPageClosed) return
                const success = await typeInput(page, selector, text);
                if (success) {
                    console.log(`[waitAndType] Nhập dữ liệu thành công: ${text} vào ${selector}`);
                    break; // Thoát vòng lặp nếu nhập thành công
                } else {
                    console.log(`[waitAndType] Nhập thất bại, thử lại sau...`);
                }
    
                await Util.sleep(500);
            }
        }
        async function Await() {
            while (true) {
                if (globalState.isPageClosed) return
                const __finnd = await PageService.findPageByUrl('chrome-extension://')
                if (__finnd.check) {
                    const page = await PageService.getTargetPage('chrome-extension://bfnaelmomeimhlpmgjnjophhpkkoljpa/onboarding.html')
                    await ElementService.HandlefindAndClickElement(
                        page,
                        '//*[@id="root"]/main/div[2]/div/div[2]/button[2]',
                        20
                    )
                    await ElementService.HandleWaitForSelectorClickElement(
                        page,
                        '#root > main > div._175sik91._51gazn1x._51gazn37._51gazn18p._51gazn5r > div > div.t8qixv0.t8qixv1._51gazn8._51gazn18w._51gazn1ak._51gazn1c3._51gazn129._51gazngj > button:nth-child(3)',
                        20
                    )
                    while (true) {
                        if (globalState.isPageClosed) return
                        const button = await ElementService.HandlefindAndElementText(page, 'Solana')
                        if (button) {
                            break;
                        }
                        await Util.sleep(500)
                    }
        
                    await waitAndType(page,
                        `#root > main > div._175sik91._51gazn1x._51gazn37._51gazn18p._51gazn5r > form > div > section > div:nth-child(2) > input`,
                        'vi1'
                    )

                    await waitAndType(page,
                        `#root > main > div._175sik91._51gazn1x._51gazn37._51gazn18p._51gazn5r > form > div > section > div:nth-child(3) > textarea`,
                        `${globalState.workerData.sol_private_key}`
                    )
                    await waitAndClick(page, `[data-testid="onboarding-form-submit-button"]`)
                    while (true) {
                        if (globalState.isPageClosed) return
                        const button = await page.$('[data-testid="onboarding-form-password-input"]');
                        if (button) {
                            break;
                        }
                        await Util.sleep(500)
                    }
                    await waitAndType(page,
                        `[data-testid="onboarding-form-password-input"]`,
                        'hunghung'
                    )
                    await waitAndType(page,
                        `[data-testid="onboarding-form-confirm-password-input"]`,
                        'hunghung'
                    )
                    await waitAndClick(page,
                        `[data-testid="onboarding-form-terms-of-service-checkbox"]`,
                    )
                    await waitAndClick(page,
                        `[data-testid="onboarding-form-submit-button"]`,
                    )
                    await Util.sleep(10000)
                    await waitAndClick(page,
                        `[data-testid="onboarding-form-submit-button"]`,
                    )
                    break
                }
                await Util.sleep(2000)
            }
        }
        await Await()
    }
    static async ImportPrivateKey(close = false) {
        async function clickButton1(page, xpath) {
            try {
                // Chờ phần tử xuất hiện bằng XPath
                const elementHandle = await page.evaluateHandle((xpath) => {
                    return document.evaluate(
                        xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
                    ).singleNodeValue;
                }, xpath);
    
                if (!elementHandle) {
                    console.error("Không tìm thấy nút:", xpath);
                    return false;
                }
    
                // Click vào nút bằng evaluate
                const clicked = await page.evaluate((el) => {
                    if (el && el.offsetWidth > 0 && el.offsetHeight > 0 && !el.disabled) {
                        el.scrollIntoView();
                        el.click();
                        return true;
                    }
                    return false;
                }, elementHandle);
    
                if (clicked) {
                    console.log("✅ Click thành công:", xpath);
                    return true;
                } else {
                    console.error("Không thể click vì nút bị ẩn hoặc vô hiệu hóa:", xpath);
                    return false;
                }
            } catch (error) {
                console.error("Lỗi khi click:", error);
                return false;
            }
        }
    
        async function waitAndClick1(umba, selector) {
            while (true) {
                if (globalState.isPageClosed) return
                const elementHandle = await umba.evaluateHandle((xpath) => {
                    return document.evaluate(
                        xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
                    ).singleNodeValue;
                }, selector);
    
                if (elementHandle) {
                    const success = await clickButton1(umba, selector);
                    if (success) return true;
                }
    
                await Util.sleep(5000)
            }
        }
    
        async function clickButton(page, btnSelector) {
            try {
                console.log(`[clickButton] Chờ tìm nút: ${btnSelector}`);
                await page.waitForSelector(btnSelector, { visible: true, timeout: 10000 });
    
                const btn = await page.$(btnSelector);
                if (btn) {
                    console.log(`[clickButton] Tìm thấy nút: ${btnSelector}, kiểm tra trạng thái...`);
                    const clicked = await page.evaluate(selector => {
                        const btn = document.querySelector(selector);
                        if (btn && btn.offsetWidth > 0 && btn.offsetHeight > 0 && !btn.disabled) {
                            console.log(`[clickButton] Nút hợp lệ, thực hiện click: ${selector}`);
                            btn.scrollIntoView();
                            const event = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
                            btn.dispatchEvent(event);
                            return true;  // ✅ Click thành công
                        }
                        console.log(`[clickButton] Nút bị ẩn hoặc disabled: ${selector}`);
                        return false;  // ❌ Nút bị ẩn hoặc disabled
                    }, btnSelector);
    
                    if (!clicked) {
                        console.error(`[clickButton] Không thể click vì nút bị ẩn hoặc vô hiệu hóa: ${btnSelector}`);
                        return false;
                    }
                    console.log(`[clickButton] Click thành công: ${btnSelector}`);
                    return true;
                } else {
                    console.error(`[clickButton] Không tìm thấy nút: ${btnSelector}`);
                    return false;
                }
            } catch (error) {
                console.error(`[clickButton] Lỗi khi click: ${error.message}`);
                return false;
            }
        }
    
        async function typeInput(page, selector, text) {
            try {
                console.log(`[typeInput] Chờ tìm input: ${selector}`);
                await page.waitForSelector(selector, { visible: true, timeout: 10000 });
    
                console.log(`[typeInput] Tìm thấy input: ${selector}, chuẩn bị nhập dữ liệu...`);
                const input = await page.$(selector);
                if (input) {
                    console.log(`[typeInput] Bắt đầu nhập dữ liệu vào: ${selector}`);
                    await input.click({ clickCount: 3 }); // Chọn toàn bộ văn bản trước khi nhập
                    await page.type(selector, text); // Gõ văn bản
                    console.log(`[typeInput] Nhập thành công: ${text}`);
                    return true; // Nhập thành công
                } else {
                    console.error(`[typeInput] Không tìm thấy ô input: ${selector}`);
                    return false;
                }
            } catch (error) {
                console.error(`[typeInput] Lỗi khi nhập dữ liệu: ${error.message}`);
                return false;
            }
        }
    
        async function waitAndClick(umba, selector) {
            console.log(`[waitAndClick] Bắt đầu chờ và click: ${selector}`);
            while (true) {
                if (globalState.isPageClosed) return
                const input = await umba.$(selector);
                if (input) {
                    console.log(`[waitAndClick] Tìm thấy nút, thử click: ${selector}`);
                    const success = await clickButton(umba, selector);
                    if (success) {
                        console.log(`[waitAndClick] Click thành công: ${selector}`);
                        break;
                    }
                } else {
                    //console.log(`[waitAndClick] Chưa tìm thấy nút: ${selector}, thử lại sau...`);
                }
    
                await Util.sleep(500);
            }
        }
    
        async function waitAndType(page, selector, text) {
            console.log(`[waitAndType] Bắt đầu chờ và nhập dữ liệu vào: ${selector}`);
            while (true) {
                if (globalState.isPageClosed) return
                const success = await typeInput(page, selector, text);
                if (success) {
                    console.log(`[waitAndType] Nhập dữ liệu thành công: ${text} vào ${selector}`);
                    break; // Thoát vòng lặp nếu nhập thành công
                } else {
                    console.log(`[waitAndType] Nhập thất bại, thử lại sau...`);
                }
    
                await Util.sleep(500);
            }
        }
        async function Await() {
            while (true) {
                if (globalState.isPageClosed) return
                const __finnd = await PageService.findPageByUrl('chrome-extension://')
                if (__finnd.check) {
                    const page = await PageService.getTargetPage('chrome-extension://bfnaelmomeimhlpmgjnjophhpkkoljpa/onboarding.html')
                    await ElementService.HandlefindAndClickElement(
                        page,
                        '//*[@id="root"]/main/div[2]/div/div[2]/button[2]',
                        20
                    )
                    await ElementService.HandleWaitForSelectorClickElement(
                        page,
                        '#root > main > div._175sik91._51gazn1x._51gazn37._51gazn18p._51gazn5r > div > div.t8qixv0.t8qixv1._51gazn8._51gazn18w._51gazn1ak._51gazn1c3._51gazn129._51gazngj > button:nth-child(3)',
                        20
                    )
                    while (true) {
                        if (globalState.isPageClosed) return
                        const button = await ElementService.HandlefindAndElementText(page, 'Solana')
                        if (button) {
                            break;
                        }
                        await Util.sleep(500)
                    }
                    await ElementService.HandlefindAndClickElementText(
                        page,
                        'Solana',
                        20
                    )
                    //await page.keyboard.press("ArrowDown");
                    await page.keyboard.press("Enter");
                    await Util.sleep(5000)

                    await waitAndType(page,
                        `#root > main > div._175sik91._51gazn1x._51gazn37._51gazn18p._51gazn5r > form > div > section > div:nth-child(2) > input`,
                        'vi1'
                    )

                    await waitAndType(page,
                        `#root > main > div._175sik91._51gazn1x._51gazn37._51gazn18p._51gazn5r > form > div > section > div:nth-child(3) > textarea`,
                        `0x${globalState.workerData.EVM.private_key}`
                    )
                    await waitAndClick(page, `[data-testid="onboarding-form-submit-button"]`)
                    while (true) {
                        if (globalState.isPageClosed) return
                        const button = await page.$('[data-testid="onboarding-form-password-input"]');
                        if (button) {
                            break;
                        }
                        await Util.sleep(500)
                    }
                    await waitAndType(page,
                        `[data-testid="onboarding-form-password-input"]`,
                        'hunghung'
                    )
                    await waitAndType(page,
                        `[data-testid="onboarding-form-confirm-password-input"]`,
                        'hunghung'
                    )
                    await waitAndClick(page,
                        `[data-testid="onboarding-form-terms-of-service-checkbox"]`,
                    )
                    await waitAndClick(page,
                        `[data-testid="onboarding-form-submit-button"]`,
                    )
                    await Util.sleep(10000)
                    await waitAndClick(page,
                        `[data-testid="onboarding-form-submit-button"]`,
                    )
                }
                await Util.sleep(2000)
            }
        }
        await Await()
    }
    static async ImportMetaWallet(close = false) {
        async function Await() {
            while (true) {
                const page = await PageService.findPageByUrl('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/home.html#onboarding/welcome')
                if (page.check) {
                    console.log("tim thấy")
                    break
                }
                await Util.sleep(5000)
            }
        }
        await Await()
        const pagePartalWallet = await PageService.getTargetPage('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/home.html#onboarding/welcome')

        await pagePartalWallet.waitForSelector('[id="onboarding__terms-checkbox"]', { timeout: 10000 });
        while (true) {
            const button = await pagePartalWallet.$('[id="onboarding__terms-checkbox"]');
            if (button) {
                await button.click()
                break;
            }
            await Util.sleep(500)
        }
        await pagePartalWallet.waitForSelector('[data-testid="onboarding-import-wallet"]', { timeout: 10000 });
        while (true) {
            const button = await pagePartalWallet.$('[data-testid="onboarding-import-wallet"]');

            // Kiểm tra nếu button tồn tại và không bị disabled
            if (button) {
                const isDisabled = await button.evaluate((btn) => btn.disabled);
                if (!isDisabled) {
                    await button.click()
                    break;
                }
                await Util.sleep(500)
            }
        }
        await pagePartalWallet.waitForSelector('[data-testid="metametrics-i-agree"]', { timeout: 10000 });
        while (true) {
            const button = await pagePartalWallet.$('[data-testid="metametrics-i-agree"]');
            if (button) {
                await button.click()
                break;
            }
            await Util.sleep(500)
        }
        await pagePartalWallet.waitForSelector('[id="import-srp__srp-word-0"]', { timeout: 10000 });
        while (true) {
            const input = await pagePartalWallet.$('[id="import-srp__srp-word-0"]');
            if (input) {
                break;
            }
            await Util.sleep(500)
        }
        console.log('qua')
        const mnemonics = globalState.workerData.pharos.mnemonic.split(' ');

        for (let i = 0; i < mnemonics.length; i++) {
            const value = mnemonics[i]
            const input = await pagePartalWallet.$(`[id="import-srp__srp-word-${i}"]`);
            if (input) {
                await input.type(value)
            }
        }
        while (true) {
            const button = await pagePartalWallet.$('[data-testid="import-srp-confirm"]');

            // Kiểm tra nếu button tồn tại và không bị disabled
            if (button) {
                const isDisabled = await button.evaluate((btn) => btn.disabled);
                if (!isDisabled) {
                    await button.click()
                    break;
                }
                await Util.sleep(500)
            }
        }
        while (true) {
            const input = await pagePartalWallet.$('[data-testid="create-password-new"]');
            if (input) {
                await input.type('hunghung')
                break;
            }
            await Util.sleep(500)
        }
        while (true) {
            const input = await pagePartalWallet.$('[data-testid="create-password-confirm"]');
            if (input) {
                await input.type('hunghung')
                break;
            }
            await Util.sleep(500)
        }
        while (true) {
            const button = await pagePartalWallet.$('[data-testid="create-password-terms"]');
            if (button) {
                await button.click()
                break;
            }
            await Util.sleep(500)
        }
        while (true) {
            const button = await pagePartalWallet.$('[data-testid="create-password-import"]');

            // Kiểm tra nếu button tồn tại và không bị disabled
            if (button) {
                const isDisabled = await button.evaluate((btn) => btn.disabled);
                if (!isDisabled) {
                    await button.click()
                    break;
                }
                await Util.sleep(500)
            }
        }
        while (true) {
            const button = await pagePartalWallet.$('[data-testid="onboarding-complete-done"]');
            if (button) {
                await button.click()
                break;
            }
            await Util.sleep(500)
        }
        while (true) {
            const button = await pagePartalWallet.$('[data-testid="pin-extension-next"]');
            if (button) {
                await Util.sleep(3000)
                await button.click()
                break;
            }
            await Util.sleep(500)
        }
        while (true) {
            const button = await pagePartalWallet.$('[data-testid="pin-extension-done"]');
            if (button) {
                await Util.sleep(3000)
                await button.click()
                break;
            }
            await Util.sleep(500)
        }
        //await pagePartalWallet.reload()
        // while (true) {
        //     const page = await ElementService.HandlefindAndElementText(pagePartalWallet, 'Connecting to Ethereum Mainnet', 1)
        //     if (!page) {
        //         await Util.sleep(10000)
        //         break
        //     }
        //     await Util.sleep(3000)
        // }

        // while (true) {
        //     const button = await pagePartalWallet.$('[data-testid="network-display"]');
        //     if (button) {
        //         await button.click()
        //         break; 
        //     }
        //     await Util.sleep(500)
        // }
        // while (true) {
        //     const page = await ElementService.HandlefindAndElementText(pagePartalWallet, 'Add a custom network', 2)
        //     if (page) {            
        //         await ElementService.HandlefindAndClickElement(pagePartalWallet, '/html/body/div[3]/div[3]/div/section/div[2]/button', 1) 
        //         break
        //     }
        //     await Util.sleep(500)
        // }
        // while (true) {
        //     const input = await pagePartalWallet.$('[data-testid="network-form-network-name"]');
        //     if (input) {
        //         await input.type('Haust Testnet')
        //         break; 
        //     }
        //     await Util.sleep(500)
        // }


        // while (true) {
        //     const button = await pagePartalWallet.$('[data-testid="test-add-rpc-drop-down"]');
        //     if (button) {
        //         await button.click()
        //         break; 
        //     }
        //     await Util.sleep(500)
        // }
        // while (true) {
        //     const page = await ElementService.HandlefindAndElementText(pagePartalWallet, 'Add RPC URL', 2)
        //     if (page) {            
        //         await ElementService.HandlefindAndClickElement(pagePartalWallet, '/html/body/div[3]/div[3]/div/section/div/div[1]/div[2]/div[2]/div/div/button', 1) 
        //         break
        //     }
        //     await Util.sleep(500)
        // }
        // while (true) {
        //     const input = await pagePartalWallet.$('[data-testid="rpc-url-input-test"]');
        //     if (input) {
        //         await input.type('https://rpc-testnet.haust.app')
        //         break; 
        //     }
        //     await Util.sleep(500)
        // }
        // while (true) {
        //     const page = await ElementService.HandlefindAndElementText(pagePartalWallet, 'Add URL', 2)
        //     if (page) {            
        //         await ElementService.HandlefindAndClickElement(pagePartalWallet, '/html/body/div[3]/div[3]/div/section/div/div[2]/button', 1) 
        //         break
        //     }
        //     await Util.sleep(500)
        // }





        //await pagePartalWallet.close()
        //add chain

        // const pageChainlist = await PageService.openNewPage('https://chainlist.org/?testnets=true&search=Haust+Testnet')
        // while (true) {
        //     const page = await ElementService.HandlefindAndElementText(pageChainlist, 'Connect Wallet', 2)
        //     if (page) {            
        //         await ElementService.HandlefindAndClickElement(pageChainlist, '//*[@id="__next"]/div/div[2]/div[2]/div/button[1]', 1) 
        //         break
        //     }
        //     await Util.sleep(500)
        // }

        // await this.ConectMetaWallet()



        //await this.ApproveMetaWallet()
        //await pageChainlist.close()
        //         Network name
        // Haust Testnet
        // Network URL
        // https://rpc-testnet.haust.app
        // Chain ID
        // 1523903251
        // Currency symbol
        // HAUST
        
    }
    static async ConectMetaWallet(close = false) {
        let page;
        async function Await() {
            while (true) {
                page = await PageService.findPageByUrl('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/');
                if (page.check) {
                    console.log("Tìm thấy trang ví MetaMask!");
                    break;
                }
                await Util.sleep(5000);
            }
        }
        await Await();

        const pagePartalWallet = await PageService.getTargetPage(page.url);

        while (true) {
            await Util.sleep(3000);
            
            const [pass, button, approved] = await Promise.all([
                pagePartalWallet.$('[data-testid="unlock-password"]'),
                pagePartalWallet.$('[data-testid="confirm-btn"]'),
                pagePartalWallet.$('[data-testid="confirm-footer-button"]')
            ]);

            if (pass) {
                //await pagePartalWallet.waitForSelector('[data-testid="unlock-password"]')
                await ElementService.typeInput(pagePartalWallet, '[data-testid="unlock-password"]', 'hunghung')
                await Util.sleep(5000)
                await pagePartalWallet.keyboard.press("Enter");
            }

            if (button) {
               // await pagePartalWallet.waitForSelector('[data-testid="confirm-btn"]')
                await ElementService.clickButton(pagePartalWallet, '[data-testid="confirm-btn"]')
            }

            if (approved) {
                //await pagePartalWallet.waitForSelector('[data-testid="confirm-footer-button"]')
                await ElementService.clickButton(pagePartalWallet, '[data-testid="confirm-footer-button"]')
                break;
            }
        }

    }
    static async ApproveMetaWallet(close = false) {
        let page
        async function Await() {
            while (true) {
                page = await PageService.findPageByUrl('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/')
                if (page.check) {
                    console.log(page.url)
                    break
                }
                await Util.sleep(1000)
            }
        }
        await Await()
        const pagePartalWallet = await PageService.getTargetPage(page.url)

        while (true) {
            const button = await pagePartalWallet.$('[data-testid="confirmation-submit-button"]');
            if (!button) {
                const isDisabled = await button.evaluate((btn) => btn.disabled);
                if (!isDisabled) {
                    await button.click()
                    await Util.sleep(15000)
                    break;
                }
            }
            await Util.sleep(5000)
            // <button class="button btn--rounded btn-primary" data-testid="confirmation-submit-button">Approve</button>
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
    static async CreatePhantomWallet(close = false) {
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
        var teget = null
        async function Await() {

            while (true) {
                teget = await PageService.findPageByUrl('chrome-extension://bfnaelmomeimhlpmgjnjophhpkkoljpa')
                if (teget.check) {
                    console.log("tim thấy")
                    break
                }
                await Util.sleep(1000)
            }
        }
        await Await()
        const pagePartalWallet = await PageService.getTargetPage(teget.url)

        await ElementService.HandlefindAndClickElement(
            pagePartalWallet,
            '//*[@id="root"]/main/div[2]/div/div[2]/button[2]',
            20
        )
        await ElementService.HandlefindAndClickElement(
            pagePartalWallet,
            '//*[@id="root"]/main/div[2]/div/div[2]/button[3]',
            20
        )
        await ElementService.HandlefindAndClickElementText(
            pagePartalWallet,
            'Solana',
            20
        )
        //await pagePartalWallet.keyboard.press("ArrowDown");
        await pagePartalWallet.keyboard.press("Enter");
        await Util.sleep(5000)
        await ElementService.HandlefindAndTypeElement(
            pagePartalWallet,
            '//*[@id="root"]/main/div[2]/form/div/section/div[2]/input',
            'hunghung',
            20
        )

        await ElementService.HandlefindAndTypeElement(
            pagePartalWallet,
            '//*[@id="root"]/main/div[2]/form/div/section/div[3]/textarea',
            `${globalState.workerData.mnemonic}`,
            20
        )
        await ElementService.HandlefindAndClickElement(
            pagePartalWallet,
            '//*[@id="root"]/main/div[2]/form/button',
            20
        )
        await ElementService.HandlefindAndTypeElement(
            pagePartalWallet,
            '//*[@id="root"]/main/div[2]/form/div/section/div[2]/input',
            'hunghung',
            20
        )
        await Util.sleep(5000)

        await ElementService.HandlefindAndTypeElement(pagePartalWallet, `//input[@data-testid="onboarding-form-password-input"]`, 'hunghung')
        await ElementService.HandlefindAndTypeElement(pagePartalWallet, `//input[@data-testid="onboarding-form-confirm-password-input"]`, 'hunghung')
        await ElementService.HandlefindAndClickElement(
            pagePartalWallet,
            '//*[@id="root"]/main/div[2]/form/div[2]/span/input',
            20
        )

        await ElementService.HandlefindAndClickElement(
            pagePartalWallet,
            '//*[@id="root"]/main/div[2]/form/button',
            20
        )
        // await Util.sleep(10000)
        // await ElementService.HandlefindAndClickElement(
        //     pagePartalWallet,
        //     '//*[@id="root"]/main/div[2]/form/button',
        //     20
        // )
        //*[@id="root"]/main/div[2]/form/button
        //*[@id="root"]/main/div[2]/form/div[1]/div[2]/input
        //*[@id="root"]/main/div[2]/form/div[1]/div[2]/input

    }
    static async Create(close = false) {
        var create = null
        async function Await() {
            while (true) {
                create = await PageService.findPageByUrl('chrome-extension://bfnaelmomeimhlpmgjnjophhpkkoljpa/onboarding.html')
                if (create.check) {
                    console.log("tim thấy")
                    break
                }
                await Util.sleep(3000)
            }
        }
        await Await()
        const page = await PageService.getTargetPage(create.url)
        await page.close()
        
        while (true) {
            
            const pagePartalWallet = await PageService.openNewPage('chrome-extension://bfnaelmomeimhlpmgjnjophhpkkoljpa/onboarding.html')
            await ElementService.HandlefindAndClickElement(
                pagePartalWallet,
                '//*[@id="root"]/main/div[2]/div/div[2]/button[1]',
            )

            while (true) {
                const check = await ElementService.HandlefindAndElementText(pagePartalWallet, 'You will use this to unlock your wallet.', 1)
                if (check) {
                    break;
                }
                const button = await pagePartalWallet.$('[data-testid="create-manual-seed-phrase"]');
                if (button) {
                    await button.click()
                    break;
                }
                await Util.sleep(500)
            }
            let attemptCount = 0; // Khởi tạo biến đếm số lần thử

            while (attemptCount < 6) { // Giới hạn số lần lặp tối đa là 6
                const passwordInput = await pagePartalWallet.$('[data-testid="onboarding-form-password-input"]');
                if (passwordInput) {
                    await passwordInput.type('Hunghung123');
                }

                const confirmPasswordInput = await pagePartalWallet.$('[data-testid="onboarding-form-confirm-password-input"]');
                if (confirmPasswordInput) {
                    await confirmPasswordInput.type('Hunghung123');
                }

                // Kiểm tra xem cả hai input đã có giá trị chưa
                if (passwordInput && confirmPasswordInput) {
                    break; // Thoát khỏi vòng lặp nếu cả hai trường đều đã điền giá trị
                }

                // Tăng biến đếm sau mỗi lần lặp
                attemptCount++;

                await Util.sleep(1000);
                console.log("Chưa qua các input", attemptCount);
            }

            while (true) {
                const checkboxChecked = await pagePartalWallet.$('[data-testid="onboarding-form-terms-of-service-checkbox"][aria-checked="true"]');
                const button = await pagePartalWallet.$('[data-testid="onboarding-form-submit-button"]');

                if (button && checkboxChecked) {
                    await button.click();
                    break;
                }

                await Util.sleep(500);
                console.log("Chưa qua các onboarding-form-submit-button");

                // Nếu checkbox chưa được chọn, click vào checkbox đó
                const check = await pagePartalWallet.$('[data-testid="onboarding-form-terms-of-service-checkbox"][aria-checked="false"]');
                if (check) {
                    await check.click();
                    continue;
                }
            }
            await Util.sleep(5000)
            const values = await pagePartalWallet.evaluate(() => {
                const inputs = [];
                for (let i = 0; i <= 11; i++) {
                    const input = document.querySelector(`[data-testid="secret-recovery-phrase-word-input-${i}"]`);
                    if (input) {
                        inputs.push(input.value);
                    }
                }
                return inputs;
            });

            // Tạo chuỗi từ các giá trị đã lấy
            const secretRecoveryPhrase = values.join(' ');

            console.log('Secret Recovery Phrase:', secretRecoveryPhrase);
            const fileName = 'recovery.txt';

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
                    if (!data.includes(secretRecoveryPhrase)) {
                        // Nếu không có trong file, ghi thêm vào file mà không ghi đè
                        fs.appendFile(fileName, secretRecoveryPhrase + '\n', 'utf8', (err) => {
                            if (err) {
                                console.error('Lỗi khi ghi nội dung vào file:', err);
                            } else {
                                console.log('Đã thêm vào lịch sử clipboard:', secretRecoveryPhrase);
                            }
                        });
                    } else {
                        console.log('Nội dung đã có trong lịch sử clipboard:', secretRecoveryPhrase);
                    }
                });
            });
            await Util.sleep(3000)

            while (true) {
                const checkboxChecked = await pagePartalWallet.$('[data-testid="onboarding-form-saved-secret-recovery-phrase-checkbox"][aria-checked="true"]');

                const button = await pagePartalWallet.$('[data-testid="onboarding-form-submit-button"]');
                if (button && checkboxChecked) {
                    await button.click()
                    break;
                }
                await Util.sleep(500)
                const check = await pagePartalWallet.$('[data-testid="onboarding-form-saved-secret-recovery-phrase-checkbox"][aria-checked="false"]');
                if (check) {
                    await check.click();
                    continue;
                }
            }
            while (true) {
                const button = await ElementService.HandlefindAndElementText(pagePartalWallet, 'Get Started', 1)
                if (!button) {
                    break;
                }
                await ElementService.HandlefindAndClickElement(
                    pagePartalWallet,
                    '//*[@id="root"]/main/div[2]/form/button',
                    1
                )
                await Util.sleep(500)
            }
        }
        //chrome-extension://bfnaelmomeimhlpmgjnjophhpkkoljpa/popup.html




        // await ElementService.HandlefindAndClickElement(
        //     pagePartalWallet,
        //     '//*[@id="root"]/main/div[2]/form/div[2]/span/input',
        //     20
        // )

        // await ElementService.HandleWaitForSelectorClickElement(
        //     pagePartalWallet,
        //     '#root > main > div._175sik91._51gazn1x._51gazn37._51gazn18p._51gazn5r > form > div.sc-fotOHu.sc-fKVqWL.sc-fDMmqs.dXUaCU.kHNXmD.iUHtmT > span > input[type=checkbox]',
        //     20
        // )
        // await Util.sleep(5000)
        // await ElementService.HandlefindAndClickElement(
        //     pagePartalWallet,
        //     '//*[@id="root"]/main/div[2]/form/button',
        //     20
        // )
        // //await PhantomWallet.CreatePhantomWallet()

        // const pagePartal = await PageService.openNewPage('chrome-extension://bfnaelmomeimhlpmgjnjophhpkkoljpa/popup.html')
        // await ElementService.HandlefindAndClickElement(
        //     pagePartal,
        //     '//*[@id="root"]/div/div/section/div/div[1]/p',
        //     20
        // )
        // await Util.sleep(5000)
        // await ElementService.HandlefindAndClickElement(
        //     pagePartal,
        //     '//*[@id="root"]/div/div/div[6]/div/div[3]/div[3]/div/div',
        //     20
        // )
        // await Util.sleep(5000)

        // await ElementService.HandlefindAndClickElement(
        //     pagePartal,
        //     '//*[@id="root"]/div/div/div[6]/div/div/div[2]/div/button',
        //     20
        // )

        // await Util.sleep(5000)




        // await ElementService.HandlefindAndClickElement(
        //     pagePartal,
        //     '//*[@id="root"]/div/div/div[6]/div/div/div[2]/div[2]/button[1]',
        //     20
        // )
        // await ElementService.HandlefindAndTypeElement(
        //     pagePartal,
        //     '//*[@id="root"]/div/div/div[6]/div/div/div/form/div[5]/input',
        //     'hunghung',
        //     20
        // )

        // await ElementService.HandlefindAndClickElement(
        //     pagePartal,
        //     '//*[@id="root"]/div/div/div[6]/div/div/div/div/div[1]/span/input',
        //     20
        // )

        // await ElementService.HandlefindAndClickElement(
        //     pagePartal,
        //     '//*[@id="root"]/div/div/div[6]/div/div/div/div/div[2]/button[2]',
        //     20
        // )
        // //*[@id="root"]/div/div/div[6]/div/div/div/section/div[2]/div[1]/input
        // //*[@id="root"]/div/div/div[6]/div/div/div/section/div[2]/div[12]/input
        // await Util.sleep(5000)


        // lấy private key

        // await ElementService.HandlefindAndClickElement(
        //     pagePartal,
        //     '//*[@id="root"]/div/div/div[6]/div/div/div[2]/div[2]/button[2]',
        //     20
        // )
        // await ElementService.HandlefindAndTypeElement(
        //     pagePartal,
        //     '//*[@id="root"]/div/div/div[6]/div/div/div/form/div[5]/input',
        //     'hunghung',
        //     20
        // )

        // await ElementService.HandlefindAndClickElement(
        //     pagePartal,
        //     '//*[@id="root"]/div/div/div[6]/div/div/div/div/div[1]/span/input',
        //     20
        // )

        // await ElementService.HandlefindAndClickElement(
        //     pagePartal,
        //     '//*[@id="root"]/div/div/div[6]/div/div/div/div/div[2]/button[2]',
        //     20
        // )
        // await ElementService.HandlefindAndClickElement(
        //     pagePartal,
        //     '//div[@data-testid="select-private-key-eip155:1"]',
        //     20
        // )
        // await Util.sleep(5000)
        // await ElementService.HandlefindAndClickElement(
        //     pagePartal,
        //     '//*[@id="root"]/div/div/div[6]/div/div/div/section/div[2]/button',
        //     20
        // )
        // await Util.sleep(5000)
        // await ElementService.HandlefindAndClickElement(
        //     pagePartal,
        //     '//*[@id="root"]/div/div/div[6]/div/div/div/section/div[2]/button',
        //     20
        // )
        // await Util.sleep(5000)
        if (close) {
            await pagePartalWallet.close()
        }
    }
    static async Conect(close = false) {
        async function clickButton(page, btnSelector) {
            try {
                await page.waitForSelector(btnSelector, { visible: true, timeout: 10000 });
    
                const btn = await page.$(btnSelector);
                if (btn) {
                    const clicked = await page.evaluate(selector => {
                        const btn = document.querySelector(selector);
                        if (btn && btn.offsetWidth > 0 && btn.offsetHeight > 0 && !btn.disabled) {
                            btn.scrollIntoView();
                            const event = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
                            btn.dispatchEvent(event);
                            return true;  // ✅ Click thành công
                        }
                        return false;  // ❌ Nút bị ẩn hoặc disabled
                    }, btnSelector);
    
                    if (!clicked) {
                        console.error("Không thể click vì nút bị ẩn hoặc vô hiệu hóa:", btnSelector);
                        return false;
                    }
                    return true;
                } else {
                    console.error("Không tìm thấy nút:", btnSelector);
                    return false;
                }
            } catch (error) {
                console.error("Lỗi khi click:", error);
                return false;
            }
        }
    
        try {
            async function Await() {
                while (true) {
                    const page = await PageService.findPageByUrl('chrome-extension://bfnaelmomeimhlpmgjnjophhpkkoljpa/notification.html')
                    if (page.check) {
                        console.log("tim thấy")
                        const pagePartalWallet = await PageService.getTargetPage('chrome-extension://bfnaelmomeimhlpmgjnjophhpkkoljpa/notification.html')
    
                        if (!pagePartalWallet) return;

                        if (await ElementService.HandleWaitForSelectorTypeElement(
                            pagePartalWallet,
                            '#unlock-form > div > div:nth-child(3) > div > input',
                            'hunghung',
                            1
                        )) {
                            await pagePartalWallet.keyboard.press("Enter");
                        }
                        await ElementService.HandleWaitForSelectorClickElement(pagePartalWallet,
                            '#root > div > div.sc-htJRVC.Ifjhy > div > div.sc-jRQBWg.sc-pVTFL.EgSbv.cZzoXH > div > button.sc-fFeiMQ.gbIHNA',
                            1
                        )
                        
                        if (close) {
                            await pagePartalWallet.close();
                        }
                
                    }
                    if (globalState.isPageClosed) {
                        console.log("thoat runPhantomWallet");
                        return;
                    }
                    await Util.sleep(1000)
                }
            }
            await Await()
        } catch (error) {
            console.log('Lỗi:', error);
            return false;
        }
    }
    static async Confirm(close = false) {
        const pagePartalWallet = await PageService.getTargetPage('chrome-extension://bfnaelmomeimhlpmgjnjophhpkkoljpa/notification.html')
        async function clickButton(page, btnSelector) {
            try {
                await page.waitForSelector(btnSelector, { visible: true, timeout: 10000 });
        
                const btn = await page.$(btnSelector);
                if (btn) {
                    const clicked = await page.evaluate(selector => {
                        const btn = document.querySelector(selector);
                        if (btn && btn.offsetWidth > 0 && btn.offsetHeight > 0 && !btn.disabled) {
                            btn.scrollIntoView();
                            const event = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
                            btn.dispatchEvent(event);
                            return true;  // ✅ Click thành công
                        }
                        return false;  // ❌ Nút bị ẩn hoặc disabled
                    }, btnSelector);
        
                    if (!clicked) {
                        console.error("Không thể click vì nút bị ẩn hoặc vô hiệu hóa:", btnSelector);
                        return false;
                    }
                    return true;
                } else {
                    console.error("Không tìm thấy nút:", btnSelector);
                    return false;
                }
            } catch (error) {
                console.error("Lỗi khi click:", error);
                return false;
            }
        }
        async function typeInput(page, selector, text) {
            try {
                await page.waitForSelector(selector, { visible: true, timeout: 10000 });
                console.log(selector)
                const input = await page.$(selector);
                if (input) {
                    console.log("vo")
                    await input.click({ clickCount: 3 }); // Chọn toàn bộ văn bản trước khi nhập
                    await page.type(selector, text); // Gõ văn bản với độ trễ 50ms
                    return true; // Nhập thành công
                } else {
                    console.error("Không tìm thấy ô input:", selector);
                    return false;
                }
            } catch (error) {
                console.error("Lỗi khi nhập dữ liệu:", error);
                return false;
            }
        }
        try {
            await clickButton(pagePartalWallet, '[data-testid="primary-button"]')
            // await ElementService.HandlefindAndClickElement(
            //     pagePartalWallet,
            //     '//*[@id="root"]/div/div[1]/div/div[2]/div/button[2]',
            //     1
            // )
        } catch (error) {
            console.log('loi', error)
        }

        if (close) {
            await pagePartalWallet?.close()
        }
    }
    static async download() {
        // https://chromewebstore.google.com/search/OKX%20Wallet

        const pagePartalWallet = await PageService.openFirstPage('https://chromewebstore.google.com/search/OKX%20Wallet')
        await ElementService.HandlefindAndClickElement(
            pagePartalWallet,
            '//*[@id="yDmH0d"]/c-wiz[1]/div/div/div/main/section/div[1]/div[1]/a',
            20
        )
        await Util.sleep(10000)
        await ElementService.HandleWaitForSelectorClickElement(
            pagePartalWallet,
            '#yDmH0d > c-wiz > div > div > main > div > section.VWBXhd > section > div.OdjmDb > div > button',
            20
        )

        await Util.sleep(10000)
        await PageService.findAllUrl()
    }
}

module.exports = PhantomWallet;