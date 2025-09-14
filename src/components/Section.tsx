import { ReactNode } from "react";
export default function Section({ id, title, subtitle, children }:{ id?:string; title:string; subtitle?:string; children:ReactNode }){
  return (
    <section id={id} className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-[var(--mz-deep-blue)]">{title}</h2>
      {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}
