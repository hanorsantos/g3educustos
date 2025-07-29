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
type CalculationType = "preco-venda" | "lucro"

export function Calculator() {
  const [currency, setCurrency] = useState<CurrencyType>("R$ (Real)")
  const [calculationType, setCalculationType] = useState<CalculationType>("preco-venda")
  const [cfun, setCfun] = useState("9.000,00")
  const [cmvun, setCmvun] = useState("5.000,00")
  const [ocv, setOcv] = useState("10%")
  const [lucro, setLucro] = useState("15%")
  const [precoVenda, setPrecoVenda] = useState("20.000,00")
  const [showMemorial, setShowMemorial] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validatePercentage = (value: string): boolean => {
    let numValue: number

    if (value.includes("%")) {
      numValue = Number.parseFloat(value.replace("%", "")) / 100
    } else {
      numValue = Number.parseFloat(value.replace(",", "."))
    }

    return !isNaN(numValue) && numValue >= 0 && numValue <= 1
  }

  const handleOcvChange = (value: string) => {
    setOcv(value)
    if (!validatePercentage(value)) {
      setError("OCV não pode ser maior que 100% ou 1")
    } else {
      setError(null)
    }
  }

  const handleLucroChange = (value: string) => {
    setLucro(value)
    if (calculationType === "preco-venda" && !validatePercentage(value)) {
      setError("Lucro não pode ser maior que 100% ou 1")
    } else {
      setError(null)
    }
  }

  const handleCalculate = () => {
    if (calculationType === "preco-venda") {
      if (!validatePercentage(ocv) || !validatePercentage(lucro)) {
        setError("OCV e Lucro não podem ser maiores que 100% ou 1")
        return
      }
    } else {
      if (!validatePercentage(ocv)) {
        setError("OCV não pode ser maior que 100% ou 1")
        return
      }
    }

    setError(null)
    setShowMemorial(true)
  }

  const currencySymbol = currency.split(" ")[0]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
      <Card className="overflow-hidden shadow-md">
        <div className="bg-blue-800 text-white p-4">
          <h2 className="text-xl font-bold">Preço de Vendas</h2>
          <p className="text-sm text-blue-100">Fórmula de Precificação Estratégica</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-medium mb-2">Calcular</h3>
              <RadioGroup
                value={calculationType}
                onValueChange={(value) => setCalculationType(value as CalculationType)}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="preco-venda" id="preco-venda" />
                  <Label htmlFor="preco-venda">Preço de Venda</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lucro" id="lucro" />
                  <Label htmlFor="lucro">Lucro</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <h3 className="font-medium mb-2">Moeda</h3>
              <RadioGroup
                value={currency}
                onValueChange={(value) => setCurrency(value as CurrencyType)}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="R$ (Real)" id="real" />
                  <Label htmlFor="real">R$ (Real)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="G$ (Guarani)" id="guarani" />
                  <Label htmlFor="guarani">G$ (Guarani)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="U$ (Dólar)" id="dolar" />
                  <Label htmlFor="dolar">U$ (Dólar)</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Campos de entrada em disposição horizontal */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <h3 className="font-medium mb-2">CFun</h3>
              <EditableField
                value={cfun}
                onChange={setCfun}
                prefix={currencySymbol}
                placeholder="Custo Fixo unitário"
                tooltip="Custo Fixo por unidade (valor monetário)"
              />
              <p className="text-xs text-gray-500 mt-1">Digite um valor monetário (ex: 9.000,00)</p>
            </div>

            <div>
              <h3 className="font-medium mb-2">CMVun</h3>
              <EditableField
                value={cmvun}
                onChange={setCmvun}
                prefix={currencySymbol}
                placeholder="Custo da Mercadoria Vendida Unitária"
                tooltip="Custo da Mercadoria Vendida Unitária (valor monetário)"
              />
              <p className="text-xs text-gray-500 mt-1">Digite um valor monetário (ex: 5.000,00)</p>
            </div>

            <div>
              <h3 className="font-medium mb-2">OCV</h3>
              <EditableField
                value={ocv}
                onChange={handleOcvChange}
                placeholder="Outros Custos Variáveis (0,1 ou 10%)"
                tooltip="Outros Custos Variáveis (porcentagem, máximo 1 ou 100%)"
              />
              <p className="text-xs text-gray-500 mt-1">
                Digite um decimal menor que 1 (ex: 0,10) ou porcentagem (ex: 10%)
              </p>
            </div>

            <div>
              {calculationType === "preco-venda" ? (
                <>
                  <h3 className="font-medium mb-2">L</h3>
                  <EditableField
                    value={lucro}
                    onChange={handleLucroChange}
                    placeholder="Lucro (0,15 ou 15%)"
                    tooltip="Lucro (porcentagem, máximo 1 ou 100%)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Digite um decimal menor que 1 (ex: 0,15) ou porcentagem (ex: 15%)
                  </p>
                </>
              ) : (
                <>
                  <h3 className="font-medium mb-2">PV</h3>
                  <EditableField
                    value={precoVenda}
                    onChange={setPrecoVenda}
                    prefix={currencySymbol}
                    placeholder="Preço de Venda"
                    tooltip="Preço de Venda (valor monetário)"
                  />
                  <p className="text-xs text-gray-500 mt-1">Digite um valor monetário (ex: 20.000,00)</p>
                </>
              )}
            </div>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{error}</div>}

          <Button className="w-full bg-blue-800 hover:bg-blue-900 text-white" onClick={handleCalculate}>
            <CalculatorIcon className="h-4 w-4 mr-2" />
            {calculationType === "preco-venda" ? "Calcular Preço de Venda" : "Calcular Lucro"}
          </Button>
        </div>
      </Card>

      <CalculationMemorial
        showMemorial={showMemorial}
        currency={currency}
        cfun={cfun}
        cmvun={cmvun}
        ocv={ocv}
        lucro={lucro}
        precoVenda={precoVenda}
        calculationType={calculationType}
      />
    </div>
  )
}
