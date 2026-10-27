// Optional network smoke test. It never writes hardware details or query results.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('fs'),path=require('path');let context;
(async()=>{
 const root=__dirname,ext=path.join(root,'extension');context=await chromium.launchPersistentContext(fs.mkdtempSync(path.join(root,'.test-profile-native-')),{executablePath:process.env.BRAVE_PATH||'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe',headless:true,viewport:{width:1440,height:1000},args:[`--disable-extensions-except=${ext}`,`--load-extension=${ext}`]});
 const page=await context.newPage();await page.goto('https://www.google.com/?hl=en');await page.locator('#still-home').waitFor({timeout:15000});
 await page.locator('#hardware-frame').scrollIntoViewIfNeeded();await page.frameLocator('#hardware-frame').locator('#ram-model').filter({hasText:'GB physical memory'}).waitFor({timeout:10000});console.log('Live Google homepage and private hardware frame: PASS');
 await page.getByRole('searchbox',{name:'Search Google',exact:true}).fill('albert');await page.locator('.suggestion-photo').first().waitFor({timeout:15000});console.log('Live rich Google autocomplete: PASS');
 await page.goto('https://www.google.com/search?q=example');await page.waitForFunction(()=>document.documentElement.dataset.grTheme||location.pathname.startsWith('/sorry')||document.querySelector('iframe[src*="recaptcha"],#captcha-form'),{},{timeout:10000});
 if(await page.evaluate(()=>location.pathname.startsWith('/sorry')||!!document.querySelector('iframe[src*="recaptcha"],#captcha-form')))console.log('Live result navigation: SKIP — Google challenge left untouched; controlled result tests cover the palette.');else console.log('Live native Google result palette: PASS');await context.close();
})().catch(async error=>{console.error('Live native smoke check:',error.message);if(context)await context.close();process.exitCode=1;});
