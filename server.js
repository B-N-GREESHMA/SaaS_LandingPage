const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./db');
const User = require('./models/user');
const sendVerificationEmail = require('./mailer');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Serve the landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Handle signup form
app.post('/api/signup', async (req, res) => {
  const { name, email } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return res.send('<h3>❌ This email is already registered!</h3>');
    }

    const newUser = new User({ name, email });
    await newUser.save();

    // Send verification email
    await sendVerificationEmail(email);
    res.send(`<h2>✅ Thank you! Check your email for the verification link.</h2>`);
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Something went wrong.');
  }
});

// Email verification route
app.get('/verify', async (req, res) => {
  const { email } = req.query;

  try {
    const user = await User.findOne({ email });
    if (user) {
      user.verified = true;
      await user.save();
      return res.redirect('/thankyou');
    }
    res.send('❌ Invalid verification link.');
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Verification failed.');
  }
});

// Thank you page
app.get('/thankyou', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'thankyou.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
