// 모듈
const express = require('express');
const RECORD = require('./../routes/mongo/gold.js');

// Router
const router = express.Router();
// 홈페이지
router.get('/', (req, res) => {
  res.render('index');
});
// 게임
router.get('/start', (req, res) => {
  res.render('game');
});
// 랭킹
router.get('/rank', (req, res) => {
  RECORD.find().sort('-money').find((error, data) => {
    if (error) {
      console.log(error);
    } else if (data !== null) { // 랭킹 데이터
      res.render('rank', { data });
    }
    return 0;
  });
});
// 도네이션
router.get('/donation', (req, res) => {
  res.render('donation');
});
// 더보기
router.get('/more', (req, res) => {
  res.render('more');
});

module.exports = router;
