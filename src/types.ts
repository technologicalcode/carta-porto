export type Variante = {
  etiqueta: string
  precio: number
}

/**
 * Un plato de la carta.
 * `modelo3d` queda reservado para enganchar después el visor 3D
 * (el mismo esquema que menu-digital-3d: .glb y .usdz).
 */
export type Plato = {
  id: string
  nombre: string
  precio?: number
  descripcion?: string
  variantes?: Variante[]
  modelo3d?: {
    glb?: string
    usdz?: string
    /**
     * Escala uniforme del archivo. 1 = el modelo ya está en metros.
     * En RA, 0.16 de ancho equivale a un plato de 16 cm.
     */
    escala?: number
  }
}

export type Seccion = {
  id: string
  nombre: string
  nota?: string
  platos: Plato[]
}

export type Salsa = {
  id: string
  nombre: string
  descripcion: string
}

export type Carta = {
  id: string
  nombre: string
  secciones: Seccion[]
  salsas?: Salsa[]
  cierre?: string
}
