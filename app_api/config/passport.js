const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('users');

passport.use(new LocalStrategy({
  usernameField: 'email' // Specifies that 'email' will be used as the username field
},
async (username, password, done) => {
  try {
    // Use async/await instead of callbacks
    const user = await User.findOne({ email: username });

    if (!user) {
      console.warn("Login attempt failed: User not found with email", username);
      return done(null, false, { message: 'Incorrect username.' });
    }

    if (!user.validPassword(password)) {
      console.warn("Login attempt failed: Incorrect password for user", username);
      return done(null, false, { message: 'Incorrect password.' });
    }

    console.log("Login successful for user:", username);
    return done(null, user);

  } catch (err) {
    console.error("Error occurred during login query:", err);
    return done(err);
  }
}));
