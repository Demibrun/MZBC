"use client";
import Image from "next/image";

const services = [
  {
    name:"HolyGhost Visitation Service",
    day:"Sundays",
    time:"8:15am",
    details:"Evangelism/Sunday School: 7:40–8:10am",
    imageUrl:"/uploads/sunday.jpg"
  },
  {
    name:"Deliverance & Miracle Hour",
    day:"Mondays",
    time:"11:30am",
    details:"Come expecting miracles",
    imageUrl:"/uploads/monday-deliverance.jpg"
  },
  {
    name:"Word Liberation Hour",
    day:"Wednesdays",
    time:"5:00pm",
    imageUrl:"/uploads/sunday.jpg",
  },
  {
    name:"Zion Breakthrough Night",
    day:"Last Fridays of the Month",
    time:"10:00pm",
    imageUrl:"/uploads/friday-breakthrough.jpg"
  }
];

export default function ServicesPage(){
  return (
    <section className="section py-12">
      <h2 className="h2">Services & Times</h2>

      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map(s=>(
          <article key={s.name} className="card">
            <div className="frame-16x9">
              <Image src={s.imageUrl} alt={s.name} fill className="object-cover"/>
            </div>
            <div className="p-5">
              <span className="chip">{s.day}</span>
              <h3 className="mt-2 text-xl font-semibold text-mz-deep">{s.name}</h3>
              <p className="text-mz-dark/70">{s.time}</p>
              {s.details && <p className="mt-2 text-sm text-mz-dark/70">{s.details}</p>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
