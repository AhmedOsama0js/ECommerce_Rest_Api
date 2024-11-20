const asyncHandler = require("express-async-handler");
const ApiError = require("../../utils/ApiError");
const ApiFeatures = require("../../utils/ApiFeatures/ApiFeatures");
const path = require("path");
const fs = require("fs");

// delete Files
const deleteFiles = (image) => {
  const parsedUrl = new URL(image).pathname;
  const imagePath = path.join(__dirname, "..", "..", "uploads", parsedUrl);
  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error("Error deleting image:", err);
    } else {
      console.log("Image deleted successfully");
    }
  });
};

exports.deleteOne = (name, Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return next(new ApiError(`not found ${name} by this id (${id})`, 404));
    }

    if (document.image || document.coverImage) {
      const image = document.image || document.coverImage;
      deleteFiles(image);
    }

    if (Array.isArray(document.images)) {
      document.images.forEach((image) => {
        deleteFiles(image);
      });
    }

    res.status(204).send();
  });

exports.updateOne = (name, Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findById(id);

    if (!document) {
      return next(
        new ApiError(`not found ${name} by this id (${req.params.id})`, 404)
      );
    }

    if (Array.isArray(req.body.images) && req.body.images.length > 0) {
      await document.images.forEach((image) => {
        deleteFiles(image);
      });
    }

    if (req.body.image || req.body.coverImage) {
      const image = document.image || document.coverImage;
      if (image) {
        deleteFiles(image);
      }
    }

    const updatedDocument = await Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    updatedDocument.save();
    const result = updatedDocument.toObject();
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

exports.getOneItem = (name, Model, populateOption) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    let query = Model.findById(id);
    if (populateOption) {
      query.populate(populateOption);
    }
    const document = await query.select("-__v");
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

    let filter = {};
    if (req.filterObject) {
      filter = req.filterObject;
    }

    const features = new ApiFeatures(Model.find(filter), req.query)
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
