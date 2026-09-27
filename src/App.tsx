import { useEffect, useMemo, useRef, useState } from 'react'
import type { ModelViewerElement } from '@google/model-viewer'
import { cartas, restaurante } from './data/menu'
import type { Carta, Plato } from './types'

function soles(valor: number) {
  return `S/ ${valor.toFixed(2)}`
}

function textoPlato(plato: Plato) {
  return [plato.nombre, plato.descripcion, plato.variantes?.map((v) => v.etiqueta).join(' ')]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

function filtrarCarta(carta: Carta, consulta: string): Carta | null {
  const q = consulta.trim().toLowerCase()
  if (!q) return carta

  const secciones = carta.secciones
    .map((seccion) => ({
      ...seccion,
      platos: seccion.platos.filter((plato) => textoPlato(plato).includes(q)),
    }))
    .filter((seccion) => seccion.platos.length > 0)

  const salsas = carta.salsas?.filter((salsa) =>
    `${salsa.nombre} ${salsa.descripcion}`.toLowerCase().includes(q),
  )

  if (secciones.length === 0 && (!salsas || salsas.length === 0)) return null
  return { ...carta, secciones, salsas }
}

function Precio({ plato }: { plato: Plato }) {
  if (plato.variantes?.length) {
    return (
      <div className="variantes">
        {plato.variantes.map((variante) => (
          <span key={variante.etiqueta}>
            <small>{variante.etiqueta}</small>
            {soles(variante.precio)}
          </span>
        ))}
      </div>
    )
  }

  if (plato.precio == null) return null
  return <strong className="precio">{soles(plato.precio)}</strong>
}

function CartaBlock({
  carta,
  onVer3d,
}: {
  carta: Carta
  onVer3d: (plato: Plato) => void
}) {
  return (
    <section className="carta" id={carta.id} aria-labelledby={`${carta.id}-titulo`}>
      <header className="carta-head">
        <p>Nuestra</p>
        <h2 id={`${carta.id}-titulo`}>{carta.nombre}</h2>
      </header>

      {carta.salsas && carta.salsas.length > 0 && (
        <div className="salsas">
          <h3>Nuestras alitas</h3>
          <ul>
            {carta.salsas.map((salsa) => (
              <li key={salsa.id}>
                <div>
                  <strong>{salsa.nombre}</strong>
                  <span>{salsa.descripcion}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {carta.secciones.map((seccion) => (
        <div className="seccion" key={seccion.id} id={seccion.id}>
          <h3>{seccion.nombre}</h3>
          {seccion.nota && <p className="nota">{seccion.nota}</p>}
          <ul className="platos">
            {seccion.platos.map((plato) => (
              <li key={plato.id}>
                <div>
                  <strong>{plato.nombre}</strong>
                  {plato.descripcion && <span>{plato.descripcion}</span>}
                  <button
                    type="button"
                    className="ver-3d"
                    onClick={() => onVer3d(plato)}
                  >
                    Ver en 3D
                  </button>
                </div>
                <Precio plato={plato} />
              </li>
            ))}
          </ul>
        </div>
      ))}

      {carta.cierre && <p className="cierre">{carta.cierre}</p>}
    </section>
  )
}

function Modelo3d({
  glb,
  usdz,
  nombre,
  escala = 1,
}: {
  glb: string
  usdz?: string
  nombre: string
  escala?: number
}) {
  const visor = useRef<ModelViewerElement>(null)
  const [visorListo, setVisorListo] = useState(false)
  const [modeloListo, setModeloListo] = useState(false)
  const [sinHolograma, setSinHolograma] = useState(false)

  useEffect(() => {
    let activo = true
    void import('@google/model-viewer').then(() => {
      if (activo) setVisorListo(true)
    })
    return () => {
      activo = false
    }
  }, [])

  useEffect(() => {
    const elemento = visor.current
    if (!visorListo || !elemento) return
    const marcar = () => setModeloListo(true)
    if (elemento.loaded) marcar()
    elemento.addEventListener('load', marcar)
    return () => elemento.removeEventListener('load', marcar)
  }, [visorListo])

  useEffect(() => {
    const elemento = visor.current
    if (!visorListo || !elemento) return
    const esCelular = window.matchMedia('(pointer: coarse)').matches
    if (!esCelular) return
    let vigente = true
    const revisar = window.setTimeout(() => {
      if (vigente && !elemento.canActivateAR) setSinHolograma(true)
    }, 800)
    return () => {
      vigente = false
      window.clearTimeout(revisar)
    }
  }, [visorListo, glb])

  if (!visorListo) {
    return (
      <div className="escenario">
        <p>Cargando el visor…</p>
      </div>
    )
  }

  return (
    <>
      <model-viewer
        ref={visor}
        className="visor"
        src={glb}
        ios-src={usdz}
        alt={`Modelo 3D de ${nombre}`}
        camera-controls
        auto-rotate
        disable-zoom
        camera-orbit="0deg 70deg 105%"
        min-camera-orbit="auto auto 105%"
        max-camera-orbit="auto auto 105%"
        scale={`${escala} ${escala} ${escala}`}
        ar
        ar-scale="fixed"
        ar-modes="webxr quick-look"
        shadow-intensity="1"
        touch-action="none"
      />
      {!modeloListo && <p className="visor-nota">Cargando el plato…</p>}
      {sinHolograma && (
        <p className="aclaracion-ar">
          Este celular no abre el holograma. Puedes girar el modelo con el dedo. En un iPhone,
          o en un Android con Servicios de Google Play para RA, sí se ve sobre la mesa.
        </p>
      )}
    </>
  )
}

function Visor3d({ plato, onCerrar }: { plato: Plato | null; onCerrar: () => void }) {
  const dialogo = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const nodo = dialogo.current
    if (!nodo) return
    if (plato && !nodo.open) nodo.showModal()
    if (!plato && nodo.open) nodo.close()
  }, [plato])

  useEffect(() => {
    if (!plato) return
    const scrollY = window.scrollY
    const cuerpo = document.body
    const anterior = {
      overflow: cuerpo.style.overflow,
      position: cuerpo.style.position,
      top: cuerpo.style.top,
      width: cuerpo.style.width,
    }
    cuerpo.style.overflow = 'hidden'
    cuerpo.style.position = 'fixed'
    cuerpo.style.top = `-${scrollY}px`
    cuerpo.style.width = '100%'

    const frenarFondo = (evento: TouchEvent) => {
      const objetivo = evento.target
      if (objetivo instanceof Element && objetivo.closest('model-viewer')) return
      evento.preventDefault()
    }
    document.addEventListener('touchmove', frenarFondo, { passive: false })

    return () => {
      document.removeEventListener('touchmove', frenarFondo)
      cuerpo.style.overflow = anterior.overflow
      cuerpo.style.position = anterior.position
      cuerpo.style.top = anterior.top
      cuerpo.style.width = anterior.width
      window.scrollTo(0, scrollY)
    }
  }, [plato])

  return (
    <dialog ref={dialogo} className="visor-dialog" onClose={onCerrar}>
      {plato && (
        <div className="visor-cuerpo">
          <button type="button" className="cerrar" onClick={() => dialogo.current?.close()}>
            Cerrar
          </button>
          <p className="kicker">Modelo 3D</p>
          <h2>{plato.nombre}</h2>
          {plato.descripcion && <p className="visor-nota">{plato.descripcion}</p>}
          <Precio plato={plato} />
          {plato.modelo3d?.glb ? (
            <Modelo3d
              glb={plato.modelo3d.glb}
              usdz={plato.modelo3d.usdz}
              nombre={plato.nombre}
              escala={plato.modelo3d.escala}
            />
          ) : (
            <div className="escenario">
              <p>El modelo 3D de {plato.nombre} se mostrará aquí.</p>
            </div>
          )}
        </div>
      )}
    </dialog>
  )
}

export default function App() {
  const [consulta, setConsulta] = useState('')
  const [activa, setActiva] = useState(cartas[0].id)
  const [plato3d, setPlato3d] = useState<Plato | null>(null)

  const visibles = useMemo(
    () =>
      cartas
        .map((carta) => filtrarCarta(carta, consulta))
        .filter((carta): carta is Carta => carta !== null),
    [consulta],
  )

  useEffect(() => {
    if (consulta.trim()) {
      window.scrollTo(0, 0)
      return
    }

    const marcar = () => {
      const linea = 160
      let actual = cartas[0].id
      for (const carta of cartas) {
        const nodo = document.getElementById(carta.id)
        if (nodo && nodo.getBoundingClientRect().top <= linea) actual = carta.id
      }
      setActiva(actual)
    }

    marcar()
    window.addEventListener('scroll', marcar, { passive: true })
    return () => window.removeEventListener('scroll', marcar)
  }, [consulta])

  function irACarta(id: string) {
    setConsulta('')
    setActiva(id)
    window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  return (
    <>
      <header className="topbar">
        <a className="marca" href="#inicio">
          <span>Porto</span>
          <small>Mar & Brasas</small>
        </a>
        <label className="buscar">
          <span className="sr">Buscar en la carta</span>
          <input
            value={consulta}
            onChange={(event) => setConsulta(event.target.value)}
            placeholder="Buscar un plato"
            type="search"
          />
        </label>
      </header>

      <nav className="cartas-nav" aria-label="Cartas">
        {cartas.map((carta) => (
          <button
            key={carta.id}
            type="button"
            className={activa === carta.id && !consulta.trim() ? 'is-active' : undefined}
            onClick={() => irACarta(carta.id)}
          >
            {carta.nombre.replace('Carta de ', '').replace('Carta ', '')}
          </button>
        ))}
      </nav>

      <main>
        {!consulta.trim() && (
        <section className="hero" id="inicio">
          <div className="marco">
            <p className="kicker">Nuestra carta</p>
            <h1>Porto</h1>
            <p className="slogan">
              <span>★</span> Mar & Brasas <span>★</span>
            </p>
            <p className="lead">
              Mar, brasas, criollo y barra. La carta de la casa, para verla en el celular.
            </p>
            <button type="button" className="cta" onClick={() => irACarta('marina')}>
              Ver la carta
            </button>
          </div>
        </section>
        )}

        {visibles.length === 0 ? (
          <p className="vacio">No hay platos con “{consulta.trim()}”.</p>
        ) : (
          visibles.map((carta) => (
            <CartaBlock key={carta.id} carta={carta} onVer3d={setPlato3d} />
          ))
        )}
      </main>

      <footer className="aviso">
        <p className="aviso-kicker">Aviso importante</p>
        <h2>Buzón de quejas o sugerencias</h2>
        <a className="whatsapp" href={restaurante.whatsappUrl}>
          {restaurante.whatsapp}
        </a>
        <p>
          En este número puedes comentar la atención, la comida o las instalaciones. También
          leemos sugerencias.
        </p>
        <p className="redes-texto">
          Síguenos, comparte tu experiencia, etiquétanos y reclama tu chilcano gratis.
        </p>
        <div className="redes">
          <a href={restaurante.instagram}>Instagram</a>
          <a href={restaurante.tiktok}>TikTok</a>
          <a href={restaurante.facebook}>Facebook</a>
          <span>{restaurante.redes}</span>
        </div>
        <p className="pie">Carta actualizada · {restaurante.actualizacion}</p>
      </footer>
      <Visor3d plato={plato3d} onCerrar={() => setPlato3d(null)} />
    </>
  )
}
