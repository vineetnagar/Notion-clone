const { Document } = require("../modules/document");

async function createDocument(req, res) {
  if (!req.user) return res.redirect("/user/signin");
  try {
    const doc = await Document.create({
      title: "",
      content: "",
      createdBy: req.user.id,
    });
    res.redirect(`/document/${doc._id}`);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function removecover(req, res) {
  try {
    await Document.findByIdAndUpdate(req.params.id, { coverImage: "" });
    res.redirect(`/document/${req.params.id}`);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteDocument(req, res) {
  try {
    await Document.findByIdAndDelete(req.params.id, { isdeleted: true });
    res.redirect("/dashboard");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateDocument(req, res) {
  try {
    const { title, content } = req.body;
    await Document.findByIdAndUpdate(req.params.id, {
      title,
      content,
    });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function addCoverImage(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const coverImagePath = `/uploads/${req.file.filename}`;
    await Document.findByIdAndUpdate(req.params.id, {
      coverImage: coverImagePath,
    });
    res.redirect(`/document/${req.params.id}`);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getDocument(req, res) {
  if (!req.user) return res.redirect("/user/signin");
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Not found" });

    const docs = await Document.find({
      createdBy: req.user.id,
      isdeleted: { $ne: true },
    }).sort({ createdAt: -1 });
    res.render("document", { doc, docs, user: req.user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  createDocument,
  removecover,
  deleteDocument,
  updateDocument,
  addCoverImage,
  getDocument,
};
