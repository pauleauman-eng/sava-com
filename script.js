
"use strict";

/* =====================================================
   SAVA.COM — COMPLETE SHARED JAVASCRIPT
   Phase 2: Live Admin Dashboard Statistics
   ===================================================== */

/* =====================================================
   1. SUPABASE CONFIGURATION
   ===================================================== */

// Copy the exact URL from your WORKING script.js.
// Do not reconstruct it manually from a project ID.
const SAVA_SUPABASE_URL =
  "https://peixiqpwgwqltfzmcpbj.supabase.co";

// Copy your existing WORKING public publishable key.
// NEVER use a service_role or secret key.
const SAVA_PUBLISHABLE_KEY =
  "sb_publishable_1MeHZO0etAFBdcGJ2O2xZQ_ymf4eElK";

const $ = (id) => document.getElementById(id);

let savaDatabase = null;

const isSupabaseConfigured =
  /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(
    SAVA_SUPABASE_URL
  ) &&
  SAVA_PUBLISHABLE_KEY.trim().length > 20 &&
  !SAVA_PUBLISHABLE_KEY.includes("PASTE_YOUR");

function initializeDatabase() {
  if (!isSupabaseConfigured) return false;

  if (
    !window.supabase ||
    typeof window.supabase.createClient !== "function"
  ) {
    return false;
  }

  if (!savaDatabase) {
    savaDatabase = window.supabase.createClient(
      SAVA_SUPABASE_URL,
      SAVA_PUBLISHABLE_KEY
    );
  }

  return true;
}

function requireDatabase(statusId) {
  if (initializeDatabase()) return true;

  setStatus(
    statusId,
    isSupabaseConfigured
      ? "Unable to load Supabase. Check your connection."
      : "Configure the working Supabase URL and publishable key in script.js."
  );

  return false;
}

/* =====================================================
   2. SHARED HELPERS
   ===================================================== */

function setStatus(id, message) {
  const element = $(id);
  if (element) element.textContent = message;
}

function createElement(tag, className = "", text = "") {
  const element = document.createElement(tag);
  if (className) element.className = className;
  element.textContent = text;
  return element;
}

function createButton(label, callback, danger = false) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;

  if (danger) button.className = "danger-button";

  button.addEventListener("click", callback);
  return button;
}

function getErrorMessage(error) {
  return error?.message || "An unexpected error occurred.";
}

function formatDate(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function getAuthorName(article) {
  return article?.author_name?.trim() || "SAVA.COM Team";
}

function reducedMotion() {
  return window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "auto" });
}

if ($("year")) {
  $("year").textContent = new Date().getFullYear();
}

/* =====================================================
   3. PUBLIC NAVIGATION
   ===================================================== */

function initializeNavigation() {
  const nav = $("navlinks");
  const menu = $("menuBtn");

  if (!nav) return;

  if (!nav.querySelector('a[href="articles.html"]')) {
    const link = document.createElement("a");
    link.href = "articles.html";
    link.textContent = "Articles";

    const support = nav.querySelector(
      'a[href="support.html"]'
    );

    if (support) {
      nav.insertBefore(link, support);
    } else {
      nav.append(link);
    }
  }

  if (!menu) return;

  function closeMenu() {
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
  }

  menu.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menu.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

initializeNavigation();

/* =====================================================
   4. RECOVERY GUIDES
   ===================================================== */

const recoveryGuides = {
  smoking: {
    title: "A practical plan to quit smoking",
    intro:
      "Nicotine dependence is treatable. Counseling and approved quit-smoking medicines can improve the chances of success.",
    steps: [
      "Pick a quit date and write down why quitting matters to you.",
      "Track when you usually smoke; plan an alternative for each trigger.",
      "Tell a trusted friend or family member about your plan.",
      "Ask a clinician or pharmacist about evidence-based options such as nicotine replacement therapy; age and medical circumstances matter.",
      "If you slip, identify the trigger and restart without giving up."
    ],
    note:
      "Secondhand smoke can also harm people around you. Making your home and car smoke-free helps protect others."
  },
  vaping: {
    title: "A practical plan to stop vaping",
    intro:
      "Nicotine withdrawal can cause irritability, difficulty concentrating, and cravings. These symptoms often improve over time.",
    steps: [
      "Identify the situations where you reach for your vape.",
      "Choose a realistic quit date and remove vaping reminders.",
      "Prepare craving responses: water, a walk, slow breathing, or reaching out to someone.",
      "Ask a healthcare professional for tailored support, especially if you're a teen or use nicotine frequently.",
      "Revisit your plan after a setback; progress is rarely perfectly linear."
    ],
    note:
      "Vaping is not harmless. For young people, avoiding nicotine is especially important because the brain is still developing."
  },
  alcohol: {
    title: "Safer steps for changing alcohol use",
    intro:
      "If alcohol has become difficult to control, support is available. Some people need supervised withdrawal and structured treatment.",
    steps: [
      "Notice patterns: how much you drink, when, and what triggers it.",
      "Talk with a healthcare professional if you drink heavily, regularly, or have experienced withdrawal symptoms.",
      "Discuss a safe treatment plan; options may include counseling, medication, and peer support.",
      "Plan alcohol-free activities and supportive social settings.",
      "Ask trusted people to support your goals and seek follow-up care when needed."
    ],
    note:
      "SAFETY: Alcohol withdrawal can be life-threatening. If you may be physically dependent, do not abruptly stop without medical guidance. Seek emergency care for seizures, hallucinations, or severe confusion."
  }
};

function initializeGuides() {
  const panel = $("guide-panel");
  if (!panel) return;

  const tabs = [
    ...document.querySelectorAll("[data-guide]")
  ];

  function showGuide(key) {
    const guide = recoveryGuides[key];
    if (!guide) return;

    const heading = createElement("h3", "", guide.title);
    const intro = createElement("p", "", guide.intro);
    const list = document.createElement("ol");

    guide.steps.forEach((step) => {
      list.append(createElement("li", "", step));
    });

    const note = createElement("p", "notice", guide.note);

    panel.replaceChildren(heading, intro, list, note);

    tabs.forEach((tab) => {
      const active = tab.dataset.guide === key;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });

    panel.setAttribute(
      "aria-labelledby",
      "tab-" + key
    );
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      showGuide(tab.dataset.guide);
    });

    tab.addEventListener("keydown", (event) => {
      let next = index;

      if (event.key === "ArrowRight") {
        next = (index + 1) % tabs.length;
      } else if (event.key === "ArrowLeft") {
        next = (index - 1 + tabs.length) % tabs.length;
      } else if (event.key === "Home") {
        next = 0;
      } else if (event.key === "End") {
        next = tabs.length - 1;
      } else {
        return;
      }

      event.preventDefault();
      showGuide(tabs[next].dataset.guide);
      tabs[next].focus();
    });
  });

  const topic = new URLSearchParams(
    window.location.search
  ).get("topic");

  showGuide(
    Object.prototype.hasOwnProperty.call(
      recoveryGuides,
      topic
    ) ? topic : "smoking"
  );
}

initializeGuides();

/* =====================================================
   5. RECOVERY TRACKER
   ===================================================== */

function initializeTracker() {
  if (!$("saveTracker")) return;

  const storageKey = "sava_tracker_v2";
  const habitNames = {
    smoking: "Smoking-free",
    vaping: "Vaping-free",
    alcohol: "Alcohol-free"
  };

  function localDay(date) {
    return Math.floor(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      ) / 86400000
    );
  }

  function parseDate(value) {
    if (
      typeof value !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(value)
    ) return null;

    const [year, month, day] =
      value.split("-").map(Number);

    const date = new Date(0);
    date.setFullYear(year, month - 1, day);
    date.setHours(0, 0, 0, 0);

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) return null;

    return date;
  }

  function renderTracker(data) {
    if (!data) {
      $("daysCount").textContent = "—";
      $("habitLabel").textContent = "No goal saved yet";
      $("progressFill").style.width = "0%";
      $("progressBar").setAttribute("aria-valuenow", "0");
      $("progressText").textContent =
        "Set a goal to see your progress.";
      $("milestones").replaceChildren();
      return;
    }

    const start = parseDate(data.start);
    if (!start) {
      renderTracker(null);
      return;
    }

    const days = Math.max(
      0,
      localDay(new Date()) - localDay(start)
    );

    const percentage = Math.min(
      100,
      Math.round(days / data.goal * 100)
    );

    const remaining = Math.max(0, data.goal - days);

    $("daysCount").textContent = days;
    $("habitLabel").textContent = habitNames[data.habit];
    $("progressFill").style.width = percentage + "%";
    $("progressBar").setAttribute(
      "aria-valuenow", String(percentage)
    );

    $("progressText").textContent =
      `${percentage}% of your ${data.goal}-day goal • ` +
      `${remaining} day(s) remaining`;

    const milestones = $("milestones");
    milestones.replaceChildren();

    [1, 3, 7, 14, 30, 60, 90].forEach((day) => {
      const earned = days >= day;

      milestones.append(
        createElement(
          "span",
          "milestone" + (earned ? " earned" : ""),
          (earned ? "✓ " : "") + day + " days"
        )
      );
    });
  }

  function readTracker() {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return null;

      const data = JSON.parse(raw);
      const date = parseDate(data?.start);

      if (
        data &&
        Object.prototype.hasOwnProperty.call(
          habitNames, data.habit
        ) &&
        date &&
        localDay(date) <= localDay(new Date()) &&
        Number.isInteger(data.goal) &&
        data.goal >= 1 &&
        data.goal <= 3650
      ) return data;
    } catch {
      // Browser storage may be unavailable.
    }

    return null;
  }

  const saved = readTracker();

  if (saved) {
    $("habit").value = saved.habit;
    $("startDate").value = saved.start;
    $("goalDays").value = saved.goal;
    setStatus(
      "trackerMessage",
      "Goal loaded from this browser."
    );
  }

  renderTracker(saved);

  $("saveTracker").addEventListener("click", () => {
    const habit = $("habit").value;
    const start = $("startDate").value;
    const goalValue = $("goalDays").value;
    const date = parseDate(start);
    const goal = Number(goalValue);

    if (
      !Object.prototype.hasOwnProperty.call(
        habitNames, habit
      ) ||
      !date ||
      localDay(date) > localDay(new Date()) ||
      goalValue.trim() === "" ||
      !Number.isInteger(goal) ||
      goal < 1 ||
      goal > 3650
    ) {
      setStatus(
        "trackerMessage",
        "Enter a valid starting date and a goal from 1 to 3650 days."
      );
      return;
    }

    const data = { habit, start, goal };

    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify(data)
      );
      setStatus(
        "trackerMessage",
        "Your goal was saved on this device."
      );
    } catch {
      setStatus(
        "trackerMessage",
        "Storage is unavailable."
      );
    }

    renderTracker(data);
  });

  $("clearTracker").addEventListener("click", () => {
    if (!confirm("Delete your saved tracker data?")) {
      return;
    }

    try {
      localStorage.removeItem(storageKey);
    } catch {
      // Storage unavailable.
    }

    $("habit").value = "smoking";
    $("startDate").value = "";
    $("goalDays").value = "30";

    renderTracker(null);
    setStatus("trackerMessage", "Tracker data cleared.");
  });
}

initializeTracker();

/* =====================================================
   6. AWARENESS QUIZ
   ===================================================== */

const quizQuestions = [
  {
    q: "What substance in most cigarettes makes them addictive?",
    options: ["Vitamin C", "Nicotine", "Oxygen"],
    answer: 1,
    why:
      "Nicotine acts on the brain's reward system and can cause dependence."
  },
  {
    q: "Which statement about vaping is most accurate?",
    options: [
      "Vaping is completely harmless",
      "Vapes only release water vapor",
      "Many vapes contain nicotine and aerosol can carry harmful substances"
    ],
    answer: 2,
    why:
      "Vape aerosol is not simply water vapor; it may contain nicotine and other substances."
  },
  {
    q: "Which action can help when a craving appears?",
    options: [
      "Plan a short distraction or contact someone supportive",
      "Keep triggers nearby",
      "Ignore all support options"
    ],
    answer: 0,
    why:
      "Planning alternative activities and asking for support can help manage cravings."
  },
  {
    q: "Why might a person who drinks heavily need medical advice before quitting?",
    options: [
      "Withdrawal is always harmless",
      "Alcohol withdrawal can be dangerous",
      "Medical advice is never useful"
    ],
    answer: 1,
    why:
      "Withdrawal can cause seizures and other serious complications in physically dependent people."
  },
  {
    q: "Which statement about recovery is most helpful?",
    options: [
      "A setback means permanent failure",
      "Support is a sign of weakness",
      "Setbacks can be learning opportunities; support and treatment can help"
    ],
    answer: 2,
    why:
      "Recovery is a process. Evidence-based treatment and social support can help."
  }
];

function initializeQuiz() {
  const form = $("quizForm");
  if (!form) return;

  const container = $("quizQuestions");
  container.replaceChildren();

  quizQuestions.forEach((question, index) => {
    const fieldset = createElement(
      "fieldset", "quiz-question"
    );
    const legend = createElement(
      "legend", "", `${index + 1}. ${question.q}`
    );
    fieldset.append(legend);

    question.options.forEach((option, optionIndex) => {
      const label = document.createElement("label");
      const input = document.createElement("input");

      input.type = "radio";
      input.name = "q" + index;
      input.value = optionIndex;

      label.append(input, document.createTextNode(option));
      fieldset.append(label);
    });

    container.append(fieldset);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    let score = 0;
    let missing = 0;
    const details = [];

    quizQuestions.forEach((question, index) => {
      const selected = document.querySelector(
        `input[name="q${index}"]:checked`
      );

      if (!selected) {
        missing++;
        return;
      }

      const correct =
        Number(selected.value) === question.answer;

      if (correct) score++;

      details.push({
        correct,
        explanation: question.why,
        answer: question.options[question.answer]
      });
    });

    const result = $("quizResult");
    result.replaceChildren();
    result.className = "quiz-result";

    if (missing) {
      result.textContent =
        `Please answer all five questions. ${missing} unanswered.`;
      return;
    }

    result.append(
      createElement(
        "h3", "",
        `You scored ${score} out of ${quizQuestions.length}`
      ),
      createElement(
        "p", "",
        score === quizQuestions.length
          ? "Excellent! All answers are correct."
          : "Review your answers and explanations below."
      )
    );

    details.forEach((detail, index) => {
      const paragraph = document.createElement("p");

      paragraph.append(
        createElement(
          "strong", "",
          `${index + 1}. ` +
          (detail.correct ? "Correct: " : "Review: ")
        ),
        document.createTextNode(detail.explanation)
      );

      if (!detail.correct) {
        paragraph.append(
          document.createTextNode(
            " Correct answer: " + detail.answer
          )
        );
      }

      result.append(paragraph);
    });

    result.scrollIntoView({
      behavior: reducedMotion() ? "auto" : "smooth",
      block: "nearest"
    });
  });

  $("resetQuiz").addEventListener("click", () => {
    form.reset();
    $("quizResult").replaceChildren();
    $("quizResult").className = "";
  });
}

initializeQuiz();

/* =====================================================
   7. MOTIVATION
   ===================================================== */

function initializeMotivation() {
  const button = $("nextQuote");
  const text = $("quoteText");
  if (!button || !text) return;

  const quotes = [
    "One healthy choice today can make tomorrow easier.",
    "Progress is built through small, repeated actions.",
    "You can ask for help and still be strong.",
    "Your next step matters more than a perfect streak.",
    "Support and patience can make change possible.",
    "Every positive decision is a step toward a healthier life.",
    "Real progress begins with the decision to try.",
    "Your health and your future are worth protecting.",
    "Small changes can lead to meaningful improvements.",
    "You do not have to face recovery alone."
  ];

  let index = 0;

  button.addEventListener("click", () => {
    index = (index + 1) % quotes.length;
    text.textContent = "“" + quotes[index] + "”";
  });
}

initializeMotivation();

/* =====================================================
   8. PUBLIC ARTICLES
   ===================================================== */

let publicArticles = [];
let currentArticleId = null;
let currentAdminArticleImage = null;

async function loadPublicArticles() {
  if (!requireDatabase("articleStatus")) return;

  setStatus("articleStatus", "Loading articles...");

  const { data, error } = await savaDatabase
    .from("sava_articles")
    .select(
      "id,title,author_name,excerpt,image_url,created_at"
    )
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    setStatus("articleStatus", getErrorMessage(error));
    return;
  }

  publicArticles = data || [];
  renderArticleCards(publicArticles);

  setStatus(
    "articleStatus",
    publicArticles.length
      ? `${publicArticles.length} article(s) available.`
      : "No published articles yet."
  );
}

function renderArticleCards(articles) {
  const grid = $("articleGrid");
  if (!grid) return;

  grid.replaceChildren();

  if (!articles.length) {
    grid.append(
      createElement("p", "muted", "No matching articles found.")
    );
    return;
  }

  articles.forEach((article) => {
    const card = createElement("article", "article-tile");

    if (article.image_url) {
      const image = document.createElement("img");
      image.src = article.image_url;
      image.alt = article.title;
      image.loading = "lazy";
      card.append(image);
    }

    const content = createElement(
      "div", "article-tile-content"
    );

    const button = createButton(
      "Read Article →",
      () => openArticle(article.id)
    );

    button.className = "btn primary small";

    content.append(
      createElement(
        "div", "article-date",
        formatDate(article.created_at)
      ),
      createElement("h3", "", article.title),
      createElement(
        "p", "article-author",
        "By " + getAuthorName(article)
      ),
      createElement("p", "", article.excerpt || ""),
      button
    );

    card.append(content);
    grid.append(card);
  });
}

async function openArticle(articleId) {
  if (!savaDatabase) return;

  const { data, error } = await savaDatabase
    .from("sava_articles")
    .select(
      "id,title,author_name,body,image_url,created_at"
    )
    .eq("id", articleId)
    .eq("published", true)
    .single();

  if (error || !data) {
    alert(error ? getErrorMessage(error) : "Article unavailable.");
    return;
  }

  currentArticleId = articleId;

  $("articleDirectory").classList.add("hidden");
  $("articleDetail").classList.remove("hidden");

  const content = $("articleContent");
  content.replaceChildren(
    createElement(
      "div", "article-date",
      formatDate(data.created_at)
    ),
    createElement("h1", "", data.title),
    createElement(
      "p", "article-author",
      "By " + getAuthorName(data)
    )
  );

  if (data.image_url) {
    const image = document.createElement("img");
    image.src = data.image_url;
    image.alt = data.title;
    content.append(image);
  }

  content.append(
    createElement("div", "article-prose", data.body)
  );

  $("commentForm")?.reset();
  setStatus("commentStatus", "");

  await loadArticleComments(articleId);
  scrollToTop();
}

/* =====================================================
   9. PUBLIC COMMENTS
   ===================================================== */

async function loadArticleComments(articleId) {
  const container = $("commentsList");
  if (!container) return;

  container.textContent = "Loading comments...";

  const { data, error } = await savaDatabase
    .from("sava_comments")
    .select(
      "visitor_name,comment_text,created_at"
    )
    .eq("article_id", articleId)
    .eq("approved", true)
    .order("created_at", { ascending: true });

  if (currentArticleId !== articleId) return;

  container.replaceChildren();

  if (error) {
    container.textContent = getErrorMessage(error);
    return;
  }

  if (!data?.length) {
    container.textContent =
      "No comments yet. Be the first to comment!";
    return;
  }

  data.forEach((comment) => {
    const item = createElement("div", "comment-item");

    item.append(
      createElement("strong", "", comment.visitor_name),
      createElement(
        "time", "", formatDate(comment.created_at)
      ),
      createElement("p", "", comment.comment_text)
    );

    container.append(item);
  });
}

async function submitArticleComment(event) {
  event.preventDefault();

  if (!requireDatabase("commentStatus")) return;
  if (!currentArticleId) return;

  const name = $("visitorName").value.trim();
  const message = $("commentText").value.trim();

  if (
    name.length < 2 ||
    name.length > 50 ||
    message.length < 2 ||
    message.length > 1000
  ) {
    setStatus(
      "commentStatus", "Enter a valid name and comment."
    );
    return;
  }

  const button = $("commentForm").querySelector(
    'button[type="submit"]'
  );

  button.disabled = true;
  setStatus("commentStatus", "Submitting comment...");

  try {
    const { error } = await savaDatabase
      .from("sava_comments")
      .insert({
        article_id: currentArticleId,
        visitor_name: name,
        comment_text: message
      });

    if (error) throw error;

    $("commentForm").reset();

    setStatus(
      "commentStatus",
      "Comment submitted. It will appear after admin approval."
    );
  } catch (error) {
    setStatus("commentStatus", getErrorMessage(error));
  } finally {
    button.disabled = false;
  }
}

/* =====================================================
   10. ADMIN PAGE NAVIGATION
   ===================================================== */

const adminPageNames = {
  dashboardHome: "Dashboard",
  "create-article": "Create Article",
  "manage-articles": "Manage Articles",
  "manage-comments": "Comment Moderation"
};

let activeAdminPage = "dashboardHome";

function showAdminPage(pageId, updateHistory = true) {
  if (!Object.prototype.hasOwnProperty.call(
    adminPageNames, pageId
  )) {
    pageId = "dashboardHome";
  }

  const dashboard = $("adminDashboard");

  if (!dashboard ||
      dashboard.classList.contains("hidden")) {
    return;
  }

  dashboard.querySelectorAll(
    "[data-admin-panel]"
  ).forEach((panel) => {
    panel.classList.toggle(
      "hidden",
      panel.id !== pageId
    );
  });

  dashboard.querySelectorAll(
    ".admin-nav-link[data-admin-page]"
  ).forEach((link) => {
    const active = link.dataset.adminPage === pageId;

    if (active) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }

    link.style.background = active
      ? "rgba(0,143,128,.22)"
      : "transparent";

    link.style.color = active
      ? "#a6f6e7"
      : "#d2e3e7";
  });

  activeAdminPage = pageId;

  if ($("adminCurrentPage")) {
    $("adminCurrentPage").textContent =
      adminPageNames[pageId];
  }

  if (updateHistory) {
    const url = new URL(window.location.href);
    url.hash = pageId;
    history.pushState({ adminPage: pageId }, "", url);
  }

  if (pageId === "dashboardHome") {
    loadAdminStatistics();
  }

  scrollToTop();
}

function initializeAdminNavigation() {
  const dashboard = $("adminDashboard");
  if (!dashboard) return;

  dashboard.querySelectorAll(
    "[data-admin-page]"
  ).forEach((link) => {
    link.addEventListener("click", (event) => {
      const pageId = link.dataset.adminPage;

      if (!Object.prototype.hasOwnProperty.call(
        adminPageNames, pageId
      )) return;

      event.preventDefault();

      // Do not discard unsaved form data automatically.
      showAdminPage(pageId);
    });
  });

  window.addEventListener("popstate", () => {
    showAdminPage(
      window.location.hash.slice(1),
      false
    );
  });

  window.addEventListener("hashchange", () => {
    showAdminPage(
      window.location.hash.slice(1),
      false
    );
  });
}

initializeAdminNavigation();

/* =====================================================
   11. NEW: LIVE ADMIN STATISTICS
   ===================================================== */

let adminStatsRequest = 0;

function setAdminStatsLoading() {
  [
    "statTotalArticles",
    "statPublishedArticles",
    "statDraftArticles",
    "statPendingComments"
  ].forEach((id) => {
    if ($(id)) $(id).textContent = "…";
  });
}

async function loadAdminStatistics() {
  if (!$("statTotalArticles")) return;

  if (!requireDatabase("adminStatsStatus")) return;

  const requestId = ++adminStatsRequest;

  const refreshButton = $("refreshAdminStats");

  if (refreshButton) refreshButton.disabled = true;

  setAdminStatsLoading();
  setStatus("adminStatsStatus", "Loading statistics...");

  try {
    const results = await Promise.all([
      savaDatabase
        .from("sava_articles")
        .select("id", {
          count: "exact",
          head: true
        }),

      savaDatabase
        .from("sava_articles")
        .select("id", {
          count: "exact",
          head: true
        })
        .eq("published", true),

      savaDatabase
        .from("sava_articles")
        .select("id", {
          count: "exact",
          head: true
        })
        .eq("published", false),

      savaDatabase
        .from("sava_comments")
        .select("id", {
          count: "exact",
          head: true
        })
        .eq("approved", false)
    ]);

    if (requestId !== adminStatsRequest) return;

    const errorResult = results.find(
      (result) => result.error
    );

    if (errorResult) {
      throw errorResult.error;
    }

    if (results.some(
      (result) => result.count === null ||
                  result.count === undefined
    )) {
      throw new Error(
        "Supabase did not return all requested counts."
      );
    }

    $("statTotalArticles").textContent =
      results[0].count;

    $("statPublishedArticles").textContent =
      results[1].count;

    $("statDraftArticles").textContent =
      results[2].count;

    $("statPendingComments").textContent =
      results[3].count;

    setStatus(
      "adminStatsStatus",
      "Statistics updated successfully."
    );
  } catch (error) {
    if (requestId !== adminStatsRequest) return;

    [
      "statTotalArticles",
      "statPublishedArticles",
      "statDraftArticles",
      "statPendingComments"
    ].forEach((id) => {
      if ($(id)) $(id).textContent = "—";
    });

    setStatus(
      "adminStatsStatus",
      "Unable to load statistics: " +
      getErrorMessage(error)
    );
  } finally {
    if (requestId === adminStatsRequest &&
        refreshButton) {
      refreshButton.disabled = false;
    }
  }
}

/* =====================================================
   12. ADMIN AUTHENTICATION
   ===================================================== */

function showAdminLogin() {
  $("adminLogin")?.classList.remove("hidden");
  $("adminDashboard")?.classList.add("hidden");
}

function showAdminDashboard() {
  $("adminLogin")?.classList.add("hidden");
  $("adminDashboard")?.classList.remove("hidden");

  showAdminPage("dashboardHome", false);
}

async function verifyAdmin() {
  if (!requireDatabase("loginStatus")) {
    showAdminLogin();
    return false;
  }

  const { data: userData, error: userError } =
    await savaDatabase.auth.getUser();

  if (userError || !userData?.user) {
    showAdminLogin();
    return false;
  }

  const { data, error } = await savaDatabase
    .from("sava_admins")
    .select("user_id")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (error || !data) {
    showAdminLogin();

    setStatus(
      "loginStatus",
      error
        ? getErrorMessage(error)
        : "This account is not authorized as a SAVA administrator."
    );

    return false;
  }

  setStatus("loginStatus", "");

  showAdminDashboard();

  await Promise.all([
    loadAdminArticles(),
    loadAdminComments()
  ]);

  return true;
}

async function loginAdmin(event) {
  event.preventDefault();

  if (!requireDatabase("loginStatus")) return;

  const email = $("adminEmail").value.trim();
  const password = $("adminPassword").value;

  const button = $("adminLoginForm").querySelector(
    'button[type="submit"]'
  );

  button.disabled = true;
  setStatus("loginStatus", "Signing in...");

  try {
    const { error } =
      await savaDatabase.auth.signInWithPassword({
        email,
        password
      });

    if (error) throw error;

    $("adminPassword").value = "";
    await verifyAdmin();
  } catch (error) {
    setStatus("loginStatus", getErrorMessage(error));
  } finally {
    button.disabled = false;
  }
}

async function logoutAdmin() {
  if (!savaDatabase) return;

  const { error } = await savaDatabase.auth.signOut();

  if (error) {
    alert(getErrorMessage(error));
    return;
  }

  ++adminStatsRequest;

  showAdminLogin();
  $("adminLoginForm")?.reset();
  resetArticleEditor();

  setStatus("loginStatus", "Signed out successfully.");
}

/* =====================================================
   13. ADMIN ARTICLE LIBRARY
   ===================================================== */

async function loadAdminArticles() {
  const container = $("adminArticleList");
  if (!container || !savaDatabase) return;

  container.textContent = "Loading articles...";

  const { data, error } = await savaDatabase
    .from("sava_articles")
    .select("*")
    .order("created_at", { ascending: false });

  container.replaceChildren();

  if (error) {
    container.textContent = getErrorMessage(error);
    return;
  }

  if (!data?.length) {
    container.textContent = "No articles created yet.";
    return;
  }

  data.forEach((article) => {
    const item = createElement("div", "admin-item");

    const actions = createElement(
      "div", "admin-actions"
    );

    actions.append(
      createButton("Edit", () => editArticle(article)),
      createButton(
        article.published ? "Unpublish" : "Publish",
        () => toggleArticlePublished(article)
      ),
      createButton(
        "Delete",
        () => deleteArticle(article.id),
        true
      )
    );

    item.append(
      createElement("h3", "", article.title),
      createElement(
        "p", "",
        "Author: " + getAuthorName(article)
      ),
      createElement(
        "p", "",
        article.published ? "Published" : "Draft"
      ),
      actions
    );

    container.append(item);
  });
}

/* =====================================================
   14. ARTICLE EDITOR
   ===================================================== */

function resetArticleEditor() {
  const form = $("articleEditor");
  if (!form) return;

  form.reset();

  $("editArticleId").value = "";
  $("editorHeading").textContent = "Create Article";
  $("articleAuthor").value = "";

  currentAdminArticleImage = null;

  const preview = $("imagePreview");
  preview.classList.add("hidden");
  preview.removeAttribute("src");

  setStatus("editorStatus", "");
}

function editArticle(article) {
  $("editArticleId").value = article.id;
  $("articleTitle").value = article.title;
  $("articleAuthor").value = getAuthorName(article);
  $("articleExcerpt").value = article.excerpt || "";
  $("articleBody").value = article.body || "";

  $("articlePublished").checked =
    article.published;

  $("articleImage").value = "";
  currentAdminArticleImage =
    article.image_url || null;

  $("editorHeading").textContent = "Edit Article";

  const preview = $("imagePreview");

  if (article.image_url) {
    preview.src = article.image_url;
    preview.classList.remove("hidden");
  } else {
    preview.classList.add("hidden");
    preview.removeAttribute("src");
  }

  showAdminPage("create-article");
}

/* =====================================================
   15. ARTICLE IMAGE UPLOAD
   ===================================================== */

async function uploadArticleImage(file) {
  const allowedTypes = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp"
  };

  if (!Object.prototype.hasOwnProperty.call(
    allowedTypes, file.type
  )) {
    throw new Error(
      "Only JPG, PNG, and WebP images are allowed."
    );
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error(
      "Image must be 5 MB or smaller."
    );
  }

  const filename =
    crypto.randomUUID() +
    "." +
    allowedTypes[file.type];

  const { error } = await savaDatabase.storage
    .from("sava-article-images")
    .upload(filename, file, {
      contentType: file.type,
      upsert: false
    });

  if (error) throw error;

  const { data } = savaDatabase.storage
    .from("sava-article-images")
    .getPublicUrl(filename);

  return {
    path: filename,
    publicUrl: data.publicUrl
  };
}

/* =====================================================
   16. SAVE ARTICLE
   ===================================================== */

async function saveAdminArticle(event) {
  event.preventDefault();

  if (!requireDatabase("editorStatus")) return;

  const articleId = $("editArticleId").value;
  const title = $("articleTitle").value.trim();
  const authorName = $("articleAuthor").value.trim();
  const excerpt = $("articleExcerpt").value.trim();
  const body = $("articleBody").value.trim();
  const published = $("articlePublished").checked;

  if (title.length < 3 || title.length > 180) {
    setStatus("editorStatus", "Enter a valid article title.");
    return;
  }

  if (
    authorName.length < 2 ||
    authorName.length > 100
  ) {
    setStatus(
      "editorStatus",
      "Author name must contain 2 to 100 characters."
    );
    return;
  }

  if (!body) {
    setStatus(
      "editorStatus",
      "Article content cannot be empty."
    );
    return;
  }

  const button = $("articleEditor").querySelector(
    'button[type="submit"]'
  );

  button.disabled = true;
  setStatus("editorStatus", "Saving article...");

  let uploadedImagePath = null;

  try {
    const payload = {
      title,
      author_name: authorName,
      excerpt,
      body,
      published,
      updated_at: new Date().toISOString()
    };

    const file = $("articleImage").files[0];

    if (file) {
      const uploaded = await uploadArticleImage(file);
      payload.image_url = uploaded.publicUrl;
      uploadedImagePath = uploaded.path;
    } else if (articleId) {
      payload.image_url = currentAdminArticleImage;
    }

    const result = articleId
      ? await savaDatabase
          .from("sava_articles")
          .update(payload)
          .eq("id", articleId)
          .select("id")
      : await savaDatabase
          .from("sava_articles")
          .insert(payload)
          .select("id");

    if (result.error) throw result.error;

    if (!result.data?.length) {
      throw new Error(
        "Article was not saved. Check administrator permissions."
      );
    }

    resetArticleEditor();
    await loadAdminArticles();

    showAdminPage("manage-articles");

  } catch (error) {
    setStatus(
      "editorStatus",
      getErrorMessage(error)
    );

    if (uploadedImagePath) {
      console.warn(
        "Unused uploaded image:",
        uploadedImagePath
      );
    }
  } finally {
    button.disabled = false;
  }
}

/* =====================================================
   17. PUBLISH / UNPUBLISH / DELETE
   ===================================================== */

async function toggleArticlePublished(article) {
  if (!savaDatabase) return;

  const { data, error } = await savaDatabase
    .from("sava_articles")
    .update({
      published: !article.published,
      updated_at: new Date().toISOString()
    })
    .eq("id", article.id)
    .select("id");

  if (error || !data?.length) {
    alert(
      error
        ? getErrorMessage(error)
        : "Update not permitted."
    );
    return;
  }

  await loadAdminArticles();
}

async function deleteArticle(articleId) {
  if (!confirm(
    "Permanently delete this article and its comments?"
  )) return;

  const { data, error } = await savaDatabase
    .from("sava_articles")
    .delete()
    .eq("id", articleId)
    .select("id");

  if (error || !data?.length) {
    alert(
      error
        ? getErrorMessage(error)
        : "Deletion not permitted."
    );
    return;
  }

  resetArticleEditor();

  await Promise.all([
    loadAdminArticles(),
    loadAdminComments()
  ]);
}

/* =====================================================
   18. COMMENT MODERATION
   ===================================================== */

async function loadAdminComments() {
  const container = $("adminComments");
  if (!container || !savaDatabase) return;

  container.textContent = "Loading comments...";

  const { data, error } = await savaDatabase
    .from("sava_comments")
    .select(
      "id,visitor_name,comment_text,created_at"
    )
    .eq("approved", false)
    .order("created_at", { ascending: false });

  container.replaceChildren();

  if (error) {
    container.textContent = getErrorMessage(error);
    return;
  }

  if (!data?.length) {
    container.textContent = "No pending comments.";
    return;
  }

  data.forEach((comment) => {
    const item = createElement("div", "admin-item");
    const actions = createElement(
      "div", "admin-actions"
    );

    actions.append(
      createButton(
        "Approve",
        () => approveComment(comment.id)
      ),
      createButton(
        "Delete",
        () => deleteComment(comment.id),
        true
      )
    );

    item.append(
      createElement(
        "h3", "", comment.visitor_name
      ),
      createElement(
        "p", "", formatDate(comment.created_at)
      ),
      createElement(
        "p", "", comment.comment_text
      ),
      actions
    );

    container.append(item);
  });
}

async function approveComment(commentId) {
  const { data, error } = await savaDatabase
    .from("sava_comments")
    .update({ approved: true })
    .eq("id", commentId)
    .select("id");

  if (error || !data?.length) {
    alert(
      error
        ? getErrorMessage(error)
        : "Approval not permitted."
    );
    return;
  }

  await loadAdminComments();
}

async function deleteComment(commentId) {
  if (!confirm("Delete this comment?")) return;

  const { data, error } = await savaDatabase
    .from("sava_comments")
    .delete()
    .eq("id", commentId)
    .select("id");

  if (error || !data?.length) {
    alert(
      error
        ? getErrorMessage(error)
        : "Deletion not permitted."
    );
    return;
  }

  await loadAdminComments();
}

/* =====================================================
   19. INITIALIZE PUBLIC ARTICLES
   ===================================================== */

function initializePublicArticles() {
  if (!$("articleGrid")) return;

  $("articleSearch")?.addEventListener(
    "input",
    (event) => {
      const query = event.target.value
        .trim()
        .toLowerCase();

      const filtered = publicArticles.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          getAuthorName(article)
            .toLowerCase()
            .includes(query)
      );

      renderArticleCards(filtered);
    }
  );

  $("backArticles")?.addEventListener("click", () => {
    currentArticleId = null;

    $("articleDetail").classList.add("hidden");
    $("articleDirectory").classList.remove("hidden");

    scrollToTop();
  });

  $("commentForm")?.addEventListener(
    "submit",
    submitArticleComment
  );

  loadPublicArticles();
}

/* =====================================================
   20. INITIALIZE ADMIN DASHBOARD
   ===================================================== */

function initializeAdminArticles() {
  if (!$("adminLoginForm")) return;

  $("adminLoginForm").addEventListener(
    "submit",
    loginAdmin
  );

  $("adminLogout")?.addEventListener(
    "click",
    logoutAdmin
  );

  $("articleEditor")?.addEventListener(
    "submit",
    saveAdminArticle
  );

  $("cancelEdit")?.addEventListener(
    "click",
    resetArticleEditor
  );

  $("refreshAdminStats")?.addEventListener(
    "click",
    loadAdminStatistics
  );

  $("articleImage")?.addEventListener(
    "change",
    (event) => {
      const file = event.target.files[0];
      const preview = $("imagePreview");

      if (!file) return;

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
      ];

      if (
        !allowedTypes.includes(file.type) ||
        file.size > 5 * 1024 * 1024
      ) {
        setStatus(
          "editorStatus",
          "Select a JPG, PNG, or WebP image up to 5 MB."
        );

        event.target.value = "";
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        preview.src = reader.result;
        preview.classList.remove("hidden");
      };

      reader.readAsDataURL(file);
    }
  );

  if (requireDatabase("loginStatus")) {
    verifyAdmin();
  }
}

initializePublicArticles();
initializeAdminArticles();

/* =====================================================
   END OF SAVA.COM SHARED JAVASCRIPT
   ===================================================== */
