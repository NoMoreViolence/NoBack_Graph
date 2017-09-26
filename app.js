// 모듈
// 익스프레스
const express = require('express');
// 위치 __dirname
const path = require('path');
// 로거
const logger = require('morgan');
// 쿠키 처리
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
// 디버그
const debug = require('debug')('noback-graph:server');
// HTTP 서버
const http = require('http');

const index = require('./routes/index');
const users = require('./routes/users');

const app = express();

// ejs 뷰 엔진
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
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


// 포트를 숫자, 문자열 또는 거짓으로 표준화합니다.
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (Number.isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};
// 환경에서 포트를 가져와 Express에 저장
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);


// HTTP 서버 만들기
const server = http.createServer(app);
// Error 의 이벤트 리스너
const OH_ERROR = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ?
    port :
    port;

  // 친숙한 메시지로 특정 청취 오류를 처리합니다.
  switch (error.code) {
    case 'EACCES':
      console.error(bind);
      console.log('requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind);
      console.log('already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
};
// listening 의 이벤트 리스너
const listening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ?
    addr :
    addr.port;
  debug(bind);
};

// 소켓 io server 가동
const io = require('socket.io')(server);
// 서버 가동
server.listen(port, () => {
  console.log('server is running at http://localhost:3000');
});
server.on('error', OH_ERROR);
server.on('listening', listening);

// 소켓 IO 파트
io.on('Example', () => {
  io.emit('aa', true);
});
