const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { connectToMongodb } = require("./connect.js");
const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middleware/authentication");
const { userRouter } = require("./routes/user");
const { documentRouter } = require("./routes/document");
const { Document } = require("./modules/document");
const methodOverride = require("method-override");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = 9000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

connectToMongodb("mongodb://localhost:27017/Notion-clone").then(() =>
  console.log("Mongodb connected"),
);

io.on("connection", (socket) => {
  socket.on("title-update", ({ docId, title }) => {
    socket.broadcast.emit("title-changed", { docId, title });
  });
});

app.get("/", (req, res) => res.render("home"));

app.use("/document", documentRouter);

app.get("/dashboard", async (req, res) => {
  if (!req.user) return res.redirect("/user/signin");
  try {
    const docs = await Document.find({
      createdBy: req.user.id,
      isdeleted: { $ne: true },
    }).sort({ createdAt: -1 });
    res.render("dashboard", { docs, user: req.user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use("/user", userRouter);

server.listen(PORT, () => console.log("Server Started"));
