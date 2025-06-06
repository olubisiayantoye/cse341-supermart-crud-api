const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Auth service is up. Try /auth/github to login with GitHub.');
});

// GitHub login
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub OAuth callback
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    // Redirect to your frontend/dashboard after successful login
   res.redirect(`${process.env.BASE_URL}/api-docs`);
  }
);

// Logout
router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect('/');
  });
});

module.exports = router;
