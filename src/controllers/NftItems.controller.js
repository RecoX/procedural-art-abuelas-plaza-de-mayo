// Models
const db = require("../db");

// Exceptions
const { NotFound } = require("../utils/errors");

// Aux
const rankingsAvailable = ["elo", "level", "total_kills", "total_gold"];
const { GM_USER_NAMES } = require('../utils/enums')


/*
 * Endpoints
 */
exports.getAllItemsOnSale = async () => {
  const itemsOnSale = await db("mao__nft_items_sell").select().where("status", "ON_SALE");
  
  if(!itemsOnSale) throw new NotFound("No hay items a la venta", "ITEMS_ON_SALE_NOT_EXISTS");
  return itemsOnSale;
};

exports.getItemOnSaleById = async (saleId) => {
  const itemsOnSale = await db("mao__nft_items_sell").select().where("id", saleId).first();
  
  if(!itemsOnSale) throw new NotFound("No hay items a la venta con ese id", "ITEMS_ON_SALE_NOT_EXISTS");
  return itemsOnSale;
};



