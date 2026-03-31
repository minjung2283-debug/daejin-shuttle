export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')

  const { query } = req.query
  if (!query) return res.status(400).json({ error: 'Missing query' })

  const kakaoKey = process.env.KAKAO_KEY
  if (!kakaoKey) return res.status(500).json({ error: 'Kakao API key not configured' })

  try {
    const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}&size=6`
    const response = await fetch(url, { headers: { Authorization: `KakaoAK ${kakaoKey}` } })
    const data = await response.json()

    const places = (data.documents || []).slice(0, 6).map(p => ({
      name: p.place_name,
      address: p.road_address_name || p.address_name || '',
      x: parseFloat(p.x),
      y: parseFloat(p.y),
    }))

    return res.status(200).json({ places })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
