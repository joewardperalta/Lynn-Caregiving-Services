# Lynn’s Caregiving Services

Multi-page website for **Lynn’s Caregiving Services**, a Canadian non-medical in-home care business. Families can request care online, browse services, learn about the company, and contact the team. Personal Support Workers can apply for employment through the careers form.

**Live site:** [https://www.lynncaregiving.com](https://www.lynncaregiving.com)

## Features

- Responsive marketing pages (Home, About, Services, Why Choose Us, Careers, Contact, Privacy)
- Primary conversion flow: **Request Care**
- Secondary conversion: phone and contact form
- Careers / PSW job application form
- Server-side form validation and sanitization
- Transactional email notifications via SMTP (Resend recommended)
- Optional confirmation email for care requests
- Rate-limited public API endpoints
- Security headers with Helmet
- SEO basics: sitemap, robots.txt, Open Graph metadata

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | HTML5, CSS3, vanilla JavaScript |
| Backend | Node.js 18+, Express.js |
| Email | Nodemailer (SMTP) |
| Validation | express-validator |
| Security | helmet, express-rate-limit, dotenv |

No React, Next.js, Vue, Angular, Tailwind, or Bootstrap. A database is **not required** for the current form flow. Submitted forms are emailed to the business owner.

## Prerequisites

- [Node.js 18+](https://nodejs.org/)
- npm (included with Node.js)
- SMTP credentials (Resend, or another provider)

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env
# Windows:
# copy .env.example .env

# 3. Edit .env with your SMTP and owner email settings

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Script | Description |
| --- | --- |
| `npm run dev` | Start server with file watching (`node --watch`) |
| `npm start` | Start server for production-style runs |

Pages render without email configured. Form submissions require valid SMTP settings in `.env`.

## Project structure

```text
.
├── public/                     Static site assets
│   ├── index.html
│   ├── about.html
│   ├── services.html
│   ├── why-choose-us.html
│   ├── request-care.html
│   ├── careers.html
│   ├── contact.html
│   ├── privacy.html
│   ├── thank-you.html
│   ├── thank-you-application.html
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── css/
│   ├── js/
│   └── images/
├── server/
│   ├── controllers/            Request handlers
│   ├── routes/                 API route definitions
│   ├── services/               Email delivery
│   ├── middleware/             Validation and error handling
│   └── db/                     Optional PostgreSQL helper (unused by forms)
├── database/
│   └── schema.sql              Optional schema reference
├── .env.example
├── .gitignore
├── server.js                   Application entry point
├── package.json
└── README.md
```

## Environment variables

Copy `.env.example` to `.env` and configure:

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | No | HTTP port (default `3000`) |
| `NODE_ENV` | No | `development` or `production` |
| `OWNER_EMAIL` | Yes (forms) | Inbox that receives form notifications |
| `FROM_EMAIL` | Yes (forms) | Sender address for outgoing mail |
| `EMAIL_HOST` | Yes (forms) | SMTP host (e.g. `smtp.resend.com`) |
| `EMAIL_PORT` | No | SMTP port (default `587`) |
| `EMAIL_SECURE` | No | `true` for port 465; otherwise `false` |
| `EMAIL_USER` | Yes (forms) | SMTP username (Resend: `resend`) |
| `EMAIL_PASSWORD` | Yes (forms) | SMTP password / API key |
| `SEND_CONFIRMATION_EMAIL` | No | `true` to email care-request submitters |
| `SITE_URL` | No | Public site URL |

Never commit `.env`. Keep credentials on the server only.

### Example Resend configuration

```env
OWNER_EMAIL=lynncaregiving@gmail.com
FROM_EMAIL=requests@lynncaregiving.com
EMAIL_HOST=smtp.resend.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=resend
EMAIL_PASSWORD=re_xxxxxxxxx
SEND_CONFIRMATION_EMAIL=true
SITE_URL=https://www.lynncaregiving.com
```

## Email setup (Resend)

### Testing (unverified domain)

1. Create an API key in Resend.
2. Set `FROM_EMAIL=onboarding@resend.dev`.
3. Set `OWNER_EMAIL` to the email on your Resend account.
4. Set `SEND_CONFIRMATION_EMAIL=false`.

Without a verified domain, Resend only delivers to your account email.

### Production (verified domain)

1. Add and verify your domain at [resend.com/domains](https://resend.com/domains).
2. Set `FROM_EMAIL` to an address on that domain (for example `requests@lynncaregiving.com`).
3. Set `OWNER_EMAIL` to the business inbox (for example `lynncaregiving@gmail.com`).
4. Optionally enable `SEND_CONFIRMATION_EMAIL=true`.

If SMTP is not configured, form submissions return an error and the email body is written to the server log for local debugging.

## API endpoints

All public form endpoints are rate limited.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/inquiries` | Care request (Request Care form) |
| `POST` | `/api/contact` | General contact message |
| `POST` | `/api/applications` | PSW job application |

### Request Care flow

1. Visitor completes `request-care.html`.
2. Client-side JavaScript validates required fields and `POST`s JSON to `/api/inquiries`.
3. Express validates and sanitizes the payload again.
4. Nodemailer emails the owner and optionally sends a confirmation.
5. Browser redirects to `thank-you.html`.

Contact and careers forms follow the same validation/email pattern. Careers redirects to `thank-you-application.html`.

User-entered HTML is stripped and escaped before inclusion in emails.

## Security

- Helmet sets standard HTTP security headers
- Rate limiting on public form `POST` routes
- Request bodies limited to 20kb
- Server-side validation and sanitization (frontend validation is convenience only)
- Production API errors omit stack traces
- Forms intentionally avoid collecting diagnoses, health card numbers, SINs, or payment details

## Deployment

1. Set production environment variables on the host (never commit secrets).
2. Install dependencies: `npm install --omit=dev`
3. Start with a process manager such as PM2 or systemd: `npm start`
4. Serve behind HTTPS (Caddy, Nginx, or a platform that terminates TLS)
5. Set `NODE_ENV=production`
6. Confirm Resend domain verification and test each form
7. Review `public/privacy.html` with a qualified professional if needed

## Pages

| Page | File |
| --- | --- |
| Home | `public/index.html` |
| About Us | `public/about.html` |
| Services | `public/services.html` |
| Why Choose Us | `public/why-choose-us.html` |
| Request Care | `public/request-care.html` |
| Careers | `public/careers.html` |
| Contact | `public/contact.html` |
| Privacy Policy | `public/privacy.html` |

Redirect helpers:

- `request-psw.html` → `request-care.html`
- `how-it-works.html` → `why-choose-us.html`

## License

Private project. All rights reserved by Lynn’s Caregiving Services unless otherwise stated.

## Photo credits

Home-care photographs are sourced from [Pexels](https://www.pexels.com/) / [Unsplash](https://unsplash.com/) as free-to-use images. Confirm current licence terms for each source before republication, and replace with original photography when available.
