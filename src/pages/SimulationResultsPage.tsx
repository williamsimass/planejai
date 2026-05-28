// página que exibe o resultado da simulação
// lê o id da URL e busca os dados no localStorage

import { CalendarClock, CreditCard, Goal, Landmark, PiggyBank, Wallet } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import { AIInsightsCard } from '@/components/features/SimulationResults/AIInsightsCard'
import { Card } from '@/components/features/SimulationResults/Card'
import { Button } from '@/components/shared/Button'
import { PageHero } from '@/components/shared/PageHero'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import { calcMonthlySavings } from '@/utils/simulation'

export function SimulationResultsPage() {
  const { id } = useParams<{ id: string }>()
  const { getFormData } = useSimulationStorage()
  const navigate = useNavigate()
  const data = id ? getFormData(id) : null

  if (!data) {
    return (
      <main className="mx-auto max-w-xl px-4 py-14 text-center">
        <p className="text-muted-foreground mb-4">Simulação não encontrada.</p>
        <Button variant="primary" onClick={() => void navigate('/')}>
          Nova Simulação
        </Button>
      </main>
    )
  }

  const monthlySavings = calcMonthlySavings(data)

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <PageHero
        title="Resultado da sua simulação"
        subtitle="Com base no seu perfil financeiro e objetivos."
      />
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card
          icon={Goal}
          label="Custo da Meta"
          value={data.goalAmount}
          subtitle={data.goalName}
        />
        <Card
          icon={CalendarClock}
          label="Prazo"
          value={`${data.goalDeadline} meses`}
          subtitle="Prazo para atingir a meta"
        />
        <Card
          variant="primary"
          icon={PiggyBank}
          label="Economia mensal"
          value={`R$ ${monthlySavings.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          subtitle="Economia mensal necessária"
        />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {id && (
          <AIInsightsCard
            simulationId={id}
            className="order-2 lg:order-1 lg:col-span-2"
          />
        )}
        <div className="order-1 flex flex-col gap-6 lg:order-2">
          <Card
            icon={Wallet}
            label="Renda mensal"
            value={data.income}
            subtitle="Renda total bruta por mês"
          />
          <Card
            icon={CreditCard}
            label="Custos Fixos de Vida"
            value={data.expenses}
            subtitle="Gastos essenciais por mês"
          />
          <Card
            icon={Landmark}
            label="Dívidas / Parcelas"
            value={data.debts}
            subtitle="Valor comprometido em parcelas/depósito"
          />
        </div>
      </div>
    </main>
  )
}
