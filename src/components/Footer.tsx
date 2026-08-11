export function Footer() {
  return (
    <footer className="mt-10 border-t border-[var(--border)] pt-6 pb-10 text-xs text-[var(--text-muted)]">
      <p>
        Dados de COVID-19: <span className="text-[var(--text-secondary)]">disease.sh</span>.
        Dados de dengue, zika e chikungunya:{" "}
        <span className="text-[var(--text-secondary)]">
          InfoDengue / Fiocruz
        </span>
        .
      </p>
      <p className="mt-1">
        Este painel tem fins informativos e não substitui orientação médica ou
        dos órgãos oficiais de saúde.
      </p>
    </footer>
  );
}
