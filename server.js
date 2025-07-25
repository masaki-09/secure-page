const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
// ★ ここにあった const PORT = 3000; は削除しました

// フォームから送信されたデータを解析するための設定
app.use(express.urlencoded({ extended: true }));

// セッション（ログイン状態の記憶）を使うための設定
app.use(session({
    secret: 'kagawa-kosen-2025',
    resave: false,
    saveUninitialized: true,
}));

// publicフォルダを静的ファイル（CSS, JSなど）の置き場所として指定
app.use(express.static(path.join(__dirname, 'public')));

// ログイン状態をチェックする関数
function checkAuth(req, res, next) {
    if (req.session.loggedIn) {
        next();
    } else {
        res.redirect('/');
    }
}

// ルートURL ("/") にアクセスがあった時の処理
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// パスワードが送信された時 ("/login") の処理
app.post('/login', (req, res) => {
    // ★ パスワードはここで設定します
    const CORRECT_PASSWORD = 'test';
    const { password } = req.body;

    if (password === CORRECT_PASSWORD) {
        req.session.loggedIn = true;
        res.redirect('/timetable');
    } else {
        res.redirect('/');
    }
});

// タイムテーブルページ ("/timetable") の処理
app.get('/timetable', checkAuth, (req, res) => {
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
// ★ PORTの宣言は、ここに1つだけ残します
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`サーバーがポート ${PORT} で起動しました`);
});