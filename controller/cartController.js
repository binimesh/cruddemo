const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../database/models/Cart");
const { registerValidation, loginValidation } = require("../middleware/validation");
const JWT_KEY = process.env.JWT_KEY;


// signup
const signUp = async (req, res, next) => {
  const { error, value } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const emailExist = await User.findOne({ email: req.body.email }); 
  if (emailExist) return res.status(400).send({ message: "Email already exist!" });

  try {
    const newUser = await createUserObj(req);
    const savedUser = await User.create(newUser);
    return res.status(200).send({ message: "User created successfully!", user: savedUser });
  } catch (err) {
    return res.status(400).send({ error: "User created successfully!", error: err });
  }
};

// login
const logIn = async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const foundUser = await User.findOne({ email: req.body.email }); 
  if (!foundUser) return res.status(400).send({ message: "invalid login credential" });

  try {
    const isMatch = await bcrypt.compareSync(req.body.password, foundUser.password);
    if (!isMatch) return res.status(400).send({ message: "invalid login credential" });

    // create and assign jwt
    const token = await jwt.sign({ _id: foundUser._id }, JWT_KEY);

    return res.status(200).header("auth-token", token).send({ "auth-token": token, userId: foundUser._id });
  } catch (error) {
    return res.status(400).send(error);
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    req.body.password = bcrypt.hashSync(req.body.password, 10); 
    const updatedUser = await User.findByIdAndUpdate(req.params.userId, { $set: req.body }, { new: true });

    if (!updatedUser) {
      return res.status(400).send({ message: "Could not update user" });
    }
    return res.status(200).send({ message: "User updated successfully", updatedUser });

  } catch (error) {
    return res.status(400).send({ error: "An error has occurred, unable to update user" });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.userId); 

    if (!deletedUser) {
      return res.status(400).send({ message: "Could not delete user" });
    }
    return res.status(200).send({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    return res.status(400).send({ error: "An error has occurred, unable to delete user" });
  }
};



const createUserObj = async (req) => {
  return {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
  };
}

modules.exports ={ deleteUser,updateUser,logIn,signUp };