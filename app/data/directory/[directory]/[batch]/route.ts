import { getChains } from "@/lib/data";

const BATCH_SIZE = 40;
const directories = ["chains", "testnets"] as const;

function recordsFor(directory: string) {
  const chains = getChains();
  return directory === "testnets"
    ? chains.filter((chain) => chain.networkType === "testnet")
    : chains;
}

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return directories.flatMap((directory) => {
    const batchCount = Math.ceil(recordsFor(directory).length / BATCH_SIZE);
    return Array.from({ length: batchCount }, (_, batch) => ({
      directory,
      batch: String(batch),
    }));
  });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ directory: string; batch: string }> },
) {
  const { directory, batch } = await params;
  if (!directories.includes(directory as typeof directories[number])) {
    return new Response("Not found", { status: 404 });
  }

  const batchNumber = Number.parseInt(batch, 10);
  const records = recordsFor(directory);
  const start = batchNumber * BATCH_SIZE;
  if (!Number.isInteger(batchNumber) || batchNumber < 0 || start >= records.length) {
    return new Response("Not found", { status: 404 });
  }

  return Response.json(records.slice(start, start + BATCH_SIZE), {
    headers: {
      "Cache-Control": "public, max-age=0, s-maxage=31536000, stale-while-revalidate=86400",
    },
  });
}
