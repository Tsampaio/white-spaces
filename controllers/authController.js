const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Transactions = require('../models/transactionModel');
const fs = require('fs');
const { upload } = require('../utils/imageUpload');
const axios = require('axios');

const Email = require('../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res, message) => {
  const token = signToken(user._id);
  // console.log(process.env.JWT_COOKIE_EXPIRES_IN)
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    // sameSite: 'none',
    // secure: true,
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  // console.log(token);
  // console.log(cookieOptions);

  res.cookie('jwt', token, cookieOptions);
  // res.cookie('name', 'Telmo', cookieOptions);
  // console.log('Cookie Set');
  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    message: message,
    token,
    user: user,
  });
};

const generateActivationToken = async (req, user) => {
  const activationToken = user.activationResetToken();
  user.activationToken = activationToken;
  await user.save({ validateBeforeSave: false });

  const url = `${req.protocol}://${req.get(
    'host'
  )}/activate/${activationToken}`;
  //Or http://localhost:3000/dashboard   for HOST
  // console.log(url);
  await new Email(user, url).sendWelcome();
};

exports.register = async (req, res) => {
  try {
    // console.log(req.body);
    const { name, email, password, passwordConfirm, token } = req.body;

    if (!token) {
      throw new Error(
        'There was a problem with your request. Please try again later.'
      );
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

    const response = await axios.post(verificationUrl);

    console.log("The google verification is:");
    console.log(response.data);

  
      // Destructure body object
      // Check the reCAPTCHA v3 documentation for more information
      const { success, score } = response.data;
    

      // reCAPTCHA validation
      if (!success || score < 0.4) {
       
        throw new Error("Register failed. Robots aren't allowed here. " + score);
      }
      // When no problems occur, "send" the form
      console.log('Congrats you sent the form');
      // Return feedback to user with msg
    

    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email });

    if (user) {
      // return res.status(401).send({
      //   status: 'fail',
      //   message: 'That email already has been taken'
      // });
      throw new Error('That email has been taken already');
    }

    const newUser = await User.create({
      name: name,
      email: email,
      password: password,
      passwordConfirm: passwordConfirm,
    });

    // 2) Generate the random reset token
    generateActivationToken(req, newUser);
    // const activationToken = newUser.activationResetToken();
    // newUser.activationToken = activationToken;
    // await newUser.save({ validateBeforeSave: false });

    // const url = `${req.protocol}://${req.get('host')}/activate/${activationToken}`;
    // //Or http://localhost:3000/dashboard   for HOST
    // console.log(url);
    // await new Email(newUser, url).sendWelcome();

    // res.status(200).json({
    //   status: 'success',
    //   message: 'You are Registered',
    //   data: newUser
    // });

    res.status(201).json({
      status: 'success',
      message: 'Please check your email to activate your account!',
      score: score,
    });
  } catch (error) {
    console.log(error.message);
    res.status(401).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.activate = async (req, res, next) => {
  // 1) Get user based on the token

  // console.log('inside account Activation');
  // console.log(req.params.token);
  const user = await User.findOne({ activationToken: req.params.token });

  // console.log(user);

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(
      res.status(400).json({
        status: 'fail',
        message: 'Token is invalid or has expired',
      })
    );
  }

  user.active = 'active';
  user.activationToken = undefined;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    message: 'You are Activated',
  });
};

exports.login = async (req, res, next) => {
  try {
    const { email, password, token } = req.body;

    if (!token) {
      throw new Error(
        'There was a problem with your request. Please try again later.'
      );
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

    const response = await axios.post(verificationUrl);

    console.log("The google verification is:");
    console.log(response.data);

    // Destructure body object
    // Check the reCAPTCHA v3 documentation for more information
    const { success, score } = response.data;

    // reCAPTCHA validation
    if (!success || score < 0.4) {
      // return res.json({
      //   status: 'fail',
      //   message: "Sending failed. Robots aren't allowed here.",
      //   score: score,
      // });
      throw new Error("Login failed. Robots aren't allowed here. " + score);
    }

    console.log('Inside Login Controller');
    // 1) Check if email and password exist
    if (!email || !password) {
      throw new Error('Please provide email and password');
    }
    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');
    // console.log(user);
    if (!user || !(await user.correctPassword(password, user.password))) {
      throw new Error('Incorrect email or password');
    }

    // 3) If everything ok, send token to client
    createSendToken(user, 200, res, 'You are logged in');
  } catch (error) {
    console.log(error.message);
    res.status(401).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.logout = (req, res) => {
  // res.cookie('jwt', 'loggedout', {
  //   expires: new Date(Date.now() + 5 * 1000),
  //   httpOnly: true
  // });
  res.clearCookie('jwt');
  res.status(200).json({
    status: 'success',
    message: 'Token Removed',
  });
};

exports.protect = async (req, res, next) => {
  // 1) Getting token and check of it's there
  console.log('inside protect');
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      console.log('checking req header authorization');
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      console.log('inside browser cookies');
      token = req.cookies.jwt;
    } else {
      return res.status(200).json({
        status: 'guest',
        message: 'Failed to authenticate',
      });
    }

    console.log(token);
    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log('Decoded is');
    console.log(decoded);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    //console.log(currentUser);
    if (!currentUser) {
      console.log('No current user');
      return next(
        res.status(401).json({
          status: 'fail',
          message: 'The user belonging to this token does no longer exist.',
        })
      );
    }

    req.user = currentUser;
    req.token = token;
    console.log('before protect next');
    next();
  } catch (error) {
    console.log('error in login');
    console.log(error);
    res.status(401).json({
      status: 'fail',
      message: 'The user belonging to this token does no longer exist.',
    });
  }

  // res.status(200).json({
  //   status: 'success',
  //   message: 'your are authenticated',
  //   token,
  //   user: currentUser,
  //   active: currentUser.active
  // });
};

exports.loadUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'your are authenticated',
    token: req.token,
    user: req.user,
    active: req.user.active,
  });
};

exports.forgotPassword = async (req, res) => {
  //1) Get user based on POSTed email
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new Error('The email does not exist');
    }

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) Send it to user's email

    // await sendEmail({
    //   email: user.email,
    //   subject: 'Your password reset token (valid for 10 min)',
    //   message
    // });

    // const resetURL = `${req.protocol}://${req.get(
    // 'host'
    // )}/api/users/resetPassword/${resetToken}`;

    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/resetPassword/${resetToken}`;

    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'We have sent you an email, to reset your password',
    });
  } catch (err) {
    // user.passwordResetToken = undefined;
    // user.passwordResetExpires = undefined;
    // await user.save({ validateBeforeSave: false });

    console.log(err.message);

    res.status(401).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// exports.myEmail = async (req, res, next ) => {
//   try {
//     await sendEmail({
//       email: "user@email.com",
//       subject: 'Your password reset token (valid for 10 min)',
//       message: "Hello"
//     });

//     res.status(200).json({
//       status: 'success',
//       message: 'Token sent to email!'
//     });
//   } catch (err) {
//     return next(
//       res.status(500).json({
//         status: 'fail',
//         message: err.message
//       })
//     );
//   }
// }

exports.resetPassword = async (req, res, next) => {
  // 1) Get user based on the token
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
      throw new Error('Token is invalid or has expired');
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordChangedAt = Date.now();
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 3) Update changedPasswordAt property for the user
    // 4) Log the user in, send JWT
    // createSendToken(user, 200, res, "Password updated");
    res.status(200).json({
      status: 'success',
      message: 'Password updated',
    });
  } catch (error) {
    console.log(error.message);
    res.status(401).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.updatePassword = async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(
      res.status(401).json({
        status: 'fail',
        message: 'Your current password is wrong.',
      })
    );
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  createSendToken(user, 200, res, 'Password updated');
};

exports.emailActivation = async (req, res) => {
  try {
    // console.log('inside emailActivation');
    // console.log(req.params.email);
    const user = await User.findOne({ email: req.params.email });
    // console.log(user);
    generateActivationToken(req, user);

    res.status(200).json({
      status: 'success',
      message: 'The activation Email has been sent',
    });
  } catch (error) {
    console.log(error);
  }
};

exports.profilePic = async (req, res) => {
  try {
    if (req.file === null) {
      return res.status(400).json({
        msg: 'No file uploaded',
      });
    }
    console.log('this is user');
    console.log(req.user);

    //Check later for backend validation
    // upload(req, res, function (error) {
    //   if(error) {
    //     console.log("INSIDE UPLOAD ERROR")
    //     console.log(error.code)
    //     error.message = 'File Size is too large. Allowed file size is 100KB';
    //     res.status(500).json({ message: error.message });
    //     return
    //   }
    // })

    console.log('this is files');
    console.log(req.file);
    // console.log(req.files);

    // const file = req.files.file;
    // const userId = req.body.userId;

    const user = req.user;
    user.image = `/uploads/users/${req.file.filename}`;

    // // user.hasProfilePic = true;

    await user.save({ validateBeforeSave: false });

    // const path = `${__dirname}/../client/public/${file.name}`;

    // if (fs.existsSync(path)) {
    //   //file exists
    //   fs.unlinkSync(path)
    // }

    // file.mv(`${__dirname}/../client/src/images/${file.name}`, err => {
    //   if (err) {
    //     console.error(err);
    //     return res.status(500).send(err);
    //   }

    //   res.json({ status: "success" });
    // });
    res.json({ status: 'success' });
  } catch (err) {
    console.log('This is error');
    console.log(err);
  }
};

exports.updateUserDb = async (req, res) => {
  try {
    console.log(req.body.newPassword);
    let message = '';
    const user = await User.findById(req.user.id).select('+password');
    console.log('The user is');
    console.log(user);
    // console.log("password is: " +  req.body.password)
    // console.log(await user.correctPassword(req.body.password, user.password));
    // 2) Check if POSTed current password is correct
    if (
      (req.body.newPassword || req.body.newPasswordConfirm) &&
      !req.body.password
    ) {
      throw new Error('Please enter your current password');
    } else if (
      req.body.newPassword &&
      req.body.newPasswordConfirm &&
      !(await user.correctPassword(req.body.password, user.password))
    ) {
      throw new Error('Your current password is wrong');
    }

    // 3) If so, update password
    user.name = req.body.name;

    if (req.body.newPassword) {
      console.log('inside password');
      user.password = req.body.newPassword;
      user.passwordConfirm = req.body.newPasswordConfirm;
      (message = 'Profile Updated'), await user.save();
      res.status(200).json({
        status: 'success',
        message: 'Profile Updated',
      });
    } else {
      await user.save({ validateBeforeSave: false });
      res.status(200).json({
        status: 'success',
        message: 'Profile Updated',
      });
    }
    // User.findByIdAndUpdate will NOT work as intended!

    // 4) Log user in, send JWT
    // createSendToken(user, 200, res, message);
  } catch (error) {
    console.log(error.message);
    res.status(401).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    if (req.user.role === 'admin' || req.user._id == req.params.id) {
      const user = await User.findById(req.params.id);
      if (!user) {
        return next(
          res.status(404).json({
            status: 'Fail',
            message: 'There is no user with email address.',
          })
        );
      }

      console.log(user);

      res.json({
        user: user,
      });
    } else {
      throw new Error('You are not an admin or the right user');
    }
  } catch (error) {
    console.log(error.message);
    res.status(401).json({
      message: error.message,
    });
  }
};

exports.getUserPurchases = async (req, res) => {
  try {
    const transactions = await Transactions.find();
    // req.params.id

    const allTransactions = transactions.filter((trs) => {
      return trs.user == req.params.id;
    });
    console.log(allTransactions);
    res.json({
      transactions: allTransactions,
    });
  } catch (error) {}
};

exports.lastLogin = async (req, res) => {
  try {
    console.log('last login');
    // console.log(req.user);
    const dateNow = new Date();

    const user = await User.findById(req.user._id);
    console.log(user);
    user.lastLogin = dateNow;

    await user.save({ validateBeforeSave: false });

    res.json({
      date: dateNow,
    });
  } catch (error) {
    console.log(error);
  }
};
