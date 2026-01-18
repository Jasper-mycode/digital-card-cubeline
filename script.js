document.addEventListener("DOMContentLoaded", () => {
    // 1. 從網址取得 User ID (例如: index.html?id=jasper)
    const urlParams = new URLSearchParams(window.location.search);
    // 如果網址沒有 id，預設載入 'demo' (或是你可以改成 'jasper' 當作預設值)
    const userId = urlParams.get('id');

    if (!userId) {
        showError("歡迎使用數位名片系統<br><small>請在網址後方加上 ?id=您的ID</small>");
        return;
    }

    // 2. 動態載入該使用者的 config.js
    loadUserConfig(userId);
});

function loadUserConfig(userId) {
    const script = document.createElement('script');
    // 指向正確的路徑： u/{userId}/config.js
    script.src = `u/${userId}/config.js?t=${Date.now()}`; // 加入時間戳記防止快取
    
    script.onload = () => {
        // 下載成功後，執行渲染
        renderProfile();
    };

    script.onerror = () => {
        // 下載失敗 (找不到該 User)
        showError(`找不到使用者: ${userId}<br><small>請確認 ID 是否正確</small>`);
    };

    document.head.appendChild(script);
}

function renderProfile() {
    // 檢查 Config 是否真的載入成功
    if (typeof USER_PROFILE === 'undefined') {
        showError("System Error: Config format invalid.");
        return;
    }

    const { info, theme, links } = USER_PROFILE;

    // A. 設定主題色
    if (theme && theme.primaryColor) {
        document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
    }

    // B. 渲染文字 (安全寫入)
    setText("ui-name", info.name);
    setText("ui-title", info.title);
    setText("ui-bio", info.bio);
    
    const avatarEl = document.getElementById("ui-avatar");
    if (avatarEl) {
        // 如果沒有設定頭像，使用預設圖
        avatarEl.src = info.avatar || "https://via.placeholder.com/150";
    }
    
    // 更新年份
    const yearEl = document.getElementById("year");
    if(yearEl) yearEl.textContent = new Date().getFullYear();

    // C. 動態生成按鈕
    const container = document.getElementById("links-container");
    container.innerHTML = ""; // 清空舊內容

    const labels = {
        github: "GitHub",
        linkedin: "LinkedIn",
        instagram: "Instagram",
        email: "Email Me",
        website: "Official Website",
        phone: "Contact"
    };

    Object.entries(links).forEach(([key, url]) => {
        if (!url || url.trim() === "") return;

        const a = document.createElement("a");
        a.href = url;
        a.className = "link-btn";
        a.target = "_blank";
        a.rel = "noopener noreferrer";

        // 如果是 Email，加上 mailto: (雙重防呆)
        if (key === 'email' && !url.startsWith('mailto:')) {
            a.href = 'mailto:' + url;
        }

        a.textContent = labels[key] || key.toUpperCase();
        container.appendChild(a);
    });
}

// 輔助函式：設定文字並檢查元素是否存在
function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text || "";
}

// 輔助函式：顯示錯誤畫面
function showError(msg) {
    document.body.innerHTML = `
        <div style="text-align:center; padding:50px; font-family:sans-serif; color:#666;">
            <h2 style="color:#e74c3c;">⚠️ Error</h2>
            <p>${msg}</p>
        </div>
    `;
}
