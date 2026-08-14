"use client";

import { useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { courses } from "@/content/courses";
import { siteConfig } from "@/lib/site";

const field =
  "mt-2 w-full rounded-xl border border-line bg-surface px-3.5 py-3 text-sm text-ink outline-none focus:border-accent";

export function ContactForm() {
  const searchParams = useSearchParams();
  const courseFromUrl = searchParams.get("course") || "";
  const defaultCourse = courses.some((course) => course.slug === courseFromUrl)
    ? courseFromUrl
    : "";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [interestedCourse, setInterestedCourse] = useState(defaultCourse);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, interestedCourse, message }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || "Could not send inquiry.");
        return;
      }
      setSuccess(json.message || "Inquiry received.");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setInterestedCourse("");
    } catch {
      setError("Network error. Please try again or email us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="text-sm font-semibold">
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          className={field}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="email" className="text-sm font-semibold">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className={field}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="phone" className="text-sm font-semibold">
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          className={field}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="course" className="text-sm font-semibold">
          Course interest
        </label>
        <select
          id="course"
          name="course"
          className={field}
          required
          value={interestedCourse}
          onChange={(e) => setInterestedCourse(e.target.value)}
        >
          <option value="" disabled>
            Select a course
          </option>
          {courses.map((course) => (
            <option key={course.id} value={course.slug}>
              {course.title}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="message" className="text-sm font-semibold">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          className={field}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {success ? <p className="text-sm text-green-700">{success}</p> : null}
      <Button type="submit" variant="signal" disabled={loading}>
        {loading ? "Sending…" : "Send inquiry"}
      </Button>
      <p className="text-xs text-muted">
        Or email{" "}
        <a className="font-semibold text-accent" href={`mailto:${siteConfig.email}`}>
          {siteConfig.email}
        </a>
      </p>
    </form>
  );
}
