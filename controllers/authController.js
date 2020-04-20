const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// const Email = require('../utils/email');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  console.log(process.env.JWT_COOKIE_EXPIRES_IN)
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  console.log(token);
  console.log(cookieOptions);
  
  // res.cookie('jwt', token, cookieOptions);
  res.cookie('name', 'Telmo');
  console.log('Cookie Set');
  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    message: 'You are Registered',
    token,
    data: {
      user
    }
  });
};

exports.register = async (req, res, next) => {
  try {
    // console.log(req.body);
    const { name, email, password, passwordConfirm } = req.body;

    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email })

    if (user) {
      return res.status(401).send({
        status: 'fail',
        message: 'That email already has been taken'
      });
    }

    const newUser = await User.create({
      name: name,
      email: email,
      password: password,
      passwordConfirm: passwordConfirm
    });

    // const url = `${req.protocol}://${req.get('host')}/dashboard`;
    // Or http://localhost:3002/dashboard   for HOST
    // console.log(url);
    // await new Email(newUser, url).sendWelcome();

    // res.status(200).json({
    //   status: 'success',
    //   message: 'You are Registered',
    //   data: newUser
    // });

    createSendToken(newUser, 201, res);
  } catch(error) {
    console.log(error);
  }

};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide email and password'
    });
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return res.status(401).json({
      status: 'fail',
      message: 'Incorrect email or password'
    });
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, res);
};

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ 
    status: 'success',
    message: "Token Removed"
  });
};

exports.protect = async (req, res, next) => {
  // 1) Getting token and check of it's there
  console.log("inside protect");
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if(res.userStatus) {
    return res.status(201).json({
      status: 'success',
      message: 'You are a Guest!!'
    });
  }
  // console.log(token);
  if (!token) {
    return res.status(401).json({
      status: 'fail',
      message: 'You are not logged in! Please log in to get access.'
    });
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, config.get("JWT_SECRET"));
  //console.log(decoded);
  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  //console.log(currentUser);
  if (!currentUser) {
    return next(
      res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token does no longer exist.'
      })
    );
  }

  // 4) Check if user changed password after the token was issued
  // if (currentUser.changedPasswordAfter(decoded.iat)) {
  //   return next(
  //     res.status(401).json({
  //       status: 'fail',
  //       message: 'User recently changed password! Please log in again.'
  //     })
  //   );
  // }

  // GRANT ACCESS TO PROTECTED ROUTE
  // req.user = currentUser;
  // res.locals.user = currentUser;
  // next();

  res.status(200).json({
    status: 'success',
    message: 'your are authenticated',
    token,
    user: currentUser
  });

  next();
};

// Only for rendered pages, no errors!
// exports.isLoggedIn = async (req, res, next) => {
//   if (req.cookies.jwt) {
//     try {
//       // 1) verify token
//       const decoded = await promisify(jwt.verify)(
//         req.cookies.jwt,
//         config.get("JWT_SECRET")
//       );

//       // 2) Check if user still exists
//       const currentUser = await User.findById(decoded.id);
//       if (!currentUser) {
//         return next();
//       }

//       // 3) Check if user changed password after the token was issued
//       if (currentUser.changedPasswordAfter(decoded.iat)) {
//         return next();
//       }

//       // THERE IS A LOGGED IN USER
//       res.locals.user = currentUser;
//       return next();
//     } catch (err) {
//       return next();
//     }
//   }
//   next();
// };

exports.isGuest = async (req, res, next) => {
  if (!req.cookies.jwt) {
    
      // return res.status(200).json({
      //   status: 'Success',
      //   message: 'You are a guest'
      // })
      res.userStatus = "guest";
  }
  next();
};

// exports.restrictTo = (...roles) => {
//   return (req, res, next) => {
//     // roles ['admin', 'lead-guide']. role='user'
//     if (!roles.includes(req.user.role)) {
//       return next(
//         new AppError('You do not have permission to perform this action', 403)
//       );
//     }

//     next();
//   };
// };

exports.forgotPassword = async (req, res, next) => {
  console.log("inside forgot password");
  //1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    
    return next(
      res.status(404).json({
        status: 'Fail',
        message: 'There is no user with email address.'
      })
    );
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  try {
    // await sendEmail({
    //   email: user.email,
    //   subject: 'Your password reset token (valid for 10 min)',
    //   message
    // });

    const resetURL = `${req.protocol}://${req.get(
    'host'
    )}/api/users/resetPassword/${resetToken}`;

    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      res.status(500).json({
        status: 'fail',
        message: 'There was an error sending the email. Try again later!'
      })
    );
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
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
   
    return next(
      res.status(400).json({
        status: 'fail',
        message: 'Token is invalid or has expired'
      })
    );
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  createSendToken(user, 200, res);
};

exports.updatePassword = async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(
      res.status(401).json({
        status: 'fail',
        message: 'Your current password is wrong.'
      })
    );
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
};
