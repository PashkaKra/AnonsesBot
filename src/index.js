const TelegramApi = require("node-telegram-bot-api");
const {loadImage, createCanvas} = require('canvas');
const fs = require("fs");
//const axios = require("axios");
//const {convertFile} = require('convert-svg-to-png');
//const canvg = require('canvg');
//const sharp = require("sharp");
const dotenv = require("dotenv");
dotenv.config();

const TOKEN = process.env.TOKEN;

const bot = new TelegramApi(TOKEN, {polling: true});

bot.on('message', (msg) => {
	const text = msg.text;
	const chatId = msg.chat.id;
	console.log(msg);
	//bot.sendMessage(chatId, `you wrote me ${text}`);
});

bot.on('photo', async msg => {
	const chatId = msg.chat.id;
	const caption = msg.caption;
	let k = 1;
	if(caption){
		const [Title, date] = caption.split('  ', 2);
		let [koef, title] = Title.split("|", 2);
		if(!title){
			title = koef;
			koef = 1;
		}
		console.log(`koef = ${koef}`);
		console.log(`tit = ${title}`);

		if(title && date){
		const [title1, title2] = title.split('/', 2);
		const [dateStart, separator, dateEnd] = date.split(/([-и]|(?:AND|OR))/, 3);
	 
		photoId = msg.photo[msg.photo.length-1].file_id

		const image = await bot.getFile(photoId);
		const FILE_PATH = `https://api.telegram.org/file/bot${TOKEN}/${image.file_path}`;
		const Img1 = await loadImage(FILE_PATH);
		const Img2 = await loadImage(`src/public/logo/logo.png`);
		//const width = msg.photo[msg.photo.length-1].width;
		//const height = msg.photo[msg.photo.length-1].height+150;
		const width = Img1.width;
		//const height = Img1.height+150;
		const height = Img1.height;
		//const k = width >= height ? (height - width)+width*14/100 : (width - height)*width/2200;
		const k = (height - width)+width*14/100;
		//console.log(k);
		//const k = 150;
		const canvas = createCanvas(width, height+width*14/100);
		const context = canvas.getContext('2d');
		context.drawImage(Img1, 0, 0, width, height);
		//context.drawImage(Img2, 0, Img1.height+150-width, width, width);
		//context.drawImage(Img2, 0, height+k-width, width, width);
		context.drawImage(Img2, 0, k, width, width);
		context.fillStyle = "#e85d17";
		//context.font = `${width/(title.length*1.3)}pt Ralev001`;
		if(!title2){
			context.font = `${width*koef/18}pt Ralev001`;
			context.fillText(title, 25, height-koef+width/10);
		}
		else{
			context.font = `${width*koef/26}pt Ralev001`;
			context.fillText(title1, 25, height+width/15);
			context.fillText(title2, 25, height+width/8.5);
		}

		context.fillStyle = "white";
		if(!separator){
    		context.font = `${width/17}pt Ralev001`;
			context.fillText(dateStart, width/1.29, height+width*0.08);
		}
		else{
			context.font = `${width/20}pt Ralev001`;
			context.fillText(dateStart, width/1.24, height+width*0.03);
			context.fillText(dateEnd, width/1.24, height+width*0.105);
			if(separator === 'и'){
				context.fillText(separator, width/1.31, height+width*0.06);
			}
			else{
				context.fillText('[', width/1.29, height+width*0.06);
			}
		}
		console.log(height+k-width);
		const imgBuffer = canvas.toBuffer('image/jpeg');
		fs.writeFileSync(`src/public/${image.file_path}`, imgBuffer);
		bot.sendPhoto(chatId, fs.readFileSync(`src/public/${image.file_path}`));
		}
		else{console.log('title or date is err');}
	}
	else{console.log('err');}
});
