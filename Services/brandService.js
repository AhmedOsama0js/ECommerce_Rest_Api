const brandModel = require("../Models/brandModel");
const factory = require("./FactoresApi/Factors");

// GET
exports.getBrands = factory.getAllItems(brandModel);
//GET By ID
exports.getBrandById = factory.getOneItem("brand", brandModel);
// POST
exports.createBrand = factory.createOne(brandModel);

// PUT
exports.editBrand = factory.updateOne("brand", brandModel);

// DELETE
exports.deleteBrandById = factory.deleteOne("brand", brandModel);
