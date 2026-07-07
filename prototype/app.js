const form = document.querySelector("#merchantForm");
const output = document.querySelector("#output");
const outputTitle = document.querySelector("#outputTitle");
const strategyText = document.querySelector("#strategyText");
const copyBtn = document.querySelector("#copyBtn");
const downloadBtn = document.querySelector("#downloadBtn");
const toast = document.querySelector("#toast");
const evidenceList = document.querySelector("#evidenceList");
const tabs = document.querySelectorAll(".tab");
const presetButtons = document.querySelectorAll("[data-preset]");

let currentTab = "diagnosis";
let latestText = "";
let currentData = {};

const audienceProfiles = {
  student: {
    label: "学生",
    rhythm: ["下课后", "午饭前后", "晚自习前", "宿舍拼单", "周末出门前"],
    motivation: ["近", "便宜", "适合拍照", "能和室友一起买", "有隐藏福利"],
    channel: "小红书、朋友圈、校园微信群",
    conversion: "到店报暗号、宿舍拼单、进群领下周福利",
    metric: "收藏/评论、到店暗号次数、进群人数",
    sceneLabel: "学生场景感"
  },
  worker: {
    label: "周边工人",
    rhythm: ["早班前", "午休 20 分钟", "下午补能", "下班路上", "工友拼单"],
    motivation: ["实惠", "出餐快", "分量足", "能打包", "离工地近"],
    channel: "微信群、短视频同城、门口海报",
    conversion: "工友拼单、电话/微信预订、午休快取",
    metric: "拼单人数、预订次数、午休高峰出单量",
    sceneLabel: "班次场景感"
  },
  faculty: {
    label: "教职工",
    rhythm: ["早课前", "课间", "午休", "会议前后", "下班前"],
    motivation: ["稳定", "干净", "省心", "可开发票", "适合办公室分享"],
    channel: "朋友圈、办公室群、校内社群",
    conversion: "办公室团购、提前预订、长期优惠",
    metric: "办公室订单数、复购次数、团购金额",
    sceneLabel: "办公场景感"
  },
  resident: {
    label: "社区居民",
    rhythm: ["买菜顺路", "接娃前后", "晚饭后散步", "周末家庭消费", "老客复购"],
    motivation: ["离家近", "放心", "适合家人", "老客优惠", "服务熟悉"],
    channel: "社区群、朋友圈、门店海报",
    conversion: "邻里推荐、会员卡、老客储值",
    metric: "老客复购、会员新增、储值金额",
    sceneLabel: "社区场景感"
  },
  office: {
    label: "上班族",
    rhythm: ["通勤路上", "午休", "下午茶", "加班前", "下班路上"],
    motivation: ["效率", "品质稳定", "可外带", "适合团队", "不耽误时间"],
    channel: "企业微信群、外卖平台、同城短视频",
    conversion: "办公室拼单、企业下午茶、提前下单",
    metric: "拼单金额、外带订单、企业客户数",
    sceneLabel: "办公消费场景感"
  },
  custom: {
    label: "自定义客群",
    rhythm: ["高峰前", "午间", "傍晚", "周末", "老客回访"],
    motivation: ["方便", "实惠", "稳定", "省时间", "服务熟悉"],
    channel: "朋友圈、微信群、同城内容平台",
    conversion: "暗号福利、预约快取、老客召回",
    metric: "咨询量、到店数、复购数",
    sceneLabel: "客群场景感"
  }
};

const locationProfiles = {
  campus: "学校门口/校内生活圈",
  construction: "工地/产业园旁",
  office: "写字楼/办公区旁",
  community: "社区/居民区旁"
};

const presets = {
  student: {
    storeType: "奶茶店",
    storeName: "南门柠檬茶",
    product: "手打柠檬茶、鸭屎香柠檬茶、第二杯半价",
    audienceType: "student",
    price: "12-18 元",
    audience: "下课后的大学生",
    locationContext: "campus",
    goal: "提高到店客流",
    tone: "年轻有梗"
  },
  worker: {
    storeType: "快餐店",
    storeName: "东门工友饭堂",
    product: "大份盖浇饭、免费加饭、午休快取套餐",
    audienceType: "worker",
    price: "15-22 元",
    audience: "附近工地和产业园工人",
    locationContext: "construction",
    goal: "提高到店客流",
    tone: "高性价比"
  },
  faculty: {
    storeType: "咖啡店",
    storeName: "北苑咖啡站",
    product: "美式咖啡、办公室拼单、会议咖啡配送",
    audienceType: "faculty",
    price: "16-28 元",
    audience: "学校教职工和行政老师",
    locationContext: "campus",
    goal: "提升社群复购",
    tone: "专业可信"
  }
};

function value(id) {
  const node = document.querySelector(`#${id}`);
  return node ? node.value.trim() : "";
}

function setValue(id, nextValue) {
  const node = document.querySelector(`#${id}`);
  if (!node) return;
  node.value = nextValue;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1400);
}

function collectData() {
  const audienceType = value("audienceType") || "student";
  return {
    storeType: value("storeType") || "小店",
    storeName: value("storeName") || "校边小店",
    product: value("product") || "主推产品",
    price: value("price") || "学生友好价",
    audience: value("audience") || audienceProfiles[audienceType].label,
    audienceType,
    locationContext: value("locationContext") || "campus",
    goal: value("goal") || "提高到店客流",
    tone: value("tone") || "年轻有梗"
  };
}

function profileOf(data) {
  return audienceProfiles[data.audienceType] || audienceProfiles.custom;
}

function rotate(items, index) {
  return items[index % items.length];
}

function buildPosts(data) {
  const profile = profileOf(data);
  return Array.from({ length: 7 }, (_, index) => {
    const day = index + 1;
    const rhythm = rotate(profile.rhythm, index);
    const motive = rotate(profile.motivation, index);
    return {
      title: `D${day}｜${rhythm}：${motive}的${data.storeType}选择`,
      body: `${data.storeName} 主推 ${data.product}，客单价 ${data.price}，面向${data.audience}。这条内容强调“${rhythm} + ${motive}”，结尾引导用户执行：${profile.conversion}。`
    };
  });
}

function buildScripts(data) {
  const profile = profileOf(data);
  return [
    {
      title: `${profile.label}的一天切片`,
      body: `镜头 1：拍${profile.rhythm[0]}的人流。镜头 2：展示 ${data.product} 的制作/交付过程。镜头 3：强调 ${profile.motivation[0]} 和 ${data.price}。结尾引导：${profile.conversion}。`
    },
    {
      title: "真实购买理由采访",
      body: `找 2-3 位目标顾客说出购买理由，围绕“${profile.motivation.slice(0, 3).join("、")}”。不要像广告，要像真实路过后的选择。`
    },
    {
      title: "老板 30 秒承诺",
      body: `老板出镜说明本周目标“${data.goal}”，承诺一件具体事：更快出餐、更稳品质、更清楚优惠或更好售后。`
    }
  ];
}

function buildCommunity(data) {
  const profile = profileOf(data);
  return {
    messages: [
      `今天${profile.rhythm[0]}来店/预订，报暗号“校边参谋”，${data.product} 有本周福利。`,
      `${profile.label}专属提醒：如果赶时间，可以提前发消息，尽量帮你快取。`,
      `适合${profile.rhythm[4]}，可以和熟人一起拼单，价格更划算。`,
      `本周想验证一个小活动：${profile.conversion}，欢迎试一次。`,
      `老顾客回访：这周主推 ${data.product}，有特殊需求可以提前说。`,
      `今天收集 5 条真实反馈，明天根据反馈调整活动。`,
      `高峰时段建议提前 10 分钟预约，减少等待。`,
      `把到店/下单截图发群里，可参与周五小福利。`,
      `如果你身边也有${profile.label}朋友，转发给他，本周一起享福利。`,
      `本周复盘看三个数：咨询、到店、复购。老板会根据反馈调整。`
    ],
    replies: [
      `好评：谢谢认可，下次${profile.rhythm[1]}可以试试 ${data.product}，本周有专属福利。`,
      "差评：抱歉这次体验没有达到预期，可以私信具体问题，我们会优先处理并给出补偿方案。",
      `咨询：我们在${locationProfiles[data.locationContext]}附近，适合${data.audience}，客单价约 ${data.price}。`,
      "催促：高峰期可能需要等待，建议提前预约，我们会尽量缩短取餐/取货时间。",
      `复购：老朋友本周回来可以报暗号，适合${profile.conversion}。`
    ]
  };
}

function buildValidation(data) {
  const profile = profileOf(data);
  return [
    ["D1-D2", `访谈 8-10 家${locationProfiles[data.locationContext]}商家，确认他们是否服务${profile.label}，记录运营痛点和预算。`],
    ["D3-D4", `选择 3 家愿意试用的店，采集门头、菜单、评论区、社群话术和高峰时段。`],
    ["D5-D6", `生成第一版增长包：体检分、内容日历、短视频脚本、${profile.label}转化话术。`],
    ["D7-D9", `让商家在${profile.channel}发布，记录内容采用率和发布时间。`],
    ["D10-D11", `围绕${profile.metric}收集数据，判断内容是否真的带来线索。`],
    ["D12-D13", "优化客群画像、Prompt、定价和交付格式，沉淀一个可复制样板案例。"],
    ["D14", "测试 99/299 元付费意愿，决定继续产品化还是转为轻服务。"]
  ];
}

function computeScores(data) {
  const profile = profileOf(data);
  const productFit = Math.min(14, Math.floor(data.product.length / 5));
  const contextFit = data.locationContext === "campus" && data.audienceType === "student" ? 8 : 4;
  const scene = 70 + contextFit + productFit;
  const conversion = data.goal === "提高到店客流" ? 78 : 70;
  const community = data.goal === "提升社群复购" ? 86 : 72;
  const reply = data.goal === "处理差评" ? 88 : 78;
  const health = Math.round((scene + conversion + community + reply) / 4);
  return { scene, conversion, community, reply, health, sceneLabel: profile.sceneLabel };
}

function updateScores(data) {
  const scores = computeScores(data);
  document.querySelector("#healthScore").textContent = `增长健康分 ${scores.health}`;
  document.querySelector("#sceneScore").textContent = scores.scene;
  document.querySelector("#conversionScore").textContent = scores.conversion;
  document.querySelector("#communityScore").textContent = scores.community;
  document.querySelector("#replyScore").textContent = scores.reply;
  document.querySelector("#sceneScore").nextElementSibling.textContent = scores.sceneLabel;
}

function renderDiagnosis(data) {
  const profile = profileOf(data);
  const scores = computeScores(data);
  output.innerHTML = `
    <article class="content-card wide">
      <h3>AI 店铺诊断结论</h3>
      <p>${data.storeName} 当前最值得验证的是“${data.goal}”。系统识别主要客群为“${profile.label}”，高频时段是“${profile.rhythm.slice(0, 3).join("、")}”。增长重点不是多发内容，而是把“${profile.motivation.slice(0, 3).join("、")}”转成可追踪的到店动作。</p>
    </article>
    <article class="content-card">
      <h3>优势</h3>
      <ul>
        <li>客群画像清晰：${data.audience}。</li>
        <li>购买动机可被内容表达：${profile.motivation.join("、")}。</li>
        <li>适合渠道：${profile.channel}。</li>
      </ul>
    </article>
    <article class="content-card">
      <h3>短板</h3>
      <ul>
        <li>如果只发泛文案，无法证明内容带来真实到店。</li>
        <li>需要把每条内容绑定一个可记录动作：暗号、预约、拼单或进群。</li>
        <li>需要按客群节奏发布，而不是按老板空闲时间发布。</li>
      </ul>
    </article>
    <article class="content-card wide">
      <h3>本周增长实验</h3>
      <div class="message-grid">
        <div class="message-item">实验 A：围绕“${profile.rhythm[0]}”发内容。指标：${profile.metric}。</div>
        <div class="message-item">实验 B：强调“${profile.motivation[0]}”。指标：咨询转化率。</div>
        <div class="message-item">实验 C：设置“${profile.conversion}”。指标：可追踪动作次数。</div>
        <div class="message-item">实验 D：评论回复加入补偿/预约路径。指标：二次沟通率。</div>
      </div>
    </article>
  `;
  latestText = `增长健康分 ${scores.health}\n客群：${profile.label}\n节奏：${profile.rhythm.join("、")}\n动机：${profile.motivation.join("、")}\n转化动作：${profile.conversion}\n验证指标：${profile.metric}`;
}

function renderPosts(data) {
  const posts = buildPosts(data);
  const profile = profileOf(data);
  output.innerHTML = `
    <article class="content-card wide">
      <h3>本周内容主线</h3>
      <p>${data.storeName} 是面向${data.audience}的${data.storeType}。本周内容围绕“${data.goal}”，按${profile.label}的生活节奏发布，而不是写死成学生场景。</p>
    </article>
    ${posts.map(item => `
      <article class="content-card">
        <h3>${item.title}</h3>
        <p>${item.body}</p>
      </article>
    `).join("")}
  `;
  latestText = posts.map(item => `${item.title}\n${item.body}`).join("\n\n");
}

function renderScripts(data) {
  const scripts = buildScripts(data);
  output.innerHTML = `
    <article class="content-card wide">
      <h3>短视频生产原则</h3>
      <p>每条 15-30 秒，只拍真实门店、真实价格、真实客群节奏；每条视频都要绑定一个可记录动作。</p>
    </article>
    <article class="content-card wide">
      <h3>脚本清单</h3>
      ${scripts.map(item => `
        <div class="script-card">
          <strong>${item.title}</strong>
          <p>${item.body}</p>
        </div>
      `).join("")}
    </article>
  `;
  latestText = scripts.map(item => `${item.title}\n${item.body}`).join("\n\n");
}

function renderCommunity(data) {
  const community = buildCommunity(data);
  output.innerHTML = `
    <article class="content-card wide">
      <h3>社群促销话术</h3>
      <div class="message-grid">
        ${community.messages.map(item => `<div class="message-item">${item}</div>`).join("")}
      </div>
    </article>
    <article class="content-card wide">
      <h3>评论回复模板</h3>
      <ul>${community.replies.map(item => `<li>${item}</li>`).join("")}</ul>
    </article>
  `;
  latestText = [...community.messages, ...community.replies].join("\n");
}

function renderValidation(data) {
  const timeline = buildValidation(data);
  const profile = profileOf(data);
  output.innerHTML = `
    <article class="content-card wide">
      <h3>两周验证计划</h3>
      <div class="timeline">
        ${timeline.map(([day, task]) => `
          <div class="timeline-item">
            <strong>${day}</strong>
            <span>${task}</span>
          </div>
        `).join("")}
      </div>
    </article>
    <article class="content-card">
      <h3>核心指标</h3>
      <ul>
        <li>访谈 8-10 家店</li>
        <li>找到 3 家试用门店</li>
        <li>至少 30% 内容被采用</li>
        <li>至少 1 家愿意付费</li>
        <li>关键业务指标：${profile.metric}</li>
      </ul>
    </article>
    <article class="content-card">
      <h3>最大风险</h3>
      <p>商家可能只接受免费内容，不愿持续付费。解决方式是把内容绑定到可记录动作，证明 AI 不是写稿，而是在做增长实验。</p>
    </article>
  `;
  latestText = timeline.map(([day, task]) => `${day}：${task}`).join("\n");
}

function renderEvidence(data) {
  const profile = profileOf(data);
  const items = [
    `${profile.label}不是抽象用户，有明确节奏：${profile.rhythm.slice(0, 3).join("、")}。`,
    `商家要验证的不是文案好不好看，而是${profile.metric}是否提升。`,
    `访谈要问：谁负责运营、每周发几次、是否有${profile.conversion}。`,
    "关键付费问题：99 元试用包或 299 元月包是否能被接受。"
  ];
  evidenceList.innerHTML = items.map(item => `<li>${item}</li>`).join("");
}

function render() {
  const data = collectData();
  const profile = profileOf(data);
  currentData = data;
  outputTitle.textContent = `${data.storeName} · ${profile.label}增长包`;
  strategyText.textContent = `${data.storeName} 的本周目标是“${data.goal}”。策略是围绕${profile.label}的“${profile.rhythm.slice(0, 3).join("、")}”节奏，把 ${data.product} 变成可追踪的动作：${profile.conversion}。`;
  renderEvidence(data);
  updateScores(data);

  if (currentTab === "diagnosis") renderDiagnosis(data);
  if (currentTab === "posts") renderPosts(data);
  if (currentTab === "scripts") renderScripts(data);
  if (currentTab === "community") renderCommunity(data);
  if (currentTab === "validation") renderValidation(data);
}

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(item => item.classList.remove("active"));
    tab.classList.add("active");
    currentTab = tab.dataset.tab;
    render();
  });
});

function applyPreset(name, silent = false) {
  const preset = presets[name];
  if (!preset) return false;
  Object.entries(preset).forEach(([key, nextValue]) => setValue(key, nextValue));
  render();
  if (!silent) showToast(`已切换为${audienceProfiles[preset.audienceType].label}场景`);
  return true;
}

presetButtons.forEach(button => {
  button.addEventListener("click", () => {
    applyPreset(button.dataset.preset);
  });
});

form.addEventListener("submit", event => {
  event.preventDefault();
  render();
  showToast("已生成新的增长包");
});

copyBtn.addEventListener("click", async () => {
  await navigator.clipboard.writeText(latestText);
  showToast("当前内容已复制");
});

downloadBtn.addEventListener("click", () => {
  const blob = new Blob([`${currentData.storeName} 增长包\n\n${latestText}`], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${currentData.storeName}-增长包.txt`;
  link.click();
  URL.revokeObjectURL(link.href);
  showToast("TXT 已导出");
});

const initialPreset = new URLSearchParams(window.location.search).get("preset");
if (!applyPreset(initialPreset, true)) {
  render();
}
