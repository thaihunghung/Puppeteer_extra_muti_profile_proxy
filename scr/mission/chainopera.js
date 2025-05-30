const globalState = require("../config/globalState");
const { PageService, ElementService } = require("../config/import.service");
const { Twitter, Hotmail } = require("../config/import.social.media");
const { Util } = require("../config/import.util");
const Discord = require("../modules/discord/discord");
const PartalWallet = require("../modules/wallet/partal/partal");
const PhantomWallet = require("../modules/wallet/phantom/phantom");

async function ChainOpenMission() {
    try {     
        let isPageClosed = false
        await PhantomWallet.ImportWallet()
          const ref = 'IUOVPVA2'
          const chainopera = await PageService.openNewPage(`https://chainopera.ai/quest/?inviteCode=${ref}`)
          chainopera.on('close', async () => {
            isPageClosed = true;
          });
          await Util.sleep(5000)
          await chainopera.reload()
          await ElementService.HandlefindAndClickElement(chainopera, `//*[@id="app"]/div/main/header/div/div[2]/button`)
          await chainopera.evaluate(() => {
              const shadowHost = document.querySelector('body > onboard-v2');
              if (shadowHost) {
                  const shadowRoot = shadowHost.shadowRoot;
                  const button = shadowRoot.querySelector(
                      'section > div > div > div > div > div > div > div > div.scroll-container.svelte-1qwmck3 > div > div > div > div:nth-child(2) > button'
                  );
                  if (button) {
                      button.click(); // Click vào nút
                      console.log('Button clicked!');
                  } else {
                      console.error('Button not found!');
                  }
              } else {
                  console.error('Shadow host not found!');
              }
          });
          while (true) {
            await Promise.all([
                PhantomWallet.Conect(),
                PhantomWallet.Confirm()
            ])
            if (isPageClosed) break
              await Util.sleep(5000)
          }

    } catch (error) {
        console.log(` that bai`, error)
    } 
}

module.exports = ChainOpenMission