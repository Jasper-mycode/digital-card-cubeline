document.addEventListener("DOMContentLoaded", () => {
    // 檢查設定檔是否存在
    if (typeof USER_PROFILE === 'undefined') {
        document.body.innerHTML = "<h3 style='text-align:center; margin-top:50px'>System Error: Config missing.</h3>";
        return;
    }

    const { info, theme, links } = USER_PROFILE;

    // 1. 設定主題色 (CSS Variable 注入)
    if (theme && theme.primaryColor) {
        document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
    }

    // 2. 渲染文字 (安全防護：使用 textContent)
    document.getElementById("ui-name").textContent = info.name;
    document.getElementById("ui-title").textContent = info.title;
    document.getElementById("ui-bio").textContent = info.bio;
    document.getElementById("ui-avatar").src = info.avatar;
    document.getElementById("year").textContent = new Date().getFullYear();

    // 3. 動態生成按鈕
    const container = document.getElementById("links-container");
    const labels = {
        github: "GitHub",
        linkedin: "LinkedIn",
        instagram: "Instagram",
        email: "Email Me",
        website: "Official Website",
        phone: "Contact"
    };

    Object.entries(links).forEach(([key, url]) => {
        if (!url || url.trim() === "") return; // 過濾空值

        const a = document.createElement("a");
        a.href = url;
        a.className = "link-btn";
        a.target = "_blank";
        a.rel = "noopener noreferrer"; // 資安標準：防止反向連結綁架
        
        // 簡單的圖示邏輯 (可擴充)
        a.textContent = labels[key] || key.toUpperCase();
        
        container.appendChild(a);
    });
});
