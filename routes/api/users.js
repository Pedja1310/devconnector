const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// @route     POST api/users
// @desc      Register Route
// @access    Public
router.post('/', [
  check('name', 'Name is required').not().isEmpty(), 
  check('email', 'Please include valid email.').isEmail(), 
  check('password', 'Password must be at least 6 characters long.').isLength({min: 6})
], (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.errors });
  }
  res.status(200).send('OK');
})

module.exports = router;