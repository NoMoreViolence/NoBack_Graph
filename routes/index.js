// 모듈
const express = require('express');

// Router
const router = express.Router();
// 홈페이지
router.get('/', (req, res) => {
  // game, rank, donation, setting
  // ejs에 각각 로딩할 페이지 여부
  res.render('index');
});
// 게임
router.get('/start', (req, res) => {
  res.render('game');
});
// 랭킹
router.get('/rank', (req, res) => {
  res.render('rank');
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
