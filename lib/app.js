// External
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var cuid = require('cuid');
var path = require('path');
var passport = require('passport');
var session = require('express-session');
var GitHubStrategy = require('passport-github2').Strategy;

// Controllers
var AssetPairCtrl = require('./controllers/AssetPairCtrl');
var ProviderCtrl = require('./controllers/ProviderCtrl');
var QuoteCtrl = require('./controllers/QuoteCtrl');
var MainCtrl = require('./controllers/MainCtrl');
var GitHubCtrl = require('./controllers/GitHubCtrl');
var RepoCtrl = require('./controllers/RepoCtrl');

// Models
var User = require('./models/User');

// Other
var config = require('../config');
var logger = require ('./logger');
var util = require('./util');

// Set up passport
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: '/auth/github/callback'
  },
  function(accessToken, refreshToken, profile, done) {
		User.findOne({ githubId: profile.id }, function (err, user) {
			if (err) {
				return done(err, null);
			}

			if (!user) {
				logger.trace('User does not exist yet. Creating user...');
				// User does not exist (yet)
				return User.create({ githubId: profile.id, accessToken: accessToken }, function (err, user) {
					return done(err, user);
				});
			}

			if (user.accessToken !== accessToken) {
				logger.trace('User token for user id', user.githubId, 'did not match, updating accessToken...');
				user.accessToken = accessToken;
				return user.save(function (err, res) {
					return done(err, user);
				});
			}

			logger.trace('Does already exist and token is still up-to-date');

			return done(err, user);
		});
	}
));
passport.serializeUser(function(user, done) {

	console.log(user);

	// TODO
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
	// TODO
  done(null, obj);
});

// Init express app
var app = express();

// Middlewares
app.use(cookieParser());
app.use(methodOverride());
app.use(session({ secret: process.env.SESSION_SECRET || 'keyboard cat' }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
  req.requestId = cuid();
  next();
});
app.use(function (req, res, next) {
  logger.trace(req.requestId, req.method, req.originalUrl, req.query);
  next();
});

app.use('/static', express.static(path.join(config.baseDir, 'static')));

app.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }));

app.get('/auth/github/callback',
passport.authenticate('github', { failureRedirect: '/' }),
	function(req, res) {
	// Successful authentication, redirect home.
	res.redirect('/');
});

app.get('/logout', function(req, res){
	// destroy the user's session to log them out
	// will be re-created next request
	req.session.destroy(function(){
		res.redirect('/');
	});
});

function loggedIn(req, res, next) {
	if (req.user) {
		next();
	} else {
		res.status(401).send({ message: 'You are not authenticated. Please authenticate first.', code: 401});
	}
}

// GitHub overrides
app.delete('/github/user/repos/activated/:repoId', loggedIn, RepoCtrl.deactivate);
app.get('/github/user/repos/activated', loggedIn, RepoCtrl.activatedRepos);
app.post('/github/user/repos/activated', loggedIn, RepoCtrl.activate);

// GitHub Proxy
['get', 'post', 'put', 'delete'].forEach(function (method) {
	app[method]('/github/*', loggedIn, GitHubCtrl[method])
});

// Providers
app.get('/providers', loggedIn, ProviderCtrl.all);

// Asset pairs
app.get('/assetPairs/:pair/quotes', loggedIn, QuoteCtrl.allQuotesForAssetPair);
app.get('/assetPairs/:pair', loggedIn, AssetPairCtrl.get);
app.delete('/assetPairs/:pair', loggedIn, AssetPairCtrl.remove);
app.get('/assetPairs', loggedIn, AssetPairCtrl.all);
app.post('/assetPairs', loggedIn, AssetPairCtrl.add);
app.get('/', MainCtrl.index);

module.exports = app;
