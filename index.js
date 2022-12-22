const browserObject = require('./browser');
const pageScraper = require('./pageScraper');
var jsdom = require('jsdom');
$ = require('jquery')(new jsdom.JSDOM().window);
global.document = new jsdom.JSDOM().window.document;

async function scrapeAll(){
	try{
        let mainUrl = 'https://www.bhaskar.com';
        let browserInstance = browserObject.startBrowser();
		let browser = await browserInstance;
        let page = await browser.newPage();
        await page.goto(mainUrl);
        // await page.setDefaultNavigationTimeout(0);
        let data = await page.evaluate(() => {
            let mainUrl = 'https://www.bhaskar.com';
            let results = [];
            let items = document.querySelectorAll('a');
            items.forEach((item) => {
                if(item.toString().search('.html') != -1){
                    results.push({
                        url:  mainUrl + item.getAttribute('href'),
                        text: item.innerText,
                    });
                }
            });
            return results;
        });
        await pageScraper.scraper(browser, data);
	}
	catch(err){
		console.log("Could not resolve the browser instance => ", err);
	}
}

module.exports = scrapeAll();