import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js';
import { useEffect, useRef } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Legend, Tooltip);

interface BreakdownChartProps {
  title: string;
  labels: string[];
  /** Single series: number[]. Multi-series (requires seriesLabels): number[][] */
  values: number[] | number[][];
  colors: string[];
  mode?: 'bar' | 'doughnut';
  /** When provided, values must be number[][] — one array per series label */
  seriesLabels?: string[];
  /** Enable stacked bars (only meaningful in bar mode with seriesLabels) */
  stacked?: boolean;
}

export default function BreakdownChart({
  title,
  labels,
  values,
  colors,
  mode = 'doughnut',
  seriesLabels,
  stacked = false,
}: BreakdownChartProps) {
  // Chart.js initialises before the browser has finished layout during
  // Astro hydration, which leaves the canvas at the default 300×150.
  // One rAF after mount guarantees the parent has its CSS dimensions.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chartRef = useRef<any>(null);
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      chartRef.current?.resize();
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const isMultiSeries = Array.isArray(seriesLabels) && seriesLabels.length > 0;

  const datasets = isMultiSeries
    ? (seriesLabels as string[]).map((label, i) => ({
        label,
        data: (values as number[][])[i] ?? [],
        backgroundColor: colors[i] ?? '#94a3b8',
        borderColor: '#fffdf8',
        borderWidth: 0,
        borderRadius: stacked ? 0 : 6,
      }))
    : [
        {
          label: title,
          data: values as number[],
          backgroundColor: colors,
          borderColor: '#fffdf8',
          borderWidth: mode === 'doughnut' ? 4 : 0,
          borderRadius: mode === 'bar' ? 10 : 0,
        },
      ];

  const data = { labels, datasets };

  return (
    <section className="rounded-[28px] border border-border/80 bg-surface-elevated p-5 shadow-[0_18px_40px_rgba(44,42,37,0.05)] sm:p-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">{title}</p>
      <div className="relative mt-4 h-[250px] sm:h-[320px]">
        {mode === 'doughnut' ? (
          <Doughnut
            ref={chartRef}
            data={data}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    usePointStyle: true,
                    boxWidth: 10,
                    padding: 12,
                    font: { size: 11 },
                    color: '#5c665f',
                  },
                },
              },
            }}
          />
        ) : (
          <Bar
            ref={chartRef}
            data={data}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              indexAxis: isMultiSeries ? 'x' : 'y',
              scales: {
                x: {
                  beginAtZero: true,
                  stacked: isMultiSeries && stacked,
                  grid: isMultiSeries ? { display: false } : { color: '#ece5d7' },
                  ticks: {
                    color: '#5c665f',
                    font: { size: 10 },
                    maxRotation: 45,
                  },
                },
                y: {
                  beginAtZero: true,
                  stacked: isMultiSeries && stacked,
                  grid: { color: '#ece5d7' },
                  ticks: { color: '#5c665f' },
                },
              },
              plugins: {
                legend: {
                  display: isMultiSeries,
                  position: 'bottom',
                  labels: {
                    usePointStyle: true,
                    boxWidth: 10,
                    padding: 12,
                    font: { size: 11 },
                    color: '#5c665f',
                  },
                },
              },
            }}
          />
        )}
      </div>
    </section>
  );
}
