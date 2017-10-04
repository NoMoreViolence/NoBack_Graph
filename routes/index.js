// 모듈
const express = require('express');
// Router
const router = express.Router();
// 홈페이지
router.get('/', (req, res) => {
  // game, rank, donation, setting
  // ejs에 각각 로딩할 페이지 여부
  res.render('index', {
    game: false,
    rank: false,
    donation: false,
    setting: false,
  });
});
// 유저 이름 입력 레이아웃
router.get('/start', (req, res) => {
  res.render('index', {
    game: true,
    rank: false,
    donation: false,
    setting: false,
  });
});
// 랭킹
router.get('/rank', (req, res) => {
  res.render('index', {
    game: false,
    rank: true,
    donation: false,
    setting: false,
  });
});
// 도네이션
router.get('/donation', (req, res) => {
  res.render('index', {
    game: false,
    rank: false,
    donation: true,
    setting: false,
  });
});
// 세팅
router.get('/setting', (req, res) => {
  res.render('index', {
    game: false,
    rank: false,
    donation: false,
    setting: true,
  });
});

module.exports = router;
