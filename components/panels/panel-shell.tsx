import type { ReactNode } from "react";

type PanelShellProps = {
  title: string;
  kicker?: string;
  className: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function PanelShell({
  title,
  kicker,
  className,
  actions,
  children
}: PanelShellProps) {
  return (
    <section className={`panel ${className}`}>
      <div className="panel__header">
        <div>
          {kicker ? <p className="panel__kicker">{kicker}</p> : null}
          <h2>{title}</h2>
        </div>
        {actions}
      </div>
      <div className="panel__body">{children}</div>
    </section>
  );
}
