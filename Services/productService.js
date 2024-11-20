const productModel = require("../Models/productModel");
const factory = require("./FactoresApi/Factors");

const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { uploadALotOfImages } = require("../middleware/uploadImageMiddleware");

// upload image
exports.uploadProductsImages = uploadALotOfImages([
  { name: "coverImage", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

exports.resizeImg = asyncHandler(async (req, res, next) => {
  if (!req.files) return next();
  if (req.files.coverImage && req.files.coverImage[0].buffer) {
    const coverImageFileName = `product-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}-cover.webp`;
    await sharp(req.files.coverImage[0].buffer)
      .resize(500, 500)
      .toFormat("webp")
      .webp({ quality: 80 })
      .toFile(`uploads/products/${coverImageFileName}`);
    req.body.coverImage = coverImageFileName;
  }

  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(
        asyncHandler(async (image, i) => {
          const ImagesFileNames = `product-${Date.now()}-${Math.round(
            Math.random() * 1e9
          )}-image-${i + 1}.webp`;
          await sharp(image.buffer)
            .resize(500, 500)
            .toFormat("webp")
            .webp({ quality: 80 })
            .toFile(`uploads/products/${ImagesFileNames}`);
          req.body.images.push(ImagesFileNames);
        })
      )
    );
  }
  next();
});

// GET
exports.getProducts = factory.getAllItems(productModel);

//GET By ID
exports.getProductById = factory.getOneItem("product", productModel, "reviews");

// POST
exports.createProduct = factory.createOne(productModel);

// PUT
exports.editProduct = factory.updateOne("product", productModel);

// DELETE
exports.deleteProduct = factory.deleteOne("product", productModel);
