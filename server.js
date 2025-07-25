const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

app.set('trust proxy', 1); 
app.use(session({
    secret: 'kagawa-kosen-2025-very-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: true,
        sameSite: 'lax'
    }
}));

app.use(express.static(path.join(__dirname, 'public')));

function checkAuth(req, res, next) {
    if (req.session.loggedIn) {
        next();
    } else {
        res.redirect('/');
    }
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/login', (req, res) => {
    // Safe log: records that a login was attempted without logging the password.
    console.log(`Login attempt received at: ${new Date().toISOString()}`);

    const CORRECT_PASSWORD = '200910081842masaki';
    const { password } = req.body;

    if (password === CORRECT_PASSWORD) {
        req.session.loggedIn = true;
        req.session.save(() => {
            res.redirect('/timetable');
        });
    } else {
        res.redirect('/');
    }
});

app.get('/timetable', (req, res) => {
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

app.listen(PORT, () => {
    console.log(`サーバーがポート ${PORT} で起動しました`);
});