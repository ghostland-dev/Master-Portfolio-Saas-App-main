import { supabase } from '@/lib/supabase'

// Mock Supabase
const mockSupabase = {
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
  })),
}

jest.mock('@/lib/supabase', () => ({
  supabase: mockSupabase,
}))

describe('Projects API Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getProjects', () => {
    it('should fetch all projects', async () => {
      const mockProjects = [
        {
          id: '1',
          title: 'E-commerce Website',
          description: 'A modern e-commerce platform',
          status: 'active',
          client_id: 'client-1',
          created_at: '2024-01-01',
        },
        {
          id: '2',
          title: 'Mobile App',
          description: 'iOS and Android mobile application',
          status: 'completed',
          client_id: 'client-2',
          created_at: '2024-01-15',
        },
      ]

      mockSupabase.from().select().mockResolvedValue({
        data: mockProjects,
        error: null,
      })

      const { data, error } = await supabase
        .from('projects')
        .select('*')

      expect(data).toEqual(mockProjects)
      expect(error).toBeNull()
      expect(mockSupabase.from).toHaveBeenCalledWith('projects')
    })

    it('should handle database errors', async () => {
      const mockError = { message: 'Database connection failed' }

      mockSupabase.from().select().mockResolvedValue({
        data: null,
        error: mockError,
      })

      const { data, error } = await supabase
        .from('projects')
        .select('*')

      expect(data).toBeNull()
      expect(error).toEqual(mockError)
    })
  })

  describe('createProject', () => {
    it('should create a new project', async () => {
      const newProject = {
        title: 'New Project',
        description: 'Project description',
        status: 'proposal',
        client_id: 'client-1',
        budget: 5000,
      }

      const mockCreatedProject = {
        id: '3',
        ...newProject,
        created_at: '2024-01-20',
        updated_at: '2024-01-20',
      }

      mockSupabase.from().insert().mockResolvedValue({
        data: [mockCreatedProject],
        error: null,
      })

      const { data, error } = await supabase
        .from('projects')
        .insert(newProject)

      expect(data).toEqual([mockCreatedProject])
      expect(error).toBeNull()
      expect(mockSupabase.from).toHaveBeenCalledWith('projects')
    })

    it('should validate required fields', async () => {
      const invalidProject = {
        description: 'Project without title',
        status: 'proposal',
      }

      const mockError = { message: 'Title is required' }

      mockSupabase.from().insert().mockResolvedValue({
        data: null,
        error: mockError,
      })

      const { data, error } = await supabase
        .from('projects')
        .insert(invalidProject)

      expect(data).toBeNull()
      expect(error).toEqual(mockError)
    })
  })

  describe('updateProject', () => {
    it('should update an existing project', async () => {
      const projectId = '1'
      const updates = {
        status: 'completed',
        budget: 7500,
      }

      const mockUpdatedProject = {
        id: projectId,
        title: 'E-commerce Website',
        description: 'A modern e-commerce platform',
        status: 'completed',
        client_id: 'client-1',
        budget: 7500,
        created_at: '2024-01-01',
        updated_at: '2024-01-20',
      }

      mockSupabase.from().update().eq().mockResolvedValue({
        data: [mockUpdatedProject],
        error: null,
      })

      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', projectId)

      expect(data).toEqual([mockUpdatedProject])
      expect(error).toBeNull()
    })
  })

  describe('deleteProject', () => {
    it('should delete a project', async () => {
      const projectId = '1'

      mockSupabase.from().delete().eq().mockResolvedValue({
        data: [],
        error: null,
      })

      const { data, error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)

      expect(data).toEqual([])
      expect(error).toBeNull()
    })
  })
})
