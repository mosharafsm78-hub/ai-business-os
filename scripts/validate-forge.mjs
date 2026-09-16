import { readFileSync } from "node:fs";

const html = readFileSync("index.html", "utf8");
const scripts = [];
const re = /<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi;
let m;
while ((m = re.exec(html))) scripts.push(m[1]);

const errors = [];
scripts.forEach((source, i) => {
  try { new Function(source); }
  catch (e) { errors.push(`script #${i + 1}: ${e.message}`); }
});

const required = [
  ["shared shell", "function shell("],
  ["shared navigation", "function nav("],
  ["shared context bar", "function forgeContextBar("],
  ["shared page header", "function forgePageGuide("],
  ["single application state", "const state="],
];
for (const [name, needle] of required) {
  if (!html.includes(needle)) errors.push(`missing ${name}`);
}

const stateCount = (html.match(/const state=/g) || []).length;
if (stateCount !== 1) errors.push(`expected exactly one application state, found ${stateCount}`);

if (html.indexOf("</body>") < html.indexOf("<style id=\"forge-sitewide-system\">")) {
  errors.push("shared design CSS must be inside <head>, not after </body>");
}

if (errors.length) {
  console.error("Forge validation failed:");
  for (const error of errors) console.error(" - " + error);
  process.exit(1);
}
console.log(`Forge validation passed: ${scripts.length} script blocks, all syntactically valid.`);
