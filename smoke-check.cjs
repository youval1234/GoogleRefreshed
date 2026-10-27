const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('fs'),path=require('path');let context;
(async()=>{
 const ext=path.join(__dirname,'extension');
 context=await chromium.launchPersistentContext(fs.mkdtempSync(path.join(__dirname,'.test-profile-live-')),{executablePath:process.env.BRAVE_PATH||'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe',headless:true,args:[`--disable-extensions-except=${ext}`,`--load-extension=${ext}`]});
 await context.route('https://www.google.com/**',r=>r.request().resourceType()==='document'?r.fulfill({contentType:'text/html',body:'<!doctype html><title>Google</title><body>Live data smoke test</body>'}):r.continue());
 const page=await context.newPage();await page.goto('https://www.google.com/');await page.locator('#still-home').waitFor();
 await page.getByRole('searchbox',{name:'Search Google',exact:true}).fill('weather');await page.locator('.suggestion-option').first().waitFor({timeout:15000});console.log('Live Google autocomplete: PASS');await page.getByRole('searchbox',{name:'Search Google',exact:true}).fill('');
 await page.getByRole('tab',{name:'Weather',exact:true}).click();
 await page.waitForFunction(()=>{const r=document.querySelector('#still-home').shadowRoot;return r.querySelector('.temperature')||/unavailable|closed|long|Failed|source/i.test(r.querySelector('#weather-status').textContent);},{},{timeout:25000});
 const weather=await page.locator('.temperature').count()>0;
 console.log('Live weather:',weather?'PASS':'FAIL: '+await page.locator('#weather-status').textContent());
 await page.getByRole('tab',{name:'News',exact:true}).click();
 await page.waitForFunction(()=>{const r=document.querySelector('#still-home').shadowRoot;return r.querySelector('.news-item')||/below|No headlines/i.test(r.querySelector('#news-status').textContent);},{},{timeout:25000});
 const news=await page.locator('.news-item').count()>0;
 console.log('Live local news:',news?'PASS':'FAIL: '+await page.locator('#news-status').textContent());
 // Never write detected city, IP address, coordinates, or live headlines to a report.
 await context.close();if(!weather||!news)process.exitCode=1;
})().catch(async error=>{console.error(error.message);if(context)await context.close();process.exitCode=1;});
