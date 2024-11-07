const multer = require("multer");
const ApiError = require("../utils/ApiError");

const multerOptions = () => {
  const multerStorage = multer.memoryStorage();
  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only images allowed ", 400));
    }
  };
  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
  return upload;
};

exports.uploadSignalImage = (fieldName) => multerOptions().single(fieldName);

exports.uploadALotOfImages = (fieldsArray) =>
  multerOptions().fields(fieldsArray);
