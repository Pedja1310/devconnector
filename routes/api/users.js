const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const bycrypt = require('bcryptjs');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

// @route     POST api/users
// @desc      Register Route
// @access    Public
router.post('/', [
  check('name', 'Name is required').not().isEmpty(), 
  check('email', 'Please include valid email.').isEmail(), 
  check('password', 'Password must be at least 6 characters long.').isLength({min: 6})
], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    // check the db for existing email
    let user = await User.findOne({ email });
    
    // return error if there is email
    if(user) {
      return res.status(400).json({ errors: [ {msg: 'User already exits'} ] });
    }

    // get gravatar based on the email
    const avatar = gravatar.url(email, {
      s: '200',
      r: 'pg',
      d: 'mm'
    });

    // create a new instance of the user
    user = new User({
      name,
      email,
      avatar,
      password
    });

    // get bycrypt salt
    const salt = await bycrypt.genSalt(10);

    // hash the pass with bycrypt and generated salt
    user.password = await bycrypt.hash(password, salt);

    // save the user to the db
    await user.save()

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
        res.json({ token })
      }
    );


  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error.")
  }
})

module.exports = router;