const subCategoryModel = require("../Models/subCategoryModel");
const factory = require("./FactoresApi/Factors");

exports.setSubcategoryToCategoryId = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObject = filterObject;
  next();
};

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
