//
// app.js
//



// スコア初期データ
var INIT_SCORES = [
    {name:'----', score:500},
    {name:'----', score:400},
    {name:'----', score:300},
    {name:'----', score:200},
    {name:'----', score:100}
];


var mlkcca = new MilkCocoa('appleip86pp5s.mlkcca.com');
var ds = mlkcca.dataStore('score');
// スコアデータ
var scoreData = {
    id:null, data:[]
};


$('.game').blockrain({
    theme: 'candy',
    autoBlockWidth: true,
    onGameOver: game_onGameOver
});

setup();


//
// listener
//
function game_onGameOver (score) {
    // scoreにゲームスコアが入ってる
    var user = window.prompt('ユーザー名を入力してください', '名無し');
    rankSort(user, score);
}



// 初期設定
function setup() {
    ds.stream().next(function(err, result) {
        console.log('ds.stream().next');
        
        // DBにスコアが存在するか
        if (result[0] === undefined) {
            // スコアデータの初期設定
            scoreData.data.push(INIT_SCORES);
            ds.push(scoreData);
        } else {
            // DBからスコア取得
            scoreData.data.push(result[0].value.data[0]);
        }
        rankUpdate();
    });
}

// ランキングデータ表示
function rankUpdate() {
    // 数の取得
    var maxRank = scoreData.data[0].length;
    
    // 順番にページに表示
    for (var i = 0; i < maxRank; i++) {
        $('.name' + (i+1)).text(scoreData.data[0][i].name);
        $('.score' + (i+1)).text(scoreData.data[0][i].score);
    }
}

// ランキングデータ作成
function rankSort(user, score) {
    // スコアデータを最新にするためクリア
    scoreData.data = [];
    
    ds.stream().next(function(err, result) {
       // 最新データを取得
       scoreData.data.push(result[0].value.data[0]);
       
       // DB更新のため、ID取得
       scoreData.id = result[0].id;
       
       // ゲーム終了時のスコアを追加
       scoreData.data[0].push(
           {name:user, score:score}
       );
       
       // スコア順にソート
       scoreData.data[0].sort(function(a, b) {
          return b.score - a.score;
       });
       scoreData.data[0].pop();
       rankUpdate();
       
       // DBを更新
       ds.set(scoreData.id, scoreData);
    });
}


