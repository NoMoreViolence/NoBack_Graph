// 몽구스 모듈
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

module.exports = () => {
  const connect = () => {
    mongoose.connect('mongodb://127.0.0.1:27017/Graph', { useMongoClient: true }, (err) => {
      if (err) {
        console.error('mongodb connection error', err);
      }
      console.log('몽고 연결 완료');
    });
  };
  connect();
  mongoose.connection.on('disconnected', connect);
  mongoose.connection.on('error', () => {
    console.log('Connection Failed!');
  });
};
