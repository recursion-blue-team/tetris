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

//効果音
const ROTATE_SOUND = new Audio("sounds/rotateSound.mp3");
const STACK_SOUND = new Audio("sounds/stackSound.mp3");
const DELETE_SOUND = new Audio("sounds/deleteSound.mp3");


// テトロミノの色
const TETRO_COLORS = [
    [0, 0, 0],          //0空
    [102, 204, 255],    //1水色
    [255, 153, 34],     //2オレンジ
    [102, 102, 255],    //3青
    [204, 85, 204],     //4紫
    [255, 221, 34],     //5黄色
    [255, 68, 68],      //6赤
    [85, 187, 85]       //7緑
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
let tetroType = Math.floor(Math.random() * (TETRO_TYPES.length - 1)) + 1;

// 描画対象のテトロミノ
let tetro = TETRO_TYPES[tetroType];

// ホールドしたテトロミノの形
let holdingTetroType = 0;

// ホールドしたテトロミノ
let holdingTetro = undefined;

//フィールド本体を一次元配列とする
let field = [];

// ゲームオーバーを判定するフラグ
let gameOver = false;

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
}


initialize();
drawAll();


let isDropping;
// 一時停止ボタン
const buttonStop = document.getElementById("action-stop");
buttonStop.addEventListener("click", ()=>{
    if(isDropping){
        dropStop();
        buttonStop.innerHTML =
        `
        <svg xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 24 24" stroke-width="1.5" stroke="white">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
        </svg>
        `;
    }else{
        dropStart();
        buttonStop.innerHTML =
        `
        <svg xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 24 24" stroke-width="1.5" stroke="white">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 019 14.437V9.564z" />
        </svg>
        `;
    }
});



//一定間隔でdropTetroを呼び出します
function dropStart()
{
    startDrop = setInterval(dropTetro, DROP_SPEED);
    isDropping = true;
}
dropStart();


// 一時停止処理
function dropStop()
{
    clearInterval(startDrop);
    isDropping = false;
}


//テトロミノを落下させる関数です
function dropTetro()
{
    if(gameOver) return;

    if(canMove(0, 1)) tetroY++;
    if(!canMove(0, 1))
    {
        fixTetro();
        deleteLine();

        tetroType = Math.floor(Math.random() * (TETRO_TYPES.length - 1)) + 1;
        tetro = TETRO_TYPES[tetroType];
        tetroX = START_X;
        tetroY = START_Y;

        if(!canMove(0, 0))
        {
            gameOver = true;
        }
    }
    drawAll();
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
                STACK_SOUND.currentTime = 0;
                STACK_SOUND.play();
            }
        }
    }

}

//一行そろった時にブロックを消す関数です。
function deleteLine()
{
    for(let y = 0; y < FIELD_ROW; y++)
    {
        let flag = true;
        for(let x = 0; x < FIELD_COL; x++)
        {
            if(!field[y][x])
            {
                flag = false;
                break;
            }
        }
        if(flag)

            for(let newY = y; newY > 0; newY--)
            {
                for(let newX = 0; newX < FIELD_ROW; newX++)
                {
                    field[newY][newX] = field[newY-1][newX];
                    DELETE_SOUND.currentTime = 0;
                    DELETE_SOUND.play();
                }
            }
    }
}


//ブロック一つを描画する関数です
function drawBlock(x, y, color, alpha = 1)
{
    let px = x * BLOCK_SIZE;
    let py = y * BLOCK_SIZE;
    let r, g, b;
    [r, g, b] = TETRO_COLORS[color];
    context.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    context.fillRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
    context.strokeStyle = `rgba(0, 0, 0, ${alpha})`;    //黒色
    context.strokeRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
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

function drawPredictedLandingPoint()
{
    let dummyTetro = tetro;
    let dummyMovementX = 0;
    let dummyMovementY = 0;
    while(canMove(dummyMovementX, dummyMovementY + 1, dummyTetro)){
        dummyMovementY++;
    }

    for(let y = 0; y < TETRO_SIZE; y++)
    {
        for(let x = 0; x < TETRO_SIZE; x++)
        {
            if(tetro[y][x])
            {
                drawBlock(tetroX + dummyMovementX + x, tetroY + dummyMovementY + y, tetroType, 0.4)
            }
        }
    }
}

function drawAll(){
    drawField();
    drawTetro();
    drawPredictedLandingPoint();

    if(gameOver)
    {
        let msg = "GAME OVER";
        context.font = "40px 'MS ゴシック'";
        let msgWidth = context.measureText(msg).width;
        let x = SCREEN_WIDTH / 2 - msgWidth / 2;
        let y = SCREEN_HEIGHT / 2 - 20;
        context.lineWidth = 4;
        context.strokeText(msg, x, y);
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
    ROTATE_SOUND.currentTime = 0;
    ROTATE_SOUND.play();
    return newTetro;
}

// ホールド機能
function holdTetro()
{
    if(holdingTetro !== undefined)
    {
        // フィールド中のテトロミノとホールドしたテトロミノの入れ替え
        [tetroType, holdingTetroType] = [holdingTetroType, tetroType];
        [tetro, holdingTetro] = [holdingTetro, tetro];
    }
    else
    {
        // ホールドしているテトロミノがないとき（初回のホールド）は新たにテトロミノを作成する
        holdingTetroType = tetroType;
        holdingTetro = tetro;
        tetroType = Math.floor(Math.random() * (TETRO_TYPES.length - 1)) + 1;
        tetro = TETRO_TYPES[tetroType];
        tetroX = START_X;
        tetroY = START_Y;
        console.log(holdingTetroType);
    }
}

// ボタンによる入力
document.getElementById("arrow-left-btn").addEventListener("click", function(){
    document.dispatchEvent(new KeyboardEvent( "keydown", {key: "ArrowLeft"}));
})
document.getElementById("arrow-right-btn").addEventListener("click", function(){
    document.dispatchEvent(new KeyboardEvent( "keydown", {key: "ArrowRight"}));
})
document.getElementById("arrow-down-btn").addEventListener("click", function(){
    document.dispatchEvent(new KeyboardEvent( "keydown", {key: "ArrowDown"}));
})
document.getElementById("arrow-up-btn").addEventListener("click", function(){
    document.dispatchEvent(new KeyboardEvent( "keydown", {key: "ArrowUp"}));
})
document.getElementById("space-btn").addEventListener("click", function(){
    console.log("aaa")
    document.dispatchEvent(new KeyboardEvent( "keydown", {key: "Space"}));
})

// テトロミノを移動するイベント関数です。
document.onkeydown = function(e)
{
    if(gameOver) return;
    switch(e.key)
    {
        case "ArrowLeft": // ←
            if( (isDropping) && (canMove(-1, 0)) ) tetroX--;
            break;
        case "ArrowRight": // →
            if( (isDropping) && (canMove(1, 0)) ) tetroX++;
            break;
        case "ArrowDown": // ↓
            while( (isDropping) && (canMove(0, 1)) ) tetroY++;
            break;
        case "ArrowUp": // ↑
            let newTetro = rotate();
            if( (isDropping) && (canMove(0, 0, newTetro)) ) tetro = newTetro; //回転する先にテトロミノor壁がない場合、回転できる
            break;
        case "Space": //スペース
            holdTetro();
            break;
    }
    drawAll();
}
