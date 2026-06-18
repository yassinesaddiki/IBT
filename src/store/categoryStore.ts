import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CATEGORIES } from '../mock-data/categories'
import type { Category, SubCategory } from '../mock-data/categories'
import type { Severity } from '../shared/types/ticket'

interface CategoryState {
  categories: Category[]
  addCategory:       (label: string) => void
  updateCategory:    (id: string, label: string) => void
  removeCategory:    (id: string) => void
  addSubCategory:    (catId: string, label: string, defaultSeverity?: Severity) => void
  updateSubCategory: (subId: string, label: string) => void
  removeSubCategory: (subId: string) => void
  reset:             () => void
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set) => ({
      categories: CATEGORIES,

      addCategory: (label) =>
        set((s) => ({
          categories: [
            ...s.categories,
            {
              id: `CAT-${Date.now()}`,
              label,
              subCategories: [],
            },
          ],
        })),

      updateCategory: (id, label) =>
        set((s) => ({
          categories: s.categories.map((c) => c.id === id ? { ...c, label } : c),
        })),

      removeCategory: (id) =>
        set((s) => ({ categories: s.categories.filter((c) => c.id !== id) })),

      addSubCategory: (catId, label, defaultSeverity) =>
        set((s) => ({
          categories: s.categories.map((c) =>
            c.id !== catId ? c : {
              ...c,
              subCategories: [
                ...c.subCategories,
                { id: `${catId}-${Date.now()}`, label, defaultSeverity } as SubCategory,
              ],
            }
          ),
        })),

      updateSubCategory: (subId, label) =>
        set((s) => ({
          categories: s.categories.map((c) => ({
            ...c,
            subCategories: c.subCategories.map((sub) =>
              sub.id === subId ? { ...sub, label } : sub
            ),
          })),
        })),

      removeSubCategory: (subId) =>
        set((s) => ({
          categories: s.categories.map((c) => ({
            ...c,
            subCategories: c.subCategories.filter((sub) => sub.id !== subId),
          })),
        })),

      reset: () => set({ categories: CATEGORIES }),
    }),
    { name: 'ibt-categories' }
  )
)
