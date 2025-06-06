//routes/authRoutes.js
const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Auth service is up. Try /auth/github to login with GitHub.');
});

// Start GitHub login
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub callback route
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    // Redirect to a frontend page or dashboard
    res.redirect('/api-docs') 

  }
);

// Logout route
router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) return next(err);
    res.json({ message: 'Logged out' });
    res.redirect('/');
  });
});

module.exports = router;
