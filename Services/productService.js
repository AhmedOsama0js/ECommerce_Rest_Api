const productModel = require("../Models/productModel");
const factory = require("./FactoresApi/Factors");

const multer = require("multer");
const ApiError = require("../utils/ApiError");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");

const multerStorage = multer.memoryStorage();

const multerFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ApiError("Only images allowed ", 400));
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

// upload image
exports.uploadCategoryImage = upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

exports.resizeImg = asyncHandler(async (req, res, next) => {
  if (req.files.coverImage[0].buffer) {
    const coverImageFileName = `product-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}-cover.webp`;
    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("webp")
      .webp({ quality: 80 })
      .toFile(`uploads/categories/${coverImageFileName}`);
    req.body.coverImage = coverImageFileName;
  }
});
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
