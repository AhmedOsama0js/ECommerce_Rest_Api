const categoryModel = require("../Models/categoryModel");
const factory = require("./FactoresApi/Factors");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { uploadSignalImage } = require("../middleware/uploadImageMiddleware");

// upload image
exports.uploadCategoryImage = uploadSignalImage("image");

exports.resizeImg = asyncHandler(async (req, res, next) => {
  const fileName = `category-${Date.now()}-${Math.round(
    Math.random() * 1e9
  )}.webp`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("webp")
      .webp({ quality: 80 })
      .toFile(`uploads/categories/${fileName}`);
    req.body.image = fileName;
  }

  next();
});

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
