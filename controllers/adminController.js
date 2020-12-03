
const User = require('../models/userModel');

exports.getUsers = async (req, res) => {
  console.log("Inside GET USERS");

  try {

    if (req.user.role === 'admin') {
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

exports.updateUsers = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const fetchUsers = async (users) => {
        const requests = users.map(async (user, i) => {

          return new Promise(async (resolve, reject) => {
            const userFound = await User.findById(user._id);

            if (req.body.action === "activate") {
              userFound.active = "active"
            }

            resolve(userFound);

          });
        })
        return Promise.all(requests) // Waiting for all the requests to get resolved.
      }

      fetchUsers(req.body.users)
        .then(async (userFound) => {
          // console.log("THIS IS !!!!!");
          // console.log(courseFound);
          for (let i = 0; i < userFound.length; i++) {
            await userFound[i].save({ validateBeforeSave: false });
          }

          const allUsers = await User.find();

          res.status(200).json({
            users: allUsers
          })

        });

    } else {
      throw new Error('You are not an admin');
    }
  } catch (error) {
    console.log(error.message);
    res.status(401).json({
      message: error.message
    })
  }
}

exports.deleteUsers = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      console.log(req.body.users);

      const allUsers = req.body.users.map(user => {
        return user._id;
      })

      console.log(allUsers);

      await User.deleteMany({ _id: { $in: allUsers } })
      console.log("users deleted");

      const allDbUsers = await User.find();

      res.status(200).json({
        users: allDbUsers
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
}