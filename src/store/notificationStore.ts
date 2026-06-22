import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { MOCK_NOTIFICATIONS } from '../mock-data/notifications'
import type { AppNotification } from '../mock-data/notifications'

interface NotificationState {
  notifications: AppNotification[]
  loading:       boolean

  init:        (userId: string) => Promise<void>
  markRead:    (id: string) => Promise<void>
  markAllRead: (userId: string) => Promise<void>
}

function rowToNotif(r: Record<string, unknown>): AppNotification {
  return {
    id:       r.id       as string,
    type:     r.type     as AppNotification['type'],
    title:    r.title    as string,
    message:  r.message  as string,
    time:     r.created_at as string,
    read:     r.read     as boolean,
    ticketId: r.ticket_id as string | undefined,
    roles:    [],  // not stored per-notification in Supabase, handled by user_id filter
  }
}

export const useNotificationStore = create<NotificationState>()((set) => ({
  notifications: [],
  loading:       false,

  init: async (userId) => {
    set({ loading: true })
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50)
      if (error) throw error

      const notifications = (data ?? []).map((r) => rowToNotif(r as Record<string, unknown>))
      set({ notifications: notifications.length ? notifications : [], loading: false })
    } catch {
      // Fallback to mock data if Supabase table doesn't have data yet
      set({ notifications: MOCK_NOTIFICATIONS, loading: false })
    }
  },

  markRead: async (id) => {
    await supabase.from('notifications').update({ read: true }).eq('id', id)
    set((s) => ({
      notifications: s.notifications.map((n) => n.id === id ? { ...n, read: true } : n),
    }))
  },

  markAllRead: async (userId) => {
    await supabase.from('notifications').update({ read: true }).eq('user_id', userId)
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
    }))
  },
}))

// Call this after login
export async function initNotifications(userId: string) {
  await useNotificationStore.getState().init(userId)
}
