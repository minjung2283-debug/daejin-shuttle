import RouteCard from './RouteCard'
import { fmtDur } from '../utils/time'

export default function ResultList({ results, destPlace, loading, pureTransitMin }) {
  if (loading) return (
    <div className="text-center py-10">
      <div className="w-9 h-9 border-[3px] border-blue-100 border-t-blue-500 rounded-full mx-auto mb-3.5"
        style={{ animation: 'spin 0.7s linear infinite' }} />
      <p className="text-[13px] text-slate-400 leading-relaxed">
        셔틀 시간표 분석 중…<br />ODsay 대중교통 경로 계산 중…
      </p>
    </div>
  )

  if (!results) return null

  if (results.length === 0) return (
    <div className="text-center py-9 text-slate-400">
      <div className="text-4xl mb-2.5">😔</div>
      <p className="text-[13px] leading-relaxed">이용 가능한 셔틀이 없습니다.</p>
    </div>
  )

  const bestTotal = results.find(r => r.total !== null)?.total ?? null

  return (
    <div>
      <div className="flex items-center justify-between mt-5 mb-3">
        <span className="text-xs text-slate-400 font-medium">경로 비교 ({results.length}개 노선)</span>
        <span className="text-[13px] font-bold text-slate-800">📍 {destPlace?.name}</span>
      </div>

      {/* 대중교통 비교 배너 */}
      {pureTransitMin !== null && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 mb-3">
          <div className="text-[11px] text-slate-400 mb-2 font-medium">이동 수단 비교</div>
          <div className="flex gap-2">
            <div className="flex-1 bg-white border border-slate-200 rounded-lg py-2.5 text-center">
              <div className="text-[10px] text-slate-400 mb-1">🚌 대중교통만</div>
              <div className="font-mono font-bold text-[18px] text-slate-700">{fmtDur(pureTransitMin)}</div>
            </div>
            <div className="flex items-center text-slate-300 text-sm font-light">vs</div>
            <div className={`flex-1 rounded-lg py-2.5 text-center border ${bestTotal !== null && bestTotal < pureTransitMin ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-200'}`}>
              <div className="text-[10px] text-slate-400 mb-1">🎫 셔틀 최적</div>
              <div className={`font-mono font-bold text-[18px] ${bestTotal !== null && bestTotal < pureTransitMin ? 'text-blue-600' : 'text-slate-700'}`}>
                {bestTotal !== null ? fmtDur(bestTotal) : '?'}
              </div>
            </div>
          </div>
          {bestTotal !== null && pureTransitMin !== null && (
            <div className="mt-2 text-center text-[11px]">
              {bestTotal < pureTransitMin
                ? <span className="text-blue-500 font-semibold">셔틀 이용 시 {fmtDur(pureTransitMin - bestTotal)} 단축 🚀</span>
                : bestTotal === pureTransitMin
                  ? <span className="text-slate-400">대중교통과 소요시간 동일</span>
                  : <span className="text-slate-400">대중교통이 {fmtDur(bestTotal - pureTransitMin)} 빠름</span>
              }
            </div>
          )}
        </div>
      )}

      {results.slice(0, 6).map((r, i) => (
        <RouteCard
          key={r.route.id}
          result={r}
          destPlace={destPlace}
          isBest={i === 0 && r.total !== null}
          index={i}
          pureTransitMin={pureTransitMin}
        />
      ))}

      <div className="bg-red-50 border border-red-200 rounded-xl px-3.5 py-3 text-[11px] text-red-600 leading-relaxed mt-3">
        ⚠️ <strong className="text-red-600">노쇼 페널티</strong> — 출발 5분 전까지 미탑승 시 자동 예약 취소.
        출발 30분 내 취소 시 요금 50% 차감, 출발 후 취소 시 100% 차감.
      </div>
    </div>
  )
}
