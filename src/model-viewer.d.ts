import type { ModelViewerElement } from '@google/model-viewer'

type AtributosVisor = React.DetailedHTMLProps<
  React.HTMLAttributes<ModelViewerElement>,
  ModelViewerElement
> & {
  src?: string
  alt?: string
  ar?: boolean
  'ar-modes'?: string
  'ios-src'?: string
  'camera-controls'?: boolean
  'auto-rotate'?: boolean
  'disable-zoom'?: boolean
  'camera-orbit'?: string
  'min-camera-orbit'?: string
  'max-camera-orbit'?: string
  scale?: string
  'ar-scale'?: 'auto' | 'fixed'
  'shadow-intensity'?: string
  'touch-action'?: string
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': AtributosVisor
    }
  }
}
