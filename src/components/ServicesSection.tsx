// src/components/ServicesSection.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  /** show a smaller set on the home page */
  compact?: boolean;
};

type Service = {
  title: string;
  when: string;
  image: string;
  note?: string;
};

const services: Service[] = [
    {
    title: "HolyGhost Visitation Service",
    when: "Evangelism/Sunday School: 7:40–8:10am • Service: from 8:15am",
    image: "/uploads/sunday.jpg",
 },
 {
    title: "Deliverance & Miracle Hour",
    when: "Mondays • 11:30am",
    image: "/uploads/monday-deliverance.jpg",
    note: "Come expecting miracles",
  },
  {
    title: "Word Liberation Hour",
    when: "Wednesdays • 5:00pm",
    image: "/uploads/wednesday-word.jpg",
  },
  {
    title: "Zion Breakthrough Night",
    when: "Last Friday • 10:00pm",
    image: "/uploads/friday-breakthrough.jpg",
  },
  
];

export default function ServicesSection({ compact = false }: Props) {
  const list = compact ? services.slice(0, 3) : services;

  return (
    <section id="services" className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex items-end justify-between">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--mz-deep-blue)]">
          Services & Times
        </h2>
        {!compact && (
          <Link href="/services" className="text-sm underline">
            See more
          </Link>
        )}
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((s) => (
          <Card key={s.title} className="overflow-hidden">
            <div className="relative h-40 w-full">
              <Image src={s.image} alt={s.title} fill className="object-cover" />
            </div>
            <CardHeader>
              <CardTitle className="text-[var(--mz-deep-blue)]">{s.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--mz-dark)]/80">{s.when}</p>
              {s.note && (
                <span className="mt-2 inline-block rounded bg-[var(--mz-green)]/10 px-2 py-1 text-xs text-[var(--mz-green)]">
                  {s.note}
                </span>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
