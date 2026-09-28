"use strict";

const STORAGE_KEY = "python-flex-studio-lessons-v1";
const LIFF_STORAGE_KEY = "python-flex-studio-liff-id";
const DEFAULT_LIFF_ID = "2011771258-REkhfekt";

const defaultLessons = [
  {
    title: "Python 是什麼？",
    description: "認識 Python、安裝環境，並完成你的第一支 Hello World 程式。",
    buttonText: "開始學習",
    url: "https://example.com/python/lesson-1",
    color: "#06C755",
  },
  {
    title: "變數與資料型別",
    description: "學習變數、字串、整數、浮點數與布林值的基本概念。",
    buttonText: "開始學習",
    url: "https://example.com/python/lesson-2",
    color: "#3776AB",
  },
  {
    title: "輸入與輸出",
    description: "使用 print() 顯示結果，並透過 input() 接收使用者輸入。",
    buttonText: "開始學習",
    url: "https://example.com/python/lesson-3",
    color: "#FFD43B",
  },
  {
    title: "if 條件判斷",
    description: "學會 if、elif、else，讓程式根據不同條件做出不同決定。",
    buttonText: "開始學習",
    url: "https://example.com/python/lesson-4",
    color: "#7C5CFC",
  },
  {
    title: "for 與 while 迴圈",
    description: "讓 Python 自動重複執行工作，了解 for 與 while 的使用方式。",
    buttonText: "開始學習",
    url: "https://example.com/python/lesson-5",
    color: "#F28C28",
  },
  {
    title: "List 串列",
    description: "學習如何用 List 儲存多筆資料，以及新增、刪除與修改內容。",
    buttonText: "開始學習",
    url: "https://example.com/python/lesson-6",
    color: "#00A9A5",
  },
  {
    title: "Dictionary 字典",
    description: "使用 Key 與 Value 儲存資料，建立更有結構的 Python 資料。",
    buttonText: "開始學習",
    url: "https://example.com/python/lesson-7",
    color: "#E65A8D",
  },
  {
    title: "Function 函式",
    description: "學會 def、參數與 return，把重複程式碼整理成可以重複使用的函式。",
    buttonText: "開始學習",
    url: "https://example.com/python/lesson-8",
    color: "#2F78C4",
  },
  {
    title: "錯誤處理",
    description: "使用 try 與 except 處理錯誤，避免程式遇到問題就直接停止。",
    buttonText: "開始學習",
    url: "https://example.com/python/lesson-9",
    color: "#E25555",
  },
  {
    title: "完成第一個小專案",
    description: "綜合前面的知識，製作一個簡單的猜數字遊戲。",
    buttonText: "開始挑戰",
    url: "https://example.com/python/lesson-10",
    color: "#0B1612",
  },
];

const elements = {
  lessonList: document.getElementById("lessonList"),
  lessonForm: document.getElementById("lessonForm"),
  lessonNumber: document.getElementById("lessonNumber"),
  titleInput: document.getElementById("titleInput"),
  descriptionInput: document.getElementById("descriptionInput"),
  buttonTextInput: document.getElementById("buttonTextInput"),
  urlInput: document.getElementById("urlInput"),
  colorInput: document.getElementById("colorInput"),
  colorValue: document.getElementById("colorValue"),
  titleCount: document.getElementById("titleCount"),
  descriptionCount: document.getElementById("descriptionCount"),
  previewCarousel: document.getElementById("previewCarousel"),
  previewDots: document.getElementById("previewDots"),
  previousButton: document.getElementById("previousButton"),
  nextButton: document.getElementById("nextButton"),
  resetButton: document.getElementById("resetButton"),
  shareButton: document.getElementById("shareButton"),
  saveState: document.getElementById("saveState"),
  toast: document.getElementById("toast"),
  settingsDialog: document.getElementById("settingsDialog"),
  settingsForm: document.getElementById("settingsForm"),
  openSettingsButton: document.getElementById("openSettingsButton"),
  liffIdInput: document.getElementById("liffIdInput"),
  saveSettingsButton: document.getElementById("saveSettingsButton"),
  connectionDot: document.getElementById("connectionDot"),
  connectionTitle: document.getElementById("connectionTitle"),
  connectionMessage: document.getElementById("connectionMessage"),
  jsonDialog: document.getElementById("jsonDialog"),
  openJsonButton: document.getElementById("openJsonButton"),
  jsonEditor: document.getElementById("jsonEditor"),
  jsonError: document.getElementById("jsonError"),
  copyJsonButton: document.getElementById("copyJsonButton"),
  downloadJsonButton: document.getElementById("downloadJsonButton"),
  applyJsonButton: document.getElementById("applyJsonButton"),
};

let lessons = loadLessons();
let selectedIndex = 0;
let liffReady = false;
let toastTimer = null;

function cloneDefaults() {
  return defaultLessons.map((lesson) => ({ ...lesson }));
}

function loadLessons() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved) && saved.length === 10 && saved.every(isValidLesson)) {
      return saved;
    }
  } catch (error) {
    console.warn("Could not load saved lessons", error);
  }
  return cloneDefaults();
}

function isValidLesson(lesson) {
  return Boolean(
    lesson &&
      typeof lesson.title === "string" &&
      typeof lesson.description === "string" &&
      typeof lesson.buttonText === "string" &&
      typeof lesson.url === "string" &&
      /^#[0-9a-f]{6}$/i.test(lesson.color),
  );
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) return "https://example.com";
  try {
    const url = new URL(trimmed);
    if (url.protocol === "http:" || url.protocol === "https:") return url.href;
  } catch (_error) {
    // The editor displays a clear validation error before sharing.
  }
  return trimmed;
}

function buildBubble(lesson, index) {
  return {
    type: "bubble",
    size: "kilo",
    body: {
      type: "box",
      layout: "vertical",
      paddingAll: "20px",
      contents: [
        {
          type: "text",
          text: `LESSON ${String(index + 1).padStart(2, "0")}`,
          size: "xs",
          color: lesson.color,
          weight: "bold",
        },
        {
          type: "text",
          text: lesson.title || "未命名課程",
          size: "xl",
          weight: "bold",
          wrap: true,
          margin: "md",
        },
        {
          type: "text",
          text: lesson.description || "請輸入課程說明。",
          size: "sm",
          color: "#66736C",
          wrap: true,
          margin: "md",
        },
      ],
    },
    footer: {
      type: "box",
      layout: "vertical",
      paddingAll: "12px",
      contents: [
        {
          type: "button",
          style: "primary",
          color: "#0B1612",
          height: "sm",
          action: {
            type: "uri",
            label: lesson.buttonText || "開始學習",
            uri: normalizeUrl(lesson.url),
          },
        },
      ],
    },
    styles: {
      body: { separator: false },
      footer: { separator: true },
    },
  };
}

function buildFlexData() {
  return {
    type: "carousel",
    contents: lessons.map(buildBubble),
  };
}

function renderLessonList() {
  elements.lessonList.innerHTML = lessons
    .map(
      (lesson, index) => `
        <button
          class="lesson-item${index === selectedIndex ? " active" : ""}"
          type="button"
          data-lesson-index="${index}"
          aria-current="${index === selectedIndex ? "true" : "false"}"
        >
          <span class="lesson-index">${String(index + 1).padStart(2, "0")}</span>
          <span class="lesson-name">${escapeHtml(lesson.title || "未命名課程")}</span>
          <span class="lesson-arrow" aria-hidden="true">›</span>
        </button>
      `,
    )
    .join("");
}

function renderEditor() {
  const lesson = lessons[selectedIndex];
  elements.lessonNumber.textContent = `LESSON ${String(selectedIndex + 1).padStart(2, "0")}`;
  elements.titleInput.value = lesson.title;
  elements.descriptionInput.value = lesson.description;
  elements.buttonTextInput.value = lesson.buttonText;
  elements.urlInput.value = lesson.url;
  elements.colorInput.value = lesson.color;
  elements.colorValue.value = lesson.color.toUpperCase();
  elements.titleCount.textContent = lesson.title.length;
  elements.descriptionCount.textContent = lesson.description.length;
  elements.previousButton.disabled = selectedIndex === 0;
  elements.nextButton.disabled = selectedIndex === lessons.length - 1;
}

function renderPreview() {
  elements.previewCarousel.innerHTML = lessons
    .map(
      (lesson, index) => `
        <article class="flex-card" data-preview-index="${index}">
          <div class="flex-card-top" style="background:${escapeHtml(lesson.color)}"></div>
          <div class="flex-card-body">
            <span class="flex-lesson-label" style="color:${escapeHtml(lesson.color)}">
              LESSON ${String(index + 1).padStart(2, "0")}
            </span>
            <h3>${escapeHtml(lesson.title || "未命名課程")}</h3>
            <p>${escapeHtml(lesson.description || "請輸入課程說明。")}</p>
          </div>
          <div class="flex-card-footer">
            <span class="flex-card-action">${escapeHtml(lesson.buttonText || "開始學習")}</span>
          </div>
        </article>
      `,
    )
    .join("");

  elements.previewDots.innerHTML = lessons
    .map(
      (_, index) =>
        `<span class="carousel-dot${index === selectedIndex ? " active" : ""}"></span>`,
    )
    .join("");

  requestAnimationFrame(() => scrollPreviewTo(selectedIndex, false));
}

function scrollPreviewTo(index, smooth = true) {
  const card = elements.previewCarousel.querySelector(`[data-preview-index="${index}"]`);
  if (!card) return;
  elements.previewCarousel.scrollTo({
    left: card.offsetLeft - elements.previewCarousel.offsetLeft,
    behavior: smooth ? "smooth" : "auto",
  });
}

function renderAll() {
  renderLessonList();
  renderEditor();
  renderPreview();
}

function selectLesson(index) {
  const nextIndex = Math.max(0, Math.min(lessons.length - 1, Number(index)));
  selectedIndex = nextIndex;
  renderLessonList();
  renderEditor();
  renderPreview();
}

function saveLessons() {
  elements.saveState.textContent = "儲存中…";
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lessons));
  window.setTimeout(() => {
    elements.saveState.textContent = "已儲存在此裝置";
  }, 220);
}

function updateSelectedLesson() {
  lessons[selectedIndex] = {
    title: elements.titleInput.value,
    description: elements.descriptionInput.value,
    buttonText: elements.buttonTextInput.value,
    url: elements.urlInput.value,
    color: elements.colorInput.value.toUpperCase(),
  };
  elements.colorValue.value = elements.colorInput.value.toUpperCase();
  elements.titleCount.textContent = elements.titleInput.value.length;
  elements.descriptionCount.textContent = elements.descriptionInput.value.length;
  saveLessons();
  renderLessonList();
  renderPreview();
}

function showToast(message, type = "success") {
  window.clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.toggle("error", type === "error");
  elements.toast.classList.add("visible");
  toastTimer = window.setTimeout(() => elements.toast.classList.remove("visible"), 3400);
}

function setConnectionState(state, title, message) {
  elements.connectionDot.className = `status-dot${state ? ` ${state}` : ""}`;
  elements.connectionTitle.textContent = title;
  elements.connectionMessage.textContent = message;
}

function validateForShare() {
  for (let index = 0; index < lessons.length; index += 1) {
    const lesson = lessons[index];
    if (!lesson.title.trim() || !lesson.description.trim() || !lesson.buttonText.trim()) {
      return `第 ${index + 1} 堂課仍有空白欄位。`;
    }
    try {
      const url = new URL(lesson.url.trim());
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error("Invalid protocol");
    } catch (_error) {
      return `第 ${index + 1} 堂課的網址格式不正確。`;
    }
  }
  return "";
}

async function initializeLiff() {
  const liffId = localStorage.getItem(LIFF_STORAGE_KEY)?.trim() || DEFAULT_LIFF_ID;
  elements.liffIdInput.value = liffId || "";

  if (!liffId) {
    setConnectionState("", "尚未連接 LIFF", "設定 LIFF ID 後即可分享卡片。");
    return;
  }

  if (typeof window.liff === "undefined") {
    setConnectionState("error", "LIFF 載入失敗", "請檢查網路連線後重新整理。");
    return;
  }

  setConnectionState("", "正在連接 LIFF", "正在確認 LINE 分享功能…");

  try {
    await window.liff.init({ liffId, withLoginOnExternalBrowser: true });
    liffReady = true;
    const available = window.liff.isApiAvailable("shareTargetPicker");
    if (available) {
      setConnectionState("connected", "LIFF 已連接", "Share Target Picker 可以使用。");
    } else {
      setConnectionState("error", "分享功能未啟用", "請到 LINE Developers 啟用 Share Target Picker。");
    }
  } catch (error) {
    console.error(error);
    setConnectionState("error", "LIFF 連接失敗", error.message || "請確認 LIFF ID 與 Endpoint URL。");
  }
}

async function shareToLine() {
  const validationError = validateForShare();
  if (validationError) {
    showToast(validationError, "error");
    return;
  }

  const liffId = localStorage.getItem(LIFF_STORAGE_KEY)?.trim();
  if (!liffId) {
    elements.settingsDialog.showModal();
    showToast("請先設定 LIFF ID。", "error");
    return;
  }

  if (!liffReady || typeof window.liff === "undefined") {
    showToast("LIFF 尚未完成連接，請確認設定後重新載入。", "error");
    return;
  }

  if (!window.liff.isApiAvailable("shareTargetPicker")) {
    showToast("此 LIFF 尚未啟用 Share Target Picker。", "error");
    return;
  }

  elements.shareButton.disabled = true;
  elements.shareButton.textContent = "正在開啟 LINE…";

  try {
    const result = await window.liff.shareTargetPicker(
      [
        {
          type: "flex",
          altText: "Python 新手入門｜10 堂課程",
          contents: buildFlexData(),
        },
      ],
      { isMultiple: true },
    );

    if (result) {
      showToast("Flex 課程卡片已分享！");
    } else {
      showToast("已取消分享。");
    }
  } catch (error) {
    console.error(error);
    showToast(`分享失敗：${error.message || "請稍後再試"}`, "error");
  } finally {
    elements.shareButton.disabled = false;
    elements.shareButton.innerHTML = '<span class="button-icon" aria-hidden="true">↗</span> 分享到 LINE';
  }
}

function saveLiffSettings(event) {
  event.preventDefault();
  const liffId = elements.liffIdInput.value.trim();
  if (!liffId) {
    showToast("請輸入 LIFF ID。", "error");
    return;
  }
  localStorage.setItem(LIFF_STORAGE_KEY, liffId);
  window.location.reload();
}

function openJsonDialog() {
  elements.jsonEditor.value = JSON.stringify(buildFlexData(), null, 2);
  elements.jsonError.textContent = "";
  elements.jsonDialog.showModal();
}

function lessonFromBubble(bubble, index) {
  const bodyContents = bubble?.body?.contents;
  const action = bubble?.footer?.contents?.[0]?.action;
  const labelText = bodyContents?.[0]?.text;
  const color = bodyContents?.[0]?.color;

  if (
    bubble?.type !== "bubble" ||
    !Array.isArray(bodyContents) ||
    bodyContents.length < 3 ||
    typeof bodyContents[1]?.text !== "string" ||
    typeof bodyContents[2]?.text !== "string" ||
    action?.type !== "uri" ||
    typeof action.label !== "string" ||
    typeof action.uri !== "string" ||
    !/^#[0-9a-f]{6}$/i.test(color)
  ) {
    throw new Error(`第 ${index + 1} 張卡片的結構不符合這個編輯器。`);
  }

  return {
    title: bodyContents[1].text,
    description: bodyContents[2].text,
    buttonText: action.label,
    url: action.uri,
    color: color.toUpperCase(),
    labelText,
  };
}

function applyJson() {
  elements.jsonError.textContent = "";
  try {
    const parsed = JSON.parse(elements.jsonEditor.value);
    if (parsed?.type !== "carousel" || !Array.isArray(parsed.contents)) {
      throw new Error("最外層必須是 type: carousel，並包含 contents。");
    }
    if (parsed.contents.length !== 10) {
      throw new Error("此版本的編輯器需要剛好 10 張課程卡片。");
    }
    const importedLessons = parsed.contents.map(lessonFromBubble);
    if (!importedLessons.every(isValidLesson)) {
      throw new Error("JSON 內容缺少必要欄位。");
    }
    lessons = importedLessons.map(({ labelText: _labelText, ...lesson }) => lesson);
    selectedIndex = 0;
    saveLessons();
    renderAll();
    elements.jsonDialog.close();
    showToast("JSON 已套用到編輯器與預覽。");
  } catch (error) {
    elements.jsonError.textContent = error.message || "JSON 格式不正確。";
  }
}

async function copyJson() {
  try {
    await navigator.clipboard.writeText(elements.jsonEditor.value);
    showToast("JSON 已複製。");
  } catch (_error) {
    elements.jsonEditor.select();
    document.execCommand("copy");
    showToast("JSON 已複製。");
  }
}

function downloadJson() {
  const blob = new Blob([elements.jsonEditor.value], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "python-course-flex.json";
  anchor.click();
  URL.revokeObjectURL(url);
}

function resetLessons() {
  if (!window.confirm("確定要還原 10 堂課的預設內容嗎？目前修改會被取代。")) return;
  lessons = cloneDefaults();
  selectedIndex = 0;
  saveLessons();
  renderAll();
  showToast("課程已還原為預設內容。");
}

function registerWebMcpTools() {
  const context = document.modelContext;
  if (!context?.registerTool) return;

  const register = (tool) => {
    try {
      Promise.resolve(context.registerTool(tool)).catch(console.error);
    } catch (error) {
      console.error(error);
    }
  };

  register({
    name: "read_python_flex_course",
    title: "讀取 Python Flex 課程",
    description: "讀取目前編輯器中的 10 堂 Python 課程與 Flex Message JSON。",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true, untrustedContentHint: false },
    execute() {
      return { lessons, flex: buildFlexData() };
    },
  });

  register({
    name: "update_python_flex_lesson",
    title: "更新 Python Flex 課程",
    description: "更新指定的一堂 Python 課程，並同步更新畫面、預覽與瀏覽器儲存內容。",
    inputSchema: {
      type: "object",
      properties: {
        lessonNumber: { type: "integer", minimum: 1, maximum: 10 },
        title: { type: "string", minLength: 1, maxLength: 80 },
        description: { type: "string", minLength: 1, maxLength: 240 },
        buttonText: { type: "string", minLength: 1, maxLength: 40 },
        url: { type: "string", format: "uri" },
        color: { type: "string", pattern: "^#[0-9A-Fa-f]{6}$" },
      },
      required: ["lessonNumber"],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: false, untrustedContentHint: false },
    execute(input) {
      const index = Number(input.lessonNumber) - 1;
      if (!Number.isInteger(index) || index < 0 || index >= lessons.length) {
        throw new Error("lessonNumber 必須介於 1 到 10。 ");
      }
      const next = { ...lessons[index] };
      for (const key of ["title", "description", "buttonText", "url", "color"]) {
        if (typeof input[key] === "string") next[key] = input[key];
      }
      if (!isValidLesson(next)) throw new Error("課程資料格式不正確。");
      lessons[index] = next;
      saveLessons();
      selectLesson(index);
      return { lessonNumber: index + 1, lesson: next };
    },
  });
}

elements.lessonList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-lesson-index]");
  if (button) selectLesson(button.dataset.lessonIndex);
});

elements.lessonForm.addEventListener("input", updateSelectedLesson);
elements.previousButton.addEventListener("click", () => selectLesson(selectedIndex - 1));
elements.nextButton.addEventListener("click", () => selectLesson(selectedIndex + 1));
elements.resetButton.addEventListener("click", resetLessons);
elements.shareButton.addEventListener("click", shareToLine);
elements.openSettingsButton.addEventListener("click", () => elements.settingsDialog.showModal());
elements.settingsForm.addEventListener("submit", saveLiffSettings);
document.querySelectorAll("[data-close-settings]").forEach((button) => {
  button.addEventListener("click", () => elements.settingsDialog.close());
});
elements.openJsonButton.addEventListener("click", openJsonDialog);
elements.applyJsonButton.addEventListener("click", applyJson);
elements.copyJsonButton.addEventListener("click", copyJson);
elements.downloadJsonButton.addEventListener("click", downloadJson);

elements.previewCarousel.addEventListener("scroll", () => {
  const cards = Array.from(elements.previewCarousel.children);
  const closest = cards.reduce(
    (best, card, index) => {
      const distance = Math.abs(card.offsetLeft - elements.previewCarousel.scrollLeft);
      return distance < best.distance ? { index, distance } : best;
    },
    { index: selectedIndex, distance: Infinity },
  );
  elements.previewDots.querySelectorAll(".carousel-dot").forEach((dot, index) => {
    dot.classList.toggle("active", index === closest.index);
  });
});

renderAll();
initializeLiff();
registerWebMcpTools();
