'use client'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency, formatSeeds, formatDateShort } from '@/lib/utils/format'
import type { StockHistoryPoint } from '@/lib/supabase/types'

interface Props {
  data: StockHistoryPoint[]
  isTeen: boolean
  color?: string
}

export default function PortfolioChart({ data, isTeen, color = '#2D6A4F' }: Props) {
  if (!data.length) {
    return (
      <div className="h-48 flex items-center justify-center bg-bark-50 rounded-2xl">
        <p className="text-bark-400 text-sm">No chart data yet</p>
      </div>
    )
  }

  const first = data[0].close
  const last  = data[data.length - 1].close
  const isUp  = last >= first
  const chartColor = isUp ? '#2D6A4F' : '#DC2626'

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={chartColor} stopOpacity={0.15} />
              <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tickFormatter={d => formatDateShort(d)}
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis hide domain={['auto', 'auto']} />
          <Tooltip
            contentStyle={{ background: '#fff', border: '1px solid #E5DFD0', borderRadius: 12, fontSize: 12 }}
            formatter={(val: number) => [isTeen ? formatCurrency(val) : formatSeeds(val), 'Price']}
            labelFormatter={d => formatDateShort(d)}
          />
          <Area
            type="monotone"
            dataKey="close"
            stroke={chartColor}
            strokeWidth={2}
            fill="url(#chartGrad)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
