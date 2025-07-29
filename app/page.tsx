import Image from "next/image"
import { Calculator } from "@/components/calculator"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <main className="flex flex-col items-center p-4 md:p-8 flex-grow">
        <div className="mb-8">
          <Image src="/logo-g3.png" alt="G3 Educação Executiva" width={240} height={100} priority />
        </div>
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-8">Preço de Vendas</h1>
        <Calculator />
      </main>

      <footer className="bg-blue-800 text-white text-center py-4 text-sm">
        © {new Date().getFullYear()} G3 Educação Executiva. Todos os direitos reservados.
      </footer>
    </div>
  )
}
