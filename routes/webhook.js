const express = require('express');

const router = express.Router();

router.post('/', (req, res) => {
  console.log("this is the request")
  console.log(req);
});


module.exports = router;