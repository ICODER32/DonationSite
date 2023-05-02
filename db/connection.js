const mongoose = require("mongoose");

const connectDb = async () => {
  mongoose
    .connect(
      "mongodb+srv://m001-student:Ibtisam@sandbox.xuwkkn8.mongodb.net/Cyclw22?retryWrites=true&w=majority"
    )
    .then(() => {
      console.log("Database Connected");
    })
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
};

module.exports = connectDb;
