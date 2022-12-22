const puppeteer = require('puppeteer');

async function startBrowser(){
	let browser;
	try {
	    console.log("Opening the browser......");
	    browser = await puppeteer.launch({
	        headless: false,
	        args: [
				'--no-sandbox',
				'--disable-setuid-sandbox',
				'--disable-accelerated-2d-canvas',
				'--disable-gpu'
			],
	        'ignoreHTTPSErrors': true,
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
	    });
	} catch (err) {
	    console.log("Could not create a browser instance => : ", err);
	}
	return browser;
}

module.exports = {
	startBrowser
};