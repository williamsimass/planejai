// componente de um passo do formulário
// recebe as configurações do passo e as funções de navegação

import { type SyntheticEvent, useState } from 'react'

import { ArrowLeft, ArrowRight, type LucideIcon } from 'lucide-react'

import { Button } from '@/components/shared/Button'
import { Input, type InputProps } from '@/components/shared/Input'
import { formatCurrencyMask } from '@/utils/currency'

// props que vêm do arquivo data/simulation.ts
export interface FormStepProps {
  id: string // identificador único do passo (ex: "income", "expenses")
  icon: LucideIcon
  title: string
  question: string
  inputProps: InputProps // props que passamos direto pro Input
  submitButtonProps?: { // opcional - só o último passo tem label diferente
    label: string
    emojiIcon?: string
  }
}

// props de navegação que vêm do componente pai (SimulationForm)
interface ActionButtonsProps {
  onBack: () => void
  onNext: (value: string) => void // passa o valor pra salvar no formData
  hideBackButton?: boolean // esconde o botão voltar no primeiro passo
}

export function FormStep({
  icon: Icon,
  title,
  question,
  inputProps,
  submitButtonProps,
  hideBackButton,
  onBack,
  onNext,
}: FormStepProps & ActionButtonsProps) {
  // estado interno do input - fica aqui e não no pai
  // quando a key muda, esse estado reseta automaticamente
  const [inputValue, setInputValue] = useState('')

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault() // previne o comportamento padrão do form (recarregar página)
    if (!inputValue) return // não avança se o campo estiver vazio
    onNext(inputValue) // passa o valor pro componente pai
  }

  return (
    <div className="bg-card rounded-2xl p-6 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] sm:p-8">
      {/* ícone do passo dentro de um quadrado arredondado roxo */}
      <div className="bg-primary mb-4 flex h-15 w-15 items-center justify-center rounded-xl">
        <Icon size={32} className="text-primary-foreground" />
      </div>

      {/* categoria em maiúsculo, tipo um label */}
      <h2 className="text-primary mb-1 text-xs font-semibold tracking-widest uppercase">
        {title}
      </h2>

      {/* pergunta principal do passo */}
      <h3 className="text-foreground mb-6 text-xl leading-snug font-semibold sm:text-2xl">
        {question}
      </h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          {...inputProps}
          value={inputValue}
          onChange={(e) => {
            // verifica se o campo é de dinheiro pelo prefixo "R$"
            const isCurrency = inputProps.prefix === 'R$'
            const value = e.target.value
            // aplica a máscara de moeda ou guarda o valor normal
            setInputValue(isCurrency ? formatCurrencyMask(value) : value)
          }}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
          {/* botão voltar fica escondido no primeiro passo */}
          {!hideBackButton && (
            <Button
              type="button"
              variant="ghost"
              className="order-2 flex-1 justify-center rounded-xl py-3 sm:order-1"
              onClick={onBack}
            >
              <ArrowLeft size={16} />
              Voltar
            </Button>
          )}

          {/* botão de avançar - desabilitado se o campo estiver vazio */}
          <Button
            type="submit"
            variant="primary"
            className="order-1 flex-1 sm:order-2"
            disabled={!inputValue}
          >
            {submitButtonProps?.label ?? 'Próximo'}
            {/* no último passo mostra emoji, nos outros mostra seta */}
            {submitButtonProps?.emojiIcon ? (
              <span>{submitButtonProps.emojiIcon}</span>
            ) : (
              <ArrowRight size={16} />
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
