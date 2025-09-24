// src/gemini/gemini.service.ts
import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';

@Injectable()
export class GeminiService {
  private readonly GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  async askGemini(message: string, history: any[] = []): Promise<any> {
    if (!this.GEMINI_API_KEY) {
      return { reply: 'API Key no definida 😥' };
    } // ✅ Instrucciones para la IA:
    const systemPrompt = `Eres un asistente personal llamado Milo, y respondes a peticiones del usuario. Tu principal objetivo es identificar la intención de la solicitud y responder con un objeto JSON si la intención es una de las siguientes. Si no, responde con un texto normal y conversacional.

Intenciones y respuestas en JSON:
- Si el usuario quiere crear una nota, responde: { "action": "create_note", "title": "[TÍTULO]", "content": "[CONTENIDO]" }
  - Ejemplos de frases de usuario: "Quiero hacer una nota para la reunión", "anota esto", "crea una nota de compras".

- Si el usuario pregunta por el clima, responde: { "action": "get_weather" }
  - Ejemplos de frases de usuario: "¿Qué clima hace?", "cómo está el tiempo", "dime el pronóstico".

- Si el usuario quiere ver noticias, responde: { "action": "get_news" }
  - Ejemplos de frases de usuario: "noticias de hoy", "dame las novedades locales".

- Si el usuario quiere crear un recordatorio, responde: { "action": "get_reminders" }
  - Ejemplos de frases de usuario: "ponme un recordatorio", "recuérdame..."

- Si el usuario quiere gestionar tareas, responde: { "action": "get_tasks" }
  - Ejemplos de frases de usuario: "mis tareas", "lista de pendientes".

Si la petición no encaja en estas categorías, responde como un asistente conversacional.`; // ...

    const formattedHistory = history.map((msg) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${this.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              // 👇 IMPORTANTE: el systemPrompt debería ser el primer mensaje
              { role: 'user', parts: [{ text: systemPrompt }] },

              ...formattedHistory,
              { role: 'user', parts: [{ text: message }] },
            ],
          }),
        },
      );

      const data = await res.json();
      const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!replyText) {
        return { reply: 'No se pudo obtener una respuesta válida 😅' };
      } // ✅ Intenta parsear la respuesta como JSON
      const jsonRegex = /```json\n([\s\S]*?)\n```/;
      const match = replyText.match(jsonRegex);
      if (match && match[1]) {
        try {
          const parsedJson = JSON.parse(match[1]);
          return parsedJson;
        } catch (e) {
          console.error('Error al parsear el JSON:', e);
          return {
            reply: 'Milo intentó enviarme una acción, pero no pude entenderla.',
          };
        }
      }
      return { reply: replyText };
    } catch (err) {
      console.error(err);
      return { reply: 'Error al consultar Gemini 😥' };
    }
  }
}
