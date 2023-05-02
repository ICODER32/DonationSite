const express = require("express");
const path = require("path");
const connectDb = require("./db/connection");
const PORT = process.env.PORT || 3000;

const app = express();
const cookieParser = require("cookie-parser");

// CSS JS FILES FOR FRONTEND ARE SERVED FROM PUBLIC FILE
const staticPath = path.join(__dirname, "./public");

// MONGODB CONNECTION
connectDb();

// midllewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(staticPath));
app.use(cookieParser());
app.set("view engine", "ejs");

// pages routes middleware
app.use("/", require("./routes/pages"));
// user routes middleware
app.use("/api/user", require("./routes/users"));
app.use("/api/items", require("./routes/items"));
app.use("/api/request", require("./routes/pickup"));
app.get("*", (req, res) => {
  res.render("error", {
    message: "Something went wrong",
  });
});
// Server Started
app.listen(PORT, () => {
  console.log(`Server Started at http://localhost:${PORT}`);
});
