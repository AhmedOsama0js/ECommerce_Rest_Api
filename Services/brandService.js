const brandModel = require("../Models/brandModel");
const factory = require("./FactoresApi/Factors");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { uploadSignalImage } = require("../middleware/uploadImageMiddleware");

exports.uploadBrandImage = uploadSignalImage("image");

exports.resizeImg = asyncHandler(async (req, res, next) => {
  const fileName = `brand-${Date.now()}-${Math.round(
    Math.random() * 1e9
  )}.webp`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("webp")
      .webp({ quality: 80 })
      .toFile(`uploads/Brands/${fileName}`);
    req.body.image = fileName;
  }
  next();
});

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
