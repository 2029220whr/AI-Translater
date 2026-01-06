import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

const processApiKey = process.env.API_KEY;

if (!processApiKey) {
  console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: processApiKey || '' });

const synonymSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    term: { type: Type.STRING, description: "The synonym word" },
    translation: { type: Type.STRING, description: "Chinese translation of the synonym" },
  },
  required: ["term", "translation"],
};

const exampleSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    en: { type: Type.STRING, description: "English example sentence" },
    cn: { type: Type.STRING, description: "Chinese translation of the example" },
  },
  required: ["en", "cn"],
};

const wordDetailSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    word: { type: Type.STRING, description: "The target word" },
    phonetic: { type: Type.STRING, description: "IPA phonetic transcription (e.g. /wɜːrd/)" },
    partOfSpeech: { type: Type.STRING, description: "Part of speech (e.g. noun, verb, adj)" },
    definition: { type: Type.STRING, description: "Concise Chinese definition" },
    synonyms: { 
      type: Type.ARRAY, 
      items: synonymSchema,
      description: "List of 2-3 synonyms with translations"
    },
    derivatives: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "List of derived forms (e.g. word -> wordy, wording)"
    },
    examples: { 
      type: Type.ARRAY, 
      items: exampleSchema,
      description: "1-2 example sentences using the word"
    },
  },
  required: ["word", "phonetic", "partOfSpeech", "definition", "synonyms", "derivatives", "examples"],
};

const analysisResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    mainTranslation: { type: Type.STRING, description: "Translation of the input text. If input is a single word, provide its main definition here too." },
    isSentenceOrParagraph: { type: Type.BOOLEAN, description: "True if input is a phrase, sentence or paragraph. False if single word." },
    vocabulary: { 
      type: Type.ARRAY, 
      items: wordDetailSchema,
      description: "If input is a single word, this array contains just that word details. If input is text, this array contains the most important/difficult words extracted from the text."
    },
  },
  required: ["mainTranslation", "isSentenceOrParagraph", "vocabulary"],
};

export const analyzeText = async (text: string): Promise<AnalysisResult> => {
  try {
    const modelId = 'gemini-3-flash-preview'; 
    const response = await ai.models.generateContent({
      model: modelId,
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Analyze the following English text. 
              If it is a single word, provide its details (phonetic, POS, synonyms, derivatives, examples).
              If it is a sentence or paragraph, translate it to Chinese first, then extract the key vocabulary words (focus on academic, CEFR B1+ words) and provide details for each extracted word.
              
              Input Text: "${text}"`
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisResponseSchema,
        systemInstruction: "You are an expert English linguist and teacher assisting a Chinese student. Provide accurate IPA phonetics, precise Chinese definitions, and helpful examples.",
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response from AI");
    }

    return JSON.parse(resultText) as AnalysisResult;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};