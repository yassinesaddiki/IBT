import { useState } from 'react'
import { getPublicUrl } from '../hooks/useStorageUpload'
import { COLORS } from '../../design-system/tokens'

interface Props {
  photos:  string[]   // array of storage paths OR full URLs
  bucket?: 'ticket-photos' | 'employee-avatars'
  label?:  string
}

/**
 * Displays a grid of photos. Paths are resolved to public URLs if `bucket` is provided.
 * Full URLs (starting with http) are used as-is.
 * Clicking a photo opens it in a simple fullscreen lightbox.
 */
export function PhotoGrid({ photos, bucket = 'ticket-photos', label }: Props) {
  const [lightbox, setLightbox] = useState<string | null>(null)

  if (!photos.length) {
    return (
      <div style={{ fontSize: '12px', color: COLORS.text.muted, fontStyle: 'italic' }}>
        Aucune photo jointe
      </div>
    )
  }

  const resolve = (p: string) =>
    p.startsWith('http') ? p : getPublicUrl(bucket, p)

  return (
    <>
      {label && (
        <div style={{ fontSize: '11px', color: COLORS.text.muted, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: '8px' }}>
          {label}
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
        {photos.map((p, i) => {
          const url = resolve(p)
          return (
            <div key={i} onClick={() => setLightbox(url)}
              style={{ aspectRatio: '1', borderRadius: '10px', overflow: 'hidden', cursor: 'pointer', border: `0.5px solid ${COLORS.border.default}`, background: COLORS.bg.panel }}>
              <img src={url} alt={`Photo ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
            </div>
          )
        })}
      </div>

      {lightbox && (
        <div onClick={() => setLightbox(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, cursor: 'pointer', padding: '20px' }}>
          <img src={lightbox} alt="Photo" style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain', borderRadius: '12px' }} />
          <div style={{ position: 'absolute', top: '16px', right: '20px', color: '#fff', fontSize: '13px', opacity: 0.6 }}>
            Cliquer pour fermer
          </div>
        </div>
      )}
    </>
  )
}
