
import { GoogleGenAI, Type } from "@google/genai";
import { Topic, ConsensusSummary } from "../types";

/**
 * Generates a theological consensus summary using Gemini 3 Pro.
 * Acts as a scholarly referee to resolve disparate community answers.
 */
export async function generateConsensus(topic: Topic): Promise<ConsensusSummary> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const contributionsContext = topic.contributions
    .map((c) => `[Voice of ${c.author}]: ${c.content}`)
    .join("\n\n");

  const systemInstruction = `You are the "Grand Ecumenical Arbiter" and "Theological Referee."

THE CHALLENGE:
A community is debating the topic: "${topic.title}". 
As the saying goes: "Ask 100 people about the Holy Trinity, you get 100 different answers." 
Your goal is to get EVERYONE ON THE SAME PAGE.

YOUR CORE FUNCTIONS:
1. REFEREE: Directly address the rebuttals and insights in the input. If one voice claims X and another claims Y, use your scholarly authority to determine the truth (Z).
2. ETYMOLOGIST: Analyze the Greek/Hebrew root meanings of key terms discussed.
3. EXEGETE: Use scriptural references as the final anchor of truth.
4. HERMENEUTIC EXPERT: Establish the framework of interpretation that unifies the conflicting voices.

THE VERDICT:
Produce a 'Unified Definition' so profound and anchored that a Pastor could use it as a foundational teaching tool. It must incorporate the "rebutted" insights while pointing to a higher truth.

OUTPUT JSON FORMAT REQUIREMENTS:
- unifiedDefinition: The final "Same Page" synthesis.
- alignmentScore: 0-100, reflecting how close the community is to this unity.
- etymologyNotes: Terms, Origins (e.g. Greek, Latin), and Meanings.
- scripturalFoundations: References and summaries of why they anchor this truth.
- keyPoints: The pillars of this unified truth.
- schoolsOfThought: Group the 100 answers into logical schools.
- hermeneuticalFramework: Describe the lens used to reach this consensus.

Act with absolute clarity, pastoral authority, and scholarly precision.`;

  const prompt = `Topic of Inquiry: "${topic.title}"
Initial Statement: "${topic.initialStatement}"

Chorus of Community Voices (Debate & Rebuttals):
${contributionsContext}`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      systemInstruction,
      temperature: 0.1, // Very low temperature for authoritative, reproducible refereeing
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          unifiedDefinition: { type: Type.STRING },
          alignmentScore: { type: Type.NUMBER },
          schoolsOfThought: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                prevalence: { type: Type.STRING }
              },
              propertyOrdering: ["name", "description", "prevalence"]
            }
          },
          keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
          etymologyNotes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                term: { type: Type.STRING },
                origin: { type: Type.STRING },
                meaning: { type: Type.STRING }
              },
              propertyOrdering: ["term", "origin", "meaning"]
            }
          },
          exegeticalInsights: { type: Type.ARRAY, items: { type: Type.STRING } },
          hermeneuticalFramework: { type: Type.STRING },
          scripturalFoundations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                reference: { type: Type.STRING },
                summary: { type: Type.STRING }
              },
              propertyOrdering: ["reference", "summary"]
            }
          }
        },
        propertyOrdering: [
          "unifiedDefinition", "alignmentScore", "schoolsOfThought", 
          "keyPoints", "etymologyNotes", "exegeticalInsights", 
          "hermeneuticalFramework", "scripturalFoundations"
        ]
      }
    }
  });

  try {
    const text = response.text?.trim();
    if (!text) throw new Error("The Scriptorium provided an empty scroll.");
    
    const data = JSON.parse(text);
    const version = (topic.consensusHistory?.length || 0) + 1;
    return {
      ...data,
      id: Math.random().toString(36).substring(2, 11),
      version,
      syncedAt: Date.now()
    };
  } catch (error) {
    console.error("Theological Arbiter Error:", error);
    throw new Error("The Arbiter could not reach a verdict. Ensure your community debate has substance.");
  }
}
