// Contact form handler — receives POST from the form, validates, sends via Resend.
// Env vars required:
//   RESEND_API_KEY — from https://resend.com/api-keys
//   RESEND_FROM    — sender address (e.g. onboarding@resend.dev for tests)
//   RESEND_TO      — destination (e.g. naturalstonefabricators@gmail.com)
import { Resend } from "resend";

const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
const RESEND_FROM = import.meta.env.RESEND_FROM;
const RESEND_TO = import.meta.env.RESEND_TO;

export const prerender = false;

function isEmail(v) {
  return typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST({ request }) {
  if (!RESEND_API_KEY) {
    return new Response(
      JSON.stringify({ ok: false, error: "Server is not configured (RESEND_API_KEY missing)." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ ok: false, error: "Invalid JSON body." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Honeypot — bots fill the hidden field; real users don't
  if (body.website) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const first_name = (body.first_name || "").toString().trim();
  const last_name = (body.last_name || "").toString().trim();
  const email = (body.email || "").toString().trim();
  const phone = (body.phone || "").toString().trim();
  const message = (body.message || "").toString().trim();

  if (!first_name) return errorResponse("First name is required.", 400);
  if (!email || !isEmail(email)) return errorResponse("A valid email is required.", 400);
  if (!phone) return errorResponse("Phone is required.", 400);
  if (!message) return errorResponse("Message is required.", 400);
  if (first_name.length > 100 || last_name.length > 100) return errorResponse("Name too long.", 400);
  if (message.length > 5000) return errorResponse("Message too long.", 400);

  const fullName = [first_name, last_name].filter(Boolean).join(" ");
  const subject = `New lead from ${fullName} — NSF website`;
  const text = [
    `Name: ${fullName}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    "",
    "Message:",
    message,
  ].join("\n");

  const html = `
    <div style="font-family: system-ui, sans-serif; line-height: 1.6; color: #031927;">
      <h2 style="margin: 0 0 16px;">New contact form submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(fullName)}</p>
      <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
      <p><strong>Phone:</strong> <a href="tel:${escapeHtml(phone)}">${escapeHtml(phone)}</a></p>
      <hr style="border: none; border-top: 1px solid #e7f5fd; margin: 16px 0;" />
      <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
    </div>
  `;

  try {
    const resend = new Resend(RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: RESEND_FROM,
      to: RESEND_TO,
      replyTo: email,
      subject,
      text,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return errorResponse("Could not send email. Please call us at (714) 390-0370.", 502);
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return errorResponse("Server error. Please try again or call us at (714) 390-0370.", 500);
  }
}

function errorResponse(message, status) {
  return new Response(JSON.stringify({ ok: false, error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}