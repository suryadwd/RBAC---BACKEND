const User = require("../model/user.model");



const protectedRoute = (req, res, next) => {
  if(!req.session.user){
    return res.status(401).json({ error: "Unauthorized" });
  }
  next()
}

const isSuperAdmin = async(req, res, next) => {
  const user = await User.findById(req.session.user.id);
  // console.log(user.role)
  if(user.role !== "SUPERADMIN"){
    return res.status(401).json({ error: "Access denied. Only SuperAdmin can perform this action." });
  }
  next();
}

const isAdmin = (req, res, next) => {
  if(req.session.user.role !== "ADMIN"){
    return res.status(401).json({ error: "Access denied. Only Admin can perform this action." });
  }
  next();
}

const isAdminOrSuperAdmin = async(req, res, next) => {
  // console.log(req.session.user.id) // id of user logged in

  const user = await User.findById(req.session.user.id);

  // console.log(user.role)

  if (!["ADMIN", "SUPERADMIN"].includes(user.role)) {
    return res.status(401).json({ error: "Access denied. Only Admin or SuperAdmin can perform this action." });
  }

  next();
}

module.exports = { protectedRoute, isSuperAdmin, isAdmin, isAdminOrSuperAdmin };