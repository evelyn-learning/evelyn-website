/**
 * Homework Extraction API Route
 *
 * Extracts problems from uploaded homework images using Claude's vision.
 * Returns the extracted text and initial tutor response.
 */

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageData, mimeType, subject, topic, level, conversationHistory = [] } = body;

    if (!imageData) {
      return NextResponse.json({ error: 'Image data is required' }, { status: 400 });
    }

    // Validate mime type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(mimeType)) {
      return NextResponse.json({ error: 'Invalid image type' }, { status: 400 });
    }

    // Step 1: Extract structured problem data from the image
    const extractionPrompt = `You are extracting a homework problem from an image.
Your task is to carefully analyze and extract the problem in a structured JSON format.

Return a JSON object with these fields:
{
  "problemText": "The complete problem statement",
  "diagramDescription": "Description of any diagram/figure in the image (null if none)",
  "givenValues": [{"symbol": "r", "value": "1", "unit": "km"}, ...],
  "findValues": ["net displacement", "average velocity", ...],
  "problemType": "kinematics" | "forces" | "energy" | "circular-motion" | "projectile" | "other"
}

Be precise and complete. Return ONLY valid JSON, no other text.`;

    const extractionResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system: extractionPrompt,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mimeType,
                data: imageData,
              },
            },
            {
              type: 'text',
              text: 'Extract the homework problem from this image as structured JSON.',
            },
          ],
        },
      ],
    });

    const extractedContent = extractionResponse.content[0];
    if (extractedContent.type !== 'text') {
      return NextResponse.json({ error: 'Failed to extract problem' }, { status: 500 });
    }

    // Parse the structured extraction
    let problemData: {
      problemText: string;
      diagramDescription?: string;
      givenValues?: Array<{ symbol: string; value: string; unit?: string }>;
      findValues?: string[];
      problemType?: string;
    };

    try {
      // Clean up potential markdown code blocks
      let jsonText = extractedContent.text.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.slice(7);
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.slice(3);
      }
      if (jsonText.endsWith('```')) {
        jsonText = jsonText.slice(0, -3);
      }
      problemData = JSON.parse(jsonText.trim());
    } catch {
      // Fallback if JSON parsing fails
      problemData = {
        problemText: extractedContent.text,
        givenValues: [],
        findValues: [],
      };
    }

    const extractedProblem = problemData.problemText;

    // Create whiteboard command to display the extracted problem
    const whiteboardCommands = [
      {
        action: 'showDiagram',
        type: 'problem',
        params: {
          problemText: problemData.problemText,
          diagramDescription: problemData.diagramDescription,
          givenValues: problemData.givenValues || [],
          findValues: problemData.findValues || [],
        },
      },
    ];

    // Step 2: Generate tutor response using the extracted problem
    const tutorPrompt = `You are an expert AI tutor helping a student with their homework.
The student has uploaded an image containing this problem:

---
${extractedProblem}
---

Your task:
1. Acknowledge you can see the problem (reference specific details to show you understand it)
2. Do NOT solve the problem yet - use the Socratic method
3. Ask a guiding question to help them start thinking about the solution

Topic context: ${subject} - ${topic} (${level} level)

Keep your response SHORT (2-3 sentences max). This is a voice conversation.
Remember: Guide them to discover the solution, don't just give it away.`;

    const tutorResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      system: tutorPrompt,
      messages: [
        ...conversationHistory,
        {
          role: 'user',
          content: `I uploaded a homework problem. Here's what it says:\n\n${extractedProblem}\n\nCan you help me understand it and work through it?`,
        },
      ],
    });

    const tutorContent = tutorResponse.content[0];
    if (tutorContent.type !== 'text') {
      return NextResponse.json({ error: 'Unexpected response type' }, { status: 500 });
    }

    return NextResponse.json({
      text: tutorContent.text,
      extractedProblem: extractedProblem,
      extracted: true,
      whiteboardCommands,
      problemData,
      usage: {
        inputTokens: extractionResponse.usage.input_tokens + tutorResponse.usage.input_tokens,
        outputTokens: extractionResponse.usage.output_tokens + tutorResponse.usage.output_tokens,
      },
    });
  } catch (error) {
    console.error('[Extract Homework API] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
