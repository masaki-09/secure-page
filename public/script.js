document.addEventListener("DOMContentLoaded", () => {
    // ログインページにはテーブルがないので、存在チェックを追加
    const table = document.querySelector("#schedule-table");
    if (!table) return;

    updateTable();

    const updateButton = document.querySelector("#update-button");
    updateButton.addEventListener("click", updateTable);
});

async function loadCSV(filePath) {
    const response = await fetch(filePath);
    const text = await response.text();
    return text;
}

function parseCSV(csvText) {
    return csvText.split("\n").map(row => row.split(","));
}

function populateTable(data) {
    const tableBody = document.querySelector("#schedule-table tbody");
    if (!tableBody) return;
    tableBody.innerHTML = "";

    data.slice(1).forEach(row => {
        if (row.length < 5) return;
        const status = row[4]?.trim() || "";
        if (status === "非参照") return;

        const tr = document.createElement("tr");

        if (status === "終了済") {
            tr.style.textDecoration = "line-through";
            tr.style.color = "#888";
        } else if (status === "進行中") {
            tr.style.backgroundColor = "rgba(255, 228, 181, 0.5)";
            tr.style.fontWeight = "bold";
        }

        for (let i = 0; i < 4; i++) {
            const td = document.createElement("td");
            td.textContent = row[i]?.trim() || "";
            tr.appendChild(td);
        }
        tableBody.appendChild(tr);
    });
}

async function updateTable() {
    try {
        const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSJ_pdzvwNGa2bAbXCQ3hzDokTq0v33n4NROmEt6fD0W2WGgZQBYtsEvzdx4ZKtCHcsCkeG2GOvmpxf/pub?gid=914423484&single=true&output=csv&t=" + new Date().getTime();
        const csvText = await loadCSV(csvUrl);
        const data = parseCSV(csvText);
        populateTable(data);
    } catch (error) {
        console.error("エラーが発生しました:", error);
    }
}