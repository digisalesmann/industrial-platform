'use client';

import { AreaChart, Area, ResponsiveContainer, YAxis, Tooltip } from 'recharts';

const data = [
    { time: '00:00', val: 400 }, { time: '04:00', val: 300 },
    { time: '08:00', val: 500 }, { time: '12:00', val: 450 },
    { time: '16:00', val: 700 }, { time: '20:00', val: 600 },
];

export default function LiquidityChart() {
    return (
        <div className="h-48 w-full mt-8 opacity-50">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <Tooltip
                        contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a' }}
                        itemStyle={{ color: '#3b82f6', fontSize: '10px', fontFamily: 'monospace' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="val"
                        stroke="#3b82f6"
                        fillOpacity={1}
                        fill="url(#colorVal)"
                        strokeWidth={2}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}