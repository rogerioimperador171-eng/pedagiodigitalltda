import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";

import heroBg from "@/assets/hero-bg.jpg";
import logoMark from "@/assets/logo-mark.png";
import qrCode from "@/assets/qrcode.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pedágio Digital — Consulte débitos pela placa" },
      {
        name: "description",
        content:
          "Consulte débitos de pedágio pela placa do seu veículo e ative seu plano digital com 1 mês grátis.",
      },
      { property: "og:title", content: "Pedágio Digital — Consulte débitos pela placa" },
      {
        property: "og:description",
        content:
          "Uma nova era para o pedágio começou: ágil e digital. Consulte sua placa e ative o plano gratuito.",
      },
    ],
  }),
  component: Index,
});

const PLAN_KEY = "pedagio-digital-plan-start";
const MONTH_MS = 30 * 24 * 60 * 60 * 1000;

function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  return (
    <div className="flex items-center gap-3">
      <img
        src={logoMark}
        alt="Pedágio Digital"
        width={586}
        height={436}
        className={size === "lg" ? "h-12 w-auto" : "h-10 w-auto"}
      />

      <span
        className={`font-extrabold leading-[0.95] tracking-tight ${
          size === "lg" ? "text-2xl" : "text-xl"
        }`}
      >
        Pedágio
        <br />
        Digital
      </span>
    </div>
  );
}

function Index() {
  const [plate, setPlate] = useState("");
  const [foreign, setForeign] = useState(false);
  const [terms, setTerms] = useState(false);
  const [robot, setRobot] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);

  const plateValid = useMemo(() => {
    const v = plate.replace(/[^A-Z0-9]/g, "");
    if (foreign) return v.length >= 4;
    return /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(v);
  }, [plate, foreign]);

  const canSubmit = plateValid && terms;

  function handleSubmit() {
    if (!canSubmit) return;
    const clean = plate.replace(/[^A-Z0-9]/g, "");
    const code = `PD${clean}${String(Math.floor(1000 + Math.random() * 8999))}BR`;
    setResult(code);
    if (typeof window !== "undefined" && !localStorage.getItem(PLAN_KEY)) {
      localStorage.setItem(PLAN_KEY, String(Date.now()));
    }
  }

  useEffect(() => {
    if (result) resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [result]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden">
        <img
          src={heroBg}
          alt=""
          width={1024}
          height={1536}
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/70 to-background" />

        <div className="relative px-5 pb-10 pt-7">
          <header className="flex items-start justify-between gap-4">
            <Logo />
            <button
              type="button"
              aria-label="Abrir menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
              className="shrink-0 rounded-xl border border-foreground/70 p-3 transition-colors hover:bg-foreground/10"
            >
              <span className="block h-0.5 w-6 bg-foreground" />
              <span className="mt-1.5 block h-0.5 w-6 bg-foreground" />
              <span className="mt-1.5 block h-0.5 w-6 bg-foreground" />
            </button>
          </header>

          {menuOpen && (
            <nav className="mt-4 rounded-2xl border border-border bg-card/95 p-2 backdrop-blur">
              {["Início", "Como funciona", "Planos", "Ajuda"].map((item) => (
                <a
                  key={item}
                  href="#consulta"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm font-semibold text-card-foreground transition-colors hover:bg-secondary"
                >
                  {item}
                </a>
              ))}
            </nav>
          )}

          <h1 className="mt-16 text-[2rem] font-extrabold uppercase leading-[1.15] tracking-[0.08em]">
            Desfrute de toda a comodidade do pedágio{" "}
            <span className="text-primary">digital</span>
          </h1>
          <p className="mt-5 text-base text-foreground/85">
            Uma nova era para o pedágio começou: ágil e digital como tem que ser.
          </p>

          <div
            id="consulta"
            className="mt-6 rounded-3xl bg-panel p-6 text-panel-foreground shadow-[var(--shadow-panel)]"
          >
            <h2 className="text-2xl leading-snug">
              Informe uma <strong className="font-extrabold">placa</strong> válida para consultar:
            </h2>

            <input
              value={plate}
              onChange={(e) => setPlate(e.target.value.toUpperCase().slice(0, 8))}
              placeholder="DIGITE SUA PLACA"
              inputMode="text"
              autoComplete="off"
              aria-label="Placa do veículo"
              className="mt-5 w-full rounded-2xl bg-panel-input px-5 py-5 text-lg font-bold tracking-[0.15em] text-panel-foreground outline-none ring-primary/70 placeholder:font-bold placeholder:text-panel-muted focus:ring-2"
            />

            <div
              onClick={() => setForeign(!foreign)}
              className="mt-5 flex cursor-pointer items-center gap-3 text-[0.95rem]"
            >
              <Check checked={foreign} onChange={setForeign} label="Minha placa é estrangeira" />
              <span>Minha placa é estrangeira (opcional)</span>
            </div>

            <div
              onClick={() => setTerms(!terms)}
              className="mt-4 flex cursor-pointer items-start gap-3 text-[0.95rem] leading-snug"
            >
              <Check checked={terms} onChange={setTerms} label="Aceito os termos" />
              <span>
                Li e concordo com os <em className="underline">Termos de uso</em> e{" "}
                <em className="underline">Políticas de Privacidade</em> da plataforma Pedágio
                Digital.
              </span>
            </div>


            <button
              type="button"
              onClick={() => setRobot((r) => !r)}
              className="mt-5 flex w-full items-center gap-4 rounded-md border border-panel-muted/40 bg-panel-input px-4 py-4 text-left"
            >
              <span
                className={`grid h-7 w-7 shrink-0 place-items-center border-2 ${
                  robot ? "border-primary bg-primary" : "border-panel-muted bg-white"
                }`}
              >
                {robot && (
                  <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
                    <path
                      d="M4 10.5l4 4 8-9"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-panel-foreground"
                    />
                  </svg>
                )}
              </span>
              <span className="min-w-0 flex-1 text-base">Não sou um robô</span>
              <span className="shrink-0 text-center text-[0.6rem] font-semibold tracking-wide text-panel-muted">
                <svg viewBox="0 0 24 24" className="mx-auto h-6 w-6" aria-hidden="true">
                  <path
                    d="M20 12a8 8 0 1 1-2.34-5.66M20 4v4h-4"
                    fill="none"
                    stroke="#4285f4"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                reCAPTCHA
              </span>
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="mt-6 w-full rounded-2xl bg-primary px-6 py-5 text-lg font-semibold text-primary-foreground transition-opacity disabled:cursor-not-allowed disabled:bg-panel-muted/35 disabled:text-white"
            >
              Buscar débitos
            </button>
          </div>
        </div>
      </section>

      {result && <PlanResult code={result} plate={plate} ref={resultRef} />}

      <Footer />
    </main>
  );
}

function Check({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg border-2 transition-colors ${
        checked ? "border-primary bg-primary" : "border-panel-muted bg-panel-input"
      }`}
    >
      {checked && (
        <svg viewBox="0 0 20 20" className="h-4 w-4 text-primary-foreground" aria-hidden="true">
          <path
            d="M4 10.5l4 4 8-9"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}

function useCountdown() {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const start = Number(localStorage.getItem(PLAN_KEY) ?? Date.now());
    const tick = () => setLeft(Math.max(0, start + MONTH_MS - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (left === null) return null;
  const s = Math.floor(left / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

function PlanResult({
  code,
  plate,
  ref,
}: {
  code: string;
  plate: string;
  ref: React.Ref<HTMLDivElement>;
}) {
  const time = useCountdown();
  const [copied, setCopied] = useState(false);
  const [renewMsg, setRenewMsg] = useState(false);


  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section ref={ref} className="scroll-mt-4 px-5 pb-12">
      <div className="rounded-3xl border border-border bg-card p-6 text-card-foreground">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          Placa {plate.toUpperCase()}
        </p>
        <h2 className="mt-2 text-xl font-extrabold leading-snug">
          Apresente o código do QR Code ou o código abaixo
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Mostre no guichê ou na cancela para liberar sua passagem.
        </p>

        <div className="mt-6 rounded-2xl bg-white p-4">
          <img
            src={qrCode}
            alt="QR Code de acesso ao pedágio digital"
            width={640}
            height={640}
            loading="lazy"
            className="mx-auto h-56 w-56 object-contain"
          />
        </div>

        <div className="mt-5 rounded-2xl border border-dashed border-primary/60 bg-secondary px-4 py-4 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Seu código</p>
          <p className="mt-2 break-all text-2xl font-extrabold tracking-[0.12em] text-primary">
            {code}
          </p>
          <button
            type="button"
            onClick={copy}
            className="mt-3 rounded-full border border-border px-5 py-2 text-sm font-semibold transition-colors hover:bg-muted"
          >
            {copied ? "Código copiado" : "Copiar código"}
          </button>
        </div>

        <div className="mt-7 rounded-2xl bg-secondary p-5">
          <p className="text-sm font-semibold">Seu plano gratuito de 1 mês termina em:</p>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {[
              ["Dias", time?.days],
              ["Horas", time?.hours],
              ["Min", time?.minutes],
              ["Seg", time?.seconds],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-xl bg-card px-1 py-3 text-center">
                <p className="text-2xl font-extrabold tabular-nums text-primary">
                  {value === undefined || value === null
                    ? "--"
                    : String(value).padStart(2, "0")}
                </p>
                <p className="mt-1 text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-primary/40 p-5 text-center">
          <p className="text-sm text-muted-foreground">A partir do segundo mês</p>
          <p className="mt-1 text-3xl font-extrabold">R$ 500,00</p>
          <p className="mt-1 text-xs text-muted-foreground">Cobrança mensal, cancele quando quiser.</p>
          <button
            type="button"
            onClick={() => setRenewMsg(true)}
            className="mt-4 w-full rounded-2xl bg-primary px-6 py-4 text-base font-semibold text-primary-foreground"
          >
            Renovar plano
          </button>
          {renewMsg && (
            <p
              role="status"
              className="mt-4 rounded-xl border border-primary/50 bg-secondary px-4 py-3 text-sm leading-snug"
            >
              Para renovar seu plano, entre em contato com o suporte do Pedágio Digital.
            </p>
          )}
        </div>

      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-footer px-6 py-10 text-center">
      <div className="flex justify-center">
        <Logo size="lg" />
      </div>

      <div className="mt-7 flex items-center justify-center gap-5 text-muted-foreground">
        <a href="#consulta" aria-label="LinkedIn" className="transition-colors hover:text-foreground">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
            <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.75V21h-4v-5.6c0-1.34-.02-3.06-1.9-3.06-1.9 0-2.2 1.45-2.2 2.96V21H9z" />
          </svg>
        </a>
        <a href="#consulta" aria-label="Instagram" className="transition-colors hover:text-foreground">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-8 w-8">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
          </svg>
        </a>
      </div>

      <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
        Inovap 5 Administração e Participações
        <br />
        LTDA - 11.964.190/0001-83
      </p>

      <div className="mt-7 flex items-center justify-center gap-6 text-foreground/85">
        <span className="flex items-center gap-1.5 text-2xl font-extrabold tracking-tight">
          <svg viewBox="0 0 40 24" className="h-6 w-9" fill="currentColor" aria-hidden="true">
            <path d="M2 22 10 2h5L7 22zM12 22 20 2h5l-8 20zM22 22 30 2h5l-8 20z" />
          </svg>
          motiva
        </span>
        <span className="relative text-2xl font-semibold tracking-tight">
          <svg
            viewBox="0 0 24 10"
            className="absolute -top-3 right-0 h-3 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <path d="M1 7c4-6 8 2 12-2s6 0 10-2" />
          </svg>
          ecorodovias
        </span>
      </div>
    </footer>
  );
}
