const productModel = require("../Models/productModel");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");

// GET
exports.getProducts = asyncHandler(async (req, res) => {
  const queryString = { ...req.query };
  const extracts = ["sort", "limit", "page"];
  extracts.forEach((elt) => delete queryString[elt]);


  if (queryString.ratingQuantity) {
    if (queryString.ratingQuantity.lte) {
      queryString.ratingQuantity.lte = Number(queryString.ratingQuantity.lte);
    }
    if (queryString.ratingQuantity.gte) {
      queryString.ratingQuantity.gte = Number(queryString.ratingQuantity.gte);
    }
  }

  let queryStr = JSON.stringify(queryString).replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`
  );

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;

  let mongooseQuery = productModel
    .find(JSON.parse(queryStr), { __v: 0, slug: 0 }) 
    .skip(skip)
    .limit(limit)
    .populate({ path: "category", select: "name" })
    .populate({ path: "subCategory", select: "name" })
    .populate({ path: "brand", select: "name" });

  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    mongooseQuery = mongooseQuery.sort(sortBy);
  } else {
      mongooseQuery = mongooseQuery.sort("-createAt");
  }

  const product = await mongooseQuery;
  res.status(200).json({ length: product.length, page, data: product });
});

//GET By ID
exports.getProductById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await productModel.findById(id).select("-slug -__v");
  if (!product) {
    return next(new ApiError(`not found product by this id (${id})`, 404));
  }
  res.status(200).json({ data: product });
});

// POST
exports.createProduct = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.name);
  const product = await productModel.create(req.body);
  const result = product.toObject();
  delete result.slug;
  delete result.__v;
  res.status(201).json({ data: product });
});

// PUT
exports.editProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.name) {
    req.body.slug = slugify(req.body.name);
  }
  const product = await productModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  if (!product) {
    return next(new ApiError(`not found product by this id (${id})`, 404));
  }

  const result = product.toObject();
  delete result.slug;
  delete result.__v;

  res.status(200).json({ data: result });
});

// DELETE
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await productModel.findByIdAndDelete(id);
  if (!product) {
    return next(new ApiError(`not found product by this id (${id})`, 404));
  }
  res.status(204).json();
});
