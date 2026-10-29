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
    container: 'border-warn/25 bg-warn/[0.06]',
    dot: 'bg-warn',
    label: 'CAUTION',
  },
  tip: {
    container: 'border-tip/25 bg-tip/[0.06]',
    dot: 'bg-tip',
    label: 'TIP',
  },
  danger: {
    container: 'border-danger/25 bg-danger/[0.06]',
    dot: 'bg-danger',
    label: 'WARNING',
  },
};

const CALLOUT_LABEL_COLORS: Record<CalloutKind, string> = {
  info: 'text-accent',
  warn: 'text-warn',
  tip: 'text-tip',
  danger: 'text-danger',
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
      className={`my-6 rounded-tile border px-5 py-4 text-sm leading-relaxed text-primary ${styles.container}`}
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
