// 모듈
const express = require('express');
const path = require('path');
const logger = require('morgan');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
// express
const app = express();

const index = require('./routes/index');
const users = require('./routes/users');

app.use('/', index);
app.use('/users', users);

// ejs 뷰 엔진
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// 미들웨어 설정
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// 404 오류
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// 에러 핸들러
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
