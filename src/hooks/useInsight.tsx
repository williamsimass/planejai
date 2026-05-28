// hook que gerencia a chamada pra API do Gemini
// foi a parte mais difícil do projeto, principalmente o controle de chamadas duplicadas

import { useCallback, useEffect, useRef, useState } from 'react'

import { buildAIPrompt } from '@/data/aiPrompt'
import { getInsight, type InsightData } from '@/services/aiService'

import { useSimulationStorage } from './useSimulationStorage'

export function useInsight(id: string) {
  const { getFormData, updateSimulation } = useSimulationStorage()

  // useRef não causa re-render quando muda, perfeito pra usar como "flag"
  // sem isso o StrictMode do React chamava a API duas vezes em dev
  const isRequestPending = useRef(false)

  // inicializa com o insight salvo no localStorage (se já existir)
  // assim não faz chamada desnecessária se o usuário já gerou antes
  const [insight, setInsight] = useState<InsightData | null>(() => {
    const simulation = getFormData(id)
    return simulation?.insight ?? null
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // useCallback pra não recriar essa função em todo render
  // é necessário pq ela entra no array de dependências do useEffect abaixo
  const fetchInsight = useCallback(
    async (simulationId: string) => {
      const simulation = getFormData(simulationId)

      // verifica se a simulação existe antes de chamar a API
      if (!simulation) {
        setError('Simulação não encontrada.')
        return
      }

      isRequestPending.current = true
      setIsLoading(true)
      setError(null) // limpa erro anterior se houver

      try {
        const prompt = buildAIPrompt(simulation)
        const data = await getInsight(prompt)
        setInsight(data)

        // salva o insight junto com a simulação pra não chamar a API de novo
        updateSimulation(simulationId, { ...simulation, insight: data })
        return data
      } catch {
        setError('Erro ao gerar o diagnóstico. Tente novamente.')
      } finally {
        // finally sempre executa, mesmo com erro
        isRequestPending.current = false
        setIsLoading(false)
      }
    },
    [getFormData, updateSimulation],
  )

  // esse effect dispara a chamada automática quando o componente monta
  // as condições evitam chamadas duplicadas ou desnecessárias
  useEffect(() => {
    // não faz nada se: já tem insight, já está carregando,
    // tem requisição pendente ou já deu erro (o usuário vai clicar em "tentar novamente")
    if (insight || isLoading || isRequestPending.current || error) return

    void fetchInsight(id).then((data) => {
      isRequestPending.current = false
      if (!data) return
      setInsight(data)
    })
  }, [id, insight, isLoading, fetchInsight, error])

  // expõe fetchInsight pra poder chamar manualmente no botão de retry
  return { insight, isLoading, error, fetchInsight }
}
