//HTMLで図形を表示する機能のcanvas apiと二次元描画contextの取得
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");


//ブロック１単位のピクセルサイズ
const BLOCK_SIZE = 30;
//テトロミノのサイズ
const TETRO_SIZE = 4;

//フィールドサイズ(縦、横)
const FIELD_COL = 10;
const FIELD_ROW = 20;

//キャンバスサイズ
const SCREEN_WIDTH = BLOCK_SIZE * FIELD_COL; // 300px
const SCREEN_HEIGHT = BLOCK_SIZE * FIELD_ROW; // 600px
canvas.width = SCREEN_WIDTH;
canvas.height = SCREEN_HEIGHT;
canvas.style.border = "4px solid #555";

//テトロミノが落ちるスピード
const DROP_SPEED = 600;

// テトロミノの色
const TETRO_COLORS = [
	"#000",			//0空
	"#6CF",			//1水色
	"#F92",			//2オレンジ
	"#66F",			//3青
	"#C5C",			//4紫
	"#FD2",			//5黄色
	"#F44",			//6赤
	"#5B5"			//7緑
];

const TETRO_TYPES = [
// 0.空
    [],

// 1.I
    [
        [ 0, 0, 0, 0 ],
        [ 1, 1, 1, 1 ],
        [ 0, 0, 0, 0 ],
        [ 0, 0, 0, 0 ]
    ],

// 2.L
    [
        [ 0, 1, 0, 0 ],
        [ 0, 1, 0, 0 ],
        [ 0, 1, 1, 0 ],
        [ 0, 0, 0, 0 ]
    ],

// 3.J
    [
        [ 0, 0, 1, 0 ],
        [ 0, 0, 1, 0 ],
        [ 0, 1, 1, 0 ],
        [ 0, 0, 0, 0 ]
    ],

// 4.T
    [
        [ 0, 1, 0, 0 ],
        [ 0, 1, 1, 0 ],
        [ 0, 1, 0, 0 ],
        [ 0, 0, 0, 0 ]
    ],

// 5.O
    [
        [ 0, 0, 0, 0 ],
        [ 0, 1, 1, 0 ],
        [ 0, 1, 1, 0 ],
        [ 0, 0, 0, 0 ]
    ],

// 6.Z
    [
        [ 0, 0, 0, 0 ],
        [ 1, 1, 0, 0 ],
        [ 0, 1, 1, 0 ],
        [ 0, 0, 0, 0 ]
    ],

// 7.S
    [
        [ 0, 0, 0, 0 ],
        [ 0, 1, 1, 0 ],
        [ 1, 1, 0, 0 ],
        [ 0, 0, 0, 0 ]
    ]
];


const START_X = FIELD_COL / 2 - TETRO_SIZE / 2;
const START_Y = 0;

// テトロミノの初期座標
let tetroX = START_X;
let tetroY = START_Y;

// テトロミノの形
let tetroType = Math.floor(Math.random() * (TETRO_TYPES.length - 1));

// 描画対象のテトロミノ
let tetro = TETRO_TYPES[tetroType];

//フィールド本体を一次元配列とする
let field = [];

//二次元配列にしてフィールドを初期化する関数です
function initialize()
{
    for (let y = 0; y < FIELD_ROW; y++)
    {
        field[y] = [];
        for (let x = 0; x < FIELD_COL; x++)
        {
            field[y][x] = 0;
        }
    }

    //テストで表示しているブロック
    field[19][9] = 1;
}

//フィールドを表示する関数です
function drawField()
{
    context.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    for(let y = 0; y < FIELD_ROW; y++)
    {
        for(let x = 0; x < FIELD_COL; x++)
        {
            if(field[y][x])
            {
                drawBlock(x, y, field[y][x]);
            }
        }
    }
}


initialize();
drawField();
drawTetro();

//一定間隔でdropTetroを呼び出します
setInterval(dropTetro, DROP_SPEED);


//テトロミノを落下させる関数です
function dropTetro()
{
    if(canMove(0, 1)) tetroY++;
    else
    {
        fixTetro();
        tetroType = Math.floor(Math.random() * (TETRO_TYPES.length - 1)) + 1;
        tetro = TETRO_TYPES[tetroType];
        tetroX = START_X;
        tetroY = START_Y;
    }
    drawField();
    drawTetro();
}


//テトロミノを落下させた後固定する関数です
function fixTetro()
{
    for(let y = 0; y < TETRO_SIZE; y++)
    {
        for(let x = 0; x < TETRO_SIZE; x++)
        {
            if(tetro[y][x])
            {
                field[tetroY + y][tetroX + x] = tetroType;
            }
        }
    }

}


//ブロック一つを描画する関数です
function drawBlock(x, y, color)
{
    let px = x * BLOCK_SIZE;
    let py = y * BLOCK_SIZE;
    context.fillStyle = TETRO_COLORS[color];
    context.fillRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
    context.strokeStyle = "black";
    context.strokeRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
}

//テトロミノを描画する関数です
function drawTetro()
{
    for(let y = 0; y < TETRO_SIZE; y++)
    {
        for(let x = 0; x < TETRO_SIZE; x++)
        {
            if(tetro[y][x])
            {
                drawBlock(tetroX + x, tetroY + y, tetroType)
            }
        }
    }
}

// ブロックの当たり判定
function canMove(movementX, movementY, newTetro = tetro)
{
    for(let y = 0; y < TETRO_SIZE; y++)
    {
        for(let x = 0; x < TETRO_SIZE; x++)
        {
            if(newTetro[y][x])
            {
                let newX = tetroX + movementX + x;
                let newY = tetroY + movementY + y;
                if(newY < 0 || newY >= FIELD_ROW || // yがフィールド外に出るとき
                    newX < 0 || newX >= FIELD_COL || // xがフィールド外に出るとき
                    field[newY][newX]) return false; // 移動地点にブロックがあるとき
            }
        }
    }
    return true;
}


//テトロミノを回転させる関数です。
function rotate()
{
    let newTetro = [];
    for(let y = 0; y < TETRO_SIZE; y++)
    {
        newTetro[y] = [];
        for(let x = 0; x < TETRO_SIZE; x++)
        {
            newTetro[y][x] = tetro[TETRO_SIZE - x -1][y];
        }
    }
    return newTetro;

}

// テトロミノを移動するイベント関数です。
document.onkeydown = function(e)
{
    switch(e.key)
    {
        case "ArrowLeft": // ←
            if(canMove(-1, 0)) tetroX--;
            break;
        case "ArrowRight": // →
            if(canMove(1, 0)) tetroX++;
            break;
        case "ArrowDown": // ↓
            if(canMove(0, 1)) tetroY++;
            break;
        case "ArrowUp": // スペースキー
            let newTetro = rotate();
            if(canMove(0, 0, newTetro)) tetro = newTetro; //回転する先にテトロミノor壁がない場合、回転できる
            break;
    }
    drawField();
    drawTetro();
}