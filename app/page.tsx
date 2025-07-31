import Image from "next/image"
import { Calculator } from "@/components/calculator"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <Image
              src="/logo-g3.png"
              alt="G3 Educação Executiva"
              width={280}
              height={120}
              priority
              className="mx-auto"
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Calculadora de Preços</h1>
          <p className="text-lg text-gray-600">Ferramenta de Precificação Estratégica</p>
        </div>

        {/* Calculator */}
        <Calculator />

        {/* Footer */}
        <footer className="mt-16 bg-gradient-to-r from-blue-800 to-blue-900 text-white text-center py-6 rounded-lg shadow-lg">
          <p className="text-sm">© {new Date().getFullYear()} G3 Educação Executiva. Todos os direitos reservados.</p>
        </footer>
      </div>
    </div>
  )
}
