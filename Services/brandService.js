const brandModel = require("../Models/brandModel");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");

// GET
exports.getBrands = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 20;
  const skip = (page - 1) * limit;
  const brand = await brandModel
    .find({}, { __v: 0, slug: 0 })
    .skip(skip)
    .limit(limit);
  res.status(200).json({ length: brand.length, page, data: brand });
});

//GET By ID
exports.getBrandById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await brandModel.findById(id).select("-slug -__v");
  if (!brand) {
    return next(new ApiError(`not found brand by this id (${id})`, 404));
  }
  res.status(200).json({ data: brand });
});

// POST
exports.createBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const brand = await brandModel.create({ name, slug: slugify(name) });
  const result = brand.toObject();
  delete result.slug;
  delete result.__v;
  res.status(201).json({ data: result });
});


// PUT
exports.editBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const brand = await brandModel.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );
  if (!brand) {
    return next(new ApiError(`not found brand by this id (${id})`, 404));
  }

  const result = brand.toObject();
  delete result.slug;
  delete result.__v;

  res.status(200).json({ data: result });
});

// DELETE
exports.deleteBrandById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await brandModel.findByIdAndDelete(id);
  if (!brand) {
    return next(new ApiError(`not found brand by this id (${id})`, 404));
  }
  res.status(204).json();
});
