import { useState } from 'react'

import { Goal, Trash2, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/shared/Button'
import { PageHero } from '@/components/shared/PageHero'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import { calcMonthlySavings } from '@/utils/simulation'

export function HistoryPage() {
  const navigate = useNavigate()
  const { getAllSimulations, deleteSimulation } = useSimulationStorage()
  const [simulations, setSimulations] = useState(getAllSimulations)

  const handleDelete = (id: string) => {
    deleteSimulation(id)
    setSimulations(getAllSimulations())
  }

  if (simulations.length === 0) {
    return (
      <main className="mx-auto max-w-xl px-4 py-14 text-center">
        <PageHero
          title="Histórico"
          subtitle="Suas simulações anteriores salvas localmente."
        />
        <p className="text-muted-foreground mb-6 text-sm">
          Nenhuma simulação encontrada.
        </p>
        <Button
          variant="primary"
          icon={TrendingUp}
          onClick={() => void navigate('/')}
        >
          Fazer primeira simulação
        </Button>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <PageHero
        title="Histórico de Simulações"
        subtitle="Suas simulações anteriores salvas localmente."
      />
      <div className="flex flex-col gap-4">
        {simulations.map((simulation) => {
          const savings = calcMonthlySavings(simulation)
          const savingsFormatted = savings.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })

          return (
            <div
              key={simulation.id}
              className="bg-card rounded-2xl p-6 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)]"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Goal size={16} className="text-primary" />
                  <span className="font-semibold">{simulation.goalName}</span>
                </div>
                <Button
                  variant="ghost"
                  icon={Trash2}
                  className="text-red-500"
                  onClick={() => handleDelete(simulation.id)}
                  aria-label="Excluir simulação"
                />
              </div>
              <div className="text-muted-foreground mb-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                <div>
                  <span className="text-foreground mb-0.5 block text-xs font-semibold tracking-widest uppercase">
                    Meta
                  </span>
                  <span>{simulation.goalAmount}</span>
                </div>
                <div>
                  <span className="text-foreground mb-0.5 block text-xs font-semibold tracking-widest uppercase">
                    Prazo
                  </span>
                  <span>{simulation.goalDeadline} meses</span>
                </div>
                <div>
                  <span className="text-foreground mb-0.5 block text-xs font-semibold tracking-widest uppercase">
                    Economia/mês
                  </span>
                  <span>R$ {savingsFormatted}</span>
                </div>
              </div>
              <Button
                variant="primary"
                className="w-full justify-center"
                onClick={() => void navigate(`/resultado/${simulation.id}`)}
              >
                Ver detalhes
              </Button>
            </div>
          )
        })}
      </div>
    </main>
  )
}
