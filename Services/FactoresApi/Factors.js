const asyncHandler = require("express-async-handler");
const ApiError = require("../../utils/ApiError");
const ApiFeatures = require("../../utils/ApiFeatures/ApiFeatures");

exports.deleteOne = (name, Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);
    if (!document) {
      return next(new ApiError(`not found ${name} by this id (${id})`, 404));
    }
    res.status(204).json();
  });


exports.updateOne = (name, Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document) {
      return next(
        new ApiError(`not found ${name} by this id (${req.params.id})`, 404)
      );
    }
    const result = document.toObject();
    delete result.__v;
    res.status(200).json({ data: result });
  });


  exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const document = await Model.create(req.body);
    const result = document.toObject();
    delete result.__v;
    res.status(201).json({ data: result });
  });


  exports.getOneItem = (name, Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findById(req.params.id).select("-__v");
    if (!document) {
      return next(
        new ApiError(`not found ${name} by this id (${req.params.id})`, 404)
      );
    }
    res.status(200).json({ data: document });
  });


  exports.getAllItems = (Model) =>
  asyncHandler(async (req, res) => {
    const documentLength = await Model.countDocuments();
    const features = new ApiFeatures(Model.find(), req.query)
      .filtration()
      .searchByKeyword()
      .sort()
      .paginate(documentLength);
    const { mongooseQuery, paginateResult } = features;

    const document = await mongooseQuery.select("-__v");

    res
      .status(200)
      .json({ length: document.length, paginateResult, data: document });
  });
