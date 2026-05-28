// serviço responsável por chamar a API do Google Gemini
// a chave fica no .env.local pra não subir pro git

import type { SimulationFormData } from '@/data/simulation'

// estrutura da resposta que a IA vai retornar
// precisa bater com o schema que definimos no prompt
export interface InsightData {
  feasibility: {
    status: 'viable' | 'needs_adjustment' | 'unfeasible'
    content: string
  }
  diagnosis: { content: string }
  suggestions: { items: string[] }
  extraIncome: { items: string[] }
  investment: { items: string[] }
  motivation: { content: string }
}

// tipo pra uma mensagem do chat (do usuário ou da IA)
export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

// tipo da resposta bruta que a API do Gemini devolve
// só precisa de candidates[0].content.parts[0].text
interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[]
    }
  }[]
}

// pega a chave da variável de ambiente - não esquecer de criar o .env.local!
const API_KEY = String(import.meta.env.VITE_GEMINI_API_KEY)
const MODEL_NAME = 'gemini-2.0-flash'
// monta a URL com o nome do modelo e a chave
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`

// função interna que faz o fetch de verdade
// separei em função própria pra não repetir código nas duas chamadas abaixo
async function callGemini(body: object): Promise<GeminiResponse> {
  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  // lança erro se a requisição não foi bem sucedida
  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.status}`)
  }

  return (await response.json()) as GeminiResponse
}

// chama a IA e parseia o JSON que ela retorna
// o prompt já instrui a IA a retornar só JSON puro
export async function getInsight(prompt: string): Promise<InsightData> {
  const response = await callGemini({
    contents: [{ parts: [{ text: prompt }] }],
  })

  // o texto da resposta é um JSON em string, então precisa fazer o parse
  const json = response.candidates[0].content.parts[0].text
  return JSON.parse(json) as InsightData
}

// envia uma mensagem do chat e retorna a resposta da IA
// passa o histórico de mensagens pra IA ter contexto da conversa
export async function sendChatMessage(
  simulation: SimulationFormData,
  history: ChatMessage[],
  userMessage: string,
): Promise<string> {
  // instrução de sistema com o contexto da simulação do usuário
  const systemPrompt = `Você é um educador financeiro especializado. O usuário já recebeu um diagnóstico financeiro e quer conversar sobre sua situação.

Contexto da simulação:
- Renda mensal: ${simulation.income}
- Custos fixos: ${simulation.expenses}
- Dívidas/parcelas: ${simulation.debts}
- Meta: ${simulation.goalName} — ${simulation.goalAmount} em ${simulation.goalDeadline} meses

Responda de forma clara, objetiva e encorajadora. Fale sempre em segunda pessoa. Máximo de 3 parágrafos curtos por resposta. Não use markdown.`

  // monta o histórico no formato que a API do Gemini espera
  // note que a IA usa "model" em vez de "assistant"
  const contents = [
    ...history.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    })),
    // adiciona a mensagem atual do usuário no final
    { role: 'user', parts: [{ text: userMessage }] },
  ]

  const response = await callGemini({
    systemInstruction: { parts: [{ text: systemPrompt }] },
    contents,
  })

  // retorna só o texto da resposta
  return response.candidates[0].content.parts[0].text
}
