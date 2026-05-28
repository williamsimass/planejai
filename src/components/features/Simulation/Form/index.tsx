// componente principal do formulário multi-step
// controla qual passo está sendo exibido e guarda as respostas

import { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { type SimulationFormData, simulationFormSteps } from '@/data/simulation'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'

import { FormStep } from '../FormStep'
import { StepProgress } from '../Progress'

export function SimulationForm() {
  // índice do passo atual (começa em 0)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  // objeto que vai acumulando as respostas de cada passo
  // o "as SimulationFormData" é necessário pq começa vazio mas o tipo exige todas as chaves
  const [formData, setFormData] = useState<SimulationFormData>(
    {} as SimulationFormData,
  )

  const navigate = useNavigate()
  const { saveFormData } = useSimulationStorage()

  const totalSteps = simulationFormSteps.length
  // passo atual baseado no índice
  const currentStep = simulationFormSteps[currentStepIndex]

  // chamada quando o usuário clica em "Próximo" ou "Gerar simulação"
  // recebe o valor que o usuário digitou no input desse passo
  const handleNextStep = (value: string) => {
    // atualiza o formData adicionando a resposta do passo atual
    // usa o id do passo como chave (ex: "income", "expenses", etc)
    const updatedFormData = { ...formData, [currentStep.id]: value }
    setFormData(updatedFormData)

    // se é o último passo, salva e vai pra página de resultado
    if (currentStepIndex + 1 > totalSteps - 1) {
      const id = saveFormData(updatedFormData)
      // navega com o id pra poder recuperar a simulação na outra página
      void navigate(`/resultado/${id}`)
      return
    }

    // senão, avança pro próximo passo
    setCurrentStepIndex((prev) => prev + 1)
  }

  // chamada quando o usuário clica em "Voltar"
  const handlePreviousStep = () => {
    if (currentStepIndex === 0) return // já está no primeiro, não faz nada
    setCurrentStepIndex((prev) => prev - 1)
  }

  return (
    <>
      {/* +1 pq o índice começa em 0 mas o usuário vê "Passo 1 de 6" */}
      <StepProgress
        currentStep={currentStepIndex + 1}
        totalSteps={totalSteps}
      />
      {/* key={currentStep.id} força o React a recriar o componente em cada passo
          sem isso o input ficava com o valor do passo anterior */}
      <FormStep
        key={currentStep.id}
        {...currentStep}
        hideBackButton={currentStepIndex === 0}
        onBack={handlePreviousStep}
        onNext={handleNextStep}
      />
    </>
  )
}
