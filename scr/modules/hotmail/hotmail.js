const globalState = require('../../config/globalState');
const { PageService, ElementService, KeyboardService } = require('../../config/import.service');
const { UtilTwitter, UtilHotmail } = require('../../config/import.util');
const Util = require('../../util/util');
require('dotenv').config();

class Hotmail {
    constructor() {}
    static async CreateHotMail() {
        const page =  await PageService.openFirstPage('https://signup.live.com/signup')
        const random = await UtilHotmail.generateRandomNameEmail()
        const pass = process.env.PASS_HOTMAIL

        if (await ElementService.HandlefindAndTypeElement(page, '//*[@id="usernameInput"]', random.mail))
            await ElementService.HandlefindAndClickElement(page, '//*[@id="nextButton"]', 10)
            console.log(`hotmail  ${globalState.workerData.profile} `,  random.mail)
        if (await ElementService.HandlefindAndTypeElement(page, '//*[@id="Password"]', pass, 20))
            await ElementService.HandlefindAndClickElement(page, '//*[@id="nextButton"]', 10)


        
        if (await ElementService.HandlefindAndTypeElement(page, '//*[@id="firstNameInput"]', random.firstName, 30)) {
            if (await ElementService.HandlefindAndTypeElement(page, '//*[@id="lastNameInput"]', random.lastName, 30))
                await ElementService.HandlefindAndClickElement(page, '//*[@id="nextButton"]', 10)
        }

        if (await ElementService.HandlefindAndClickElement(page, '//*[@id="BirthMonth"]', 30)) {
            await KeyboardService.RandomArrowDown(page, 20)
        }
 
        await ElementService.HandlefindAndTypeElement(page, '//*[@id="BirthYear"]', '2000', 30)
        await ElementService.HandlefindAndClickElement(page, '//*[@id="nextButton"]', 10)  
    }
}

module.exports = Hotmail;