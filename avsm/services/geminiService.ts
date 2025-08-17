
import { GoogleGenAI, Type } from "@google/genai";
import type { VisitorProfile } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        name: {
            type: Type.STRING,
            description: "A plausible name for the person based on general appearance. If a name is impossible to determine, provide a descriptive title like 'Professional Man in his 40s'."
        },
        age: {
            type: Type.STRING,
            description: "A plausible estimation of the person's age range (e.g., '25-30', '40-45')."
        },
        gender: {
            type: Type.STRING,
            description: "The estimated gender of the person (e.g., Male, Female)."
        },
        profession: {
            type: Type.STRING,
            description: "A likely profession based on their attire, background, and overall appearance (e.g., Student, Doctor, Corporate Executive, Tourist)."
        }
    },
    required: ["name", "age", "gender", "profession"]
};

export async function analyzeVisitorImage(base64ImageData: string): Promise<VisitorProfile> {
    try {
        const imagePart = {
            inlineData: {
                mimeType: 'image/jpeg',
                data: base64ImageData,
            },
        };

        const textPart = {
            text: "Analyze the person in this image. Based on visual cues, estimate their age range, gender, and a potential profession. Provide a plausible name or a descriptive title. Return the response in the specified JSON format."
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.2
            }
        });

        const jsonText = response.text.trim();
        const parsedResult = JSON.parse(jsonText) as VisitorProfile;
        
        if (!parsedResult.name || !parsedResult.age || !parsedResult.gender || !parsedResult.profession) {
            throw new Error("AI response is missing required fields.");
        }

        return parsedResult;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get a valid response from the Gemini API.");
    }
}