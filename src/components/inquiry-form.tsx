"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";

interface FormFields {
  name: string;
  email: string;
  checkInDate: string;
  checkOutDate: string;
  guests: string;
  message: string;
}

const initialForm: FormFields = {
  name: "",
  email: "",
  checkInDate: "",
  checkOutDate: "",
  guests: "1",
  message: "",
};

export function InquiryForm() {
  const [form, setForm] = useState<FormFields>(initialForm);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const update = (field: keyof FormFields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("send failed");
      setStatus("success");
      setForm(initialForm);
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "w-full rounded-xl border border-[var(--line)] bg-[rgba(9,11,15,0.72)] px-4 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors duration-180";

  const labelClass = "block text-sm text-[var(--muted-foreground)] mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Name</label>
          <input type="text" required value={form.name} onChange={update("name")} placeholder="Your name" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input type="email" required value={form.email} onChange={update("email")} placeholder="your@email.com" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Check-in date</label>
          <input type="date" required value={form.checkInDate} onChange={update("checkInDate")} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Check-out date</label>
          <input type="date" required value={form.checkOutDate} onChange={update("checkOutDate")} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Number of guests</label>
          <input type="number" min={1} required value={form.guests} onChange={update("guests")} className={inputClass} />
        </div>
      </div>
      <div>
        <label className={labelClass}>Message (optional)</label>
        <textarea rows={3} value={form.message} onChange={update("message")} placeholder="Any questions or special requests..." className={inputClass + " resize-none"} />
      </div>
      <div className="flex items-center gap-4">
        <Button
          type="submit"
          disabled={status === "submitting"}
          className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 cursor-pointer"
        >
          {status === "submitting" ? "Sending..." : "Send inquiry"}
        </Button>
        {status === "success" && (
          <span className="text-sm text-green-400">Inquiry sent! We&apos;ll get back to you shortly.</span>
        )}
        {status === "error" && (
          <span className="text-sm text-red-400">Failed to send. Please try again.</span>
        )}
      </div>
    </form>
  );
}
