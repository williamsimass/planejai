// hook pra gerenciar tudo que vai pro localStorage
// centralizei aqui pra não ficar espalhado pelo projeto

import type { ChatMessage, InsightData } from '@/services/aiService'

import type { SimulationFormData } from '../data/simulation'

// tipo que representa uma simulação salva completa
// o "insight" é opcional pq só existe depois que a IA responde
// o "chatHistory" também é opcional - só aparece se o usuário usou o chat
export type SimulationRecord = SimulationFormData & {
  id: string
  insight?: InsightData
  chatHistory?: ChatMessage[]
}

// usando uma constante pra não errar o nome da chave toda hora
const LOCAL_STORAGE_KEY = 'simulation-data'

export function useSimulationStorage() {
  // salva uma simulação nova e retorna o id gerado
  const saveFormData = (formData: SimulationFormData): string => {
    // crypto.randomUUID() gera um id único tipo "f47ac10b-58cc-4372-a567-0e02b2c3d479"
    // aprendi isso na aula 17, muito mais seguro que Math.random()
    const id = crypto.randomUUID()
    const record: SimulationRecord = { ...formData, id }

    // busca o que já tem salvo pra não apagar
    const storage = localStorage.getItem(LOCAL_STORAGE_KEY)
    const savedData = storage
      ? (JSON.parse(storage) as SimulationRecord[])
      : []

    // adiciona o novo registro na lista e salva tudo de volta
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify([...savedData, record]),
    )

    return id
  }

  // busca uma simulação específica pelo id
  const getFormData = (id: string): SimulationRecord | null => {
    const storage = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!storage) return null

    const savedData = JSON.parse(storage) as SimulationRecord[]
    // o find retorna undefined se não achar, por isso o ?? null
    return savedData.find((record) => record.id === id) ?? null
  }

  // retorna todas as simulações - invertidas pra mostrar a mais recente primeiro
  const getAllSimulations = (): SimulationRecord[] => {
    const storage = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!storage) return []
    return (JSON.parse(storage) as SimulationRecord[]).reverse()
  }

  // atualiza uma simulação existente (usado pra salvar o insight da IA)
  // TODO: talvez seja melhor usar um Map pra ficar mais rápido?
  const updateSimulation = (id: string, data: SimulationRecord) => {
    const storage = localStorage.getItem(LOCAL_STORAGE_KEY)
    const savedData = storage
      ? (JSON.parse(storage) as SimulationRecord[])
      : []

    // map percorre todos e substitui só o que tem o id certo
    const updated = savedData.map((record) =>
      record.id === id ? { ...data } : record,
    )

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
  }

  // remove uma simulação pelo id (pra página de histórico)
  const deleteSimulation = (id: string) => {
    const storage = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!storage) return

    const savedData = JSON.parse(storage) as SimulationRecord[]
    // filter cria uma lista nova sem o item que tem o id passado
    const updated = savedData.filter((record) => record.id !== id)
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
  }

  return {
    saveFormData,
    getFormData,
    getAllSimulations,
    updateSimulation,
    deleteSimulation,
  }
}
