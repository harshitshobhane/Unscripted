import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { name, email, message } = await req.json();
    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "All fields are required." }), { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const html = `
      <div style="background:#f4f4f7;padding:32px 0;width:100%;font-family:Segoe UI,Arial,sans-serif;">
        <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:16px;box-shadow:0 4px 24px #0001;padding:32px 24px;">
          <h2 style="color:#7c3aed;margin-bottom:12px;font-size:1.5rem;">New Contact Form Submission</h2>
          <div style="margin-bottom:18px;">
            <div style="margin-bottom:8px;"><span style="font-weight:600;color:#333;">Name:</span> <span style="color:#444;">${name}</span></div>
            <div style="margin-bottom:8px;"><span style="font-weight:600;color:#333;">Email:</span> <span style="color:#444;">${email}</span></div>
            <div style="font-weight:600;color:#333;margin-bottom:4px;">Message:</div>
            <div style="background:#f3f4f6;border-radius:8px;padding:16px 12px;color:#222;font-size:1.05rem;white-space:pre-line;">${message}</div>
          </div>
          <div style="font-size:0.95rem;color:#888;margin-top:24px;text-align:center;">This message was sent from the <b>Its-Unscripted</b> contact form.</div>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"Its-Unscripted" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_RECIPIENT,
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html,
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error("Nodemailer error:", err);
    return new Response(JSON.stringify({ error: err.message || "Failed to send message" }), { status: 500 });
  }
} 