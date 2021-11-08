const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.token;
    const token;

    if (
        authHeader && authHeader.startsWith("Bearer")
    ){
        token = req.headers.authorization.split(" ")[1];
    }

    if(!token) {
        return next(new ErrorResponse("Token is not valid!",401));
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SEC);

        const user = await User.findById(decoded.id);

        if(!user){
            return next(new ErrorResponse("No User found"),404);
        }

        req.user = user;

        next();
    } catch(err) {
        return next(new ErrorResponse("You are not allowed!",401));
    }
    
};

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      jwt.verify(token, process.env.JWT_SEC, async (err, user) => {
        if (err) res.status(403).json("Token is not valid!");
        req.user = user;
        next();
      });
    } else {
      return res.status(401).json("You are not allowed!");
    }
  };

  module.exports = {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
  };