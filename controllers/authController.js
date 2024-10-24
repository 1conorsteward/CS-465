const User = require('../models/userModel');
const bcrypt = require('bcrypt');

// Handle user login
// Handle user login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log(`Attempting login for: ${email}`);

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'Invalid email!' });
    }

    const isMatch = await bcrypt.compare(password.trim(), user.password);
    console.log("isMatch:", isMatch);
    if (!isMatch) {
      console.log('Entered password:', password);
      console.log('Stored hashed password:', user.password);
      return res.status(401).json({ message: 'Invalid password!' });
    }

    // Set session variables
    req.session.isLoggedIn = true;
    req.session.isAdmin = user.isAdmin;
    req.session.userId = user._id;

    // Conditionally redirect based on admin status
    if (user.isAdmin) {
      // If user is an admin, redirect to admin-travel page
      return res.status(200).json({ message: 'Login successful', redirectUrl: '/admin-travel' });
    } else {
      // Otherwise, redirect to the homepage or other user-specific pages
      return res.status(200).json({ message: 'Login successful', redirectUrl: '/' });
    }

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



// Handle user logout
exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.status(200).json({ message: 'Logout successful', redirectUrl: '/login' });
  });
};

// Check session status
exports.checkSession = (req, res) => {
  const isLoggedIn = req.session.isLoggedIn || false;
  res.status(200).json({ isLoggedIn });
};

// Handle user registration
exports.register = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  // Validate input
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match, please try again.' });
  }

  try {
    // Check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password.trim(), 10);
    console.log('Original Password:', password);
    console.log('Hashed Password:', hashedPassword);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    // Automatically log the user in after successful registration
    req.session.isLoggedIn = true;
    req.session.userId = newUser._id;

    res.status(201).json({ message: 'Registration successful', redirectUrl: '/' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
