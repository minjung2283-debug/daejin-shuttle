// 카카오 장소 검색
export async function searchKakaoPlace(query, kakaoKey) {
  const res = await fetch(
    `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}&size=6`,
    { headers: { Authorization: `KakaoAK ${kakaoKey}` } }
  )
  const data = await res.json()
  return (data.documents || []).slice(0, 6).map(p => ({
    name: p.place_name,
    address: p.road_address_name || p.address_name || '',
    x: parseFloat(p.x),
    y: parseFloat(p.y),
  }))
}

// T-Map 대중교통 경로 (대진대 → 목적지) — 정확한 대기시간 포함
export async function fetchTmapTransit(origin, dest) {
  try {
    const url =
      `/api/transit-tmap` +
      `?sx=${origin.x}&sy=${origin.y}` +
      `&ex=${dest.x}&ey=${dest.y}`
    const res = await fetch(url)
    const data = await res.json()
    return data.totalTime ?? null
  } catch {
    return null
  }
}

// ODsay 대중교통 경로 (하차역 → 목적지) — 서버리스 프록시를 통해 호출
export async function fetchOdsayTransit(origin, dest) {
  try {
    const url =
      `/api/transit` +
      `?sx=${origin.x}&sy=${origin.y}` +
      `&ex=${dest.x}&ey=${dest.y}`
    const res = await fetch(url)
    const data = await res.json()
    return data.totalTime ?? null
  } catch {
    return null
  }
}
