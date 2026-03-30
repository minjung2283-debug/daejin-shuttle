export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')

  const { sx, sy, ex, ey } = req.query

  if (!sx || !sy || !ex || !ey) {
    return res.status(400).json({ error: 'Missing coordinates' })
  }

  const tmapKey = process.env.VITE_TMAP_KEY
  if (!tmapKey) {
    return res.status(500).json({ error: 'T-Map API key not configured' })
  }

  try {
    const response = await fetch('https://apis.openapi.sk.com/transit/routes', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'appKey': tmapKey,
      },
      body: JSON.stringify({
        startX: sx, startY: sy,
        endX: ex,   endY: ey,
        count: 1,
        lang: 0,
        format: 'json',
        searchDttm: new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().replace(/[-T:]/g, '').slice(0, 12),
      }),
    })

    const data = await response.json()
    console.log('[TMap raw]', JSON.stringify(data).slice(0, 800))

    if (data.error) {
      return res.status(200).json({ totalTime: null, _error: data.error })
    }

    const itineraries = data.metaData?.plan?.itineraries

    if (itineraries?.length > 0) {
      const best = itineraries.reduce((a, b) =>
        a.totalTime <= b.totalTime ? a : b
      )
      return res.status(200).json({ totalTime: Math.round(best.totalTime / 60) })
    }

    return res.status(200).json({ totalTime: null })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
