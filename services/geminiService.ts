
import { GoogleGenAI } from "@google/genai";

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  image?: {
    data: string;
    mimeType: string;
  };
}

export const streamAIRecommendation = async (
  messages: ChatMessage[],
  onChunk: (chunk: string) => void
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  // Instrucciones del sistema optimizadas para legibilidad
  const systemInstruction = `Eres el Concierge Médico de "Salud & Confort Celaya".
  TU OBJETIVO: Ayudar al cliente a encontrar el equipo médico exacto y seguro.
  
  REGLAS DE FORMATO Y ESTRUCTURA (CRÍTICO):
  1. ESTRUCTURA: Siempre responde con esta estructura clara:
     - Saludo empático.
     - Análisis breve de la situación.
     - Sugerencias en lista con VIÑETAS (usa el carácter •).
     - Preguntas de seguimiento si son necesarias.
     - Disclaimer legal breve al final.
  2. ESPACIADO: Deja una LÍNEA EN BLANCO completa entre párrafos y secciones. No amontones el texto.
  3. RESALTADO: Usa negritas (**texto**) para datos numéricos, nombres de equipos y advertencias.
  4. TONO: Profesional, experto y pausado.
  
  REGLAS DE OPERACIÓN:
  - Si recibes una RECETA: Identifica el equipo y confírmalo.
  - RAZONAMIENTO CLÍNICO: Pregunta siempre por peso, medidas o movilidad si no se mencionan.
  - CONTROL DE INTERFAZ: Incluye al final (si aplica): [ACTION:FILTER_CATEGORY:NombreDeLaCategoría].
  - UBICACIÓN: Estamos en Celaya, Guanajuato.`;

  try {
    const lastMessage = messages[messages.length - 1];
    const history = messages.slice(0, -1).map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const currentParts: any[] = [{ text: lastMessage.text }];
    if (lastMessage.image) {
      currentParts.push({
        inlineData: {
          data: lastMessage.image.data,
          mimeType: lastMessage.image.mimeType
        }
      });
    }

    const result = await ai.models.generateContentStream({
      model: "gemini-3-flash-preview",
      contents: [
        ...history,
        { role: 'user', parts: currentParts }
      ],
      config: {
        systemInstruction,
        temperature: 0.6,
      }
    });

    for await (const chunk of result) {
      const chunkText = chunk.text;
      if (chunkText) {
        onChunk(chunkText);
      }
    }
  } catch (error) {
    console.error("Gemini Streaming Error:", error);
    onChunk("Lo sentimos, hubo un error técnico. Por favor intenta de nuevo o contáctanos por WhatsApp.");
  }
};
