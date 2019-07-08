const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const bycrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');


// @route     GET api/auth
// @desc      Test Route
// @access    Public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user)
  } catch(err) {
    console.log(err.message);
    res.status(500).send('Server error.');
  }
})

// @route     POST api/users
// @desc      Authenticate user & get token
// @access    Public
router.post('/', [
  check('email', 'Please include valid email.').isEmail(), 
  check('password', 'Password is required.').exists(),
], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.errors });
  }

  const { email, password } = req.body;

  try {
    // check the db for existing email
    let user = await User.findOne({ email });
    
    // return error if there is email
    if(!user) {
      return res.status(400).json({ errors: [ {msg: 'Invalid credentialsss.'} ] });
    }

    // Compare password
    const isMatch = await bycrypt.compare(password, user.password);

    // Return error if pass doesn't match
    if(!isMatch) {
      return res.status(400).json({ errors: [ {msg: 'Invalid credentials.'} ] });
    }

    // Return jsonwebtoken
    const payload = {
      user: {
        id: user.id
      }
    }

    // create and return jwt token
    jwt.sign(
      payload, 
      config.get('jwtSecret'),
      { expiresIn: 360000 }, 
      (err, token) => {
        if(err) throw err;
        console.log(token);
        res.json({ token })
      }
    );


  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error.")
  }
})

module.exports = router