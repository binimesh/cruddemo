const jwt = require("jsonwebtoken");
const sendEmail = require("../helpers/forgotPassEmail")

const User = require("../models/User");
const {registrationValidation,login} = require("../middleware/validation");

//signup
const signUp = async (req,res, next) => {
    const {error,value} = registrationValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const emailExist = await User.findOne({email:req.body.email});
    if(emailExist) return res.status(400).send({message: "Email already exits!"});

    try{
        const newUser = await createUserObj(req);
        const saveUser = await User.create(newUser);

        return res.status(200).send({message: "User created sucsfully!",user: saveUser});
    } catch (err) {
        return res.status(400).send({error: "User not created!",error: err});
    }
};

const createUserObj = async (req) => {
    return {
        firstName: req.body.findName,
        lastName: req.body.findName,
        email: req.body.findName,
        password: bycrpt.hashSync(req.body.password),
    };
}

//validation to be changed to middleware.
//dboperation can be specifed as services folder.
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

  const forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
  
    if (!user) {
      return next(new ErrorHander("User not found", 404));
    }
  
    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();
  
    await user.save({ validateBeforeSave: false });
  
    const resetPasswordUrl = `${req.protocol}://${req.get(
      "host"
    )}/password/reset/${resetToken}`;
  
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;
  
    try {
      await sendEmail({
        email: user.email,
        subject: `Ecommerce Password Recovery`,
        message,
      });
  
      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email} successfully`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
  
      await user.save({ validateBeforeSave: false });
  
      return next(new ErrorHander(error.message, 500));
    }
  });
  
  // Reset Password
  const resetPassword = catchAsyncErrors(async (req, res, next) => {
    // creating token hash
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
  
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
  
    if (!user) {
      return next(
        new ErrorHander(
          "Reset Password Token is invalid or has been expired",
          400
        )
      );
    }
  
    if (req.body.password !== req.body.confirmPassword) {
      return next(new ErrorHander("Password does not password", 400));
    }
  
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
  
    await user.save();
  
    sendToken(user, 200, res);
  });  

  module.exports = {signUp,deleteUser,updateUser,logIn,resetPassword,forgotPassword};