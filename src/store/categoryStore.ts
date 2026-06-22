import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CATEGORIES } from '../mock-data/categories'
import type { Category, SubCategory } from '../mock-data/categories'
import type { Severity } from '../shared/types/ticket'
import { supabase } from '../lib/supabase'

interface CategoryState {
  categories: Category[]
  loading:    boolean

  init: () => Promise<void>

  addCategory:       (label: string) => Promise<void>
  updateCategory:    (id: string, label: string) => Promise<void>
  removeCategory:    (id: string) => Promise<void>
  addSubCategory:    (catId: string, label: string, defaultSeverity?: Severity) => Promise<void>
  updateSubCategory: (subId: string, label: string, defaultSeverity?: Severity) => Promise<void>
  removeSubCategory: (subId: string) => Promise<void>
  reset:             () => void
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set) => ({
      categories: CATEGORIES,
      loading:    false,

      init: async () => {
        set({ loading: true })
        try {
          const { data: cats,  error: cErr } = await supabase.from('categories').select('*').order('id')
          const { data: subs,  error: sErr } = await supabase.from('sub_categories').select('*').order('id')
          if (cErr || sErr) throw cErr ?? sErr

          const categories: Category[] = (cats ?? []).map((c: Record<string, unknown>) => ({
            id:    c.id as string,
            label: c.label as string,
            subCategories: (subs ?? [])
              .filter((s: Record<string, unknown>) => s.category_id === c.id)
              .map((s: Record<string, unknown>) => ({
                id:              s.id as string,
                label:           s.label as string,
                defaultSeverity: s.default_severity as Severity | undefined,
              })),
          }))

          set({ categories: categories.length ? categories : CATEGORIES, loading: false })
        } catch {
          set({ loading: false })
        }
      },

      addCategory: async (label) => {
        const id = `CAT-${Date.now()}`
        const { error } = await supabase.from('categories').insert({ id, label })
        if (error) throw error
        set((s) => ({ categories: [...s.categories, { id, label, subCategories: [] }] }))
      },

      updateCategory: async (id, label) => {
        const { error } = await supabase.from('categories').update({ label }).eq('id', id)
        if (error) throw error
        set((s) => ({
          categories: s.categories.map((c) => c.id === id ? { ...c, label } : c),
        }))
      },

      removeCategory: async (id) => {
        const { error } = await supabase.from('categories').delete().eq('id', id)
        if (error) throw error
        set((s) => ({ categories: s.categories.filter((c) => c.id !== id) }))
      },

      addSubCategory: async (catId, label, defaultSeverity) => {
        const id = `${catId}-${Date.now()}`
        const { error } = await supabase
          .from('sub_categories')
          .insert({ id, category_id: catId, label, default_severity: defaultSeverity ?? null })
        if (error) throw error
        const sub: SubCategory = { id, label, defaultSeverity }
        set((s) => ({
          categories: s.categories.map((c) =>
            c.id !== catId ? c : { ...c, subCategories: [...c.subCategories, sub] }
          ),
        }))
      },

      updateSubCategory: async (subId, label, defaultSeverity) => {
        const updates: Record<string, unknown> = { label }
        if (defaultSeverity !== undefined) updates.default_severity = defaultSeverity
        const { error } = await supabase.from('sub_categories').update(updates).eq('id', subId)
        if (error) throw error
        set((s) => ({
          categories: s.categories.map((c) => ({
            ...c,
            subCategories: c.subCategories.map((sub) =>
              sub.id === subId
                ? { ...sub, label, ...(defaultSeverity !== undefined ? { defaultSeverity } : {}) }
                : sub
            ),
          })),
        }))
      },

      removeSubCategory: async (subId) => {
        const { error } = await supabase.from('sub_categories').delete().eq('id', subId)
        if (error) throw error
        set((s) => ({
          categories: s.categories.map((c) => ({
            ...c,
            subCategories: c.subCategories.filter((sub) => sub.id !== subId),
          })),
        }))
      },

      reset: () => set({ categories: CATEGORIES }),
    }),
    { name: 'ibt-categories' }
  )
)

