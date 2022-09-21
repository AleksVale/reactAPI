import { ReactNode, useEffect, useState, useCallback } from 'react'
import { createContext } from 'use-context-selector'
import { api } from '../lib/axios'

interface createTransactionData {
  description: string
  price: number
  category: string
  type: 'income' | 'outcome'
}

interface Transaction {
  id: number
  description: string
  type: 'income' | 'outcome'
  price: number
  category: string
  createdAt: string
}
interface TransactionContextType {
  transactions: Transaction[]
  LoadTransactions: (query?: string) => Promise<void>
  createTransaction: (data: createTransactionData) => Promise<void>
}

interface TransactionProviderProps {
  children: ReactNode
}

export const TransactionContext = createContext({} as TransactionContextType)

export function TransactionsProvider({ children }: TransactionProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  async function LoadTransactions(query?: string) {
    const response = await api.get('/transactions', {
      params: {
        _sort: 'createdAt',
        _order: 'desc',
        q: query,
      },
    })
    setTransactions(response.data)
  }

  const createTransaction = useCallback(async (data: createTransactionData) => {
    const { description, price, category, type } = data
    const response = await api.post('/transactions', {
      description,
      price,
      category,
      type,
      createdAt: new Date(),
    })

    setTransactions((state) => [response.data, ...state])
  }, [])

  useEffect(() => {
    LoadTransactions()
  }, [])

  return (
    <TransactionContext.Provider
      value={{ transactions, LoadTransactions, createTransaction }}
    >
      {children}
    </TransactionContext.Provider>
  )
}
