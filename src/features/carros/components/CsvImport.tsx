import { useState } from 'react'
import { Button, Input } from '@/components'
import { useImportarCarrosCsv, useExportarCarrosCsv } from '../hooks/useCarros'
import { useToast } from '@/components'

export function CsvImport() {
  const [file, setFile] = useState<File | null>(null)
  const importar = useImportarCarrosCsv()
  const exportar = useExportarCarrosCsv()
  const { showToast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      if (!selected.name.endsWith('.csv')) {
        showToast('Arquivo deve ser .csv', 'error')
        return
      }
      if (selected.size > 5 * 1024 * 1024) {
        showToast('Arquivo deve ter no máximo 5 MB', 'error')
        return
      }
      setFile(selected)
    }
  }

  const handleImport = async () => {
    if (!file) return
    try {
      const result = await importar.mutateAsync(file)
      showToast(
        `Importação concluída: ${result.linhasValidas} válidas, ${result.linhasDuplicadas} duplicadas, ${result.linhasInvalidas} inválidas`,
        result.linhasInvalidas > 0 || result.linhasDuplicadas > 0 ? 'warning' : 'success'
      )
      setFile(null)
    } catch {
      showToast('Erro ao importar CSV', 'error')
    }
  }

  const handleExport = async () => {
    try {
      const blob = await exportar.mutateAsync()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `carros-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
      showToast('CSV exportado com sucesso', 'success')
    } catch {
      showToast('Erro ao exportar CSV', 'error')
    }
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Importar / Exportar CSV</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-slate-700 mb-2">Importar</h4>
          <Input
            label="Arquivo CSV"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            error={file && file.size > 5 * 1024 * 1024 ? 'Máximo 5 MB' : undefined}
          />
          {file && <p className="mt-1 text-sm text-slate-600">{file.name} ({(file.size / 1024).toFixed(1)} KB)</p>}
          <Button onClick={handleImport} loading={importar.isPending} disabled={!file || importar.isPending} className="mt-4 w-full">
            Importar
          </Button>
        </div>
        <div>
          <h4 className="font-medium text-slate-700 mb-2">Exportar</h4>
          <p className="text-sm text-slate-500 mb-4">Baixar todos os carros em formato CSV</p>
          <Button onClick={handleExport} loading={exportar.isPending} variant="secondary" className="w-full">
            Exportar CSV
          </Button>
        </div>
      </div>
    </div>
  )
}
