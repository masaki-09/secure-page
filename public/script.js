// ページのHTMLがすべて読み込まれてから処理を開始する
document.addEventListener("DOMContentLoaded", () => {
    // タイムテーブルの要素があるページでのみ、以下の処理を実行する
    const table = document.querySelector("#schedule-table");
    if (!table) return; // テーブルがなければ、ここで処理を終了

    // 最初に一度テーブルを更新
    updateTable();

    // 更新ボタンがクリックされたときにもテーブルを更新
    const updateButton = document.querySelector("#update-button");
    updateButton.addEventListener("click", updateTable);
});

// GoogleスプレッドシートからCSVデータを読み込む関数
async function loadCSV(filePath) {
    const response = await fetch(filePath);
    const text = await response.text();
    return text;
}

// 読み込んだCSVテキストを、プログラムが扱いやすい配列形式に変換する関数
function parseCSV(csvText) {
    return csvText.split("\n").map(row => row.split(","));
}

// 配列データをもとに、HTMLのテーブルを組み立てる関数
function populateTable(data) {
    const tableBody = document.querySelector("#schedule-table tbody");
    if (!tableBody) return;
    tableBody.innerHTML = ""; // テーブルの中身を一度空にする

    // データの1行目（ヘッダー）を無視して、2行目から処理を開始
    data.slice(1).forEach(row => {
        if (row.length < 5) return; // データが不完全な行は無視
        const status = row[4]?.trim() || ""; // 5列目の「状態」を取得
        if (status === "非参照") return; // 状態が「非参照」の行は無視

        const tr = document.createElement("tr"); // テーブルの行（<tr>）を作成

        // 状態に応じて行のスタイルを変更
        if (status === "終了済") {
            tr.style.textDecoration = "line-through"; // 取り消し線
            tr.style.color = "#888"; // 文字を灰色に
        } else if (status === "進行中") {
            tr.style.backgroundColor = "rgba(255, 228, 181, 0.5)"; // 背景色をオレンジに
            tr.style.fontWeight = "bold"; // 文字を太字に
        }

        // 最初の4列のデータでテーブルのセル（<td>）を作成
        for (let i = 0; i < 4; i++) {
            const td = document.createElement("td");
            td.textContent = row[i]?.trim() || ""; // セルにテキストを設定
            tr.appendChild(td);
        }
        tableBody.appendChild(tr); // 完成した行をテーブルに追加
    });
}

// テーブル全体を更新するメインの関数
async function updateTable() {
    try {
        // キャッシュを避けるために、URLの末尾に現在の時刻を追加
        const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSJ_pdzvwNGa2bAbXCQ3hzDokTq0v33n4NROmEt6fD0W2WGgZQBYtsEvzdx4ZKtCHcsCkeG2GOvmpxf/pub?gid=914423484&single=true&output=csv&t=" + new Date().getTime();
        const csvText = await loadCSV(csvUrl);
        const data = parseCSV(csvText);
        populateTable(data);
    } catch (error) {
        console.error("エラーが発生しました:", error);
    }
}