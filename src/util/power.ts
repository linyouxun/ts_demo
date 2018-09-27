import { getCookie } from './tools';
import { power } from './const';
let userLeve = 1;
let userName = '';
if (!!window) {
  userLeve = window.userLeve || +(getCookie('leve') || power.general);
  userName = window.userName || (getCookie('name') || '未知');
}

export default {
   userLeve,
   userName
}
