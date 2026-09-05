# At Home Personal Support

A complete multi-page website for a small Canadian business that provides Personal Support Worker (PSW) services. The site is built for families, caregivers, seniors’ families, and employers who want to request reliable personal support at home.

The primary conversion action is **Request a Personal Support Worker**. Submitted requests are validated and emailed to the business owner. A database is not required.

> Replace the working name **At Home Personal Support**, contact placeholders, owner biography, service area, and `your-domain.ca` references before launch.

## Technology stack

- HTML5, CSS3, and vanilla JavaScript
- Node.js and Express.js
- Nodemailer for transactional email
- `dotenv`, `helmet`, `express-rate-limit`, and `express-validator`

No React, Next.js, Vue, Angular, Tailwind, or Bootstrap. PostgreSQL is optional and not used by the current form flow.

## Folder structure

```text
.
├── public/                 Static website files
│   ├── index.html
│   ├── about.html
│   ├── services.html
│   ├── how-it-works.html
│   ├── request-psw.html
│   ├── contact.html
│   ├── privacy.html
│   ├── thank-you.html
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── css/
│   ├── js/
│   └── images/
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   └── db/
├── database/
│   └── schema.sql
├── .env.example
├── .gitignore
├── server.js
├── package.json
└── README.md
```

## Installation

1. Install [Node.js 18+](https://nodejs.org/).
2. In the project folder, install dependencies:

```bash
npm install
```

3. Copy the environment file and edit the values:

```bash
copy .env.example .env
```

On macOS or Linux, use `cp .env.example .env`.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `PORT` | Web server port (default `3000`) |
| `NODE_ENV` | `development` or `production` |
| `OWNER_EMAIL` | Where new requests are sent |
| `FROM_EMAIL` | From address for outgoing mail |
| `EMAIL_HOST` | SMTP host |
| `EMAIL_PORT` | SMTP port, usually `587` |
| `EMAIL_SECURE` | `true` for port 465, otherwise `false` |
| `EMAIL_USER` | SMTP username |
| `EMAIL_PASSWORD` | SMTP password |
| `SEND_CONFIRMATION_EMAIL` | `true` to email the person who submitted the request |
| `SITE_URL` | Public site URL, used in documentation and sitemap |

Never commit the `.env` file. Email credentials stay on the server only.

## Running locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

`npm start` runs the same server without file watching.

Pages load without email configured. Form submissions require working SMTP settings in `.env`.

## Email configuration

When a request is submitted, the server emails the owner with:

- Contact information
- Client information
- Selected support types and schedule
- Additional comments
- Date and time submitted

User-entered HTML is stripped and escaped so it cannot render in the email.

Common SMTP options:

- Gmail or Google Workspace app password
- Microsoft 365
- A transactional provider such as [Resend SMTP](https://resend.com/docs/send-with-smtp), Mailgun, or Postmark

### Resend testing vs production

With Resend’s free/testing setup (`FROM_EMAIL=onboarding@resend.dev`):

- You can only send to the email address on your Resend account
- Set `OWNER_EMAIL` to that same address while testing
- Set `SEND_CONFIRMATION_EMAIL=false` (visitor confirmation emails will be rejected)

For production:

1. Verify your domain at [resend.com/domains](https://resend.com/domains)
2. Set `FROM_EMAIL` to an address on that domain (for example `requests@your-domain.ca`)
3. Set `OWNER_EMAIL` to the business inbox (for example Lynn’s email)
4. Optionally turn `SEND_CONFIRMATION_EMAIL` back on

If SMTP is not configured, the form returns an error and the email body is written to the server log so you can confirm the content during local development.

## How the inquiry form works

1. The visitor completes `request-psw.html`.
2. Vanilla JavaScript validates required fields, then `POST`s JSON to `/api/inquiries`.
3. Express validates and sanitizes the payload again.
4. Nodemailer emails the business owner, and optionally sends a confirmation email.
5. The browser redirects to `thank-you.html`.

The contact page uses `/api/contact` in the same way, without a redirect.

The submit button is disabled while a request is in progress to reduce duplicate submissions. Public forms are rate limited.

## Production deployment

1. Replace placeholders: business name, phone, email, service area, hours, owner profile, privacy policy, sitemap domain, and Open Graph URLs.
2. Use a process manager such as systemd or PM2: `npm start`.
3. Put the app behind HTTPS (Caddy, Nginx, or a host that terminates TLS).
4. Set `NODE_ENV=production`.
5. Configure SMTP credentials securely on the server.
6. Review `public/privacy.html` with a qualified professional before presenting it as a final policy.

## Security notes

- `helmet` sets standard HTTP security headers.
- `express-rate-limit` limits public form posts.
- Request bodies are limited to 20kb.
- Frontend validation is a convenience only. The server always validates again.
- Production API errors do not include stack traces.
- Do not ask visitors for diagnoses, health card numbers, SIN numbers, or payment details through these forms.

## Customization checklist

- [ ] Business name and logo text
- [ ] Phone, email, service area, and hours
- [ ] Owner name, photo, and biography on the About page
- [ ] FAQ answers for service area and response time
- [ ] Privacy policy legal review
- [ ] `robots.txt` and `sitemap.xml` live domain
- [ ] SMTP production credentials
- [ ] Photography if you prefer original photos

## Photo credits

Home-care photographs are downloaded from [Pexels](https://www.pexels.com/) / [Unsplash](https://unsplash.com/) as free-to-use images. Confirm the current licence on each source if you republish them, and replace them with original photos when available.
