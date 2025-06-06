const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/userModel');

// Session serialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// GitHub OAuth Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/auth/github/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id: githubId, username, emails, photos } = profile;

        let user = await User.findOne({ githubId });
        if (!user) {
          user = new User({
            githubId,
            username,
            email: emails?.[0]?.value || '',
            avatar: photos?.[0]?.value || ''
          });
          await user.save();
        }

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

