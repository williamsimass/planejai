import 'react-loading-skeleton/dist/skeleton.css'

import Skeleton from 'react-loading-skeleton'

import { Chat } from '@/components/features/Insights/Chat'
import { Content } from '@/components/features/Insights/Content'
import { InsightError } from '@/components/features/Insights/Error'
import { useInsight } from '@/hooks/useInsight'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'

interface AIInsightsCardProps {
  simulationId: string
  className?: string
}

export function AIInsightsCard({ simulationId, className }: AIInsightsCardProps) {
  const { insight, isLoading, error, fetchInsight } = useInsight(simulationId)
  const { getFormData } = useSimulationStorage()
  const simulation = getFormData(simulationId)

  return (
    <div
      className={[
        'bg-card rounded-2xl p-6 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="mb-3 flex items-center gap-1.5">
        <span>✨</span>
        <span className="text-primary text-xs font-semibold tracking-widest uppercase">
          Insight Financeiro Personalizado
        </span>
      </div>

      {isLoading && (
        <div className="flex">
          <Skeleton
            count={10.5}
            baseColor="var(--color-skeleton-base)"
            highlightColor="var(--color-skeleton-highlight)"
            className="mb-3 flex rounded-lg"
            containerClassName="flex-1"
            inline
          />
        </div>
      )}

      {!isLoading && error && (
        <InsightError
          simulationId={simulationId}
          message={error}
          onRetry={() => void fetchInsight(simulationId)}
        />
      )}

      {!isLoading && insight && (
        <>
          <Content insight={insight} />
          {simulation && <Chat simulation={simulation} />}
        </>
      )}
    </div>
  )
}
