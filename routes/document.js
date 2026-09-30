const express = require("express");
const documentRouter = express.Router();
const multer = require("multer");
const path = require("path");
const {
  createDocument,
  removecover,
  deleteDocument,
  updateDocument,
  addCoverImage,
  getDocument,
} = require("../controllers/document");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads`));
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()} - ${file.originalname}`;
    cb(null, filename);
  },
});
const upload = multer({ storage: storage });

documentRouter.post("/create", createDocument);

documentRouter.post("/:id/cover/remove", removecover);

documentRouter.delete("/:id/trash", deleteDocument);

documentRouter.patch("/:id", updateDocument);

documentRouter.patch("/:id/cover", upload.single("coverImage"), addCoverImage);

documentRouter.get("/:id", getDocument);

module.exports = { documentRouter };
