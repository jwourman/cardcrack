import Link from "next/link";
import { BookOpen, Twitter, Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Card<span className="text-indigo-400">Crack</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              Premium flashcards and study packs for students who take their grades seriously.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="#" className="p-2 rounded-lg hover:bg-gray-800 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg hover:bg-gray-800 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg hover:bg-gray-800 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">Product</h4>
            <ul className="space-y-2">
              {[
                { href: "/decks", label: "Browse Decks" },
                { href: "/pricing", label: "Pricing" },
                { href: "/dashboard", label: "Dashboard" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Subjects */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">Top Subjects</h4>
            <ul className="space-y-2">
              {[
                "Accounting",
                "Finance",
                "Economics",
                "Marketing",
                "Statistics",
                "Personal Finance",
              ].map((s) => (
                <li key={s}>
                  <Link
                    href={`/decks?category=${s.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">Legal</h4>
            <ul className="space-y-2">
              {[
                { href: "/terms", label: "Terms of Service" },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/refund", label: "Refund Policy" },
                { href: "/contact", label: "Contact Us" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs">
            © {new Date().getFullYear()} CardCrack. All rights reserved.
          </p>
          <p className="text-xs">
            Built for students who mean business.
          </p>
        </div>
      </div>
    </footer>
  );
}
