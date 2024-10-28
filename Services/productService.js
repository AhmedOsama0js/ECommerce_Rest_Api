const productModel = require("../Models/productModel");
const factory = require("./FactoresApi/Factors");

// GET
exports.getProducts = factory.getAllItems(productModel);

//GET By ID
exports.getProductById = factory.getOneItem("product", productModel);

// POST
exports.createProduct = factory.createOne(productModel);

// PUT
exports.editProduct = factory.updateOne("product", productModel);

// DELETE
exports.deleteProduct = factory.deleteOne("product", productModel);
