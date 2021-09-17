const ini = require('ini')
const fs = require('fs')

const OBJ_DAT_PATH = './resources/dats/obj.dat';
const CABEZAS_INIT_PATH = './resources/init/cabezas.ini';
const CASCOS_INIT_PATH = './resources/init/cascos.ini';
const ARMAS_INIT_PATH = './resources/init/armas.dat';
const ESCUDOS_INIT_PATH = './resources/init/escudos.dat';
const CUERPOS_INIT_PATH = './resources/init/cuerpos.dat';
const GRAFICOS_INIT_PATH = './resources/init/graficos.ini';
const MOLDES_INIT_PATH = './resources/init/moldes.ini';
const HECHIZOS_INIT_PATH = './resources/dats/Hechizos.dat';

//Notese que pasamos todo el texto a Mayusculas para evitar problemas.
const cabezasIni = ini.decode(fs.readFileSync(CABEZAS_INIT_PATH, 'latin1').toUpperCase());
const cascosIni = ini.decode(fs.readFileSync(CASCOS_INIT_PATH, 'latin1').toUpperCase());
const armasIni = ini.decode(fs.readFileSync(ARMAS_INIT_PATH, 'latin1').toUpperCase());
const escudosIni = ini.decode(fs.readFileSync(ESCUDOS_INIT_PATH, 'latin1').toUpperCase());
const cuerposIni = ini.decode(fs.readFileSync(CUERPOS_INIT_PATH, 'latin1').toUpperCase());
const graficosIni = ini.decode(fs.readFileSync(GRAFICOS_INIT_PATH, 'latin1').toUpperCase());
const objIni = ini.decode(fs.readFileSync(OBJ_DAT_PATH, 'latin1').toUpperCase());
const moldesIni = ini.decode(fs.readFileSync(MOLDES_INIT_PATH, 'latin1').toUpperCase());
const hechizosIni = ini.decode(fs.readFileSync(HECHIZOS_INIT_PATH, 'latin1').toUpperCase());

//Se exporta para el generador de imagenes de createCharactersImagesCollection
exports.objIni = objIni;
exports.cabezasIni = cabezasIni;

const OBJ_TYPES = {
  1: "Comidas",
  2: "Armas",
  3: "Armaduras",
  4: "Árboles",
  5: "Dinero",
  6: "Puertas",
  7: "Objetos Contenedores",
  8: "Carteles",
  9: "Llaves",
  10: "Foros",
  11: "Pociones",
  12: "Libros",
  13: "Bebidas",
  14: "Lena",
  15: "Fuego",
  16: "Escudos",
  17: "Cascos",
  18: "Herramientas",
  19: "Teleports",
  20: "Muebles y Decoraciones",
  21: "Items Mágicos",
  22: "Yacimientos",
  23: "Metales",
  24: "Pergaminos de Hechizos",
  25: "Nada",
  26: "Instrumentos Musicales",
  27: "Yunque",
  28: "Fragua",
  29: "Lingotes y Gemas",
  30: "Pieles",
  31: "Embarcaciones",
  32: "Flechas",
  33: "Botellas Vacias",
  34: "Botellas Llenas",
  35: "Resistencia Mágica",
  36: "Pases",
  37: "Gemas y priedras preciosas",
  38: "Mapas",
  39: "Bolsas de Oro (contienen más de 10k de oro)",
  40: "Pozos Mágicos",
  41: "Esposas",
  42: "Raices",
  43: "Cadáveres",
  44: "Monturas",
  45: "Puestos de Entrenamiento",
  46: "Nudillos para Artes Marciales",
  47: "Anillos Habilitadores de Hechizos",
  48: "COFRES",
  50: "Objetos de donador",
};

function getGraphicDataFromIndex(index, isHelmetOrHead = false) {
  //Si el indice es 0 retornamos, por que no hay grafico.
  if (index === '0') {
    return null
  }

  //Luego busco los graficos indexados a ese body.
  let grhData = graficosIni.GRAPHICS[`GRH${index}`];

  //Hacemos un split del string para obtener toda la informacion necesaria de grafico.ini
  //Aca solo interesa la segunda posicion
  //Ejemplo: Grh51647=8-51615-51616-51617-51618-51619-51620-51621-51622-444
  grhData = grhData.split('-');

  //En caso de que se busque un helmet o head, se retorna directamente la segunda posicion, ya que es la imagen en cuestion
  //Con sus respectivos offsets.
  if (isHelmetOrHead) {
    return {
      fileName: grhData[1],
      initialPositionX: grhData[2],
      initialPositionY: grhData[3],
      width: grhData[4],
      height: grhData[5],
    }
  }

  //Este numero lo busco en el mismo archivo y saco el numero de grafico
  let grhDataPositionFront = graficosIni.GRAPHICS[`GRH${grhData[1]}`];

  //Hacemos un split una ves mas para obtener todas las propiedades del grafico;
  grhDataPositionFront = grhDataPositionFront.split('-');

  return {
    fileName: grhDataPositionFront[1],
    initialPositionX: grhDataPositionFront[2],
    initialPositionY: grhDataPositionFront[3],
    width: grhDataPositionFront[4],
    height: grhDataPositionFront[5],
  }
}

function getGraphicDataFromMoldes(index) {
  //Si el indice es 0 retornamos, por que no hay grafico.
  if (index === '0') {
    return null
  }

  //Luego busco el molde indexado.
  let moldeData = moldesIni[`MOLDE${index}`];

  return {
    initialPositionX: moldeData["X"],
    initialPositionY: moldeData["Y"],
    width: moldeData["WIDTH"],
    height: moldeData["HEIGHT"],
  }
}

exports.getBodyData = function (bodyId) {
  //Primero busco los datos del body en el archivo Cuerpos.ini
  //Walk3 = Posicion de frente
  let graficoIndexado = cuerposIni[`BODY${bodyId}`];

  //Si existe WALK3 le damos con ese, sino usamos STD, que es el MOLDE
  if (graficoIndexado && graficoIndexado.WALK3) {
    //Tengo que sanitizar el contenido de Walk3, por que hay comentarios en el archivo y el parser de INIs no 
    //Sabe contemplarlos por lo que explota todo si no hago esto
    graficoIndexado.WALK3 = graficoIndexado.WALK3.replace(/[^0-9]/g, '');
    const graphicIndexData = getGraphicDataFromIndex(graficoIndexado.WALK3);

    return {
      fileName: graficoIndexado.FILENUM,
      ...graphicIndexData,
      headOffsetX: graficoIndexado.HEADOFFSETX ? graficoIndexado.HEADOFFSETX : '0',
      headOffsetY: graficoIndexado.HEADOFFSETY ? graficoIndexado.HEADOFFSETY : '0',
    }

  } else if (graficoIndexado && graficoIndexado.STD) {
    graficoIndexado.STD = graficoIndexado.STD.replace(/[^0-9]/g, '');
    const moldeData = getGraphicDataFromMoldes(graficoIndexado.STD)

    return {
      fileName: graficoIndexado.FILENUM,
      ...moldeData,
      headOffsetX: graficoIndexado.HEADOFFSETX ? graficoIndexado.HEADOFFSETX : '0',
      headOffsetY: graficoIndexado.HEADOFFSETY ? graficoIndexado.HEADOFFSETY : '0',
    }
  }

  return null;
}

exports.getWeaponData = function (weaponId) {
  //Primero busco los datos del body en el archivo Armas.ini
  //DIR3 = Posicion de frente
  let graficoIndexado = armasIni[`ARMA${weaponId}`];

  //Por alguna rara razon el arma 2 es el default vacio, asi que hago esta valdiacion sino capum explota
  if (!graficoIndexado || !graficoIndexado.FILENUM) {
    return
  }

  //Si existe DIR3 le damos con ese, sino usamos STD, que es el MOLDE
  if (graficoIndexado && graficoIndexado.DIR3) {
    //Tengo que sanitizar el contenido de DIR3, por que hay comentarios en el archivo y el parser de INIs no 
    //Sabe contemplarlos por lo que explota todo si no hago esto
    graficoIndexado.DIR3 = graficoIndexado.DIR3.replace(/[^0-9]/g, '');
    const graphicIndexData = getGraphicDataFromIndex(graficoIndexado.DIR3);

    return {
      fileName: graficoIndexado.FILENUM,
      ...graphicIndexData,
      headOffsetX: graficoIndexado.HEADOFFSETX ? graficoIndexado.HEADOFFSETX : '0',
      headOffsetY: graficoIndexado.HEADOFFSETY ? graficoIndexado.HEADOFFSETY : '0',
    }


  } else if (graficoIndexado && graficoIndexado.STD) {
    graficoIndexado.STD = graficoIndexado.STD.replace(/[^0-9]/g, '');
    const moldeData = getGraphicDataFromMoldes(graficoIndexado.STD)

    return {
      fileName: graficoIndexado.FILENUM,
      ...moldeData,
      headOffsetX: graficoIndexado.HEADOFFSETX ? graficoIndexado.HEADOFFSETX : '0',
      headOffsetY: graficoIndexado.HEADOFFSETY ? graficoIndexado.HEADOFFSETY : '0',
    }
  }

  return null;
}

exports.getShieldData = function (shieldId) {
  //Primero busco los datos del body en el archivo Escudos.ini
  let graficoIndexado = escudosIni[`ESC${shieldId}`];

  //Por alguna rara razon el escudo 2 es el default, asi que hago esta valdiacion sino capum explota
  if (!graficoIndexado || !graficoIndexado.FILENUM) {
    return
  }


  //Como estos graficos usan moldes, directamente me da el numero de archivo
  //Tengo que sanitizar el contenido de FileNum, por que hay comentarios en el archivo y el parser de INIs no 
  //Sabe contemplarlos por lo que explota todo si no hago esto
  graficoIndexado.FILENUM = graficoIndexado.FILENUM.replace(/[^0-9]/g, '');

  const moldeData = getGraphicDataFromMoldes(graficoIndexado.STD)
  return {
    fileName: graficoIndexado.FILENUM,
    ...moldeData,
  }
}

exports.getHelmetData = function (helmetId) {
  //Primero busco los datos del body en el archivo Escudos.ini
  let graficoIndexado = cascosIni[`HEAD${helmetId}`];

  //Como estos graficos usan moldes, directamente me da el numero de archivo
  //Tengo que sanitizar el contenido de FileNum, por que hay comentarios en el archivo y el parser de INIs no 
  //Sabe contemplarlos por lo que explota todo si no hago esto
  graficoIndexado.HEAD3 = graficoIndexado.HEAD3.replace(/[^0-9]/g, '');

  return getGraphicDataFromIndex(graficoIndexado.HEAD3, true);
}

exports.getHeadData = function (headId) {
  //Primero busco los datos del body en el archivo Escudos.ini
  let graficoIndexado = cabezasIni[`HEAD${headId}`];

  //Como estos graficos usan moldes, directamente me da el numero de archivo
  //Tengo que sanitizar el contenido de FileNum, por que hay comentarios en el archivo y el parser de INIs no 
  //Sabe contemplarlos por lo que explota todo si no hago esto
  graficoIndexado.HEAD3 = graficoIndexado.HEAD3.replace(/[^0-9]/g, '');

  return getGraphicDataFromIndex(graficoIndexado.HEAD3, true);
}

exports.getSpellInformation = function (spellId) {
  
  const spellInformation = hechizosIni[`HECHIZO${spellId}`];
  if (!spellInformation) {
    console.error(`No se encontro informacion del objeto ${spellId}`);
    return;
  }

  return spellInformation;
}

exports.getGameItemInformation = (objectId) => {
  // Mas info de la libreria de INI
  // https://www.npmjs.com/package/ini?activeTab=explore

  //Anim = al valor de la animacion del grafico;
  //GrhIndex = Icono de objeto en inventario 32 x 32;

  // Primero Obtenemos informacion del objeto del archivo obj.dat
  const gameObjectInformation = objIni[`OBJ${objectId}`];
  if (!gameObjectInformation) {
    console.error(`No se encontro informacion del objeto ${objectId}`);
    return;
  }

  let bodyGraphicData, weaponGraphicData, shieldGraphicData, helmetGraphicData;

  //Segundo obtenemos el tipo de objeto que es para poder linkear los graficos correspondientes al objeto.
  switch (OBJ_TYPES[gameObjectInformation.OBJTYPE]) {
    case "Armas":
      weaponGraphicData = this.getWeaponData(gameObjectInformation.ANIM);
      break;
    case "Cascos":
      if (gameObjectInformation.ANIM) {
        helmetGraphicData = this.getHelmetData(gameObjectInformation.ANIM);
      }
      break;
    case "Escudos":
      if (gameObjectInformation.ANIM) {
        shieldGraphicData = this.getShieldData(gameObjectInformation.ANIM);
      }
      break;
    case "Armaduras":
      bodyGraphicData = this.getBodyData(gameObjectInformation.NUMROPAJE)
      break;
  }

  //Este es el icono del inventario
  let icon32x32 = graficosIni.GRAPHICS[`GRH${gameObjectInformation.GRHINDEX}`];

  //Hacemos un split del string para obtener toda la informacion necesaria de grafico.ini
  //Aca solo interesa la segunda posicion
  //Ejemplo: Grh51647=1-109-128-352-32-32
  icon32x32 = icon32x32.split('-');

  return {
    ...objIni[`OBJ${objectId}`],
    bodyGraphicData,
    weaponGraphicData,
    shieldGraphicData,
    helmetGraphicData,
    icon32x32GraphicData: {
      fileName: icon32x32[1],
      initialPositionX: icon32x32[2],
      initialPositionY: icon32x32[3],
      width: icon32x32[4],
      height: icon32x32[5],
    }
  };
};
