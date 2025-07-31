"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { CalculationMemorial } from "@/components/calculation-memorial"
import { EditableField } from "@/components/editable-field"
import { CalculatorIcon } from "lucide-react"

type CurrencyType = "R$ (Real)" | "G$ (Guarani)" | "U$ (Dólar)"
type CalculationType = "preco-venda" | "lucro" | "desconto"

export function Calculator() {
  const [currency, setCurrency] = useState<CurrencyType>("R$ (Real)")
  const [calculationType, setCalculationType] = useState<CalculationType>("preco-venda")
  const [cfun, setCfun] = useState("")
  const [cmvun, setCmvun] = useState("")
  const [ocv, setOcv] = useState("")
  const [lucro, setLucro] = useState("")
  const [precoVenda, setPrecoVenda] = useState("")
  const [desconto, setDesconto] = useState("")
  const [showMemorial, setShowMemorial] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validatePercentage = (value: string): boolean => {
    if (!value) return true // Allow empty values

    let numValue: number

    if (value.includes("%")) {
      numValue = Number.parseFloat(value.replace("%", "").replace(",", ".")) / 100
    } else {
      numValue = Number.parseFloat(value.replace(",", "."))
    }

    return !isNaN(numValue) && numValue >= 0 && numValue <= 1
  }

  const validateCurrency = (value: string): boolean => {
    if (!value) return true // Allow empty values
    const numValue = Number.parseFloat(value.replace(/\./g, "").replace(",", "."))
    return !isNaN(numValue) && numValue > 0
  }

  const handleOcvChange = (value: string) => {
    setOcv(value)
    if (value && !validatePercentage(value)) {
      setError("OCV não pode ser maior que 100% ou 1")
    } else {
      setError(null)
    }
  }

  const handleLucroChange = (value: string) => {
    setLucro(value)
    if (calculationType === "preco-venda" && value && !validatePercentage(value)) {
      setError("Lucro não pode ser maior que 100% ou 1")
    } else {
      setError(null)
    }
  }

  const handleDescontoChange = (value: string) => {
    setDesconto(value)
    if (calculationType === "desconto" && value && !validatePercentage(value)) {
      setError("Desconto não pode ser maior que 100% ou 1")
    } else {
      setError(null)
    }
  }

  const handleCalculate = () => {
    // Validate required fields based on calculation type
    if (!validateCurrency(cfun) || !validateCurrency(cmvun) || !validatePercentage(ocv)) {
      setError("Por favor, preencha todos os campos obrigatórios com valores válidos")
      return
    }

    if (calculationType === "preco-venda") {
      if (!validatePercentage(lucro)) {
        setError("Por favor, preencha o campo Lucro com um valor válido")
        return
      }
    } else if (calculationType === "lucro") {
      if (!validateCurrency(precoVenda)) {
        setError("Por favor, preencha o campo Preço de Venda com um valor válido")
        return
      }
    } else if (calculationType === "desconto") {
      if (!validateCurrency(precoVenda) || !validatePercentage(desconto)) {
        setError("Por favor, preencha os campos Preço de Venda e Desconto com valores válidos")
        return
      }
    }

    setError(null)
    setShowMemorial(true)
  }

  const currencySymbol = currency.split(" ")[0]

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto">
      {/* Calculadora Principal */}
      <Card className="overflow-hidden shadow-lg">
        <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white p-6">
          <h2 className="text-2xl font-bold mb-2">Calculadora de Preços</h2>
          <p className="text-blue-100">Fórmula de Precificação Estratégica</p>
        </div>

        <div className="p-8 space-y-8">
          {/* Seção de Configurações */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Tipo de Cálculo</h3>
              <RadioGroup
                value={calculationType}
                onValueChange={(value) => setCalculationType(value as CalculationType)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="preco-venda" id="preco-venda" />
                  <Label htmlFor="preco-venda" className="text-base cursor-pointer">
                    Preço de Venda
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="lucro" id="lucro" />
                  <Label htmlFor="lucro" className="text-base cursor-pointer">
                    Lucro
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="desconto" id="desconto" />
                  <Label htmlFor="desconto" className="text-base cursor-pointer">
                    Desconto
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Moeda</h3>
              <RadioGroup
                value={currency}
                onValueChange={(value) => setCurrency(value as CurrencyType)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="R$ (Real)" id="real" />
                  <Label htmlFor="real" className="text-base cursor-pointer">
                    R$ (Real)
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="G$ (Guarani)" id="guarani" />
                  <Label htmlFor="guarani" className="text-base cursor-pointer">
                    G$ (Guarani)
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="U$ (Dólar)" id="dolar" />
                  <Label htmlFor="dolar" className="text-base cursor-pointer">
                    U$ (Dólar)
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Seção de Campos de Entrada */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Dados para Cálculo</h3>

            {/* Campos Básicos - Sempre visíveis */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <Label className="text-base font-medium text-gray-700">
                  CFun - Custo Fixo Unitário <span className="text-red-500">*</span>
                </Label>
                <EditableField
                  value={cfun}
                  onChange={setCfun}
                  prefix={currencySymbol}
                  placeholder="Ex: 9.000,00"
                  tooltip="Custo Fixo por unidade (valor monetário)"
                />
                <p className="text-sm text-gray-500">Digite um valor monetário</p>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium text-gray-700">
                  CMVun - Custo da Mercadoria Vendida <span className="text-red-500">*</span>
                </Label>
                <EditableField
                  value={cmvun}
                  onChange={setCmvun}
                  prefix={currencySymbol}
                  placeholder="Ex: 5.000,00"
                  tooltip="Custo da Mercadoria Vendida Unitária (valor monetário)"
                />
                <p className="text-sm text-gray-500">Digite um valor monetário</p>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium text-gray-700">
                  OCV - Outros Custos Variáveis <span className="text-red-500">*</span>
                </Label>
                <EditableField
                  value={ocv}
                  onChange={handleOcvChange}
                  placeholder="Ex: 10% ou 0,10"
                  tooltip="Outros Custos Variáveis (porcentagem, máximo 1 ou 100%)"
                />
                <p className="text-sm text-gray-500">Digite em % ou decimal (máx: 1,00)</p>
              </div>
            </div>

            {/* Campos Específicos por Tipo de Cálculo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {calculationType === "preco-venda" && (
                <div className="space-y-3">
                  <Label className="text-base font-medium text-gray-700">
                    L - Lucro Desejado <span className="text-red-500">*</span>
                  </Label>
                  <EditableField
                    value={lucro}
                    onChange={handleLucroChange}
                    placeholder="Ex: 15% ou 0,15"
                    tooltip="Lucro desejado (porcentagem, máximo 1 ou 100%)"
                  />
                  <p className="text-sm text-gray-500">Digite em % ou decimal (máx: 1,00)</p>
                </div>
              )}

              {calculationType === "lucro" && (
                <div className="space-y-3">
                  <Label className="text-base font-medium text-gray-700">
                    PV - Preço de Venda <span className="text-red-500">*</span>
                  </Label>
                  <EditableField
                    value={precoVenda}
                    onChange={setPrecoVenda}
                    prefix={currencySymbol}
                    placeholder="Ex: 20.000,00"
                    tooltip="Preço de Venda praticado (valor monetário)"
                  />
                  <p className="text-sm text-gray-500">Digite um valor monetário</p>
                </div>
              )}

              {calculationType === "desconto" && (
                <>
                  <div className="space-y-3">
                    <Label className="text-base font-medium text-gray-700">
                      PV - Preço de Venda Original <span className="text-red-500">*</span>
                    </Label>
                    <EditableField
                      value={precoVenda}
                      onChange={setPrecoVenda}
                      prefix={currencySymbol}
                      placeholder="Ex: 20.000,00"
                      tooltip="Preço de Venda original antes do desconto (valor monetário)"
                    />
                    <p className="text-sm text-gray-500">Digite um valor monetário</p>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-base font-medium text-gray-700">
                      Desconto Aplicado <span className="text-red-500">*</span>
                    </Label>
                    <EditableField
                      value={desconto}
                      onChange={handleDescontoChange}
                      placeholder="Ex: 5,00% ou 0,05"
                      tooltip="Desconto aplicado (porcentagem com 2 casas decimais)"
                    />
                    <p className="text-sm text-gray-500">Digite com 2 casas decimais (máx: 100%)</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Botão de Calcular */}
          <div className="pt-4">
            <Button
              className="w-full h-14 text-lg bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-800 text-white shadow-lg transition-all duration-200"
              onClick={handleCalculate}
            >
              <CalculatorIcon className="h-6 w-6 mr-3" />
              {calculationType === "preco-venda" && "Calcular Preço de Venda"}
              {calculationType === "lucro" && "Calcular Lucro"}
              {calculationType === "desconto" && "Calcular Lucro com Desconto"}
            </Button>
          </div>
        </div>
      </Card>

      {/* Memorial de Cálculo */}
      <CalculationMemorial
        showMemorial={showMemorial}
        currency={currency}
        cfun={cfun}
        cmvun={cmvun}
        ocv={ocv}
        lucro={lucro}
        precoVenda={precoVenda}
        desconto={desconto}
        calculationType={calculationType}
      />
    </div>
  )
}
