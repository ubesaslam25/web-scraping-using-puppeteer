var jsdom = require('jsdom');
$ = require('jquery')(new jsdom.JSDOM().window);
const fs = require('fs');
const https = require('https');

const scraperObject = {
	async scraper(browser, data){
        let page = await browser.newPage();
		for(var i=0; i<data.length; i++){
			await page.goto(data[i]['url']);
			// await page.setDefaultNavigationTimeout(0);
			let pageData = await page.evaluate(() => {
				let browserUrl = document.URL;
				let splitUrl = browserUrl.split('/');
				let link = splitUrl[splitUrl.length-1];
				let heading = document.querySelectorAll('h1');
				let paragraph = document.querySelectorAll('p');
				let image = document.querySelectorAll('img');
				let video = document.querySelectorAll('source');
				let paraArray = [];
				let headArray = [];
				let imgArray = [];
				let videoArray = [];
				let finalData = [];
				heading.forEach((headingItem) => {
					headArray.push(headingItem.innerText);
				});
				paragraph.forEach((paragraphItem) => {
					paraArray.push(paragraphItem.innerText);
				});
				image.forEach((imageItem) => {
					if(imageItem.getAttribute('src').toString().search('https:') != -1){
						imgArray.push(imageItem.getAttribute('src'));
					}
				});
				video.forEach((videoItem) => {
					if(videoItem.getAttribute('src')){
						if(videoItem.getAttribute('src').toString().search('https:') != -1){
							videoArray.push(videoItem.getAttribute('src'));
						}
					}
				});
				finalData.push({'heading': headArray, 'paragraph': paraArray, 'images': imgArray, 'link': link, 'browserLink': browserUrl, 'videos': videoArray});
				return finalData;
			});
			let fileName = pageData[0].link;
			let dir = fileName;
			pageData[0].images.forEach((imageUrl, index) => {
				https.get(imageUrl, res => {
					let imgDir = 'images';
					if (!fs.existsSync('news/'+dir+'/'+imgDir)){
						fs.mkdirSync('news/'+dir+'/'+imgDir);
					}
					const stream = fs.createWriteStream('news/'+dir+'/'+imgDir+'/download-image-'+index+'.png');
					res.pipe(stream);
					stream.on('finish', () => {
						stream.close();
					})
				})
			});
			pageData[0].videos.forEach((videoUrl, index) => {
				https.get(videoUrl, res => {
					let videoDir = 'videos';
					if (!fs.existsSync('news/'+dir+'/'+videoDir)){
						fs.mkdirSync('news/'+dir+'/'+videoDir);
					}
					const stream = fs.createWriteStream('news/'+dir+'/'+videoDir+'/download-video-'+index+'.mp4');
					res.pipe(stream);
					stream.on('finish', () => {
						stream.close();
					})
				})
			});
			pageData = JSON.stringify(pageData, null, 2);
			if (!fs.existsSync('news/'+dir)){
				fs.mkdirSync('news/'+dir);
			}
			fs.writeFileSync('news/'+dir+'/'+fileName+".json", pageData);
			await page.screenshot({ path: 'news/'+dir+'/screenshot.png' });
		}
	}
}

module.exports = scraperObject;