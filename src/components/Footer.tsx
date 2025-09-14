export default function Footer(){
  return (
    <footer className="mt-16 border-t bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 grid gap-6 md:grid-cols-3 text-sm">
        <div>
          <div className="font-semibold">Mount Zion Bible Church Nigeria</div>
          <div>“Zion, where captives become captains.”</div>
          <div className="mt-2">© {new Date().getFullYear()} MZBC. All rights reserved.</div>
        </div>
        <div>
          <div className="font-semibold">Quick Links</div>
          <ul className="mt-2 space-y-1">
            <li><a href="#services">Service Times</a></li>
            <li><a href="#media">Media</a></li>
            <li><a href="#visit">Visit Us</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold">Privacy</div>
          <p className="mt-2">We respect your privacy. Contact form uses a honeypot.</p>
        </div>
      </div>
    </footer>
  );
}
