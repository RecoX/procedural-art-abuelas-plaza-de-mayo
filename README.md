# Abuelas Plaza de Mayo - Procedural Art Creator.

Este es el codigo fuente con el cual se hicieron las 30.000 imagenes que se subieron al mercado NFT.

Mas informacion sobre la historia aqui:
https://en.wikipedia.org/wiki/Grandmothers_of_the_Plaza_de_Mayo


<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/MG-019-008_%28Plaza_25_de_Mayo%29.tif/lossy-page1-1024px-MG-019-008_%28Plaza_25_de_Mayo%29.tif.jpg">


## Instalacion y uso.

```
npm install
npm run dev
```

## Endpoints / Creacion de imagenes:

http://localhost:3100/nftmarket/createImageCollectionRandom

http://localhost:3100/nftmarket/createImageSolidBackground

http://localhost:3100/nftmarket/createImageGradientBackground

http://localhost:3100/nftmarket/createImageGradientForeground


Por alguna razon, a veces en la primera tirada no salen todas las imagenes, cree esta funcion para poder detectar cuales faltarian.
http://localhost:3100/nftmarket/checkImagesMissing

