// componente de chat com o educador financeiro (Desafio 2)
// o histórico da conversa é salvo no localStorage junto com a simulação

import { useEffect, useRef, useState } from 'react'

import { Send } from 'lucide-react'

import { Button } from '@/components/shared/Button'
import type { SimulationRecord } from '@/hooks/useSimulationStorage'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import type { ChatMessage } from '@/services/aiService'
import { sendChatMessage } from '@/services/aiService'

interface ChatProps {
  simulation: SimulationRecord
}

export function Chat({ simulation }: ChatProps) {
  const { updateSimulation } = useSimulationStorage()

  // carrega o histórico salvo (se houver) ou começa vazio
  const [messages, setMessages] = useState<ChatMessage[]>(
    simulation.chatHistory ?? [],
  )
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ref pro elemento invisível no final da lista de mensagens
  const bottomRef = useRef<HTMLDivElement>(null)

  // faz o scroll automático toda vez que uma mensagem nova aparece
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    const userMessage = input.trim()
    if (!userMessage || isLoading) return // ignora se vazio ou já carregando

    // adiciona a mensagem do usuário na lista imediatamente (não espera a IA)
    const newMessages: ChatMessage[] = [
      ...messages,
      { role: 'user', content: userMessage },
    ]
    setMessages(newMessages)
    setInput('') // limpa o input
    setIsLoading(true)
    setError(null)

    try {
      // passa o histórico anterior pra IA ter contexto da conversa
      const reply = await sendChatMessage(simulation, messages, userMessage)

      // adiciona a resposta da IA na lista
      const updatedMessages: ChatMessage[] = [
        ...newMessages,
        { role: 'assistant', content: reply },
      ]
      setMessages(updatedMessages)

      // salva o histórico atualizado no localStorage
      updateSimulation(simulation.id, {
        ...simulation,
        chatHistory: updatedMessages,
      })
    } catch {
      setError('Erro ao enviar mensagem. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="border-border mt-6 border-t pt-6">
      <h4 className="text-foreground mb-4 text-sm font-semibold">
        💬 Converse com o Educador Financeiro
      </h4>

      {/* só renderiza a lista de mensagens se tiver pelo menos uma */}
      {messages.length > 0 && (
        <div className="mb-4 flex max-h-64 flex-col gap-3 overflow-y-auto">
          {messages.map((msg, i) => (
            // mensagens do usuário ficam à direita (roxo), da IA à esquerda
            <div
              key={i}
              className={`rounded-xl p-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground ml-8'
                  : 'bg-muted-primary text-foreground mr-8'
              }`}
            >
              {msg.content}
            </div>
          ))}

          {/* indicador de que a IA está "pensando" */}
          {isLoading && (
            <div className="bg-muted-primary text-muted-foreground mr-8 animate-pulse rounded-xl p-3 text-sm">
              Pensando...
            </div>
          )}

          {/* elemento fantasma só pra ter onde dar scrollIntoView */}
          <div ref={bottomRef} />
        </div>
      )}

      {error && <p className="mb-2 text-sm text-red-500">⚠️ {error}</p>}

      {/* campo de input + botão enviar */}
      <div className="flex gap-2">
        <input
          className="bg-input text-foreground placeholder:text-muted-foreground flex-1 rounded-xl px-4 py-3 text-sm outline-none"
          placeholder="Faça uma pergunta sobre sua situação financeira..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          // permite enviar com Enter (sem Shift)
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              void handleSend()
            }
          }}
          disabled={isLoading}
        />
        <Button
          variant="primary"
          icon={Send}
          onClick={() => void handleSend()}
          disabled={!input.trim() || isLoading}
          aria-label="Enviar mensagem"
        />
      </div>
    </div>
  )
}
