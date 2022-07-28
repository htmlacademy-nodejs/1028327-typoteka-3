'use strict';

const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);

const FILE_TYPES = [`image/png`, `image/jpeg`];
const UPLOAD_DIR = `../upload/img/`;
const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (_req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  },
});

const fileFilter = (_req, file, cb) => {
  if (FILE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({storage, fileFilter});

module.exports = upload;
