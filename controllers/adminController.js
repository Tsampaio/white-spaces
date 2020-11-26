
const User = require('../models/userModel');

exports.getUsers = async (req, res) => {
  console.log("Inside GET USERS");

  try {

    if(req.user.role === 'admin') {
      const allUsers = await User.find();

      console.log(allUsers);
      console.log("END OF USERS");
      res.status(200).json({
        users: allUsers
      })
    } else {
      throw new Error('You are not an admin');
    }
    
  } catch (error) {
    console.log(error.message);
    res.status(401).json({
      message: error.message
    })
  }
};