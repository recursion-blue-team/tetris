//HTMLで図形を表示する機能のcanvas apiと二次元描画contextの取得
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");


const BLOCK_SIZE = 30;


context.fillStyle ="red";
context.fillRect(0, 0, 50, 50);