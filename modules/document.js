const { Schema, model } = require("mongoose");

const documentSchema = new Schema({
  title: {
    type: String,
    default: "",
  },
  content: {
    type: String,
    default: "",
  },
  coverImage: {
    type: String,
    default: "",
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  isdeleted: {
    type: Boolean,
    default: false,
  },
});

const Document = model("document", documentSchema);

module.exports = { Document };
