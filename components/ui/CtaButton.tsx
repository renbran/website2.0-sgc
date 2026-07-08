import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  CSSProperties,
  ReactNode,
  Ref,
} from "react";

/**
 * CtaButton — the one brand-aligned CTA.
 *
 *   variant="primary"   → filled refined-gold gradient, dark text, full radius
 *   variant="secondary" → 1px gold hairline border, cyan text, full radius
 *
 * The radius (`rounded-full`) and the resting/focus styles are fixed so the
 * "signature CTA" stays consistent across the page. Use `tone="compact"` for
 * pill-sized CTAs (Navbar, award badges); the default size matches the
 * general site rhythm.
 *
 * `as="a"` (default) renders <a>. `as="button"` for <button> — same classes.
 *
 * For the desktop-only proximity glow that FounderSection used to enjoy,
 * wrap with ProximityCtaButton instead.
 */

type Variant = "primary" | "secondary";
type Tone = "default" | "compact";
type As = "a" | "button";

interface CommonProps {
  variant?: Variant;
  tone?: Tone;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  ref?: Ref<HTMLAnchorElement | HTMLButtonElement>;
}

type AnchorOnlyProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "className" | "style" | "children"
>;

type ButtonOnlyProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "className" | "style" | "children"
>;

export type CtaButtonProps =
  | (CommonProps & AnchorOnlyProps & { as?: "a" })
  | (CommonProps & ButtonOnlyProps & { as: "button" });

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full font-bold transition duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] disabled:opacity-60 disabled:cursor-not-allowed";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-gold-gradient text-[var(--bg)] hover:scale-[1.03] hover:shadow-[0_0_22px_rgba(199,162,58,0.35)]",
  secondary:
    "border border-[rgba(199,162,58,0.35)] text-[var(--sgc-cyan)] hover:border-[var(--accent)] hover:bg-[rgba(199,162,58,0.08)]",
};

const TONES: Record<Tone, string> = {
  default: "px-6 py-3 text-[0.9rem]",
  compact: "px-4 py-[14px] text-[13px] md:px-6 md:py-3",
};

function buildClassName(
  variant: Variant,
  tone: Tone,
  extra?: string,
): string {
  return [BASE, VARIANTS[variant], TONES[tone], extra].filter(Boolean).join(" ");
}

export default function CtaButton(props: CtaButtonProps) {
  const {
    variant = "primary",
    tone = "default",
    className,
    style,
    children,
    ref,
  } = props;

  const cls = buildClassName(variant, tone, className);

  if (props.as === "button") {
    const {
      as: _as,
      variant: _v,
      tone: _t,
      ref: _r,
      className: _cn,
      style: _s,
      children: _ch,
      ...rest
    } = props;
    void _as;
    void _v;
    void _t;
    void _r;
    void _cn;
    void _s;
    void _ch;
    return (
      <button
        ref={ref as Ref<HTMLButtonElement>}
        {...rest}
        className={cls}
        style={style}
      >
        {children}
      </button>
    );
  }

  const {
    as: _as,
    variant: _v,
    tone: _t,
    ref: _r,
    className: _cn,
    style: _s,
    children: _ch,
    ...rest
  } = props;
  void _as;
  void _v;
  void _t;
  void _r;
  void _cn;
  void _s;
  void _ch;
  return (
    <a
      ref={ref as Ref<HTMLAnchorElement>}
      {...rest}
      className={cls}
      style={style}
    >
      {children}
    </a>
  );
}