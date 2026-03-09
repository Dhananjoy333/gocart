import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { genAI } from "@/configs/gemini";


async function main(base64Image, mimeType) {

  const model = genAI.getGenerativeModel({ model:process.env.GEMINI_API_MODEL});

  const result = await model.generateContent([
    `
    You are a product listing assistant for an e-commerce store.Your job is to ananlyze an image of a product and generate structured data.

    Respond ONLY with raw JSON (no code block, no markdown, no explanation).
    The JSON must strictly follow this schema:

    {
    "name": string,              //Short product name
    "description": string,       //Marketing-friendly
    description of the product
    }
    `,
    {
      inlineData: {
        data: base64Image,
        mimeType: mimeType,
      },
    },
  ]);

  const text = result.response.text();

  // clean response if Gemini wraps JSON
  const cleaned = text.replace(/```json|```/g, "").trim();

  return JSON.parse(cleaned);
}

export async function POST(request) {
  try {

    const { userId } = getAuth(request);
    const isSeller = await authSeller(userId);

    if (!isSeller) {
      return NextResponse.json({ error: "not authorized" }, { status: 401 });
    }

    const { base64Image, mimeType } = await request.json();

    const result = await main(base64Image, mimeType);

    return NextResponse.json(result);

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}