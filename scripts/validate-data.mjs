import fs from "node:fs";
import path from "node:path";

const directory = path.join(process.cwd(), "data", "chains");
const indexFile = path.join(process.cwd(), "data", "chains.index.json");
const orderFile = path.join(process.cwd(), "data", "chain-order.json");
const files = fs.readdirSync(directory).filter((file) => file.endsWith(".json"));
const slugs = new Set();
const chainIds = new Set();
const errors = [];
const required = [
  "schemaVersion",
  "name",
  "slug",
  "chainId",
  "networkType",
  "nativeCurrency",
  "rpc",
  "explorers",
  "status",
];
const networkTypes = new Set(["mainnet", "testnet", "devnet", "local"]);
const statuses = new Set(["active", "deprecated", "unverified", "coming_soon"]);
const chainFields = new Set([
  "schemaVersion",
  "name",
  "slug",
  "chainId",
  "networkType",
  "status",
  "nativeCurrency",
  "rpc",
  "explorers",
  "website",
  "docs",
  "aliases",
]);
const currencyFields = new Set(["name", "symbol", "decimals"]);
const rpcFields = new Set(["url", "isRecommended"]);
const explorerFields = new Set(["name", "url"]);

for (const file of files) {
  let chain;
  try {
    chain = JSON.parse(fs.readFileSync(path.join(directory, file), "utf8"));
  } catch (error) {
    errors.push(`${file}: invalid JSON (${error.message})`);
    continue;
  }
  for (const field of Object.keys(chain))
    if (!chainFields.has(field)) errors.push(`${file}: unsupported field ${field}`);
  for (const field of required)
    if (chain[field] === undefined) errors.push(`${file}: missing ${field}`);
  if (`${chain.chainId}.json` !== file) errors.push(`${file}: chain ID must match filename`);
  if (slugs.has(chain.slug)) errors.push(`${file}: duplicate slug ${chain.slug}`);
  else slugs.add(chain.slug);
  if (chainIds.has(chain.chainId)) errors.push(`${file}: duplicate chain ID ${chain.chainId}`);
  else chainIds.add(chain.chainId);
  if (chain.schemaVersion !== 2) errors.push(`${file}: schemaVersion must be 2`);
  if (!Number.isInteger(chain.chainId) || chain.chainId <= 0)
    errors.push(`${file}: chain ID must be a positive integer`);
  if (!networkTypes.has(chain.networkType)) errors.push(`${file}: invalid networkType`);
  if (!statuses.has(chain.status)) errors.push(`${file}: invalid status`);
  if (!Number.isInteger(chain.nativeCurrency?.decimals))
    errors.push(`${file}: native currency decimals must be an integer`);
  for (const field of Object.keys(chain.nativeCurrency ?? {}))
    if (!currencyFields.has(field))
      errors.push(`${file}: unsupported nativeCurrency field ${field}`);
  if (!Array.isArray(chain.rpc) || !chain.rpc.length) errors.push(`${file}: RPC list is empty`);
  const urls = new Set();
  for (const rpc of chain.rpc ?? []) {
    for (const field of Object.keys(rpc ?? {}))
      if (!rpcFields.has(field)) errors.push(`${file}: unsupported RPC field ${field}`);
    if (!/^https:\/\//.test(rpc.url)) errors.push(`${file}: invalid RPC URL ${rpc.url}`);
    if (typeof rpc.isRecommended !== "boolean")
      errors.push(`${file}: RPC isRecommended must be boolean`);
    if (urls.has(rpc.url)) errors.push(`${file}: duplicate RPC URL ${rpc.url}`);
    else urls.add(rpc.url);
  }
  if ((chain.rpc ?? []).filter((rpc) => rpc.isRecommended).length !== 1)
    errors.push(`${file}: exactly one recommended RPC is required`);
  const explorerUrls = new Set();
  for (const explorer of chain.explorers ?? []) {
    for (const field of Object.keys(explorer ?? {}))
      if (!explorerFields.has(field)) errors.push(`${file}: unsupported explorer field ${field}`);
    if (!explorer?.name || !/^https:\/\//.test(explorer.url))
      errors.push(`${file}: invalid explorer`);
    if (explorerUrls.has(explorer.url))
      errors.push(`${file}: duplicate explorer URL ${explorer.url}`);
    else explorerUrls.add(explorer.url);
  }
  if (chain.website && !/^https:\/\//.test(chain.website))
    errors.push(`${file}: invalid website URL`);
  if (chain.docs && !/^https:\/\//.test(chain.docs)) errors.push(`${file}: invalid docs URL`);
  if (
    chain.aliases &&
    (!Array.isArray(chain.aliases) ||
      chain.aliases.some((alias) => typeof alias !== "string" || !alias.trim()))
  )
    errors.push(`${file}: aliases must be non-empty strings`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
if (!fs.existsSync(indexFile)) {
  console.error("Missing data/chains.index.json. Run npm run build:data-index.");
  process.exit(1);
}
const index = JSON.parse(fs.readFileSync(indexFile, "utf8"));
if (!Array.isArray(index) || index.length !== files.length) {
  console.error(
    "data/chains.index.json does not match the chain file count. Run npm run build:data-index.",
  );
  process.exit(1);
}
const indexById = new Map(index.map((chain) => [chain.chainId, JSON.stringify(chain)]));
for (const file of files) {
  const chain = JSON.parse(fs.readFileSync(path.join(directory, file), "utf8"));
  if (indexById.get(chain.chainId) !== JSON.stringify(chain)) {
    console.error(
      `data/chains.index.json is out of date for ${file}. Run npm run build:data-index.`,
    );
    process.exit(1);
  }
}
if (!fs.existsSync(orderFile)) {
  console.error("Missing data/chain-order.json. Run npm run build:data-index.");
  process.exit(1);
}
const order = JSON.parse(fs.readFileSync(orderFile, "utf8"));
if (
  !Array.isArray(order.chainIds) ||
  order.chainIds.length !== files.length ||
  new Set(order.chainIds).size !== files.length ||
  order.chainIds.some((chainId) => !chainIds.has(chainId))
) {
  console.error(
    "data/chain-order.json does not match the chain files. Run npm run build:data-index.",
  );
  process.exit(1);
}
console.log(`Validated ${files.length} chain files.`);
