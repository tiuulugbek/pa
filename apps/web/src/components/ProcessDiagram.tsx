import { Gauge, Radio, Cpu, GitFork, MonitorCog, ArrowRight } from 'lucide-react';
import type { Locale } from '@pa/types';

interface Stage {
  icon: typeof Gauge;
  uz: string;
  ru: string;
  en: string;
}

const STAGES: Stage[] = [
  { icon: Gauge, uz: 'Sensorlar', ru: 'Датчики', en: 'Sensors' },
  { icon: Radio, uz: 'Transmitterlar', ru: 'Преобразователи', en: 'Transmitters' },
  { icon: Cpu, uz: 'PLK / DCS', ru: 'ПЛК / DCS', en: 'PLC / DCS' },
  { icon: GitFork, uz: 'Klapanlar', ru: 'Клапаны', en: 'Valves' },
  { icon: MonitorCog, uz: 'SCADA monitoring', ru: 'SCADA мониторинг', en: 'SCADA monitoring' },
];

/** Generic instrumentation signal chain — shows where field devices fit in a process. */
export function ProcessDiagram({ locale }: { locale: Locale }) {
  const label = (s: Stage) => (locale === 'ru' ? s.ru : locale === 'en' ? s.en : s.uz);
  return (
    <div className="overflow-x-auto rounded-2xl border border-blue-bg bg-white p-6">
      <div className="flex min-w-[640px] items-center justify-between gap-2">
        {STAGES.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="flex flex-col items-center text-center">
              <div className="grid h-14 w-14 place-items-center rounded-xl bg-blue-bg text-blue-dark">
                <s.icon className="h-7 w-7" />
              </div>
              <span className="mt-2 w-24 text-xs font-medium text-text-mid">{label(s)}</span>
            </div>
            {i < STAGES.length - 1 && <ArrowRight className="h-5 w-5 shrink-0 text-blue-accent" />}
          </div>
        ))}
      </div>
    </div>
  );
}
