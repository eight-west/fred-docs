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
                canvas: '#0a1410',
                'canvas-deep': '#060e06',
                surface: '#0E1814',
                'surface-deep': '#0B100D',
                'surface-raised': 'rgba(20,30,24,0.6)',

                // subtle borders / dividers
                edge: 'rgba(138,171,135,0.14)',
                'edge-strong': 'rgba(138,171,135,0.28)',
                'edge-soft': 'rgba(138,171,135,0.12)',
                'edge-soft-strong': 'rgba(138,171,135,0.25)',
                'edge-hover': 'rgba(138,171,135,0.3)',
                'edge-hover-strong': 'rgba(138,171,135,0.6)',

                // faint wash behind hovered cards and ghost buttons
                'surface-tint': 'rgba(138,171,135,0.04)',

                // foreground text
                primary: '#F5F0E6',
                secondary: 'rgba(245,240,230,0.68)',
                'secondary-soft': 'rgba(245,240,230,0.6)',
                'secondary-warm': 'rgba(245,240,230,0.65)',
                tertiary: 'rgba(245,240,230,0.42)',
                'tertiary-soft': 'rgba(245,240,230,0.4)',

                // brand accent (new palette)
                accent: '#4ADE80',
                'accent-dim': 'rgba(74,222,128,0.5)',
                'accent-faint': 'rgba(74,222,128,0.08)',

                // gold highlight
                gold: '#c8a96e',
                'gold-dim': 'rgba(200,169,110,0.6)',
                'gold-bright': '#d8bc84',
                'gold-ink': '#1a1408',

                // legacy brand greens (older button palette, retained until full migration)
                brand: '#395442',
                'brand-dark': '#2f4538',
                'brand-deep': '#0B180A',
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
                data: '48px',
            },
            lineHeight: {
                display: '0.9',
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
            transitionTimingFunction: {
                brand: 'cubic-bezier(0.16, 1, 0.3, 1)',
            },
        },
    },
    plugins: [],
};
