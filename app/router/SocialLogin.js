const express = require('express')
const router = express.Router()
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
const User = require('../model/User')
const request = require('request'),
  fs = require('fs'),
  moment = require('moment')
const jwt = require('jsonwebtoken')

const spreadNameFromFacebook = (name) => {
  return name.split(' ')
}

const downloadImageFromUrl = (url) => {
  let options = {
    url: url,
    method: "get",
    encoding: null
  }

  const path = '../../resource/images/'
  const imageName = moment().format('YYYYMMDDHHmmss')

  request(options, (err, res, body) => {
    if (err) {
      imageName = 'noimg'
    } else {
      fs.writeFileSync(path + imageName + '.jpg', body)
    }
  })
  return imageName + '.jpg'
}

passport.use(
  new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ['id', 'displayName', 'photos', 'email'],
    passReqToCallback: true
  }, (req, accessToken, refreshToken, profile, done) => {
    User.findOne({
        where: {
          provider_id: profile.id
        }
      })
      .then((user) => {
        if (user) return done(null, user.id)
        User.create({
            name: spreadNameFromFacebook(profile.displayName)[0],
            lastname: spreadNameFromFacebook(profile.displayName)[1],
            email: profile.emails[0].value,
            provider: '2',
            provider_id: profile.id,
            avatar: downloadImageFromUrl(profile.photos[0].value)
          })
          .then((result) => {
            done(null, profile.id)
          })
      })
      .catch((error) => {
        done(null, null)
      })
  })
)

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then(user => {
      done(null, user)
    })
})

router.get('/auth/facebook', passport.authenticate('facebook', {
  scope: ['public_profile', 'email']
}))

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }))

router.get('/profile', (req, res) => {
  const userdata = {
    id: req.user.id,
    email: req.user.email
  }
  const token = jwt.sign(userdata, process.env.JWT_SECRET, {
    expiresIn: '1h'
  })
  req.session.userId = req.user.id
  res.json({
    user: req.user,
    token: token,
    expiresIn: 3600000
  })
})

module.exports = router
