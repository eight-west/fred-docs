/**
 * Tailwind config — biofred design system.
 *
 * Tokens here are the single source of truth for colors, type, easing, etc.
 * Prefer semantic Tailwind utilities (bg-canvas, text-primary, ease-brand)
 * over hex literals or inline styles.
 *
 * Naming conventions:
 *   - color keys and fontSize keys are kept disjoint so `text-*` is unambiguous
 *     (e.g. `text-primary` = color, `text-hero` = font-size).
 *   - dark backgrounds:   canvas (base) | surface (cards) | -deep (variant)
 *   - subtle borders:     edge | edge-strong | edge-soft | edge-soft-strong
 *   - foreground text:    primary | secondary | tertiary (+ -soft variants)
 *   - brand accent:       accent (green) | gold (highlight)
 *   - legacy brand greens (older button palette): brand, brand-deep, brand-dark
 *   - radius:             tag/btn/input (3.6px) | card (0) | pill (actions) — see DESIGN.md
 *
 * Spacing carries DESIGN.md's scale (5/7/14/18/…) under `s`-prefixed keys —
 * `p-s14`, `gap-s7`. The prefix is what keeps it from shadowing Tailwind's own
 * numeric keys and silently resizing every `p-5` in the app.
 */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                // dark backgrounds
                canvas: 'rgb(var(--c-canvas) / <alpha-value>)',
                'canvas-deep': 'rgb(var(--c-canvas-deep) / <alpha-value>)',
                surface: 'rgb(var(--c-surface) / <alpha-value>)',

                // Platform app chrome. Scoped separately from `canvas` so the
                // marketing pages, which are tuned for a near-black hero, keep
                // their own footing while the app stays readable for long
                // working sessions.
                'app-canvas': '#04100a',
                'app-surface': '#091810',
                'app-edge': 'rgba(122,199,146,0.26)',
                'app-edge-strong': 'rgba(122,199,146,0.42)',
                'app-tint': 'rgba(122,199,146,0.07)',
                'app-muted': 'rgba(236,244,235,0.82)',
                'app-faint': 'rgba(236,244,235,0.60)',
                'surface-deep': 'rgb(var(--c-surface-deep) / <alpha-value>)',
                'surface-raised': 'rgba(20,30,24,0.6)',

                // subtle borders / dividers
                edge: 'var(--c-edge)',
                'edge-strong': 'var(--c-edge-strong)',
                'edge-soft': 'var(--c-edge-soft)',
                'edge-soft-strong': 'var(--c-edge-soft-strong)',
                'edge-hover': 'var(--c-edge-hover)',
                'edge-hover-strong': 'var(--c-edge-hover-strong)',

                // faint wash behind hovered cards and ghost buttons
                'surface-tint': 'var(--c-surface-tint)',

                // foreground text
                primary: 'rgb(var(--c-primary) / <alpha-value>)',
                secondary: 'var(--c-secondary)',
                'secondary-soft': 'var(--c-secondary-soft)',
                'secondary-warm': 'var(--c-secondary-warm)',
                tertiary: 'var(--c-tertiary)',
                'tertiary-soft': 'var(--c-tertiary-soft)',

                // light surfaces (FRED's message card sits on the white chat panel)
                paper: 'rgb(var(--c-paper) / <alpha-value>)',
                'paper-tint': 'var(--c-paper-tint)',
                ink: 'rgb(var(--c-ink) / <alpha-value>)',
                'ink-soft': 'var(--c-ink-soft)',
                'ink-faint': 'var(--c-ink-faint)',
                rule: 'var(--c-rule)',
                'rule-strong': 'var(--c-rule-strong)',

                // brand accent (new palette)
                accent: 'rgb(var(--c-accent) / <alpha-value>)',

                // Mirrors --focus-ring in index.css. Chosen to clear 3:1 on
                // every surface token, light and dark; see the note there.
                focus: 'var(--focus-ring)',
                'accent-dim': 'var(--c-accent-dim)',
                'accent-faint': 'var(--c-accent-faint)',

                // The Beta mark on the wordmark. Its own token because the mark
                // has to hold up at 10px on the near-black hero, on the blog's
                // translucent bar and in the app chrome, which is more than the
                // general `edge` and `tertiary` values were tuned for.
                beta: 'rgb(var(--c-beta) / <alpha-value>)',
                'beta-edge': 'var(--c-beta-edge)',
                'beta-tint': 'var(--c-beta-tint)',

                // gold highlight
                gold: 'rgb(var(--c-gold) / <alpha-value>)',
                'gold-dim': 'var(--c-gold-dim)',
                'gold-bright': 'rgb(var(--c-gold-bright) / <alpha-value>)',
                'gold-ink': 'rgb(var(--c-gold-ink) / <alpha-value>)',

                // prose callouts and syntax literals
                warn: 'rgb(var(--c-warn) / <alpha-value>)',
                tip: 'rgb(var(--c-tip) / <alpha-value>)',
                danger: 'rgb(var(--c-danger) / <alpha-value>)',

                // legacy brand greens (older button palette, retained until full migration)
                brand: 'rgb(var(--c-brand) / <alpha-value>)',
                'brand-dark': '#2f4538',
                'brand-deep': 'rgb(var(--c-brand-deep) / <alpha-value>)',
            },
            fontFamily: {
                // body / UI default — also set on <body> in index.css so most
                // elements inherit Outfit without needing a className
                sans: [
                    'Outfit',
                    'system-ui',
                    '-apple-system',
                    'BlinkMacSystemFont',
                    'Segoe UI',
                    'Roboto',
                    'Helvetica Neue',
                    'sans-serif',
                ],
                mono: [
                    'JetBrains Mono',
                    'ui-monospace',
                    'SFMono-Regular',
                    'Menlo',
                    'monospace',
                ],
                serif: [
                    'DM Serif Display',
                    'Cormorant',
                    'Georgia',
                    'serif',
                ],
            },
            fontSize: {
                hero: 'clamp(44px, 6vw, 72px)',
                // The landing H1 is a full sentence, not a three-word slogan,
                // so it runs smaller than `hero` to stay inside four lines.
                headline: 'clamp(40px, 5vw, 64px)',
                display: 'clamp(32px, 4.2vw, 58px)',
                subheading: '29px',
                h3: '22px',
                lead: '18px',
                body: '18px',
                caption: '13px',
                'doc-h1': '34px',
                'doc-h2': '26px',
                'doc-h3': '19px',
                'doc-h4': '15px',
                'mono-label': '13px',
                // Small-caps tags (the Beta mark) — sits below mono-label so
                // the tag reads as an annotation, not a peer of the wordmark.
                'mono-micro': '10px',
                data: '48px',
            },
            lineHeight: {
                display: '0.9',
                headline: '1.02',
                heading: '1.06',
                subheading: '1.28',
                body: '1.62',
                caption: '1.2',
            },
            letterSpacing: {
                // Applied to all sans text, not just display — part of the brand voice.
                brand: '-0.03em',
            },
            borderRadius: {
                tag: '3.6px',
                btn: '3.6px',
                input: '3.6px',
                card: '0px',
                pill: '9999px',
                app: '12px',
                'app-sm': '8px',
                // The landing page's floating product pieces and its bands.
                panel: '20px',
                tile: '14px',
            },
            maxWidth: {
                content: '1200px',
            },
            // Prefixed so it does not shadow Tailwind's numeric scale.
            spacing: {
                s5: '5px',
                s7: '7px',
                s14: '14px',
                s18: '18px',
                s21: '21px',
                s29: '29px',
                s59: '59px',
                s86: '86px',
                s104: '104px',
                s119: '119px',
            },
            boxShadow: {
                float: 'var(--shadow-float)',
            },
            backgroundImage: {
                // Light falling on the hero and the closing band: accent from
                // the upper right, gold from the lower left, both on canvas.
                glow: 'radial-gradient(60% 70% at 78% 30%, rgba(74,222,128,0.16) 0%, rgba(74,222,128,0.04) 45%, transparent 70%), radial-gradient(45% 60% at 8% 95%, rgba(200,169,110,0.12) 0%, transparent 60%)',
                'glow-soft': 'radial-gradient(50% 80% at 85% 50%, rgba(74,222,128,0.09) 0%, transparent 70%)',
            },
            transitionTimingFunction: {
                brand: 'cubic-bezier(0.16, 1, 0.3, 1)',
            },
        },
    },
    plugins: [],
};
