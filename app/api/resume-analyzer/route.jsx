import { RESUME_ANALYSIS_PROMPT } from "@/services/Contants";
import { createRequire } from "module";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const require = createRequire(import.meta.url);
// Import internal module directly to bypass pdf-parse's startup test-file check
const pdfParse = require("pdf-parse/lib/pdf-parse.js");
// mammoth: reliable DOCX → plain text extraction (pure JS, no native deps)
const mammoth = require("mammoth");


export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    let resumeText = "";

    if (file.type === "text/plain") {
      resumeText = await file.text();
    } else if (file.type === "application/pdf") {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      try {
        const data = await pdfParse(buffer);
        resumeText = data.text;
      } catch (pdfError) {
        console.error("PDF parse error:", pdfError);
        return NextResponse.json(
          { error: "Could not read PDF. Please ensure the PDF is not password protected and try again." },
          { status: 422 }
        );
      }
    } else {
      // DOC / DOCX — use mammoth for proper text extraction
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      try {
        const result = await mammoth.extractRawText({ buffer });
        resumeText = result.value;
        if (result.messages?.length) {
          console.log("mammoth warnings:", result.messages);
        }
      } catch (docError) {
        console.error("DOCX parse error:", docError);
        return NextResponse.json(
          { error: "Could not read DOC/DOCX file. Please try uploading a PDF instead." },
          { status: 422 }
        );
      }
    }

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json(
        { error: "Could not extract enough text from the resume. Please try a PDF or text file." },
        { status: 422 }
      );
    }

    const FINAL_PROMPT = RESUME_ANALYSIS_PROMPT.replace(
      "{{resumeText}}",
      resumeText.slice(0, 4000)
    );

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "arcee-ai/trinity-large-preview:free",
      messages: [{ role: "user", content: FINAL_PROMPT }],
      max_tokens: 1500,
      temperature: 0.2,
    });

    if (
      !completion?.choices?.length ||
      !completion.choices[0].message
    ) {
      return NextResponse.json(
        { error: "Invalid response from AI model" },
        { status: 500 }
      );
    }

    let aiContent = completion.choices[0].message.content || "";

    // Clean up the response to extract JSON
    aiContent = aiContent
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "AI returned an unexpected format. Please try again." },
        { status: 500 }
      );
    }

    const analysis = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ analysis });
  } catch (e) {
    console.error("Resume analyzer error:", e?.message || e);
    return NextResponse.json(
      { error: e?.message || "Unexpected server error" },
      { status: 500 }
    );
  }
}
