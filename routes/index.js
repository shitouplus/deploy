const express = require('express')
const path = require('path')
const router = express.Router()

/* GET home page. */
router.get('/', function(req, res) {
  // res.sendFile('index.html', { root: path.join(__dirname, '../dist')})
  // res.sendFile(`${process.cwd()}/dist/index.html`)
  res.sendFile(path.resolve('dist', 'index.html'))
});

module.exports = router;
