// import nodemailer, { Transporter } from "nodemailer";

// const createTransporter = (): Transporter => {
//   return nodemailer.createTransport({   
//     host: process.env.SMTP_HOST || "smtp.gmail.com",
//     port: Number(process.env.SMTP_PORT) || 587,
//     secure: false,
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASS,
//     },
//   });
// };

// export default createTransporter;






import nodemailer, { Transporter } from "nodemailer";

let _transporter: Transporter | null = null;

const createTransporter = (): Transporter => {
  if (_transporter) return _transporter; // reuse existing

  const user = process.env.SMTP_USER ||'nithinbalakrishnan569@gmail.com';
  const pass = process.env.SMTP_PASS ||'jhgeebcidmxsjjbw'

  // Fail fast with a clear message
  if (!user || !pass) {
    throw new Error(
      `[Mailer] SMTP credentials missing!\n` +
      `  SMTP_USER: ${user ? "✅" : "❌ not set"}\n` +
      `  SMTP_PASS: ${pass ? "✅" : "❌ not set"}\n` +
      `  Make sure dotenv.config() runs before any mail is sent.`
    );
  }

  _transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: { user, pass },
  });

  return _transporter;
};

export default createTransporter;