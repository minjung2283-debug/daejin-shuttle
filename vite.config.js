import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'url'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      {
        name: 'api-transit',
        configureServer(server) {
          server.middlewares.use('/api/transit', async (req, res) => {
            const url = new URL(req.url, 'http://localhost')
            const sx = url.searchParams.get('sx')
            const sy = url.searchParams.get('sy')
            const ex = url.searchParams.get('ex')
            const ey = url.searchParams.get('ey')
            const odsayKey = env.VITE_ODSAY_KEY

            try {
              const apiUrl =
                `https://api.odsay.com/v1/api/searchPubTransPathT` +
                `?SX=${sx}&SY=${sy}&EX=${ex}&EY=${ey}` +
                `&apiKey=${encodeURIComponent(odsayKey)}`
              const response = await fetch(apiUrl)
              const data = await response.json()

              let totalTime = null
              if (data.result?.path?.length > 0) {
                const best = data.result.path.reduce((a, b) =>
                  a.info.totalTime <= b.info.totalTime ? a : b
                )
                totalTime = best.info.totalTime
              }

              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ totalTime }))
            } catch (e) {
              res.statusCode = 500
              res.end(JSON.stringify({ error: e.message }))
            }
          })
        },
      },
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
