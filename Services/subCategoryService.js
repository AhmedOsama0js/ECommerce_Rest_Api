const subCategoryModel = require("../Models/subCategoryModel");
const factory = require("./FactoresApi/Factors");

// GET
exports.getSubCategory = factory.getAllItems(subCategoryModel);

//GET By ID
exports.getSubCategoryById = factory.getOneItem(
  "subCategory",
  subCategoryModel
);

// POST
exports.createSubCategory = factory.createOne(subCategoryModel);

// PUT
exports.editSubCategory = factory.updateOne("subCategory", subCategoryModel);

// DELETE;
exports.deleteSubCategory = factory.deleteOne("subCategory", subCategoryModel);
