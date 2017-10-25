// 몽구스 모듈 불러내기
const mongoose = require('mongoose');


const Gold = new mongoose.Schema({
  money: {
    type: Number,
    required: true,
    unique: false,
  },
  username: {
    type: String,
    required: true,
    unique: false,
  },
});
// 모듈 내보내기
module.exports = mongoose.model('Gold', Gold);
