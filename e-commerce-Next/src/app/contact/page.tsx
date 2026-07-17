"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Mail, MapPin, Phone, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/base/button";
import { Input } from "@/components/base/input";
import { Card, CardContent } from "@/components/base/card";
import api from "@/lib/api";

export default function ContactPage() {
  const t = useTranslations("contact");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSending(true);
    try {
      await api.post("/contact", { name, email, subject, message });
      setSubmitted(true);
    } catch {
      setError(t("error") || "Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setError("");
  };

  return (
    <section className="py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-3xl font-bold">{t("title")}</h1>
        <p className="mb-10 text-muted-foreground">
          {t("subtitle")}
        </p>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            {submitted ? (
              <Card>
                <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                  <Send className="size-10 text-primary" />
                  <h2 className="text-xl font-semibold">Message sent!</h2>
                  <p className="text-sm text-muted-foreground">
                    We&apos;ll get back to you within 24 hours.
                  </p>
                  <Button variant="outline" onClick={handleReset}>
                    Send another
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input placeholder={t("name")} required value={name} onChange={(e) => setName(e.target.value)} />
                <Input type="email" placeholder={t("email")} required value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input placeholder={t("subject")} required value={subject} onChange={(e) => setSubject(e.target.value)} />
                <textarea
                  className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder={t("message")}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full" disabled={sending}>
                  {sending ? (
                    <><Loader2 className="mr-2 size-4 animate-spin" />{t("sending")}</>
                  ) : (
                    t("send")
                  )}
                </Button>
              </form>
            )}
          </div>
          <div className="space-y-6">
            <Card>
              <CardContent className="space-y-4 py-6">
                <div className="flex items-center gap-3">
                  <Mail className="size-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <a href="mailto:support@store.com" className="text-sm text-muted-foreground hover:text-foreground">
                      support@store.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="size-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <a href="tel:+12345678910" className="text-sm text-muted-foreground hover:text-foreground">
                      +1 (234) 567-8910
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="size-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">
                      123 Commerce St, New York, NY 10001
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
