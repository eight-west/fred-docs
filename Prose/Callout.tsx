import { ReactNode } from 'react';

type CalloutKind = 'info' | 'warn' | 'tip' | 'danger';

// Each callout variant compiles to a fixed set of Tailwind classes so the JIT
// can pick them up. (Concatenating dynamic class fragments at runtime would
// not work.)
const CALLOUT_STYLES: Record<
  CalloutKind,
  { container: string; dot: string; label: string }
> = {
  info: {
    container: 'border-accent/25 bg-accent/[0.05]',
    dot: 'bg-accent',
    label: 'NOTE',
  },
  warn: {
    container: 'border-[rgba(250,199,117,0.25)] bg-[rgba(250,199,117,0.05)]',
    dot: 'bg-[#FAC775]',
    label: 'CAUTION',
  },
  tip: {
    container: 'border-[rgba(159,225,203,0.25)] bg-[rgba(159,225,203,0.05)]',
    dot: 'bg-[#9FE1CB]',
    label: 'TIP',
  },
  danger: {
    container: 'border-[rgba(244,144,144,0.25)] bg-[rgba(244,144,144,0.05)]',
    dot: 'bg-[#F49090]',
    label: 'WARNING',
  },
};

const CALLOUT_LABEL_COLORS: Record<CalloutKind, string> = {
  info: 'text-accent',
  warn: 'text-[#FAC775]',
  tip: 'text-[#9FE1CB]',
  danger: 'text-[#F49090]',
};

export function Callout({
  kind = 'info',
  children,
}: {
  kind?: CalloutKind;
  children: ReactNode;
}) {
  const styles = CALLOUT_STYLES[kind];
  return (
    <div
      className={`my-5 rounded-btn border px-4 py-3.5 text-sm leading-relaxed text-primary ${styles.container}`}
    >
      <div
        className={`mb-1.5 flex items-center gap-2 font-mono text-[10px] tracking-[0.12em] ${CALLOUT_LABEL_COLORS[kind]}`}
      >
        <span className={`block h-1.5 w-1.5 rounded-full ${styles.dot}`} />
        {styles.label}
      </div>
      <div>{children}</div>
    </div>
  );
}

/* ---------------------------------------------------------------- ParamTable */
