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

  return (
    <div>
      {/* 목적지 + 대중교통만 소요시간 */}
        <div className="flex items-center gap-1.5 mt-3 py-2.5">
          <span className="text-[12px] text-slate-400">대중교통만 이용 시 소요 시간</span>
          <span className="font-bold text-[12px] text-slate-400">
            {pureTransitMin !== null ? fmtDur(pureTransitMin) : '경로 없음'}
          </span>
        </div>

      {results.slice(0, 6).map((r, i) => (
        <RouteCard
          key={r.route.id}
          result={r}
          destPlace={destPlace}
          index={i}
        />
      ))}
    </div>
  )
}
