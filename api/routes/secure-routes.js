const express = require('express');

const router = express.Router();

router.get('/authenticate', (req, res, next) => {
  res.json({
    message : 'Authenticated!',
    user : req.user
  })
});

module.exports = router;
