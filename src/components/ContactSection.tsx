"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Github, Linkedin, Lock, Mail, Send } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import { PROFILE_DATA } from "@/data/seed";
import { useReveal } from "@/hooks/useReveal";

export function ContactSection() {
  const { sendContactMessage } = usePortfolio();
  const { ref, visible } = useReveal<HTMLElement>(0.08);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Enter your name, email address, and message before sending.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address (for example, name@company.com).");
      return;
    }

    await sendContactMessage({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim() || "Portfolio inquiry",
      message: message.trim(),
    });

    setSubmitted(true);
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  };

  return (
    <footer
      id="contact"
      ref={ref}
      className={`border-t border-hairline bg-panel/60 reveal-section ${
        visible ? "is-visible" : ""
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Direct Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <h2 className="font-mono text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                Get in Touch
              </h2>
              <p className="text-base text-muted leading-relaxed">
                Open to junior Full Stack / React Developer roles, Data Analyst
                opportunities, and collaborative projects in Manila or remote.
              </p>
            </div>

            <div className="space-y-3">
              <a
                href={`mailto:${PROFILE_DATA.email}`}
                className="flex items-center gap-3 p-3.5 rounded-md bg-panel border border-hairline hover:border-code/50 transition-colors group"
              >
                <span className="p-2 rounded-xs bg-code/10 text-code">
                  <Mail className="w-4 h-4" />
                </span>
                <div>
                  <div className="font-mono text-xs text-muted">Email</div>
                  <div className="font-mono text-sm text-ink group-hover:text-code transition-colors">
                    {PROFILE_DATA.email}
                  </div>
                </div>
              </a>

              <a
                href={PROFILE_DATA.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3.5 rounded-md bg-panel border border-hairline hover:border-code/50 transition-colors group"
              >
                <span className="p-2 rounded-xs bg-elevated text-ink">
                  <Github className="w-4 h-4" />
                </span>
                <div>
                  <div className="font-mono text-xs text-muted">GitHub</div>
                  <div className="font-mono text-sm text-ink group-hover:text-code transition-colors">
                    github.com/MjComia
                  </div>
                </div>
              </a>

              <a
                href={PROFILE_DATA.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3.5 rounded-md bg-panel border border-hairline hover:border-data/50 transition-colors group"
              >
                <span className="p-2 rounded-xs bg-data/10 text-data">
                  <Linkedin className="w-4 h-4" />
                </span>
                <div>
                  <div className="font-mono text-xs text-muted">LinkedIn</div>
                  <div className="font-mono text-sm text-ink group-hover:text-data transition-colors">
                    linkedin.com/in/mark-joel-comia
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-panel border border-hairline rounded-md p-6 sm:p-8">
              <h3 className="font-mono text-base font-semibold text-ink mb-1">
                Send a message
              </h3>
              <p className="text-sm text-muted mb-6">
                Messages are logged directly to Mj&apos;s workspace inbox.
              </p>

              {submitted ? (
                <div className="rounded-md border border-code/40 bg-code/10 p-5 space-y-3">
                  <div className="flex items-center gap-2 font-mono text-sm font-semibold text-code">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Message received</span>
                  </div>
                  <p className="text-sm text-ink/90">
                    Thanks for reaching out. Your note is saved in Mj&apos;s
                    inbox, or you can also email directly at{" "}
                    <a
                      href={`mailto:${PROFILE_DATA.email}`}
                      className="text-code underline underline-offset-4"
                    >
                      {PROFILE_DATA.email}
                    </a>
                    .
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="px-3 py-1.5 rounded-xs font-mono text-xs bg-panel border border-hairline text-ink hover:border-code/50"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  {error && (
                    <div
                      role="alert"
                      className="p-3 rounded-sm border border-data/50 bg-data/10 font-mono text-xs text-data"
                    >
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block font-mono text-xs text-muted mb-1.5"
                      >
                        Name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        suppressHydrationWarning
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Jane Reyes"
                        className="w-full px-3 py-2 rounded-sm bg-canvas border border-hairline text-sm text-ink placeholder:text-faint focus:border-code"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block font-mono text-xs text-muted mb-1.5"
                      >
                        Email
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        suppressHydrationWarning
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jane@company.com"
                        className="w-full px-3 py-2 rounded-sm bg-canvas border border-hairline text-sm text-ink placeholder:text-faint focus:border-code"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-subject"
                      className="block font-mono text-xs text-muted mb-1.5"
                    >
                      Subject (optional)
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      suppressHydrationWarning
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Frontend Developer / Data Analyst role"
                      className="w-full px-3 py-2 rounded-sm bg-canvas border border-hairline text-sm text-ink placeholder:text-faint focus:border-code"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block font-mono text-xs text-muted mb-1.5"
                    >
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      suppressHydrationWarning
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell me about the team, project, or dataset..."
                      className="w-full px-3 py-2 rounded-sm bg-canvas border border-hairline text-sm text-ink placeholder:text-faint focus:border-code"
                    />
                  </div>

                  <button
                    type="submit"
                    suppressHydrationWarning
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm font-mono text-xs sm:text-sm font-semibold bg-code text-[#071214] hover:opacity-90 transition-opacity"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send message</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Copyright + Subtle Admin Route Entry */}
        <div className="mt-16 pt-6 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-faint">
          <div suppressHydrationWarning>
            © {new Date().getFullYear()} {PROFILE_DATA.name}. Built with Next.js
            &amp; TypeScript.
          </div>
          <div className="flex items-center gap-4">
            <span>TUP Manila · BS Information Systems</span>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 text-faint hover:text-muted transition-colors"
              aria-label="Admin content management login"
            >
              <Lock className="w-3 h-3" />
              <span>/admin</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

