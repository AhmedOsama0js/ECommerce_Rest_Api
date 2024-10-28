const categoryModel = require("../Models/categoryModel");
const factory = require("./FactoresApi/Factors");

// GET
exports.getCategory = factory.getAllItems(categoryModel);

//GET By ID
exports.getCategoryById = factory.getOneItem("category", categoryModel);

// POST
exports.createCategory = factory.createOne(categoryModel);

// PUT
exports.editCategory = factory.updateOne("category", categoryModel);

// DELETE
exports.deleteCategoryById = factory.deleteOne("category", categoryModel);
