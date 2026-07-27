"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
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
    when: "Evangelism/Sunday School: 7:40-8:10am - Service from 8:15am",
    image: "/uploads/sunday.jpg",
  },
  {
    title: "Deliverance & Miracle Hour",
    when: "Mondays - 11:30am",
    image: "/uploads/monday-deliverance.jpg",
    note: "Come expecting miracles",
  },
  {
    title: "Word Liberation Hour",
    when: "Wednesdays - 5:00pm",
    image: "/uploads/wednesday-word.jpg",
  },
  {
    title: "Zion Breakthrough Night",
    when: "Last Friday - 10:00pm",
    image: "/uploads/friday-breakthrough.jpg",
  },
];

export default function ServicesSection({ compact = false }: Props) {
  const list = compact ? services.slice(0, 3) : services;

  return (
    <section id="services" className="section">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-kicker">Gather with us</p>
          <h2 className="h2 mt-2">Services & Times</h2>
          <p className="section-subtitle">
            Weekly worship, prayer, deliverance, and word meetings for the whole family.
          </p>
        </div>
        {!compact && (
          <Link href="/services" className="btn-primary">
            See more
          </Link>
        )}
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((s) => (
          <Card key={s.title} className="card">
            <div className="relative h-44 w-full">
              <Image src={s.image} alt={s.title} fill className="object-cover" />
            </div>
            <CardHeader>
              <CardTitle className="text-lg text-[var(--mz-deep-blue)]">
                {s.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--mz-dark)]/80">{s.when}</p>
              {s.note && (
                <span className="mt-3 inline-block rounded-full bg-[var(--mz-green)]/10 px-2.5 py-1 text-xs font-semibold text-[var(--mz-green)]">
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
