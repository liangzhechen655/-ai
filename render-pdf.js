const path = require("path");
const { chromium } = require("playwright");

(async () => {
  const projectDir = __dirname;
  const htmlPath = path.join(projectDir, "submission-a4.html");
  const pdfPath = path.join(projectDir, "submission-a4.pdf");

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1240, height: 1754 },
    deviceScaleFactor: 1
  });

  await page.goto(`file://${htmlPath.replace(/\\/g, "/")}`, { waitUntil: "networkidle" });
  await page.pdf({
    path: pdfPath,
    format: "A4",
    printBackground: true,
    margin: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" }
  });

  await browser.close();
  console.log(pdfPath);
})();
