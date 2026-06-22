import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export type StorageBucket = 'ticket-photos' | 'employee-avatars'

interface UploadResult {
  path:       string   // storage path, e.g. "ticket-photos/IBT-2406-001/eep/photo1.jpg"
  publicUrl:  string   // full public URL
}

interface UseStorageUpload {
  upload:     (file: File, path: string) => Promise<UploadResult>
  getUrl:     (bucket: StorageBucket, path: string) => string
  uploading:  boolean
  error:      string | null
}

export function useStorageUpload(bucket: StorageBucket): UseStorageUpload {
  const [uploading, setUploading] = useState(false)
  const [error,     setError]     = useState<string | null>(null)

  const upload = async (file: File, path: string): Promise<UploadResult> => {
    setUploading(true)
    setError(null)
    try {
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: true })
      if (uploadError) throw uploadError

      const { data } = supabase.storage.from(bucket).getPublicUrl(path)
      return { path, publicUrl: data.publicUrl }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload failed'
      setError(msg)
      throw err
    } finally {
      setUploading(false)
    }
  }

  const getUrl = (b: StorageBucket, path: string): string => {
    const { data } = supabase.storage.from(b).getPublicUrl(path)
    return data.publicUrl
  }

  return { upload, getUrl, uploading, error }
}

/** Upload multiple files and return their paths */
export async function uploadMultiple(
  bucket: StorageBucket,
  files: File[],
  pathPrefix: string,
): Promise<string[]> {
  const paths: string[] = []
  for (const file of files) {
    const ext  = file.name.split('.').pop() ?? 'jpg'
    const path = `${pathPrefix}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true })
    if (!error) paths.push(path)
  }
  return paths
}

/** Resolve a stored path to a public URL */
export function getPublicUrl(bucket: StorageBucket, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}
