import { api } from './client'
import type { NewRentDTO, RentModel, RentReportByClient, RentReportByCar } from './types'

export async function getAlugueis(): Promise<RentModel[]> {
  return api.get<RentModel[]>('/api/rentals')
}

export async function getAluguel(id: number): Promise<RentModel> {
  return api.get<RentModel>(`/api/rentals/${id}`)
}

export async function createAluguel(data: NewRentDTO): Promise<RentModel> {
  return api.post<RentModel>('/api/rentals', data)
}

export async function updateAluguel(id: number, data: Partial<NewRentDTO>): Promise<RentModel> {
  return api.put<RentModel>(`/api/rentals/${id}`, data)
}

export async function deleteAluguel(id: number): Promise<void> {
  return api.delete<void>(`/api/rentals/${id}`)
}

export async function getRelatorioPorCliente(): Promise<RentReportByClient> {
  return api.get<RentReportByClient>('/api/rentals/report/by-client')
}

export async function getRelatorioPorCarro(): Promise<RentReportByCar> {
  return api.get<RentReportByCar>('/api/rentals/report/by-car')
}
