"use client"

import { useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { InfoIcon } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CalculationMemorialProps {
  showMemorial: boolean
  currency: string
  cfun: string
  cmvun: string
  ocv: string
  lucro: string
  precoVenda: string
  desconto: string
  calculationType: "preco-venda" | "lucro" | "desconto"
}

export function CalculationMemorial({
  showMemorial,
  currency,
  cfun,
  cmvun,
  ocv,
  lucro,
  precoVenda,
  desconto,
  calculationType,
}: CalculationMemorialProps) {
  const memorialRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState("resultado")
  const currencySymbol = currency.split(" ")[0]

  // Parse values for calculation
  const cfunValue = Number.parseFloat(cfun.replace(/\./g, "").replace(",", "."))
  const cmvunValue = Number.parseFloat(cmvun.replace(/\./g, "").replace(",", "."))
  const precoVendaValue = Number.parseFloat(precoVenda.replace(/\./g, "").replace(",", "."))

  // Parse OCV (percentage)
  let ocvValue = 0
  if (ocv.includes("%")) {
    ocvValue = Number.parseFloat(ocv.replace("%", "").replace(",", ".")) / 100
  } else {
    ocvValue = Number.parseFloat(ocv.replace(",", "."))
  }

  // Parse L (percentage) - only used when calculating price
  let lucroValue = 0
  if (lucro.includes("%")) {
    lucroValue = Number.parseFloat(lucro.replace("%", "").replace(",", ".")) / 100
  } else {
    lucroValue = Number.parseFloat(lucro.replace(",", "."))
  }

  // Parse Desconto (percentage)
  let descontoValue = 0
  if (desconto.includes("%")) {
    descontoValue = Number.parseFloat(desconto.replace("%", "").replace(",", ".")) / 100
  } else {
    descontoValue = Number.parseFloat(desconto.replace(",", "."))
  }

  const baseValue = cfunValue + cmvunValue

  // Calculate based on type
  let resultado = 0
  let lucroCalculado = 0
  let lucroPercentual = 0
  let lucroMonetario = 0
  let precoComDesconto = 0
  let valorDesconto = 0

  if (calculationType === "preco-venda") {
    // Calculate price
    const ocvPlusLucro = ocvValue + lucroValue
    const denominador = 1 - ocvPlusLucro
    resultado = baseValue / denominador
  } else if (calculationType === "lucro") {
    // Calculate profit
    // Formula rearranged: L = 1 - OCV - (CFun + CMVun) / PV
    lucroCalculado = 1 - ocvValue - baseValue / precoVendaValue
    lucroPercentual = lucroCalculado * 100

    // Lucro monetário = PV - CFun - CMVun - (PV * OCV)
    lucroMonetario = precoVendaValue - baseValue - precoVendaValue * ocvValue

    resultado = lucroCalculado
  } else if (calculationType === "desconto") {
    // Calculate profit with discount
    // Formula: LUCRO = PV - (PV * DESCONTO) - CFun - CMVun - (OCV * (PV - PV * DESCONTO))
    precoComDesconto = precoVendaValue * (1 - descontoValue)
    valorDesconto = precoVendaValue * descontoValue

    // LUCRO = PV * (1 - DESCONTO) - CFun - CMVun - (OCV * PV * (1 - DESCONTO))
    lucroMonetario = precoComDesconto - baseValue - ocvValue * precoComDesconto
    lucroPercentual = (lucroMonetario / precoVendaValue) * 100
    lucroCalculado = lucroMonetario / precoVendaValue

    resultado = lucroCalculado
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const formatDecimal = (value: number) => {
    return value.toLocaleString("pt-BR", { minimumFractionDigits: 4, maximumFractionDigits: 4 }).replace(".", ",")
  }

  const formatPercentage = (value: number) => {
    return (value * 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  return (
    <Card className="overflow-hidden shadow-md">
      <div className="bg-blue-800 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <InfoIcon className="h-5 w-5" />
          <h2 className="text-xl font-bold">Memorial de Cálculo</h2>
        </div>
      </div>
      <div className="p-1 bg-blue-100 text-blue-800 text-sm">
        <p className="px-3">Detalhamento do cálculo realizado</p>
      </div>

      <div className="p-6">
        {!showMemorial ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <div className="w-16 h-16 mb-4 text-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="7" x2="15" y2="7"></line>
                <line x1="9" y1="11" x2="15" y2="11"></line>
                <line x1="9" y1="15" x2="13" y2="15"></line>
              </svg>
            </div>
            <p className="text-center">
              Preencha os dados e clique em calcular para ver o memorial de cálculo detalhado.
            </p>
          </div>
        ) : (
          <div className="space-y-4" ref={memorialRef}>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-bold mb-2">Dados Informados:</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <span className="font-medium">CFun:</span> {currencySymbol} {cfun}
                </div>
                <div>
                  <span className="font-medium">CMVun:</span> {currencySymbol} {cmvun}
                </div>
                <div>
                  <span className="font-medium">OCV:</span>
                  <div className="mt-1">{ocv}</div>
                </div>
                {calculationType === "preco-venda" && (
                  <div>
                    <span className="font-medium">L:</span>
                    <div className="mt-1">{lucro}</div>
                  </div>
                )}
                {(calculationType === "lucro" || calculationType === "desconto") && (
                  <div>
                    <span className="font-medium">PV:</span>
                    <div className="mt-1">
                      {currencySymbol} {precoVenda}
                    </div>
                  </div>
                )}
                {calculationType === "desconto" && (
                  <div>
                    <span className="font-medium">Desconto:</span>
                    <div className="mt-1">{desconto}</div>
                  </div>
                )}
              </div>
            </div>

            {calculationType === "preco-venda" ? (
              <Tabs defaultValue="pv-cheio" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-blue-50">
                  <TabsTrigger
                    value="pv-cheio"
                    className="data-[state=active]:bg-blue-800 data-[state=active]:text-white"
                  >
                    PV Cheio
                  </TabsTrigger>
                  <TabsTrigger
                    value="pv-equilibrio"
                    className="data-[state=active]:bg-blue-800 data-[state=active]:text-white"
                  >
                    PV Ponto de Equilíbrio
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="pv-cheio" className="space-y-4 tabs-content">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-bold mb-2">Preço de Venda Cheio (PV):</h3>
                    <p className="text-2xl font-bold text-blue-800">
                      {currencySymbol} {formatCurrency(resultado)}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-bold mb-2">Fórmula e Cálculo:</h3>
                    <div className="space-y-2">
                      <p>
                        <strong>Fórmula:</strong> PV = (CFun + CMVun) / (1 - (OCV + L))
                      </p>
                      <p>
                        <strong>Onde:</strong>
                      </p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>CFun = Custo Fixo unitário</li>
                        <li>CMVun = Custo da Mercadoria Vendida Unitária</li>
                        <li>OCV = Outros Custos Variáveis (%)</li>
                        <li>L = Lucro (%)</li>
                        <li>PV = Preço de Venda</li>
                      </ul>

                      <div className="mt-4 space-y-2 font-mono bg-gray-100 p-4 rounded-md">
                        <p>PV = (CFun + CMVun) / (1 - (OCV + L))</p>
                        <p>
                          PV = ({currencySymbol} {formatCurrency(cfunValue)} + {currencySymbol}{" "}
                          {formatCurrency(cmvunValue)}) / (1 - ({formatDecimal(ocvValue)} + {formatDecimal(lucroValue)}
                          ))
                        </p>
                        <p>
                          PV = {currencySymbol} {formatCurrency(baseValue)} / (1 -{" "}
                          {formatDecimal(ocvValue + lucroValue)})
                        </p>
                        <p>
                          PV = {currencySymbol} {formatCurrency(baseValue)} /{" "}
                          {formatDecimal(1 - (ocvValue + lucroValue))}
                        </p>
                        <p>
                          PV = {currencySymbol} {formatCurrency(resultado)}
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="pv-equilibrio" className="space-y-4 tabs-content">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-bold mb-2">Preço de Venda no Ponto de Equilíbrio:</h3>
                    <p className="text-2xl font-bold text-blue-800">
                      {currencySymbol} {formatCurrency(baseValue / (1 - ocvValue))}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-bold mb-2">Fórmula e Cálculo (Lucro = 0):</h3>
                    <div className="space-y-2">
                      <p>
                        <strong>Fórmula:</strong> PV = (CFun + CMVun) / (1 - OCV)
                      </p>
                      <p>
                        <strong>Onde:</strong>
                      </p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>CFun = Custo Fixo unitário</li>
                        <li>CMVun = Custo da Mercadoria Vendida Unitária</li>
                        <li>OCV = Outros Custos Variáveis (%)</li>
                        <li>L = 0 (Lucro zero no ponto de equilíbrio)</li>
                        <li>PV = Preço de Venda no Ponto de Equilíbrio</li>
                      </ul>

                      <div className="mt-4 space-y-2 font-mono bg-gray-100 p-4 rounded-md">
                        <p>PV = (CFun + CMVun) / (1 - OCV)</p>
                        <p>
                          PV = ({currencySymbol} {formatCurrency(cfunValue)} + {currencySymbol}{" "}
                          {formatCurrency(cmvunValue)}) / (1 - {formatDecimal(ocvValue)})
                        </p>
                        <p>
                          PV = {currencySymbol} {formatCurrency(baseValue)} / (1 - {formatDecimal(ocvValue)})
                        </p>
                        <p>
                          PV = {currencySymbol} {formatCurrency(baseValue)} / {formatDecimal(1 - ocvValue)}
                        </p>
                        <p>
                          PV = {currencySymbol} {formatCurrency(baseValue / (1 - ocvValue))}
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            ) : calculationType === "lucro" ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-bold mb-2">Lucro Calculado:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Lucro Percentual:</p>
                      <p className="text-2xl font-bold text-green-800">{formatPercentage(resultado)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Lucro Monetário:</p>
                      <p className="text-2xl font-bold text-green-800">
                        {currencySymbol} {formatCurrency(lucroMonetario)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold mb-2">Fórmula e Cálculo:</h3>
                  <div className="space-y-2">
                    <p>
                      <strong>Fórmula:</strong> L = 1 - OCV - (CFun + CMVun) / PV
                    </p>
                    <p>
                      <strong>Onde:</strong>
                    </p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>CFun = Custo Fixo unitário</li>
                      <li>CMVun = Custo da Mercadoria Vendida Unitária</li>
                      <li>OCV = Outros Custos Variáveis (%)</li>
                      <li>PV = Preço de Venda</li>
                      <li>L = Lucro (%)</li>
                    </ul>

                    <div className="mt-4 space-y-2 font-mono bg-gray-100 p-4 rounded-md">
                      <p>L = 1 - OCV - (CFun + CMVun) / PV</p>
                      <p>
                        L = 1 - {formatDecimal(ocvValue)} - ({currencySymbol} {formatCurrency(cfunValue)} +{" "}
                        {currencySymbol} {formatCurrency(cmvunValue)}) / {currencySymbol}{" "}
                        {formatCurrency(precoVendaValue)}
                      </p>
                      <p>
                        L = 1 - {formatDecimal(ocvValue)} - {currencySymbol} {formatCurrency(baseValue)} /{" "}
                        {currencySymbol} {formatCurrency(precoVendaValue)}
                      </p>
                      <p>
                        L = 1 - {formatDecimal(ocvValue)} - {formatDecimal(baseValue / precoVendaValue)}
                      </p>
                      <p>
                        L = {formatDecimal(resultado)} ({formatPercentage(resultado)}%)
                      </p>
                    </div>

                    <div className="mt-4 p-3 bg-blue-50 rounded-md">
                      <p className="text-sm font-medium text-blue-800">Lucro Monetário:</p>
                      <p className="text-sm">Lucro Monetário = PV - CFun - CMVun - (PV × OCV)</p>
                      <p className="text-sm">
                        Lucro Monetário = {currencySymbol} {formatCurrency(precoVendaValue)} - {currencySymbol}{" "}
                        {formatCurrency(baseValue)} - ({currencySymbol} {formatCurrency(precoVendaValue)} ×{" "}
                        {formatDecimal(ocvValue)})
                      </p>
                      <p className="text-sm font-bold">
                        Lucro Monetário = {currencySymbol} {formatCurrency(lucroMonetario)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h3 className="font-bold mb-2">Lucro com Desconto:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Preço com Desconto:</p>
                      <p className="text-xl font-bold text-orange-800">
                        {currencySymbol} {formatCurrency(precoComDesconto)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Lucro Percentual:</p>
                      <p className="text-xl font-bold text-orange-800">{formatPercentage(resultado)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Lucro Monetário:</p>
                      <p className="text-xl font-bold text-orange-800">
                        {currencySymbol} {formatCurrency(lucroMonetario)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold mb-2">Fórmula e Cálculo:</h3>
                  <div className="space-y-2">
                    <p>
                      <strong>Fórmula:</strong> LUCRO = PV - (PV × DESCONTO) - CFun - CMVun - (OCV × (PV - PV ×
                      DESCONTO))
                    </p>
                    <p>
                      <strong>Onde:</strong>
                    </p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>PV = Preço de Venda original</li>
                      <li>DESCONTO = Desconto aplicado (%)</li>
                      <li>CFun = Custo Fixo unitário</li>
                      <li>CMVun = Custo da Mercadoria Vendida Unitária</li>
                      <li>OCV = Outros Custos Variáveis (%)</li>
                    </ul>

                    <div className="mt-4 space-y-2 font-mono bg-gray-100 p-4 rounded-md text-sm">
                      <p>Preço com Desconto = PV × (1 - DESCONTO)</p>
                      <p>
                        Preço com Desconto = {currencySymbol} {formatCurrency(precoVendaValue)} × (1 -{" "}
                        {formatDecimal(descontoValue)})
                      </p>
                      <p>
                        Preço com Desconto = {currencySymbol} {formatCurrency(precoComDesconto)}
                      </p>
                      <br />
                      <p>LUCRO = Preço com Desconto - CFun - CMVun - (OCV × Preço com Desconto)</p>
                      <p>
                        LUCRO = {currencySymbol} {formatCurrency(precoComDesconto)} - {currencySymbol}{" "}
                        {formatCurrency(cfunValue)} - {currencySymbol} {formatCurrency(cmvunValue)} - (
                        {formatDecimal(ocvValue)} × {currencySymbol} {formatCurrency(precoComDesconto)})
                      </p>
                      <p>
                        LUCRO = {currencySymbol} {formatCurrency(precoComDesconto)} - {currencySymbol}{" "}
                        {formatCurrency(baseValue)} - {currencySymbol} {formatCurrency(ocvValue * precoComDesconto)}
                      </p>
                      <p>
                        LUCRO = {currencySymbol} {formatCurrency(lucroMonetario)} ({formatPercentage(resultado)}%)
                      </p>
                    </div>

                    <div className="mt-4 p-3 bg-yellow-50 rounded-md">
                      <p className="text-sm font-medium text-yellow-800">Resumo:</p>
                      <p className="text-sm">
                        Valor do Desconto: {currencySymbol} {formatCurrency(valorDesconto)}
                      </p>
                      <p className="text-sm">
                        Preço Final: {currencySymbol} {formatCurrency(precoComDesconto)}
                      </p>
                      <p className="text-sm">
                        Lucro Final: {currencySymbol} {formatCurrency(lucroMonetario)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Observação no rodapé */}
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-gray-700">
              <p className="font-medium mb-1">Observação:</p>
              <p>
                Os resultados apresentados nesta calculadora são estimativas baseadas nas informações inseridas pelo
                usuário. A G3 Educação Executiva não se responsabiliza por eventuais divergências ou interpretações
                equivocadas, especialmente relacionadas à classificação de Custos Fixos e Variáveis, que podem
                comprometer a precisão das análises.
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
