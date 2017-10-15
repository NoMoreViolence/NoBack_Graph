/*
const digit = () => { // 자릿수 함수
  let zero = Math.floor(Math.random() * 100); // 100분의 1 확률로 그래프는 0이 된다
  zero = Number(zero);
  if (zero === 0) {
    return zero; // 그래프 0
  }

  let hundred = Math.floor(Math.random() * 100); // 100분의 1 확률로 100의자리
  hundred = Number(hundred);
  if (hundred === 0) {
    hundred = 100;
    return hundred; // 그래프 100의자리
  }

  let ten = Math.floor(Math.random() * 5); // 5분의 1 확률로 10의자리
  ten = Number(ten);
  if (ten === 0) {
    ten = 10;
    return ten; // 그래프 10의자리
  }

  return 1; // 그래프 1의자리
};
const ONE = () => { // 일의자리 함수
  let temp = Math.floor(Math.random() * 10);

  if (temp === 0 || temp === 1 || temp === 2) {
    return 0;
  }
  temp = Math.floor(Math.random() * 10);
  return temp;
};
const TEN = () => { // 십의자리 함수
  let temp = Math.floor(Math.random() * 9) + 1;

  if (temp === 1 || temp === 2 || temp === 3 || temp === 4) {
    return 10;
  }
  temp = Math.floor(Math.random() * 9) + 1;
  return temp * 10;
};
const UNDER = () => { // 소수점
  let temp = (Math.random() * 1);
  temp = temp.toFixed(2);
  temp *= 1;
  if (temp === 0) {
    temp = UNDER();
  }
  return temp;
};
const graph = (num) => { // 그래프 함수
  let temp = 0;
  if (num === 0) {
    return 0; // 0
  } else if (num === 1) {
    temp = ONE() + UNDER();
    temp = temp.toFixed(2);
    return temp; // 1의자리
  } else if (num === 10) {
    temp = TEN() + ONE() + UNDER();
    temp = temp.toFixed(2);
    return temp; // 10의자리
  }
  return 100; // 100
};
let value = 0;
let temp;
let game = 0;

setInterval(() => {
  // console.log(`변하는 그래프 ${value}`);
  value = graph(digit());
  temp = value;
  temp *= 1000;
  temp = temp.toFixed();
  temp *= 1;
}, 3000);

const dobak = () => {
  if (game === 0) {
    console.log(`그래프 게임 시작: ${value}`);
    game = 1;
    setTimeout(() => {
      dobak();
    }, temp);
  } else if (game === 1) {
    console.log('그래프 게임 종료');
    game = 2;
    setTimeout(() => {
      dobak();
    }, 1000);
  } else if (game === 2) {
    console.log('쉬는 시간');
    game = 0;
    setTimeout(() => {
      dobak();
    }, 1500);
  }
};

dobak();
*/

const a = undefined;
console.log(typeof a);
console.log(Number.isNaN(a));
console.log(a);


let b = 1;
b = b.toFixed(2);
console.log(b);
