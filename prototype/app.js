const form = document.querySelector("#merchantForm");
const output = document.querySelector("#output");
const outputTitle = document.querySelector("#outputTitle");
const strategyText = document.querySelector("#strategyText");
const copyBtn = document.querySelector("#copyBtn");
const downloadBtn = document.querySelector("#downloadBtn");
const toast = document.querySelector("#toast");
const evidenceList = document.querySelector("#evidenceList");
const tabs = document.querySelectorAll(".tab");

let currentTab = "posts";
let latestText = "";
let currentData = {};

const postAngles = [
  "下课后 10 分钟的快乐补给",
  "学生党也能闭眼冲的高性价比",
  "本周限定福利提醒",
  "适合和室友一起打卡的组合",
  "晚自习前后的轻松小奖励",
  "周末出门前的顺路选择",
  "老顾客复购提醒"
];

function value(id) {
  return document.querySelector(`#${id}`).value.trim();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1400);
}

function collectData() {
  return {
    storeType: value("storeType"),
    storeName: value("storeName") || "校园小店",
    product: value("product") || "主推产品",
    price: value("price") || "学生价",
    audience: value("audience") || "大学生",
    goal: value("goal"),
    tone: value("tone")
  };
}

function buildPosts(data) {
  return postAngles.map((angle, index) => {
    const day = index + 1;
    return {
      title: `D${day}｜${angle}`,
      body: `${data.storeName} 的 ${data.product}，客单价 ${data.price}，适合${data.audience}。语气保持${data.tone}，结尾引导收藏、到店或进群。`
    };
  });
}

function buildScripts(data) {
  return [
    {
      title: "门店 15 秒快闪",
      body: `镜头 1：拍门头和学生路过。镜头 2：特写制作 ${data.product}。镜头 3：展示价格 ${data.price}。结尾口播：下课路过就来一份。`
    },
    {
      title: "室友测评",
      body: "三位同学分别说一个购买理由：近、划算、口味稳定。结尾给出本周暗号，鼓励宿舍拼单。"
    },
    {
      title: "老板的一天",
      body: `拍备货、出单、打包、回复评论，强化真实感，最后带出本周目标：${data.goal}。`
    }
  ];
}

function buildCommunity(data) {
  return {
    messages: [
      `今天下课后来店报暗号“校边参谋”，${data.product} 有隐藏福利。`,
      "晚自习前 30 分钟适合囤一份，进群同学本周享优先提醒。",
      "带室友一起到店更划算，适合宿舍拼单。",
      "今天评论区抽 3 位同学送小福利，明天中午公布。",
      `老顾客返场提醒：本周主推 ${data.product}，特殊需求可以提前说。`,
      "社群内先发新品图，收集 5 个反馈后再正式发小红书。",
      "中午高峰期建议提前 10 分钟预约，减少等待。",
      "本周到店打卡可加入下周试吃/试用名单。",
      "把订单截图发群里，可参与周五小福利。",
      "周末活动提前预告：两人同行更划算。"
    ],
    replies: [
      `好评：谢谢同学喜欢，下次可以试试 ${data.product}，最近有校园限定福利。`,
      "差评：很抱歉这次体验没有达到预期，可以私信具体问题，我们会优先处理并补偿。",
      `咨询：店在学校附近，适合下课后顺路来，当前客单价约 ${data.price}。`,
      "催促：高峰期可能要等几分钟，建议提前进群预约。",
      "复购：老朋友本周回来可以报暗号“再来一次”。"
    ]
  };
}

function buildValidation(data) {
  return [
    ["D1-D2", "访谈 8-10 家校园周边商家，记录发布频率、运营负责人、最大困难和预算。"],
    ["D3-D4", `选择 3 家${data.storeType}或相近门店试用，确认愿意实际发布内容。`],
    ["D5-D6", "生成第一版内容包、短视频脚本、社群话术和活动海报文案。"],
    ["D7-D9", "协助商家发布到小红书、朋友圈或微信群，并记录发布时间。"],
    ["D10-D11", "收集浏览量、咨询量、到店反馈、进群人数和老板主观评价。"],
    ["D12-D13", "优化 Prompt 和交付模板，形成可复制的每周服务流程。"],
    ["D14", "测试 99/299 元付费意愿，决定是否继续推进产品化。"]
  ];
}

function renderPosts(data) {
  const posts = buildPosts(data);
  output.innerHTML = `
    <article class="content-card wide">
      <h3>本周内容主线</h3>
      <p>${data.storeName} 是面向${data.audience}的${data.storeType}。本周内容围绕“${data.goal}”，把 ${data.product} 包装成校园生活里的高频小选择。</p>
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
      <p>每条控制在 15-30 秒，重点展示真实门店、真实价格、真实学生场景，避免空泛广告感。</p>
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
      <h3>微信群促销话术</h3>
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
        <li>至少 30% 内容被商家采用</li>
        <li>至少 1 家愿意付费</li>
      </ul>
    </article>
    <article class="content-card">
      <h3>最大风险</h3>
      <p>商家可能只接受免费内容，不愿长期付费。需要通过发布后的浏览、咨询、到店和复购数据证明价值。</p>
    </article>
  `;
  latestText = timeline.map(([day, task]) => `${day}：${task}`).join("\n");
}

function renderEvidence(data) {
  const items = [
    `${data.storeType}常见问题：内容更新不稳定，标题和活动表达同质化。`,
    "平台评论区常见模板化回复，缺少安抚、复购和二次转化。",
    "访谈要验证：谁负责运营、每周发几次、是否愿意为内容包付费。",
    "关键付费问题：99 元试用包或 299 元月包是否能被接受。"
  ];
  evidenceList.innerHTML = items.map(item => `<li>${item}</li>`).join("");
}

function render() {
  const data = collectData();
  currentData = data;
  outputTitle.textContent = `${data.storeName} · 7 天 AI 经营内容包`;
  strategyText.textContent = `${data.storeName} 的本周目标是“${data.goal}”。策略是把 ${data.product} 绑定到${data.audience}的真实场景，用内容、短视频、社群和评论回复形成一套轻量经营闭环。`;
  renderEvidence(data);

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

form.addEventListener("submit", event => {
  event.preventDefault();
  render();
  showToast("已生成新的内容包");
});

copyBtn.addEventListener("click", async () => {
  await navigator.clipboard.writeText(latestText);
  showToast("当前内容已复制");
});

downloadBtn.addEventListener("click", () => {
  const blob = new Blob([`${currentData.storeName} 7 天 AI 经营内容包\n\n${latestText}`], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${currentData.storeName}-内容包.txt`;
  link.click();
  URL.revokeObjectURL(link.href);
  showToast("TXT 已导出");
});

render();
