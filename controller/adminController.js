const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const Admin = require("../models/adminModel");
const { registerValidation, loginValidation } = require("../middleware/validation");


// signup
const signUp = async (req, res, next) => {
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const emailExist = await Admin.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("email  already exist");

  try {
    const newAdmin = await createAdmin(req);
    const savedAdmin = await newAdmin.save(); 
    return res.status(200).send({ message: "User created successfully!", user: savedAdmin  });
  } catch (error) {
    return res.status(400).send(error);
  }
};

// login
const logIn = async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const foundAdmin = await Admin.findOne({ email: req.body.email }); 
  if (!foundAdmin) return res.status(400).send({ message: "Email is not found" });

  try {
    const isMatch = await bcrypt.compareSync(req.body.password, foundAdmin.password);
    if (!isMatch) return res.status(400).send({ message: "invalid password" });

    // create and assign jwt
    const token = await jwt.sign({ _id: foundAdmin._id }, JWT_SEC);
    
    return res.status(200).header("admin-token", token).send({ "admin-token": token });
  } catch (error) {
    return res.status(400).send(error);
  }
};
// Update admin
const updateAdmin = async (req, res) => {
  try {

    req.body.password = await bcrypt.hashSync(req.body.password, 10); 
    const updatedAdmin = await Admin.findByIdAndUpdate(req.params.userId, { $set: req.body }, { new: true });

    if (!updatedAdmin) {
      return res.status(400).send({ message: "Could not update user" });
    }
    return res.status(200).send({ message: "User updated successfully", updatedUser});

  } catch (error) {
    return res.status(400).send({ error: "An error has occurred, unable to update user" });
  }
};

// Delete user
const deleteAdmin = async (req, res) => {
  try {
    const deletedAdmin = await Admin.findByIdAndDelete({ _id: req.params.userId}); 

    if (!deletedAdmin) {
      return res.status(400).send({ message: "Could not delete user" });
    }
    return res.status(200).send({ message: "User deleted successfully", user: deletedAdmin});
  } catch (error) {
    return res.status(400).send({ error: "An error has occurred, unable to delete user" });
  }
};

async function createAdmin(req) {
  const hashPassword = await bcrypt.hashSync(req.body.password, 10);
  return new Admin({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hashPassword,
  });
}

modules.exports ={ deleteAdmin,updateAdmin,logIn,signUp};