# Adding Google Login to Your Application

This guide will help you add Google Login to your web application using OAuth 2.0 and Passport.js.

## Step 1: Set Up Google OAuth 2.0

1. **Create a Project on Google Cloud Platform**:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/).
   - Create a new project.
   - Navigate to "APIs & Services" > "Credentials".
   - Click "Create Credentials" and select "OAuth 2.0 Client IDs".
   - Configure the consent screen and create the OAuth 2.0 Client ID.
   - Add the authorized redirect URIs. For development, you can use `http://localhost:3000/auth/google/callback`.

2. **Save the Client ID and Client Secret**:
   - Note down the Client ID and Client Secret. You will need these to configure your application.

## Step 2: Install Required Packages

Install the necessary packages for OAuth 2.0 and Passport.js:

```bash
npm install passport passport-google-oauth20 express-session
```

## Step 3: Configure Passport.js

Create a new file called `passport-config.js` in the root directory of your project.

### passport-config.js

```javascript
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/user');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        user = new User({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value
        });
        await user.save();
      }
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, false);
  }
});
```

## Step 4: Update the User Model

Update the `user.js` model to include the Google ID.

### models/user.js

```javascript
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    }
});

module.exports = mongoose.model('User', UserSchema);
```

## Step 5: Configure Express Session

Update `app.js` to configure Express session and initialize Passport.

### app.js

```javascript
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const User = require('./models/user');
const auth = require('./middleware/auth');
require('dotenv').config();
require('./passport-config');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/mywebapp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Routes
const users = require('./routes/users');
app.use('/users', users);

// Google OAuth routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login.html' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Admin routes
app.use('/admin', auth, express.static(path.join(__dirname, 'public/admin')));

// Landing page route
app.use('/', express.static(path.join(__dirname, 'public/landing')));

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, password });
        if (user) {
            res.json({ message: 'Login successful' });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
```

## Step 6: Add Environment Variables

Create a `.env` file in the root directory of your project to store your Google Client ID and Client Secret.

### .env

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## Step 7: Test the Google Login

1. Start your application by running:
   ```bash
   node app.js
   ```

2. Open your browser and navigate to `http://localhost:3000/auth/google`. You should be redirected to Google for authentication.

3. After successful authentication, you should be redirected back to your application.

## Conclusion

You've now added Google Login to your web application using Node.js, Express, and MongoDB. This includes setting up Google OAuth 2.0, configuring Passport.js, and creating the necessary routes.
