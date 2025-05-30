const { sleep } = require('../../util/util')
const PuppeteerAuto = require('../../browser/auto_chromium');

const Auto = PuppeteerAuto();


const GoogleHandler = function () {
    let xpath
    return {
        removeDiacritics: function(str) {
            return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        },
        randomLastNames: [
            // Họ tiếng Việt
            'Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh',
            'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ',
            'Ngô', 'Dương', 'Lý', 'Đinh', 'Mai', 'Trương', 'Tăng',
            'Châu', 'Tôn', 'Cao', 'Văn', 'Kiều', 'Tạ', 'Tống',
            'Lâm', 'Quách', 'Chu', 'Thái', 'Nghiêm', 'Trịnh',
            'Hà', 'Đoàn', 'Phùng', 'Nguyễn Văn', 'Nguyễn Thị',
            // Họ tiếng Anh
            'Smith', 'Johnson', 'Williams', 'Brown', 'Jones',
            'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
            'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
            'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
            'Thompson', 'White', 'Harris', 'Lewis', 'Clark',
            'Walker', 'Hall', 'Young', 'Allen', 'King', 'Wright',
            'Scott', 'Green', 'Adams', 'Baker', 'Carter', 'Collins'
        ],
        randomFirstNames: [
            // Tên tiếng Việt
            'An', 'Bảo', 'Cường', 'Duy', 'Hà', 'Hải', 'Hạnh',
            'Hoàng', 'Hương', 'Khánh', 'Linh', 'Minh', 'Ngọc',
            'Phúc', 'Quân', 'Thảo', 'Thành', 'Thiên', 'Thu',
            'Trung', 'Tú', 'Việt', 'Vy', 'Hậu', 'Khoa', 'Thư',
            'Phương', 'Tâm', 'Thanh', 'Huy', 'Đạt', 'Quang',
            'Giang', 'Lan', 'Tiến', 'Lệ', 'Hoa', 'Bích', 'Vân',
            'Kim', 'Hiền', 'Nhung', 'Nga', 'Tấn', 'Nhật', 'Long',
            // Tên tiếng Anh
            'James', 'Mary', 'John', 'Patricia', 'Robert',
            'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth',
            'David', 'Barbara', 'Richard', 'Susan', 'Joseph',
            'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen',
            'Daniel', 'Matthew', 'Anthony', 'Donald', 'Mark',
            'Paul', 'Steven', 'Andrew', 'Kevin', 'Brian', 'George',
            'Edward', 'Ronald', 'Jason', 'Jeffrey', 'Amy', 'Deborah',
            'Sharon', 'Michelle', 'Laura', 'Emily', 'Emma', 'Sophia',
            'Oliver', 'Mia', 'Benjamin', 'Ethan', 'Lucas', 'Harper'
        ],
        randomDays: Array.from({ length: 28 }, (_, i) => (i + 1).toString()),
        randomYears: Array.from({ length: 30 }, (_, i) => (1960 + i).toString()),
        generateRandomEmail: async function () {
            const firstName = this.randomFirstNames[Math.floor(Math.random() * this.randomFirstNames.length)];
            const lastName = this.randomLastNames[Math.floor(Math.random() * this.randomLastNames.length)];

            const cleanedFirstName =  this.removeDiacritics(firstName);
            const cleanedLastName =  this.removeDiacritics(lastName);
        
            const randomNumber = Math.floor(Math.random() * 100);
            // Tạo email
            const timestamp = Date.now();
            let mail = `${cleanedLastName}${timestamp}`;

// Lấy đúng 28 ký tự
            mail = mail.slice(0, 28);
            return {
                mail: mail,
                firstName: firstName,
                lastName: lastName
            }
        },
        getRandomItem(array) {
            return array[Math.floor(Math.random() * array.length)];
        },
        Login: async function (page, email, pass_email, browser) {
            const pages = await browser.pages();
            await page.goto('https://accounts.google.com/signin', {
                waitUntil: 'load',
            });
            await pages[0].close();
            await page.waitForSelector("#identifierId", { visible: true });
            await page.type("#identifierId", email);
            await page.waitForSelector("#identifierNext > div > button", { visible: true });
            await page.click("#identifierNext > div > button");
            await page.waitForSelector("#password > div.aCsJod.oJeWuf > div > div.Xb9hP > input", { visible: true });
            await page.type("#password > div.aCsJod.oJeWuf > div > div.Xb9hP > input", pass_email, { delay: 100 });
            await page.waitForSelector("#passwordNext > div > button", { visible: true });
            await page.click("#passwordNext > div > button");
        },
        
        Create: async function (browser) {
            const randomYear = Math.floor(Math.random() * 12) + 1990;
            const randomDay = Math.floor(Math.random() * 28) + 1;

            const {mail, firstName, lastName} = await this.generateRandomEmail();
            await sleep(5000)
            const page = await Auto.openNewPage(browser, 'https://accounts.google.com/signin')

            await this.HandlefindAndClickElement(
                page,
                '//*[@id="yDmH0d"]/c-wiz/div/div[3]/div/div[2]/div/div/div[1]/div/button',
                10
            )

            await this.HandleWaitForSelectorClickElement(
                page,
                '#yDmH0d > c-wiz > div > div.JYXaTc > div > div.FO2vFd > div > div > div:nth-child(2) > div > ul > li:nth-child(2)',
                10
            )
            await page.waitForNavigation({ waitUntil: 'networkidle0' });


            await this.HandlefindAndTypeElement(
                page,
                '//*[@id="firstName"]',
                firstName,
                10
            )

            await this.HandlefindAndTypeElement(
                page,
                '//*[@id="lastName"]',
                lastName,
                10
            )
            await page.keyboard.press("Enter");

            await page.waitForNavigation({ waitUntil: 'networkidle0' });
            await this.HandlefindAndClickElement(
                page,
                '//*[@id="month"]',
                10
            )

            const randomTimes = Math.floor(Math.random() * 12) + 1;

            for (let i = 0; i < randomTimes; i++) {
                await page.keyboard.press("ArrowDown");
            }

            await page.keyboard.press("Enter");

            await this.HandleWaitForSelectorTypeElement(
                page,
                '#day',
                `${randomDay}`,
                10
            )

            await this.HandleWaitForSelectorTypeElement(
                page,
                '#year',
                `${randomYear}`,
                10
            )

            await this.HandlefindAndClickElement(
                page,
                '//*[@id="gender"]',
                10
            )

            const randomGender = Math.floor(Math.random() * 2) + 1

            for (let i = 0; i < randomGender; i++) {
                await page.keyboard.press("ArrowDown");
            }

            await page.keyboard.press("Enter");

            await this.HandlefindAndClickElement(
                page,
                '//*[@id="birthdaygenderNext"]/div/button',
                10
            )

            // await page.waitForNavigation({ waitUntil: 'networkidle0' }); 


            if (await Auto.ElementByTextXpath(page, 'Use your existing email', 2)) {


                await this.HandlefindAndClickElement(
                    page,
                    '//*[@id="yDmH0d"]/c-wiz/div/div[3]/div/div[2]/div/div/button',
                    10
                )
                await this.HandlefindAndTypeElement(
                    page,
                    "//input[@name='Username']",
                    `${mail}@gmail.com`,
                    10
                )

                await page.keyboard.press("Enter");
            } else {
                await this.HandlefindAndTypeElement(
                    page,
                    '//*[@id="identifierId"]',
                    `${mail}`,
                    10
                )


                await page.keyboard.press("Enter");
            }

            //await page.waitForNavigation({ waitUntil: 'networkidle0' }); 

            await this.HandlefindAndTypeElement(
                page,
                "//input[@name='Passwd']",
                'hunghung',
                10
            )

            await this.HandlefindAndTypeElement(
                page,
                "//input[@name='PasswdAgain']",
                'hunghung',
                10
            )

            await page.keyboard.press("Enter");
        },

        SearchGmailByKey: async function (pageGmail, search) {
            xpath = await Auto.ElementXpath(pageGmail, '//*[@id="gs_lc50"]/input[1]', 50);
            await xpath.type(search);
            await sleep(5000)
            await pageGmail.keyboard.press("Enter");
            await sleep(5000)
            await pageGmail.keyboard.press("ArrowDown");

            const activeElement = await pageGmail.evaluate(() => {
                const focusedElement = document.activeElement;
                if (focusedElement) {
                    focusedElement.click();
                    return focusedElement.innerText;
                }
                return null;
            });

            if (activeElement) {
                console.log("Đã click vào phần tử:", activeElement);
            } else {
                console.log("Không tìm thấy phần tử để click.");
            }
            await sleep(5000)
            const emailContent = await pageGmail.evaluate(() => {
                return document.body.innerText;
            });
            console.log("Nội dung email:", emailContent);
            const verificationCodes = [...emailContent.matchAll(/\b\d{6}\b/g)].map(match => match[0]);

            if (verificationCodes.length > 0) {
                console.log("Các mã xác thực:", verificationCodes);
            } else {
                console.log("Không tìm thấy mã xác thực nào.");
            }
            return { verificationCodes: verificationCodes[verificationCodes.length - 1] }
        },

        findAndOpenMailLink: async function (page, browser, keyword) {
            const link = await page.evaluate((keyword) => {
                const anchor = Array.from(document.querySelectorAll("a")).find(a =>
                    a.href && a.href.includes(keyword)
                );
                return anchor ? anchor.href : null;
            }, keyword);

            if (link) {
                console.log("Đã tìm thấy liên kết:", link);
                const newPage = await browser.newPage();
                await newPage.goto(link, { waitUntil: "load" });
                console.log("Đã mở liên kết:", link);
                return link;
            } else {
                console.error(`Không tìm thấy liên kết chứa từ khóa '${keyword}' trong email.`);
                return null;
            }
        }







        
        ,
        HandlefindAndClickElement: async function (page, xpath, timeout = 3) {
            const element = await Auto.ElementXpath(page, xpath, timeout);
            if (element.found) {
                await element.element.click();
                await element.element.focus();
                await sleep(3000)
                await page.keyboard.down('Control');
                await page.keyboard.press('V');
                await page.keyboard.up('Control');
                return true;
            }
            return false;
        },

        HandleCoppyAndClickElement: async function (page, xpath, timeout = 3) {
            const element = await Auto.ElementXpath(page, xpath, timeout);
            if (element.found) {
                await element.element.click();
                return true;
            }
            return false;
        },

        HandleWaitForSelectorClickElement: async function (page, xpath, timeout = 3) {
            const element = await Auto.ElementWaitForSelector(page, xpath, timeout);
            if (element.found) {
                await element.element.click();
                return true;
            }
            return false;
        },

        HandleWaitForSelectorTypeElement: async function (page, xpath, input, timeout = 3) {
            const element = await Auto.ElementWaitForSelector(page, xpath, timeout);
            if (element.found) {
                await element.element.click();
                await element.element.evaluate(el => el.value = '');
                await element.element.type(input);
                return true;
            }
            return false;
        },

        HandlefindAndElementText: async function (page, text, timeout = 2) {
            const element = await Auto.ElementByTagAndTextXpath(page, text, timeout);
            if (element.found) {
                return true;
            }
            return false;
        },
        
        HandlefindAndTypeElement: async function (page, xpath, input, timeout = 10) {
            const element = await Auto.ElementXpath(page, xpath, timeout);
            if (element.found) {
                await element.element.click();
                await element.element.evaluate(el => el.value = '');
                await element.element.type(input);
                return true;
            }
            return false;
        },

    };
};

module.exports = GoogleHandler;
