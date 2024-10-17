const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('users');

const register = async (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.password) {
      return res
        .status(400)
        .json({ "message": "All fields required" });
    }
  
    try {
      const user = new User();
      user.name = req.body.name;
      user.email = req.body.email;
      user.setPassword(req.body.password);
  
      // Use async/await for saving the user
      await user.save();
  
      const token = user.generateJwt();
      res
        .status(200)
        .json({ token });
    } catch (err) {
      res
        .status(400)
        .json(err);
    }
  };
  

const login = (req, res) => {
    if (!req.body.email || !req.body.password) {
      console.error("Login failed: Missing email or password.");
      return res
        .status(400)
        .json({ "message": "All fields required" });
    }

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error("Login failed: Passport authentication error.", err);
      return res
        .status(404)
        .json(err);
    }
    if (user) {
      const token = user.generateJwt();
      console.log("Login successful: JWT generated for user", user.email);
      return res
        .status(200)
        .json({ token });
    } else {
      console.warn("Login failed: Invalid credentials provided.", info);
      return res
        .status(401)
        .json(info);
    }
  })(req, res);
};


module.exports = {
  register,
  login
};
