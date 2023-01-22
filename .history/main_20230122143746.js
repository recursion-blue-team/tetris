//HTMLで図形を表示する機能のcanvas apiと二次元描画contextの取得
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

//ブロック１単位のピクセルサイズ
const BLOCK_SIZE = 30;
//テトロミノのサイズ
const TETRO_SIZE = 4;

const TETRO_TYPES = [
    [0, 0, 0, 0],
    [1, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
];

context.fillStyle ="red";
context.fillRect(0, 0, 50, 50);

