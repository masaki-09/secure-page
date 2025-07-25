const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

// プロキシサーバーを信頼する設定
app.set('trust proxy', 1); 

// セッションの設定
app.use(session({
    secret: 'kagawa-kosen-2025-very-secret', // より複雑な秘密鍵に変更
    resave: false,
    saveUninitialized: false, // 変更がないセッションは保存しない
    cookie: { 
        secure: true, // HTTPSでのみCookieを送信
        sameSite: 'lax' // クロスサイトリクエストに対してのセキュリティ設定
    }
}));

app.use(express.static(path.join(__dirname, 'public')));

// ログイン状態をチェックする関数（診断コード追加）
function checkAuth(req, res, next) {
    // ★ 診断ログ：リクエストごとにセッションの中身を確認
    console.log('Auth Check on:', req.path, '| Session loggedIn:', req.session.loggedIn);

    if (req.session.loggedIn) {
        next();
    } else {
        res.redirect('/');
    }
}

// ログインページ
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ログイン処理（診断コード追加）
app.post('/login', (req, res) => {
    const CORRECT_PASSWORD = '200910081842masaki';
    const { password } = req.body;

    if (password === CORRECT_PASSWORD) {
        // ★ 診断ログ：パスワードが正しいことを確認
        console.log('Password correct. Setting session...');
        req.session.loggedIn = true;
        
        req.session.save((err) => {
            if (err) {
                // ★ 診断ログ：セッション保存に失敗した場合
                console.error('Session save error:', err);
                return res.redirect('/');
            }
            // ★ 診断ログ：セッション保存が成功したことを確認
            console.log('Session saved. Redirecting to timetable...');
            res.redirect('/timetable');
        });
    } else {
        // ★ 診断ログ：パスワードが間違っていた場合
        console.log('Password incorrect.');
        res.redirect('/');
    }
});

// タイムテーブルページ
app.get('/timetable', checkAuth, (req, res) => {
    // ★ 診断ログ：タイムテーブルページへのアクセスが成功したことを確認
    console.log('Successfully accessed timetable page.');
    
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

// サーバー起動
app.listen(PORT, () => {
    console.log(`サーバーがポート ${PORT} で起動しました`);
});