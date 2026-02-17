import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { useProspects } from '../hooks/useProspects'
import { Prospect } from '@/types/coach';

interface ProspectsContextValue {
  prospects: Prospect[];
  setProspects: (prospects: Prospect[]) => void;
  loading: boolean;
  fetchProspects: () => Promise<void>;
}

const ProspectsContext = createContext<ProspectsContextValue>({} as ProspectsContextValue)


export const ProspectsProvider = ({ children }: { children: React.ReactNode }) => {
  const { globalUser } = useAuth()
  const [prospects, setProspects] = useState<Prospect[]>([])
  const [loading, setLoading] = useState(true)

  const { getAccountProspects } = useProspects()

  const fetchProspects = async (): Promise<void> => {
    if (globalUser) {
      setLoading(true)
      try {
        const prospectsData = await getAccountProspects()
        if(prospectsData && prospectsData.length > 0) {
          prospectsData.sort((a, b) => a.name .localeCompare(b.name))
          setProspects(prospectsData)
        }
        else {
          setProspects([])
        }
      } catch (error) {
        console.error('Error fetching prospects:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    fetchProspects()
  }, [globalUser])

  const value = {
    prospects,
    setProspects,
    loading,
    fetchProspects
  }

  return (
    <ProspectsContext.Provider value={value}>
      {children}
    </ProspectsContext.Provider>
  )
}

export const useProspectsContext = () => {
  return useContext(ProspectsContext)
} 