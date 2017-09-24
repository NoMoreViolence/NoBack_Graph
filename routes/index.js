var express = require('express');
var router = express.Router();

// 홈페이지
router.get('/', function(req, res, next) {
    res.render('index', { donation: false });
});

// 도네이션
router.get('/donation', function(req, res, next) {
    res.render('index', { donation: true });
});

module.exports = router;