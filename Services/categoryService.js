const categoryModel = require("../Models/categoryModel");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");

// GET
exports.getCategory = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 20;
  const skip = (page - 1) * limit;
  const category = await categoryModel
    .find({}, { __v: 0, slug: 0 })
    .skip(skip)
    .limit(limit);
  res.status(200).json({ length: category.length, page, data: category });
});

//GET By ID
exports.getCategoryById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await categoryModel.findById(id).select("-slug -__v");
  if (!category) {
    return next(new ApiError(`not found category by this id (${id})`, 404));
  }
  res.status(200).json({ data: category });
});

// POST
exports.createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const category = await categoryModel.create({ name, slug: slugify(name) });
  const result = category.toObject();
  delete result.slug;
  delete result.__v;
  res.status(201).json({ data: result });
});

// PUT
exports.editCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const category = await categoryModel.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );
  if (!category) {
    return next(new ApiError(`not found category by this id (${id})`, 404));
  }

  const result = category.toObject();
  delete result.slug;
  delete result.__v;

  res.status(200).json({ data: result });
});

// DELETE
exports.deleteCategoryById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await categoryModel.findByIdAndDelete(id);
  if (!category) {
    return next(new ApiError(`not found category by this id (${id})`, 404));
  }
  res.status(204).json();
});
