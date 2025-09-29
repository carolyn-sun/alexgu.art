// plugins/cdn-jpg/cdn-exporter.js
// 把 ?p=<docs相对路径>&base=<CDN前缀> 拼出完整的 CDN URL 并导出字符串
module.exports = function () {
  const params = new URLSearchParams(this.resourceQuery);
  const rel = params.get("p") || "";
  const base = (params.get("base") || "").replace(/\/$/, "");
  const url = base ? `${base}/docs/${rel}` : `/docs/${rel}`; // 没配 base 时给个站内兜底（理论上 CI 应该总是有）
  return `module.exports = ${JSON.stringify(url)};`;
};
