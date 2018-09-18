import { getCookie } from './tools';
let userLeve = 1;
let userName = '';
if (!!window) {
  userLeve = window.userLeve || +(getCookie('leve') || 1);
  userName = window.userName || (getCookie('name') || '未知');
}

export default {
   userLeve,
   userName
}
