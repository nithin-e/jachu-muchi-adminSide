import nodemailer, { Transporter } from "nodemailer";

let _transporter: Transporter | null = null;

const createTransporter = (): Transporter => {
  if (_transporter) return _transporter;

  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error(
      `[Mailer] SMTP credentials missing!\n` +
      `  SMTP_USER: ${user ? "set" : "NOT set"}\n` +
      `  SMTP_PASS: ${pass ? "set" : "NOT set"}\n` +
      `  Add them to your .env file.`
    );
  }

  _transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: { user, pass },
  });

  _transporter.verify((error) => {
    if (error) {
      console.error("[Mailer] Transporter verification failed:", error.message);
    } else {
      console.log("[Mailer] Transporter ready. SMTP connected.");
    }
  });

  return _transporter;
};

export default createTransporter;
