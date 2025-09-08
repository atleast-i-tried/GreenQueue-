// app/api/schedule/route.js
import { NextResponse } from "next/server";
import { PricingClient, GetProductsCommand } from "@aws-sdk/client-pricing";

const client = new PricingClient({ region: "us-east-1" }); // Pricing API works in us-east-1

async function getBestRegion(instanceType) {
  const filters = [
    { Type: "TERM_MATCH", Field: "instanceType", Value: instanceType },
    { Type: "TERM_MATCH", Field: "operatingSystem", Value: "Linux" },
    { Type: "TERM_MATCH", Field: "tenancy", Value: "Shared" },
    { Type: "TERM_MATCH", Field: "preInstalledSw", Value: "NA" },
    { Type: "TERM_MATCH", Field: "capacitystatus", Value: "Used" },
  ];

  let nextToken = null;
  let cheapest = { region: null, location: null, price: Infinity };

  do {
    const cmd = new GetProductsCommand({
      ServiceCode: "AmazonEC2",
      Filters: filters,
      FormatVersion: "aws_v1",
      NextToken: nextToken,
      MaxResults: 100,
    });

    const resp = await client.send(cmd);
    nextToken = resp.NextToken;

    for (const priceStr of resp.PriceList || []) {
      let priceItem;
      try {
        priceItem = JSON.parse(priceStr);
      } catch {
        // skip malformed entries
        continue;
      }

      const productAttrs = priceItem.product?.attributes || {};
      const region = productAttrs.regionCode || null;
      const location = productAttrs.location || null;
      if (!region) continue;

      const terms = priceItem.terms?.OnDemand;
      if (!terms) continue;

      for (const offer of Object.values(terms)) {
        for (const dim of Object.values(offer.priceDimensions || {})) {
          const price = parseFloat(dim.pricePerUnit?.USD || "0");
          if (price > 0 && price < cheapest.price) {
            cheapest = { region, location, price };
          }
        }
      }
    }
  } while (nextToken);

  return cheapest.region ? cheapest : null;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const instanceType = body.instanceType || "t3.micro";

    const bestRegion = await getBestRegion(instanceType);
    if (!bestRegion) {
      return NextResponse.json({ error: "No region pricing found" }, { status: 404 });
    }

    return NextResponse.json(bestRegion);
  } catch (err) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
