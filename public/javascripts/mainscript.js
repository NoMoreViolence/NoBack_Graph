window.onload = () => {
  // 소켓을 생성합니다.
  const socket = io();


  socket.emit('Example');
};
