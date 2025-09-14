import { ReactNode } from "react";
export default function ServiceCard({ title, badge, time, children, image }:{ title:string; badge:string; time:string; children?:ReactNode; image?:string }){
  return (
    <div className="card p-5 flex gap-4 items-center">
      {image && <img src={image} alt="service" className="h-20 w-20 rounded-xl object-cover"/>}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-lg">{title}</h3>
          <span className="text-xs rounded-full px-2 py-0.5 bg-[var(--mz-primary-blue)] text-white">{badge}</span>
        </div>
        <div className="text-sm text-gray-600">{time}</div>
        {children && <div className="mt-1 text-sm">{children}</div>}
      </div>
    </div>
  );
}
