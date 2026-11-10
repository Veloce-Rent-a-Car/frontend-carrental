import { api } from './client'
import type { Carro, CarroRequest, CsvImportResult } from './types'
import { getAccessToken } from './client'

export async function getCarros(): Promise<Carro[]> {
  return api.get<Carro[]>('/api/carros')
}

export async function getCarro(id: number): Promise<Carro> {
  return api.get<Carro>(`/api/carros/${id}`)
}

export async function createCarro(data: CarroRequest): Promise<Carro> {
  return api.post<Carro>('/api/carros', data)
}

export async function updateCarro(id: number, data: CarroRequest): Promise<Carro> {
  return api.put<Carro>(`/api/carros/${id}`, data)
}

export async function deleteCarro(id: number): Promise<void> {
  return api.delete<void>(`/api/carros/${id}`)
}

export async function exportCarrosCsv(): Promise<Blob> {
  const token = getAccessToken()
  const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/api/carros/csv/export`, {
    headers: {
      Authorization: `Bearer ${token || ''}`,
    },
  })
  if (!response.ok) throw new Error('Erro ao exportar CSV')
  return response.blob()
}

export async function importCarrosCsv(file: File): Promise<CsvImportResult> {
  const token = getAccessToken()
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/api/carros/csv/import`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token || ''}`,
    },
    body: formData,
  })
  
  if (!response.ok) throw new Error('Erro ao importar CSV')
  return response.json()
}
