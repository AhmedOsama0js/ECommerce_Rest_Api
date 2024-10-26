// const SubCategoryModel = require("../Models/subCategoryModel");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const subCategoryModel = require("../Models/subCategoryModel");

// GET
exports.getSubCategory = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 20;
  const skip = (page - 1) * limit;
  const { categoryId } = req.params;
  let filterPrams = {};
  if (categoryId) {
    filterPrams = { category: categoryId };
  }

  const subCategory = await subCategoryModel
    .find(filterPrams , { __v: 0, slug: 0 })
    .skip(skip)
    .limit(limit)
    .populate({ path: "category", select: "name" });
  res.status(200).json({ length: subCategory.length, page, data: subCategory });
});

//GET By ID
exports.getSubCategoryById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await subCategoryModel
    .findById(id)
    .select("-slug -__v")
    .populate({ path: "category", select: "name" });
  if (!subCategory) {
    return next(new ApiError(`not found subCategory by this id (${id})`, 404));
  }
  res.status(200).json({ data: subCategory });
});

// POST
exports.createSubCategory = asyncHandler(async (req, res) => {
  const { name, category } = req.body;
  let subCategory = await subCategoryModel.create({
    name,
    slug: slugify(name),
    category,
  });

  subCategory = await subCategory.populate({
    path: "category",
    select: "name",
  });

  const result = subCategory.toObject();
  delete result.slug;
  delete result.__v;
  res.status(201).json({ data: result });
});

// PUT
exports.editSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;
  console.log(category);

  let subCategory = await subCategoryModel.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name), category },
    { new: true }
  );

  if (!subCategory) {
    return next(new ApiError(`not found subCategory by this id (${id})`, 404));
  }
  console.log("Before populate:", subCategory);

  subCategory = await subCategory.populate({
    path: "category",
    select: "name",
  });

  console.log("After populate:", subCategory);

  const result = subCategory.toObject();
  delete result.slug;
  delete result.__v;
  res.status(200).json({ data: result });
});

// DELETE;
exports.deleteSubCategoryById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await subCategoryModel.findByIdAndDelete(id);
  if (!subCategory) {
    return next(new ApiError(`not found subCategory by this id (${id})`, 404));
  }
  res.status(204).json({});
});
