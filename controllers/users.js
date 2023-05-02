const User = require("../models/User");
var bcrypt = require("bcryptjs");
const signupUser = async (req, res) => {
  const { fullname, email, phone_num, type, country, city, password } =
    req.body;
  try {
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);
    const response = await User.create({
      fullname,
      email,
      phone_num,
      type,
      country,
      city,
      password: hash,
    });
    res.cookie("user_id", response._id);
    res.cookie("user_type", response.type);
    res.status(201).redirect("/");
  } catch (error) {
    console.log(error);
    res.status(400).render("error", { message: "Account Already exists!" });
  }
};
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    const verified = await bcrypt.compare(password, user.password);

    if (verified) {
      res.cookie("user_id", user._id);
      res.cookie("user_type", user.type);
      res.redirect("/profile");
    } else {
      res.status(404).json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "User not found", data: error });
  }
};
const logout = (req, res) => {
  res.clearCookie("user_id");
  res.clearCookie("user_type");
  res.redirect("/");
};
module.exports = { loginUser, signupUser, logout };
