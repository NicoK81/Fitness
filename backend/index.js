// index.js (backend)

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const OpenAI = require('openai');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * POST /chat
 * Yleinen chat – kysymykset harjoittelusta JA kysymykset jo tehdystä ohjelmasta.
 * Frontista lähetetään:
 * { message, profile: {age, weight, fitnessLevel, goal}, plan, language }
 */
app.post('/chat', async (req, res) => {
  try {
    const { message, profile, plan, language = 'fi' } = req.body;
    const { age, weight, fitnessLevel, goal } = profile || {};

    const systemPromptFi = `
Olet suomenkielinen henkilökohtainen valmentaja mobiilisovelluksessa.
Vastaat LYHYESTI ja selkeästi suomeksi. Älä tee lääketieteellisiä diagnooseja.
ÄLÄ käytä englantia vastauksissa.
Voit kommentoida myös käyttäjän olemassa olevaa treeniohjelmaa, jos se on mukana viestissä.
`;

    const systemPromptEn = `
You are an English-speaking personal trainer in a mobile app.
Answer briefly and clearly in English only. Do not give medical diagnoses.
Do NOT use Finnish in your answers.
You may also comment on the user's existing workout plan if it is provided.
`;

    const userPromptFi = `
Käyttäjän tiedot:
- Ikä: ${age || 'tuntematon'}
- Paino: ${weight || 'tuntematon'} kg
- Kuntotaso: ${fitnessLevel || 'tuntematon'}
- Tavoite: ${goal || 'tuntematon'}

Nykyinen ohjelma (JSON tai teksti, voi olla tyhjä):
${plan ? JSON.stringify(plan).slice(0, 1500) : 'ei ohjelmaa'}

Käyttäjän viesti:
${message}
`;

    const userPromptEn = `
User profile:
- Age: ${age || 'unknown'}
- Weight: ${weight || 'unknown'} kg
- Fitness level: ${fitnessLevel || 'unknown'}
- Goal: ${goal || 'unknown'}

Current plan (JSON or text, can be empty):
${plan ? JSON.stringify(plan).slice(0, 1500) : 'no plan'}

User message:
${message}
`;

    const systemPrompt = language === 'en' ? systemPromptEn : systemPromptFi;
    const userPrompt = language === 'en' ? userPromptEn : userPromptFi;

    const completion = await client.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error('Chat error:', error);
    res
      .status(500)
      .json({ reply: 'Jotain meni pieleen palvelimen puolella.' });
  }
});

/**
 * POST /plan
 * Luo rakenteinen treeniohjelma JSON:ina.
 * Frontista lähetetään:
 * { profile: {...}, workouts: [...], months: number, language }
 */
app.post('/plan', async (req, res) => {
  try {
    const { profile, workouts, months, language = 'fi' } = req.body;
    const { age, weight, fitnessLevel, goal } = profile || {};

    // Turvallisuuden vuoksi rajataan treenihistorian pituutta
    const historySnippet = JSON.stringify(workouts || []).slice(0, 2000);

    const systemPromptFi = `
Olet suomenkielinen personal trainer -botti.
Laadit rakenteisia treeniohjelmia (ohjelman kesto, viikot, treenit per viikko, liikkeet).
Palautat VAIN validia JSON:ia, ilman mitään muuta tekstiä.
Kaikki tekstit (päivien nimet, fokukset, notes, liikkeiden nimet) ovat suomeksi.
Huomioi käyttäjän kuntotaso ja älä tee liian rankkaa aloittelijalle.
`;

    const systemPromptEn = `
You are an English-speaking personal trainer bot.
You create structured workout plans (duration, weeks, sessions, exercises).
You return ONLY valid JSON, nothing else.
All text (day names, focus, notes, exercise names) must be in English.
Take the user's fitness level into account and do not make the plan too hard for a beginner.
`;

    const userPromptFi = `
Käyttäjän profiili:
- Ikä: ${age || 'tuntematon'}
- Paino: ${weight || 'tuntematon'} kg
- Kuntotaso: ${fitnessLevel || 'tuntematon'}
- Tavoite: ${goal || 'tuntematon'}

Ohjelman pituus kuukausina: ${months || 1}.

Aiemmat treenit (lista, voi olla tyhjä):
${historySnippet}

Tee ohjelma, joka etenee järkevästi kuntotason mukaan.
Muista lihashuolto ja riittävät lepopäivät.

Palauta TÄSMÄLLEEN seuraavan muotoinen JSON-rakenne:

{
  "durationMonths": number,
  "weeks": [
    {
      "weekNumber": number,
      "sessions": [
        {
          "day": "string (esim. Maanantai)",
          "focus": "string (esim. Koko keho, yläkroppa, cardio)",
          "notes": "lyhyt huomio viikosta tai treenistä",
          "exercises": [
            {
              "name": "liikkeen nimi",
              "sets": number,
              "reps": "esim. 8-12",
              "restSeconds": number
            }
          ]
        }
      ]
    }
  ]
}
`;

    const userPromptEn = `
User profile:
- Age: ${age || 'unknown'}
- Weight: ${weight || 'unknown'} kg
- Fitness level: ${fitnessLevel || 'unknown'}
- Goal: ${goal || 'unknown'}

Plan duration in months: ${months || 1}.

Previous workouts (list, may be empty):
${historySnippet}

Create a plan that progresses reasonably based on fitness level.
Include rest days and do not overload the user.

Return JSON in exactly this structure:

{
  "durationMonths": number,
  "weeks": [
    {
      "weekNumber": number,
      "sessions": [
        {
          "day": "string (e.g. Monday)",
          "focus": "string (e.g. Full body, upper body, cardio)",
          "notes": "a short note for the week or session",
          "exercises": [
            {
              "name": "exercise name",
              "sets": number,
              "reps": "e.g. 8-12",
              "restSeconds": number
            }
          ]
        }
      ]
    }
  ]
}
`;

    const systemPrompt = language === 'en' ? systemPromptEn : systemPromptFi;
    const userPrompt = language === 'en' ? userPromptEn : userPromptFi;

    const completion = await client.chat.completions.create({
      model: 'gpt-4.1-mini',
      response_format: { type: 'json_object' }, // 🔥 pakottaa JSONin
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content;

    let plan;
    try {
      plan = JSON.parse(content);
    } catch (e) {
      console.error('JSON parse error, raw content:', content);
      return res.status(500).json({
        error: 'JSON parse error',
        raw: content,
      });
    }

    res.json({ plan });
  } catch (error) {
    console.error('Plan error:', error);
    res.status(500).json({ error: 'Plan generation failed' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Fitness backend running on http://localhost:${port}`);
});
