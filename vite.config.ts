import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

const raiz = path.dirname(fileURLToPath(import.meta.url))
const clave = path.join(raiz, '.certs', 'dev.key')
const certificado = path.join(raiz, '.certs', 'dev.crt')
const httpsLocal =
  fs.existsSync(clave) && fs.existsSync(certificado)
    ? {
        key: fs.readFileSync(clave),
        cert: fs.readFileSync(certificado),
      }
    : undefined

function tipoUsdz(): Plugin {
  return {
    name: 'tipo-usdz',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const ruta = decodeURIComponent((req.url ?? '').split('?')[0])
        if (!ruta.endsWith('.usdz')) return next()
        const relativo = ruta.replace(/^\/+/, '')
        const publico = path.resolve(server.config.publicDir)
        const archivo = path.resolve(publico, relativo)
        if (!archivo.startsWith(publico + path.sep)) return next()
        if (!fs.existsSync(archivo) || !fs.statSync(archivo).isFile()) return next()
        const stat = fs.statSync(archivo)
        res.writeHead(200, {
          'Content-Type': 'model/vnd.usdz+zip',
          'Content-Length': stat.size,
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'no-cache',
        })
        fs.createReadStream(archivo).pipe(res)
      })
    },
  }
}

export default defineConfig({
  plugins: [tipoUsdz(), react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    https: httpsLocal,
  },
})
