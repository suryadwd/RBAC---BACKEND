const bcrypt = require("bcryptjs");
const User = require("../model/user.model");

// signup 
const signup = async (req, res) => {

  try {
    
    // name email password from user
    const { name, email, password } = req.body;

    

    // check if all fields are filled
    if(!name || !email || !password ) return res.status(400).json({ error: "All fields are required" });
  
    // check whether user already exists
    const existingUser = await User.findOne({ email });

    // if user already exists give the error
    if(existingUser) return res.status(400).json({ error: "User already exists" });

    // const hash the password
    const hashPass = await bcrypt.hash(password, 10);

    // const save the user data
    const newUser = new User({
      name,
      email,
      password: hashPass,
    });

    // save the user
    await newUser.save();

    // session based and by writing this req.session.user.id i can get the current userId anywhere i want
    req.session.user = { id: newUser._id };

    // add the sessionId to the user document
    await User.findByIdAndUpdate(newUser._id, { sessionId: req.sessionID });

    return res.status(201).json({ message: "User registered successfully" ,success:true, sessionId: req.sessionID});

  } catch (error) {
    console.log("error in register controller");
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }

}

// login

const login = async (req, res) => {
  
try {
  
  const {email, password} = req.body

  if(!email || !password) return res.status(400).json({ error: "All fields are required" });

  const user = await User.findOne({ email });

  if(!user) return res.status(400).json({ error: "User does not exist" });

  const isMatch = await bcrypt.compare(password, user.password);

  if(!isMatch) return res.status(400).json({ error: "Password is invalid" });

  req.session.user = { id: user._id };

  // add the sessionId to the user document
  await User.findByIdAndUpdate(user._id, { sessionId: req.sessionID });

  return res.status(200).json({ message: "User logged in successfully" ,success:true,user,sessionId: req.sessionID});

} catch (error) {
  console.log("error in register controller");
  console.error(error);
  res.status(500).json({ error: "Internal Server Error" });
}

}


// logout

const logout = (req, res) => {

  req.session.destroy((err) => {
    if (err) {
      console.log("error in logout controller");
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json({ message: "User logged out successfully" ,success:true});
    }
  });

}

const home = async(req, res) => {
  const userdata = await User.findById(req.session.user.id).select("-password")
  // console.log(req.session.user.id)
  res.status(200).json({ message: " this is the homepage in which you are seeing right now " ,success:true, user:userdata});
}

const createAdmin = async (req, res) => {

  try {
    
    const {email,password, name} = req.body

    const user = await User.findOne({ email });

    if(user) return res.status(400).json({ error: "Hello superAdmin the  User already exists" });

    const hashPass = await bcrypt.hash(password, 10);

    const newAdmin = new User({email, password: hashPass, name, role:"ADMIN"});

    await newAdmin.save();

    

    return res.status(200).json({ message: "SuperAdmin created a  admin successfully" ,success:true});

  } catch (error) {
    console.log("error in createAdmin controller");
    console.error(error);
  }

}

const deleteAdmin = async (req, res) => {
  
  try {
    
    const {id} = req.body

    await User.findByIdAndDelete(id);

    return res.status(200).json({ message: "SuperAdmin deleted Admin successfully" ,success:true});

  } catch (error) {
    console.log("error in delete admin controller");
  }

}

const noOfUsers = async (req, res) => {
  try {
    const userCount = await User.countDocuments({ role: "USER" }); // count the number of users whose role is USER
    const users = await User.find({ role: "USER" }).select("name email"); // find all users whose role is USER and return only their name and email

    return res.status(200).json({ totalUsers: userCount, data: users });
  } catch (error) {
    console.log("error in noOfUsers controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const noOfAdmins = async (req, res) => {
  try {
    const adminCount = await User.countDocuments({ role: "ADMIN" }); //count the number of users whose role is ADMIN
    const admins = await User.find({ role: "ADMIN" }).select("name email"); // find all users whose role is ADMIN and return only their name and email

    return res.status(200).json({ totalAdmins: adminCount, data: admins });
  } catch (error) {
    console.log("error in noOfAdmins controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// promote and demote a user by super admin (admin -> user and user -> admin)

const promoteOrDemoteUser = async (req, res) => {
  try {
    const { userId, role } = req.body; // Takeing  userId and role manually from request body

    if (!userId || !role) {
      return res.status(400).json({ error: "User ID and new role are required." });  
    }

    const user = await User.findById(userId);  // the user to be promoted or demoted
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (user.role === "SUPERADMIN") {
      return res.status(403).json({ error: "Cannot modify SuperAdmin role." });  // cannot modify super admin role
    }

    // Update the role
    user.role = role;
    await user.save();

    return res.status(200).json({ message: `User role updated to ${role} successfully!`, success: true });
  } catch (error) {
    console.error("Error in promoteOrDemoteUser controller:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// create user or admin by super admin
const createUserBySuperAdmin = async (req, res) => {
  try {
    const { name ,email, password} = req.body;

    // Validate required fields
    if (!name || !email || !password ) {
      return res.status(400).json({ error: "Email, password, and role are required" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    // Ensure SuperAdmin cannot create another SuperAdmin
   

    const hashPass = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({name ,email , password: hashPass, role:"USER" });
    await newUser.save();

    return res.status(201).json({ 
      message: `User created successfully `, 
      success: true, 
      user: newUser 
    });

  } catch (error) {
    console.error("Error in createUserBySuperAdmin controller:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};



//  delete admin and user by super admin  
const deleteUserBySuperAdmin = async (req, res) => {
  try {
    const { userId } = req.body; // Taking userId manually

    // Find the user to delete
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the user other than the superadmin then delete (SuperAdmin cannot be deleted)
    if (user.role === "SUPERADMIN") {
      return res.status(403).json({ error: "SuperAdmin cannot be deleted" });
    }

    // Delete the user
    await User.findByIdAndDelete(userId);

    return res.status(200).json({ 
      message: `User with ID ${userId} deleted successfully`,
      success: true 
    });

  } catch (error) {
    console.error("Error in deleteUser controller:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

//create the user by admin 

const createUserByAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    const hashPass = await bcrypt.hash(password, 10);

    // Create new user with default role "USER"
    const newUser = new User({ email, password: hashPass, role: "USER" });
    await newUser.save();

    return res.status(201).json({
      message: "User created successfully",
      success: true,
      user: newUser
    });

  } catch (error) {
    console.error("Error in createUserByAdmin controller:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


// delete a user by admin

const deleteUserByAdmin = async (req, res) => {
  try {
    const { userId } = req.body; // Taking userId manually

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if user is an Admin or SuperAdmin (Admins can only delete normal Users)
    if (user.role === "ADMIN" || user.role === "SUPERADMIN") {
      return res.status(403).json({ error: "Admins cannot delete other Admins or SuperAdmins" });
    }

    // Delete the user
    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      message: "User deleted successfully",
      success: true
    });

  } catch (error) {
    console.error("Error in deleteUserByAdmin controller:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};



module.exports = { signup, login, logout, home, createAdmin,deleteAdmin, noOfUsers, noOfAdmins, createUserBySuperAdmin, promoteOrDemoteUser, deleteUserBySuperAdmin, createUserByAdmin, deleteUserByAdmin };
