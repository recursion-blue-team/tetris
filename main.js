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


const TETRO_TYPES = [

//0.空
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


// テトロミノの初期座標
let tetro_x = 0;
let tetro_y = 0;

// 描画対象のテトロミノ
let tetro = TETRO_TYPES[3];


draw_tetro();

//テトロミノを描画する関数です
function draw_tetro()
{   
    context.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    for(let y = 0; y < TETRO_SIZE; y++)
    {
        for(let x = 0; x < TETRO_SIZE; x++)
        {
            if(tetro[y][x])
            {
                let px = (tetro_x + x) * BLOCK_SIZE;
                let py = (tetro_y + y) * BLOCK_SIZE;
                context.fillStyle = "red";
                context.fillRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
                context.strokeStyle = "black";
                context.strokeRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}


// テトロミノの移動するイベント関数です。
document.onkeydown = function(e)
{    
    switch(e.key)
    { 
        case "ArrowLeft": // ←
            tetro_x--;
            break;
        case "ArrowUp": // ↑
            tetro_y--;
            break;
        case "ArrowRight": // →
            tetro_x++;
            break;
        case "ArrowDown": // ↓
            tetro_y++;
            break;
        case "Space": // スペースキー(回転)
            //回転する処理が入ります。
            break;
    }
    draw_tetro();
} 