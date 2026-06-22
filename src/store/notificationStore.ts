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
    roles:    [],
  }
}

// Keep track of the active channel so we don't subscribe twice
let activeChannel: ReturnType<typeof supabase.channel> | null = null

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
      set({ notifications: MOCK_NOTIFICATIONS, loading: false })
    }

    // Tear down any previous subscription before creating a new one
    if (activeChannel) {
      void supabase.removeChannel(activeChannel)
      activeChannel = null
    }

    // Real-time: listen for new rows inserted for this user
    activeChannel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event:  'INSERT',
          schema: 'public',
          table:  'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newNotif = rowToNotif(payload.new as Record<string, unknown>)
          set((s) => ({ notifications: [newNotif, ...s.notifications] }))
        },
      )
      .subscribe()
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

export async function initNotifications(userId: string) {
  await useNotificationStore.getState().init(userId)
}
