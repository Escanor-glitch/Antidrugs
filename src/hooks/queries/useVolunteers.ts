import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchVolunteers,
  fetchVolunteerById,
  fetchVolunteersByStatus,
  fetchVolunteersBySector,
  fetchFollowUpProfiles,
  createVolunteer,
  updateVolunteer,
  deleteVolunteer,
  createFollowUpProfile,
  updateFollowUpProfile,
} from '../../services/api/volunteers';
import type { Volunteer, FollowUpProfile } from '../../types';

// ============ Query Hooks ============

export function useVolunteers(page: number = 1, limit: number = 20) {
  const offset = (page - 1) * limit;

  return useQuery({
    queryKey: ['volunteers', page, limit],
    queryFn: () => fetchVolunteers(limit, offset),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export function useVolunteer(id: string | null) {
  return useQuery({
    queryKey: ['volunteer', id],
    queryFn: () => (id ? fetchVolunteerById(id) : null),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useVolunteersByStatus(status: string, page: number = 1, limit: number = 20) {
  const offset = (page - 1) * limit;

  return useQuery({
    queryKey: ['volunteers-status', status, page, limit],
    queryFn: () => fetchVolunteersByStatus(status, limit, offset),
    staleTime: 1000 * 60 * 5,
  });
}

export function useVolunteersBySector(sectorId: string, page: number = 1, limit: number = 20) {
  const offset = (page - 1) * limit;

  return useQuery({
    queryKey: ['volunteers-sector', sectorId, page, limit],
    queryFn: () => fetchVolunteersBySector(sectorId, limit, offset),
    staleTime: 1000 * 60 * 5,
  });
}

export function useFollowUpProfiles(volunteerId?: string) {
  return useQuery({
    queryKey: ['followUpProfiles', volunteerId],
    queryFn: () => fetchFollowUpProfiles(volunteerId),
    staleTime: 1000 * 60 * 5,
  });
}

// ============ Mutation Hooks ============

export function useCreateVolunteer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createVolunteer,
    onSuccess: () => {
      // Invalidate volunteers queries to refetch
      queryClient.invalidateQueries({ queryKey: ['volunteers'] });
    },
    onError: (error) => {
      console.error('Failed to create volunteer:', error);
    },
  });
}

export function useUpdateVolunteer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Volunteer> }) =>
      updateVolunteer(id, updates),
    onSuccess: (data) => {
      // Update specific volunteer in cache
      queryClient.setQueryData(['volunteer', data.id], data);
      // Invalidate volunteers list
      queryClient.invalidateQueries({ queryKey: ['volunteers'] });
    },
    onError: (error) => {
      console.error('Failed to update volunteer:', error);
    },
  });
}

export function useDeleteVolunteer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteVolunteer,
    onSuccess: () => {
      // Invalidate volunteers queries
      queryClient.invalidateQueries({ queryKey: ['volunteers'] });
    },
    onError: (error) => {
      console.error('Failed to delete volunteer:', error);
    },
  });
}

export function useCreateFollowUpProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFollowUpProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followUpProfiles'] });
    },
    onError: (error) => {
      console.error('Failed to create follow-up profile:', error);
    },
  });
}

export function useUpdateFollowUpProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<FollowUpProfile> }) =>
      updateFollowUpProfile(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followUpProfiles'] });
    },
    onError: (error) => {
      console.error('Failed to update follow-up profile:', error);
    },
  });
}
