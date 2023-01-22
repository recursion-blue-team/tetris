//HTMLで図形を表示する機能のcanvas apiと二次元描画contextの取得
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

//ブロック１単位のピクセルサイズ
const BLOCK_SIZE = 30;
//テトロミノのサイズ
const TETRO_SIZE = 4;


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

// 描画対象のテトロミノ
let tetro = TETRO_TYPES[3];

// canvasに描画
for(let y = 0; y < TETRO_SIZE; y++)
{
    for(let x = 0; x < TETRO_SIZE; x++)
    {
        if(tetro[x][y])
        {
            let px = x * BLOCK_SIZE;
            let py = y * BLOCK_SIZE;
            context.fillStyle = "red";
            context.fillRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
            context.strokeStyle = "black";
            context.strokeRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
        }
    }
}