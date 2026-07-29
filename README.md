# ChainIndex

[chainindex.dev](https://www.chainindex.dev) is an open-source directory for EVM chain IDs, public RPC endpoints, block explorers, native currencies, and wallet network settings.

Search mainnets and testnets, copy network details, or add a chain to your wallet from a fast, statically generated website.

## Run locally

Use a supported [Node.js](https://nodejs.org/) release: Node.js 20.19+, 22.13+, or 24+. Node.js 24 LTS is recommended.

```bash
git clone https://github.com/PranavGarg01/chainindex.git
cd chainindex
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No environment variables or external data fetches are required.

## Production build

```bash
npm run build
```

The static website is generated in `out/` and can be served by any static file server.

## Contribute chain data

Each network is a reviewable JSON file in `data/chains/`, named after its chain ID. The data contract is documented in `data/chain.schema.json`.

After changing a chain record, run:

```bash
npm run build:data-index
npm run validate:data
```

Then run the full project checks:

```bash
npm run lint
npm run build
```

Use the GitHub issue forms to propose a chain, submit a public RPC, or report a broken endpoint. Pull requests should include an official source for data changes and must never contain API keys or secrets.

## License

chainindex is available under the [MIT License](LICENSE). The license permits commercial use, while preserving the copyright and license notice.
