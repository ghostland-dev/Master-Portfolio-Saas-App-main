import { useState, useEffect } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'
import { supabaseClient } from '@/lib/supabase'
import { useSupabase } from '@/components/providers/supabase-provider'

const supabaseData = supabaseClient as SupabaseClient<any>

// Hook pour récupérer les projets
export function useProjects() {
  const { user } = useSupabase()
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setProjects([])
      setLoading(false)
      return
    }

    const fetchProjects = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabaseData
          .from('projects')
          .select(`
            *,
            client:users!projects_client_id_fkey(*)
          `)
          .order('created_at', { ascending: false })

        if (error) throw error
        setProjects(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [user])

  const createProject = async (projectData: any) => {
    try {
      const { data, error } = await supabaseData
        .from('projects')
        .insert([projectData])
        .select()

      if (error) throw error
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' }
    }
  }

  const updateProject = async (id: string, updates: any) => {
    try {
      const { data, error } = await supabaseData
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) throw error
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' }
    }
  }

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabaseData
        .from('projects')
        .delete()
        .eq('id', id)

      if (error) throw error
      return { error: null }
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'An error occurred' }
    }
  }

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
  }
}

// Hook pour récupérer les messages
export function useMessages() {
  const { user } = useSupabase()
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setMessages([])
      setLoading(false)
      return
    }

    const fetchMessages = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabaseData
          .from('messages')
          .select(`
            *,
            sender:users!messages_sender_id_fkey(*),
            recipient:users!messages_recipient_id_fkey(*),
            project:projects(*)
          `)
          .order('created_at', { ascending: false })

        if (error) throw error
        setMessages(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [user])

  const sendMessage = async (messageData: any) => {
    try {
      const { data, error } = await supabaseData
        .from('messages')
        .insert([messageData])
        .select()

      if (error) throw error
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' }
    }
  }

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabaseData
        .from('messages')
        .update({ read: true })
        .eq('id', messageId)

      if (error) throw error
      return { error: null }
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'An error occurred' }
    }
  }

  return {
    messages,
    loading,
    error,
    sendMessage,
    markAsRead,
  }
}

// Hook pour récupérer les factures
export function useInvoices() {
  const { user } = useSupabase()
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setInvoices([])
      setLoading(false)
      return
    }

    const fetchInvoices = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabaseData
          .from('invoices')
          .select(`
            *,
            client:users!invoices_client_id_fkey(*),
            project:projects(*)
          `)
          .order('created_at', { ascending: false })

        if (error) throw error
        setInvoices(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchInvoices()
  }, [user])

  const createInvoice = async (invoiceData: any) => {
    try {
      const { data, error } = await supabaseData
        .from('invoices')
        .insert([invoiceData])
        .select()

      if (error) throw error
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' }
    }
  }

  const updateInvoice = async (id: string, updates: any) => {
    try {
      const { data, error } = await supabaseData
        .from('invoices')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) throw error
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' }
    }
  }

  return {
    invoices,
    loading,
    error,
    createInvoice,
    updateInvoice,
  }
}

// Hook pour récupérer les tâches
export function useTasks(projectId?: string) {
  const { user } = useSupabase()
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setTasks([])
      setLoading(false)
      return
    }

    const fetchTasks = async () => {
      try {
        setLoading(true)
        let query = supabaseData
          .from('tasks')
          .select(`
            *,
            assignee:users!tasks_assignee_id_fkey(*),
            project:projects(*)
          `)

        if (projectId) {
          query = query.eq('project_id', projectId)
        }

        const { data, error } = await query.order('created_at', { ascending: false })

        if (error) throw error
        setTasks(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [user, projectId])

  const createTask = async (taskData: any) => {
    try {
      const { data, error } = await supabaseData
        .from('tasks')
        .insert([taskData])
        .select()

      if (error) throw error
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' }
    }
  }

  const updateTask = async (id: string, updates: any) => {
    try {
      const { data, error } = await supabaseData
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) throw error
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' }
    }
  }

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabaseData
        .from('tasks')
        .delete()
        .eq('id', id)

      if (error) throw error
      return { error: null }
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'An error occurred' }
    }
  }

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
  }
}

// Hook pour récupérer les phases de projet
export function useProjectPhases(projectId: string) {
  const { user } = useSupabase()
  const [phases, setPhases] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user || !projectId) {
      setPhases([])
      setLoading(false)
      return
    }

    const fetchPhases = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabaseData
          .from('project_phases')
          .select(`
            *,
            milestones(*)
          `)
          .eq('project_id', projectId)
          .order('start_date', { ascending: true })

        if (error) throw error
        setPhases(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchPhases()
  }, [user, projectId])

  const createPhase = async (phaseData: any) => {
    try {
      const { data, error } = await supabaseData
        .from('project_phases')
        .insert([phaseData])
        .select()

      if (error) throw error
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' }
    }
  }

  const updatePhase = async (id: string, updates: any) => {
    try {
      const { data, error } = await supabaseData
        .from('project_phases')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) throw error
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' }
    }
  }

  const deletePhase = async (id: string) => {
    try {
      const { error } = await supabaseData
        .from('project_phases')
        .delete()
        .eq('id', id)

      if (error) throw error
      return { error: null }
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'An error occurred' }
    }
  }

  return {
    phases,
    loading,
    error,
    createPhase,
    updatePhase,
    deletePhase,
  }
}

// Hook pour récupérer les rendez-vous
export function useAppointments() {
  const { user } = useSupabase()
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setAppointments([])
      setLoading(false)
      return
    }

    const fetchAppointments = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabaseData
          .from('appointments')
          .select(`
            *,
            client:users!appointments_client_id_fkey(*)
          `)
          .order('scheduled_date', { ascending: true })

        if (error) throw error
        setAppointments(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [user])

  const createAppointment = async (appointmentData: any) => {
    try {
      const { data, error } = await supabaseData
        .from('appointments')
        .insert([appointmentData])
        .select()

      if (error) throw error
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' }
    }
  }

  const updateAppointment = async (id: string, updates: any) => {
    try {
      const { data, error } = await supabaseData
        .from('appointments')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) throw error
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' }
    }
  }

  const deleteAppointment = async (id: string) => {
    try {
      const { error } = await supabaseData
        .from('appointments')
        .delete()
        .eq('id', id)

      if (error) throw error
      return { error: null }
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'An error occurred' }
    }
  }

  return {
    appointments,
    loading,
    error,
    createAppointment,
    updateAppointment,
    deleteAppointment,
  }
}

// Hook pour récupérer les retours clients
export function useFeedbacks() {
  const { user } = useSupabase()
  const [feedbacks, setFeedbacks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setFeedbacks([])
      setLoading(false)
      return
    }

    const fetchFeedbacks = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabaseData
          .from('feedbacks')
          .select(`
            *,
            client:users!feedbacks_client_id_fkey(*)
          `)
          .order('created_at', { ascending: false })

        if (error) throw error
        setFeedbacks(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchFeedbacks()
  }, [user])

  return {
    feedbacks,
    loading,
    error,
  }
}
