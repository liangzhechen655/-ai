const form = document.querySelector("#merchantForm");
const output = document.querySelector("#output");
const outputTitle = document.querySelector("#outputTitle");
const copyBtn = document.querySelector("#copyBtn");

const dayAngles = [
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

function buildContent() {
  const storeType = value("storeType");
  const storeName = value("storeName") || "校园小店";
  const product = value("product") || "主推产品";
  const price = value("price") || "学生价";
  const audience = value("audience") || "大学生";
  const goal = value("goal");
  const tone = value("tone");

  outputTitle.textContent = `${storeName} · 7 天 AI 经营内容包`;

  const posts = dayAngles.map((angle, index) => {
    return `D${index + 1}｜${angle}：${storeName} 的 ${product}，${price}，适合${audience}。文案风格：${tone}，结尾引导收藏/到店/进群。`;
  });

  const scripts = [
    `镜头 1：拍门店门头和学生路过；镜头 2：特写制作 ${product}；镜头 3：展示价格 ${price}；结尾口播“下课路过就来一杯”。`,
    `用“室友测评”形式拍 15 秒短视频，三个人分别说一个购买理由：近、便宜、好喝/好用。`,
    `拍“老板的一天”：备货、出单、打包、回复评论，强化真实感，最后带出本周目标：${goal}。`
  ];

  const groupMessages = [
    `今天下课后来店报暗号“校园 AI”，${product} 有隐藏福利。`,
    `晚自习前 30 分钟适合囤一份，进群同学本周享受优先提醒。`,
    `带室友一起到店更划算，适合宿舍拼单。`,
    `今天评论区抽 3 位同学送小福利，明天中午公布。`,
    `老顾客返场提醒：本周主推 ${product}，想要少糖/特殊需求可以提前说。`
  ];

  output.innerHTML = `
    <article class="card wide">
      <h3>本周定位</h3>
      <p>${storeName} 是面向${audience}的${storeType}，本周目标是“${goal}”。内容重点不是介绍 AI，而是把 ${product} 包装成学生在校园生活里的一个高频小选择。</p>
      <div style="margin-top: 12px;">
        <span class="tag">${storeType}</span>
        <span class="tag">${price}</span>
        <span class="tag">${tone}</span>
        <span class="tag">${goal}</span>
      </div>
    </article>

    <article class="card">
      <h3>7 条小红书/朋友圈文案</h3>
      <ul>${posts.map(item => `<li>${item}</li>`).join("")}</ul>
    </article>

    <article class="card">
      <h3>3 条短视频脚本</h3>
      <div class="script">${scripts.map((item, i) => `<div class="script-block"><strong>脚本 ${i + 1}</strong><br>${item}</div>`).join("")}</div>
    </article>

    <article class="card">
      <h3>校园优惠活动</h3>
      <ul>
        <li>活动名：下课 20 分钟补给站。</li>
        <li>规则：凭学生证或校园卡享本周限定福利，鼓励 2 人同行。</li>
        <li>传播：朋友圈/微信群发暗号，小红书评论区置顶活动。</li>
        <li>复盘：记录每日到店人数、暗号使用次数和进群人数。</li>
      </ul>
    </article>

    <article class="card">
      <h3>社群话术</h3>
      <ul>${groupMessages.map(item => `<li>${item}</li>`).join("")}</ul>
    </article>

    <article class="card">
      <h3>评论回复模板</h3>
      <ul>
        <li>好评：谢谢同学喜欢，下次来可以试试 ${product}，最近有校园限定福利。</li>
        <li>差评：很抱歉这次体验没有达到预期，可以私信我们具体问题，我们会优先处理并补偿。</li>
        <li>咨询：店在学校附近，适合下课后顺路来，当前客单价约 ${price}。</li>
        <li>催促：高峰期可能要等几分钟，建议提前进群预约。</li>
        <li>复购：老朋友本周回来可以报暗号“再来一次”。</li>
      </ul>
    </article>

    <article class="card">
      <h3>海报文案</h3>
      <p><strong>${storeName}｜下课 20 分钟补给站</strong></p>
      <p>主推：${product}</p>
      <p>学生友好价：${price}</p>
      <p>本周到店报暗号，享校园限定福利。</p>
    </article>
  `;
}

form.addEventListener("submit", event => {
  event.preventDefault();
  buildContent();
});

copyBtn.addEventListener("click", async () => {
  const text = output.innerText;
  await navigator.clipboard.writeText(text);
  copyBtn.textContent = "已复制";
  setTimeout(() => {
    copyBtn.textContent = "复制内容";
  }, 1200);
});

buildContent();
