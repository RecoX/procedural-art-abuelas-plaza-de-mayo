const { createCanvas, loadImage } = require('canvas')
const fs = require('fs')

const BACKGROUND_NFTS = 'C:/git-projects/ao20/ao20-api/resources/graphs/AO20_NFT_Frame1.png';

exports.render = async function render(objectToRender, width, height, renderNumber = 1, useBackground = false) {
    const canvas = createCanvas(width, height);

    const ctx = canvas.getContext("2d");
    
    if (useBackground) {
        //Ponemos el fondo de pantalla
        const BACKGROUND_NFTS_IMAGE_LOADED = await loadImage(BACKGROUND_NFTS)
        ctx.drawImage(BACKGROUND_NFTS_IMAGE_LOADED, 0, 0);
    }


    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const scalingFactor = 2.5;

    //Si ponemos fondo de pantalla, el pj se pone en el centro
    const globalOffset = {
        x: useBackground ? 56 : 0,
        y: useBackground ? 60 : 0,
    };

    for await (const img of objectToRender) {
        const offsetX = globalOffset.x + img.offsetX * scalingFactor;
        const offsetY = globalOffset.y + img.offsetY * scalingFactor;
        const w = img.w * scalingFactor;
        const h = img.h * scalingFactor;

        const imageLoaded = await loadImage(img.imgSrc)
        ctx.drawImage(imageLoaded, img.sx, img.sy, img.w, img.h, offsetX, offsetY, w, h);
    }

    //Creo el nombre del archivo en base a los componentes de la imagen.
    let nameFileCanvas = `Render${renderNumber}--`;
    objectToRender.forEach(el => {
        if (el.type === "head") {
            nameFileCanvas = nameFileCanvas +`${el.type}${el.fileName}-SX${el.sx}-SY${el.sy}--`
        }else {
            nameFileCanvas = nameFileCanvas + `${el.type}${el.fileName}--`
        }
    })

    //Borro los ultimos 2 --
    nameFileCanvas =  nameFileCanvas.substring(0, nameFileCanvas.length - 2);

    return {
        nameFileCanvas, 
        canvas
    }
    
    //Guardo la imagen en el disco sincronicamente.
    // const canvasBuffer = canvas.toBuffer('image/png');
    // fs.writeFileSync(`./output-nft/${fileName}.png`, canvasBuffer);
};

exports.prepareRenderGameItem = function prepareRenderGameItem(gameItemData) {
    return {
        fileName: gameItemData.fileName,
        imgSrc: `${process.env.RECURSOS_PATH}/${gameItemData.fileName}.png`,
        w: gameItemData.width,
        h: gameItemData.height,
        sx: gameItemData.initialPositionX,
        sy: gameItemData.initialPositionY,
        offsetX: 0,
        offsetY: 0,
        type: "item",
    };
}

exports.prepareRenderCharacter = function prepareRenderCharacter(headData, bodyData, weaponData, shieldData, helmetData) {
    let objectToRender = []

    const body = {
        fileName: bodyData.fileName,
        imgSrc: `${process.env.RECURSOS_PATH}/${bodyData.fileName}.png`,
        w: bodyData.width,
        h: bodyData.height,
        sx: bodyData.initialPositionX,
        sy: bodyData.initialPositionY,
        offsetX: 10,
        offsetY: 16,
        type: "body",
    };
    objectToRender.push(body)

    if (weaponData) {
        const weapon = {
            fileName: weaponData.fileName,
            imgSrc: `${process.env.RECURSOS_PATH}/${weaponData.fileName}.png`,
            w: weaponData.width,
            h: weaponData.height,
            sx: weaponData.initialPositionX,
            sy: weaponData.initialPositionY,
            offsetX: 12,
            offsetY: parseInt(bodyData.headOffsetY) + 52,
            type: "weapon",
        };

        objectToRender.push(weapon);
    }

    if (shieldData) {
        const shield = {
            fileName: shieldData.fileName,
            imgSrc: `${process.env.RECURSOS_PATH}/${shieldData.fileName}.png`,
            w: shieldData.width,
            h: shieldData.height,
            sx: shieldData.initialPositionX,
            sy: shieldData.initialPositionY,
            offsetX: 10,
            offsetY: parseInt(bodyData.headOffsetY) + 53,
            type: "shield",
        };

        objectToRender.push(shield);
    }

    if (headData) {
        const head = {
            fileName: headData.fileName,
            imgSrc: `${process.env.RECURSOS_PATH}/${headData.fileName}.png`,
            w: headData.width,
            h: headData.height,
            sx: headData.initialPositionX,
            sy: headData.initialPositionY,
            offsetX: parseInt(bodyData.headOffsetX) + 10,
            offsetY: parseInt(bodyData.headOffsetY) + 32,
            type: "head",
        };
        objectToRender.push(head);
    }

    if (helmetData) {
        const helmet = {
            fileName: helmetData.fileName,
            imgSrc: `${process.env.RECURSOS_PATH}/${helmetData.fileName}.png`,
            w: helmetData.width,
            h: helmetData.height,
            sx: helmetData.initialPositionX,
            sy: helmetData.initialPositionY,
            offsetX: parseInt(bodyData.headOffsetX) + 10,
            offsetY: parseInt(bodyData.headOffsetY) + 32,
            type: "helmet",
        };

        objectToRender.push(helmet)
    }

    return objectToRender;
}