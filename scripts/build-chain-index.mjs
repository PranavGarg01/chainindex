import fs from "node:fs";
import path from "node:path";

const dataDirectory = path.join(process.cwd(), "data", "chains");
const indexFile = path.join(process.cwd(), "data", "chains.index.json");
const orderFile = path.join(process.cwd(), "data", "chain-order.json");

const chains = fs
  .readdirSync(dataDirectory)
  .filter((file) => file.endsWith(".json"))
  .map((file) => JSON.parse(fs.readFileSync(path.join(dataDirectory, file), "utf8")))
  .sort((a, b) => a.chainId - b.chainId);

fs.writeFileSync(indexFile, `${JSON.stringify(chains, null, 2)}\n`);
const existingOrder = fs.existsSync(orderFile)
  ? (JSON.parse(fs.readFileSync(orderFile, "utf8")).chainIds ?? [])
  : [];
const chainIds = new Set(chains.map((chain) => chain.chainId));
const orderedIds = [
  ...existingOrder.filter((chainId) => chainIds.has(chainId)),
  ...chains.map((chain) => chain.chainId).filter((chainId) => !existingOrder.includes(chainId)),
];
fs.writeFileSync(orderFile, `${JSON.stringify({ chainIds: orderedIds }, null, 2)}\n`);
console.log(`Built chain index for ${chains.length} records.`);
