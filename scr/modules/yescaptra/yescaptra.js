const { PageService, ElementService } = require('../../config/import.service');
const { Util } = require('../../config/import.util');
const util = new Util()
require('dotenv').config();

class Yescaptra {
    static async Setup() {
        // await Yescaptra.Setup()
        const extensions = await PageService.openFirstPage('chrome://extensions/')
        await ElementService.HandleClickElementShadown(
            extensions,
            'document.querySelector("body > extensions-manager").shadowRoot.querySelector("#items-list").shadowRoot.querySelector("#bodfmchopdnaoipdndkdgkikhlljnohh").shadowRoot.querySelector("#dev-reload-button").shadowRoot.querySelector("#maskedImage")'
        );
        const pageYesCaptra = await PageService.openFirstPage('chrome-extension://bodfmchopdnaoipdndkdgkikhlljnohh/option/index.html')
        PageService.acceptAlert(pageYesCaptra)

        await ElementService.HandlefindAndTypeElement(
            pageYesCaptra,
            '//*[@id="app"]/div/div[2]/div/div[3]/div/div[2]/input',
            process.env.YESCAPTRA,
            10
        )
        await ElementService.HandlefindAndTypeElement(
            pageYesCaptra,
            '//*[@id="app"]/div/div[2]/div/div[4]/div/div[2]/input',
            'https://api.yescaptcha.com',
            10
        )
        await ElementService.HandlefindAndTypeElement(
            pageYesCaptra,
            '//*[@id="app"]/div/div[2]/div/div[5]/div/div[2]/input',
            '200',
            10
        )
        await ElementService.HandlefindAndTypeElement(
            pageYesCaptra,
            '//*[@id="app"]/div/div[2]/div/div[8]/div/div[2]/input',
            '10',
            10
        )
        await ElementService.HandlefindAndTypeElement(
            pageYesCaptra,
            '//*[@id="app"]/div/div[2]/div/div[11]/div/div[2]/input',
            '500',
            10
        )
        await ElementService.HandlefindAndTypeElement(
            pageYesCaptra,
            '//*[@id="app"]/div/div[2]/div/div[14]/div/div[2]/input',
            '100',
            10
        )
        await ElementService.HandlefindAndTypeElement(
            pageYesCaptra,
            '//*[@id="app"]/div/div[2]/div/div[15]/div/div[2]/input',
            '0.1',
            10
        )

        await ElementService.waitAndClick1(
            pageYesCaptra,
            '//*[@id="app"]/div/div[2]/div/div[2]/div/div[2]/span/input'

        )
        await ElementService.waitAndClick1(
            pageYesCaptra,
            '//*[@id="app"]/div/div[2]/div/div[7]/div/div[2]/span/input'

        )
        await ElementService.waitAndClick1(
            pageYesCaptra,
            '//*[@id="app"]/div/div[2]/div/div[10]/div/div[2]/span/input'

        )
        await ElementService.waitAndClick1(
            pageYesCaptra,
            '//*[@id="app"]/div/div[2]/div/div[13]/div/div[2]/span/input'
        )
        await ElementService.waitAndClick1(
            pageYesCaptra,
            '//*[@id="app"]/div/div[2]/div/div[17]/div/div[2]/span/input'
        )
        await ElementService.HandlefindAndTypeElement(
            pageYesCaptra,
            '//*[@id="app"]/div/div[2]/div/div[19]/div/div[2]/input',
            'yesCaptcha',
            10
        )

        await ElementService.waitAndClick1(
            pageYesCaptra,
            '//*[@id="app"]/div/div[2]/div/div[20]/button',
            10
        )

        await ElementService.HandlefindAndClickElementText(
            pageYesCaptra,
            'funcatpcha',
            10
        )
        await Util.sleep(3000)
        await ElementService.waitAndClick1(
            pageYesCaptra,
            '//*[@id="app"]/div/div[2]/div/div[2]/div/div[2]/span/input',
            10
        )

        await ElementService.HandlefindAndTypeElement(
            pageYesCaptra,
            '//*[@id="app"]/div/div[2]/div/div[6]/div/div[2]/input',
            '3000',
            10
        )

        await ElementService.waitAndClick1(
            pageYesCaptra,
            '//*[@id="app"]/div/div[2]/div/div[7]/button',
            10
        )
    }
}

module.exports = Yescaptra;