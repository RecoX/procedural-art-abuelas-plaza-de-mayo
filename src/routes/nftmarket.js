"use strict";

const express = require("express");
const router = express.Router();
const fs = require("fs");
const { createCanvas, loadImage } = require('canvas')

function invertColor(hex) {
	if (hex.indexOf('#') === 0) {
		hex = hex.slice(1);
	}
	// convert 3-digit hex to 6-digits.
	if (hex.length === 3) {
		hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
	}
	if (hex.length !== 6) {
		return 'Invalid HEX color';
	}
	// invert color components
	var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
		g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
		b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
	// pad each with zeros and return
	return '#' + padZero(r) + padZero(g) + padZero(b);
}

function padZero(str, len) {
	len = len || 2;
	var zeros = new Array(len).join('0');
	return (zeros + str).slice(-len);
}

function makeRandomColor() {
	return "#" + ((1 << 24) * Math.random() | 0).toString(16)
}

const usedColors = []
const BACKGROUND_NFTS = 'C:/git-projects/madres-plaza-mayo/resources/graphs/Madres.png';

async function createFileMetadata(backgroundColor, foregroundColor, renderNumber) {
	try {
		let metadata = {
			name: `Grandson #${renderNumber}`,
			description: "https://en.wikipedia.org/wiki/Grandmothers_of_the_Plaza_de_Mayo",
			image: `https://elmesonhostigado.com/nfts/ao20-1st-naked-war/${renderNumber}.png`,
			external_url: "https://www.abuelas.org.ar",
			attributes: []
		};

		metadata.attributes.push({
			trait_type: "Background Color",
			value: backgroundColor
		})

		metadata.attributes.push({
			trait_type: "Foreground Color",
			value: foregroundColor
		})

		metadata.attributes.push({
			trait_type: "Kidnapped ",
			value: renderNumber
		})


		//Guardamos el archivo .json
		fs.writeFileSync(`./output-nft/${renderNumber}.json`, JSON.stringify(metadata))
	}
	catch (err) {
		console.log("Error guardando metadata", err);
	}
}

async function createImageSolidBackground(renderNumber) {
	let randomColor = makeRandomColor()
	let invertRandomColor = invertColor(randomColor);
	
	while (invertRandomColor === 'Invalid HEX color') {
		console.log('ENTRO AL ERROR DE HEX')
		randomColor = makeRandomColor();
		invertRandomColor = invertColor(randomColor);
	}

	if (!usedColors.includes(randomColor)) {
		usedColors.push(randomColor);

		const canvas = createCanvas(335, 230);
		const ctx = canvas.getContext("2d");

		const BACKGROUND_NFTS_IMAGE_LOADED = await loadImage(BACKGROUND_NFTS)
		
		//Primero cargo la imagen y renderizo el canvas
		ctx.drawImage(BACKGROUND_NFTS_IMAGE_LOADED, 0, 0);
		//Luego vuelvo a renderizar por que el truco para cambiar de color sino no funciona
		//Mas info aca: https://stackoverflow.com/questions/45706829/change-color-image-in-canvas
		ctx.drawImage(canvas, 0, 0);

		// set composite mode
		ctx.globalCompositeOperation = "source-in";

		// draw color
		ctx.fillStyle = invertRandomColor;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		

		//Una ves que cambiamos de color de la imagen hay que volver a este modo
		ctx.globalCompositeOperation = "source-over";

		//Le ponemos el numero de render ###
		ctx.font = '18px Montserrat';
		ctx.fillText(`#${renderNumber}`, 6, 15);
		ctx.fillStyle = invertRandomColor;

		// Change the globalCompositeOperation to destination-over so that anything
		// that is drawn on to the canvas from this point on is drawn at the back
		// of what's already on the canvas
		ctx.globalCompositeOperation = 'destination-over';
		
		// Ponemos el fondo de la imagen solido
		ctx.fillStyle = randomColor;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		//Guardo metadata
		createFileMetadata(randomColor, invertRandomColor, renderNumber);

		//Guardo imagen.
		canvas.createPNGStream({ compressionLevel: 9 });
		fs.writeFileSync(`./output-nft/${renderNumber}.png`, canvas.toBuffer('image/png'));

	}
}

router.get("/createImageSolidBackground", async (req, res, next) => {
	try {
		for (let renderNumber = 1; renderNumber <= 10000; renderNumber++) {
			createImageSolidBackground(renderNumber)
		}
		res.send(`TERMINADO IMAGENES FONDO LISO`);
		
	} catch (err) {
		console.log("ERROR:", err)
		next(err);
	}
});

async function createImageGradientBackground(renderNumber) {
	let randomColor = makeRandomColor()
	let invertRandomColor = invertColor(randomColor);
	
	while (invertRandomColor === 'Invalid HEX color') {
		console.log('ENTRO AL ERROR DE HEX')
		randomColor = makeRandomColor();
		invertRandomColor = invertColor(randomColor);
	}

	if (!usedColors.includes(randomColor)) {
		usedColors.push(randomColor);

		const canvas = createCanvas(335, 230);
		const ctx = canvas.getContext("2d");

		const BACKGROUND_NFTS_IMAGE_LOADED = await loadImage(BACKGROUND_NFTS)
		
		//Primero cargo la imagen y renderizo el canvas
		ctx.drawImage(BACKGROUND_NFTS_IMAGE_LOADED, 0, 0);
		//Luego vuelvo a renderizar por que el truco para cambiar de color sino no funciona
		//Mas info aca: https://stackoverflow.com/questions/45706829/change-color-image-in-canvas
		ctx.drawImage(canvas, 0, 0);

		// set composite mode
		ctx.globalCompositeOperation = "source-in";

		// draw color
		ctx.fillStyle = "#FFFFFF";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		

		//Una ves que cambiamos de color de la imagen hay que volver a este modo
		ctx.globalCompositeOperation = "source-over";

		//Le ponemos el numero de render ###
		ctx.font = '18px Montserrat';
		ctx.fillText(`#${renderNumber}`, 6, 15);
		ctx.fillStyle = "#FFFFFF";

		// Change the globalCompositeOperation to destination-over so that anything
		// that is drawn on to the canvas from this point on is drawn at the back
		// of what's already on the canvas
		ctx.globalCompositeOperation = 'destination-over';

		//Creamos gradiente
		// Ponemos el fondo de la imagen gradiente
		const grd = ctx.createLinearGradient(0, 0, 200, 0);
		grd.addColorStop(0, randomColor); 
		// grd.addColorStop(0, invertColor(randomColor));
		grd.addColorStop(1, invertRandomColor);

		// Fill with gradient
		ctx.fillStyle = grd;
		ctx.fillRect(0, 0, canvas.width, canvas.height);		
		
		//Guardo metadata
		createFileMetadata(randomColor, invertRandomColor, renderNumber);

		//Guardo imagen.
		canvas.createPNGStream({ compressionLevel: 9 });
		fs.writeFileSync(`./output-nft/${renderNumber}.png`, canvas.toBuffer('image/png'));

	}
}

router.get("/createImageGradientBackground", async (req, res, next) => {
	try {
		for (let renderNumber = 10000; renderNumber <= 20000; renderNumber++) {
			createImageGradientBackground(renderNumber)
		}
		
		res.send(`TERMINADO IMAGENES FONDO GRADIENTE`);

	} catch (err) {
		console.log("ERROR:", err)
		next(err);
	}
});

async function createImageGradientForeground(renderNumber) {
	let randomColor = makeRandomColor()
	let invertRandomColor = invertColor(randomColor);
	
	while (invertRandomColor === 'Invalid HEX color') {
		console.log('ENTRO AL ERROR DE HEX')
		randomColor = makeRandomColor();
		invertRandomColor = invertColor(randomColor);
	}
	
	if (!usedColors.includes(randomColor)) {
		usedColors.push(randomColor);
	
		const canvas = createCanvas(335, 230);
		const ctx = canvas.getContext("2d");
	
		const BACKGROUND_NFTS_IMAGE_LOADED = await loadImage(BACKGROUND_NFTS)
		
		//Primero cargo la imagen y renderizo el canvas
		ctx.drawImage(BACKGROUND_NFTS_IMAGE_LOADED, 0, 0);
		//Luego vuelvo a renderizar por que el truco para cambiar de color sino no funciona
		//Mas info aca: https://stackoverflow.com/questions/45706829/change-color-image-in-canvas
		ctx.drawImage(canvas, 0, 0);
	
		// set composite mode
		ctx.globalCompositeOperation = "source-in";
	
		const grd = ctx.createLinearGradient(0, 0, 290, 0);
		grd.addColorStop(0, randomColor); 
		grd.addColorStop(1, invertRandomColor);
	
		// Fill with gradient
		ctx.fillStyle = grd;
	
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	
		//Una ves que cambiamos de color de la imagen hay que volver a este modo
		ctx.globalCompositeOperation = "source-over";
	
		//Le ponemos el numero de render ###
		ctx.font = '18px Montserrat';
		ctx.fillText(`#${renderNumber}`, 6, 15);
		ctx.fillStyle = invertRandomColor;
	
		// Change the globalCompositeOperation to destination-over so that anything
		// that is drawn on to the canvas from this point on is drawn at the back
		// of what's already on the canvas
		ctx.globalCompositeOperation = 'destination-over';
	
		// Ponemos el fondo de la imagen solido y blanco
		ctx.fillStyle = "#FFFFFF";
		ctx.fillRect(0, 0, canvas.width, canvas.height);		
	
		//Guardo metadata
		createFileMetadata(randomColor, invertRandomColor, renderNumber);
	
		//Guardo imagen.
		canvas.createPNGStream({ compressionLevel: 9 });
		fs.writeFileSync(`./output-nft/${renderNumber}.png`, canvas.toBuffer('image/png'));
	}
}


router.get("/createImageGradientForeground", async (req, res, next) => {
	try {

		for (let renderNumber = 20000; renderNumber <= 30000; renderNumber++) {
			createImageGradientForeground(renderNumber);
		}
		
		res.send(`TERMINADO IMAGENES CON FRENTE DE GRADIENTE`);

	} catch (err) {
		console.log("ERROR:", err)
		next(err);
	}
});

router.get("/createImageCollectionRandom", async (req, res, next) => {
	try {	
		
		for (let renderNumber = 1; renderNumber <= 30000; renderNumber++) {
			const randomNumber = Math.random() * (12 - 1) + 1;

			if (randomNumber >= 1 && randomNumber <= 4) {
				await createImageGradientBackground(renderNumber);
			} else if (randomNumber >= 5 && randomNumber <= 8) {
				await createImageGradientForeground(renderNumber);
			} else if (randomNumber >= 9 && randomNumber <= 12) {
				await createImageSolidBackground(renderNumber);
			}else {
				await createImageGradientForeground(renderNumber);
			}
		}
		
		res.send(`TERMINADO IMAGENES RANDOM : ` + usedColors.toString());

	} catch (err) {
		console.log("ERROR:", err)
		next(err);
	}
});

router.get("/createImageCollectionRandomMissingImages", async (req, res, next) => {
	try {	
		const missingImages = [4190,4584,6638,7013,7547,8934,11561,12220,15819,16034,16216,16768,16941,17644,17763,18953,21081,21735,22101,22275,22721,23841,26111,26707,26788,26819,28388,29529];

		for (let index = 0; index <= missingImages.length; index++) {
			const randomNumber = Math.random() * (12 - 1) + 1;

			if (randomNumber >= 1 && randomNumber <= 4) {
				await createImageGradientBackground(missingImages[index]);
			} else if (randomNumber >= 5 && randomNumber <= 8) {
				await createImageGradientForeground(missingImages[index]);
			} else if (randomNumber >= 9 && randomNumber <= 12) {
				await createImageSolidBackground(missingImages[index]);
			}else {
				await createImageGradientForeground(missingImages[index]);
			}
		}
		
		res.send(`TERMINADO IMAGENES RANDOM : ` + usedColors.toString());

	} catch (err) {
		console.log("ERROR:", err)
		next(err);
	}
});


//Esta funcion existe por que por alguna razon faltaron 20/30 imagenes, quiero saber cuales son para poder corregir el problema.
router.get("/checkImagesMissing", async (req, res, next) => {
	try {
		const missingImages = [];
		let filenames = await fs.readdirSync('./output-nft');

		filenames = filenames.filter(filename => filename.includes(".json"))

		for (let index = 1; index < filenames.length; index++) {
			filenames.includes(`${index}.json`)

			if (!filenames.includes(`${index}.json`)) {
				console.log("Falta la imagen: " + index)
				missingImages.push(index);
			}
		}
		
		res.send(missingImages.toString());

	} catch (err) {
		console.log("ERROR:", err)
		next(err);
	}
});



module.exports = router;
