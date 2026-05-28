// funções utilitárias pra lidar com moeda brasileira
// demorei pra entender regex mas agora faz sentido

// formata o valor enquanto o usuário digita, tipo o app do banco
// ex: digita "5000" -> vira "50,00" -> digita mais -> "500,00" etc
export function formatCurrencyMask(value: string): string {
  // remove tudo que não for número (vírgula, ponto, letras...)
  const digits = value.replace(/\D/g, '')

  // se não sobrou nada, retorna vazio pra limpar o campo
  if (!digits) {
    return ''
  }

  // divide por 100 pra simular os centavos
  // ex: "500" -> 500 / 100 = 5.00
  const number = parseInt(digits, 10) / 100

  // toLocaleString formata no padrão brasileiro (ponto como milhar, vírgula como decimal)
  return number.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

// converte o valor formatado de volta pra número
// precisa disso pra fazer os cálculos
// ex: "2.500,00" -> 2500
export function parseCurrency(value: string): number {
  return (
    parseFloat(
      // remove os pontos de milhar, troca vírgula por ponto, remove "R$"
      value.replace(/\./g, '').replace(',', '.').replace('R$', '').trim(),
    ) || 0 // se der NaN retorna 0 pra não quebrar os cálculos
  )
}
