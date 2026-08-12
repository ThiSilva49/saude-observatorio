import { Database, ShieldAlert } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-4 border-t border-[var(--border)] pt-6 pb-10">
      <div className="flex flex-col gap-3 text-xs text-[var(--text-muted)] sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-2">
          <Database size={15} strokeWidth={2} className="mt-0.5 shrink-0" aria-hidden />
          <p className="max-w-md">
            Dengue: <span className="text-[var(--text-secondary)]">InfoDengue / Fiocruz</span>.{" "}
            COVID-19: <span className="text-[var(--text-secondary)]">disease.sh</span>. Tuberculose,
            HIV/Aids, sífilis, diabetes, hipertensão, obesidade, saúde mental e câncer:{" "}
            <span className="text-[var(--text-secondary)]">dados ilustrativos</span>, integração
            planejada com DATASUS/SINAN e Ministério da Saúde.
          </p>
        </div>
        <div className="flex items-start gap-2">
          <ShieldAlert size={15} strokeWidth={2} className="mt-0.5 shrink-0" aria-hidden />
          <p className="max-w-sm">
            Projeto pessoal e independente, sem vínculo com órgãos públicos. Fins
            informativos — não substitui orientação médica ou dados oficiais de
            vigilância epidemiológica.
          </p>
        </div>
      </div>
    </footer>
  );
}
