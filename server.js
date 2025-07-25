const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = 3000;

// ★ここに好きなパスワードを設定
const CORRECT_PASSWORD = '200910081842masaki';

// フォームから送信されたデータを解析するための設定
app.use(express.urlencoded({ extended: true }));

// セッション（ログイン状態の記憶）を使うための設定
app.use(session({
    secret: 'kagawa-kosen-2025', // ★この文字列はランダムなものに変更してください
    resave: false,
    saveUninitialized: true,
}));

// publicフォルダを、CSSやJSファイルを置く場所としてサーバーに教える
app.use(express.static(path.join(__dirname, 'public')));

// ログイン状態をチェックする関数
function checkAuth(req, res, next) {
    if (req.session.loggedIn) {
        next(); // ログイン済みなら、リクエストされた処理を続ける
    } else {
        res.redirect('/'); // 未ログインなら、ログインページに強制的に戻す
    }
}

// 1. ログインページへのアクセスがあった時の処理
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 2. パスワードが送信された時の処理
app.post('/login', (req, res) => {
    const { password } = req.body;
    if (password === CORRECT_PASSWORD) {
        req.session.loggedIn = true; // パスワードが合っていれば「ログイン済み」と記憶
        res.redirect('/timetable'); // タイムテーブルページへ移動
    } else {
        res.redirect('/'); // 間違っていればログインページに戻る
    }
});

// 3. タイムテーブルページへのアクセスがあった時の処理
//    必ず checkAuth を経由するので、未ログインの人はアクセスできない
app.get('/timetable', checkAuth, (req, res) => {
    // ログイン済みの人にだけ、タイムテーブルのHTMLを送信する
    res.send(`
        <!DOCTYPE html>
        <html lang="ja">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="/style.css">
            <title>高専カンファタイムテーブル</title>
        </head>
        <body>
            <h1>24sカンファ登壇タイムテーブル</h1>
            <button id="update-button">更新</button>
            <table border="1" id="schedule-table">
                <thead>
                <tr>
                    <th>開始時刻</th>
                    <th>終了時刻</th>
                    <th>登壇者</th>
                    <th>内容</th>
                </tr>
                </thead>
                <tbody></tbody>
            </table>
            <script src="/script.js"></script>
        </body>
        </html>
    `);
});

// サーバーを起動
const PORT = process.env.PORT || 3000; // Renderが指定するポート、なければ3000番を使う

app.listen(PORT, () => {
    console.log(`サーバーがポート ${PORT} で起動しました`);
});