# BaSuka Energy — Email & Website Forms Architecture

**Prepared:** September 18, 2026
**Scope:** Domain DNS, mailboxes, and website form delivery for `basukaenergy.com`

---

## 1. What was wrong (and is now fixed)

| Symptom | Root cause | Fix applied |
|---|---|---|
| Emails to `@basukaenergy.com` never arrived | Domain MX records pointed to Namecheap's *free forwarding* servers — the real cPanel mailboxes were bypassed for all incoming mail | MX records now point to the hosting mail server; all mailboxes receive mail directly |
| Sending from `cwright@` bounced (Gmail error `550-5.7.26`) | The domain's SPF record didn't authorize the hosting server, and no DKIM record existed — Gmail requires both | SPF updated to include the server; DKIM published; DMARC added |
| Website contact forms were unreliable | Forms relied on a third-party free service and WhatsApp redirects | Forms now deliver through BaSuka's **own mail server**, with no third parties |

---

## 2. Domain DNS — Namecheap (Advanced DNS)

| Record | Host | Value | Purpose |
|---|---|---|---|
| A | `@` | `216.198.79.1` | Website (hosted on Vercel) |
| CNAME | `www` | Vercel target | Website (www) |
| A | `mail` | `162.0.229.118` | Mail server address |
| MX | `@` | `mail.basukaenergy.com` (priority 0) | Routes all incoming mail to the cPanel server |
| TXT (SPF) | `@` | `v=spf1 ip4:162.0.229.118 include:spf.web-hosting.com ~all` | Authorizes the server to send as `@basukaenergy.com` |
| TXT (DKIM) | `default._domainkey` | *(RSA key from cPanel)* | Cryptographically signs outgoing mail |
| TXT (DMARC) | `_dmarc` | `v=DMARC1; p=none; rua=mailto:onyxjulesctr@gmail.com` | Anti-spoofing reports (monitoring mode) |

**Important:** the website records (first two rows) are separate from mail — the site lives on Vercel and was unaffected by all mail changes.

---

## 3. Mailboxes — cPanel hosting (`premium118.web-hosting.com`)

- All existing cPanel mailboxes (including `cwright@`) now **receive mail directly** — verified end to end.
- Outgoing mail is SPF/DKIM-signed by the domain, so it no longer bounces at Gmail/Outlook.
- A dedicated `forms@basukaenergy.com` mailbox sends all website-form notifications (keeps personal inboxes clean).
- **Published addresses:** `info@`, `partners@`, `basukaacademy@`, `cwright@` — each exists on the server and receives its mail (verified by live tests on every form).

**Reading mail:** cPanel webmail, or any device/app via IMAP — host `premium118.web-hosting.com`, port 993 (SSL); outgoing SMTP port 465 (SSL). Use the *server hostname* (not `mail.basukaenergy.com`) in mail apps, because the server's TLS certificate covers `*.web-hosting.com`.

---

## 4. Website forms — how submissions reach you

```
Visitor fills a form on basukaenergy.com
        ↓
Vercel serverless endpoint  /api/contact   (BaSuka's own code, no third parties)
        ↓  validation · spam checks · rate limiting
SMTP via premium118.web-hosting.com  (SPF/DKIM-signed)
        ↓
info@ / partners@ / basukaacademy@ mailbox
```

| Form | Page | Delivers to |
|---|---|---|
| Contact form | Contact Us (EN/FR) | `info@basukaenergy.com` |
| Newsletter subscribe | Footer, every page | `info@basukaenergy.com` |
| Partner inquiry | Partners (EN/FR) | `partners@basukaenergy.com` |
| Academy application | Academy (EN/FR) | `basukaacademy@basukaenergy.com` |
| Ba-Suka Academy application | Ba-Suka Academy (EN/FR) | `basukaacademy@basukaenergy.com` |

**What the emails look like:** sent from `BaSuka Energy Website <forms@basukaenergy.com>`, subject prefixed `[Website] …` (e.g. "Contact inquiry", "Partnership inquiry", "Academy application"), with the visitor's email set as **Reply-To** — so you can answer directly.

**Built-in protections**

- **Honeypot field** — silent bot trap (bots fill it, humans never see it)
- **Origin allowlist** — only `basukaenergy.com` may submit
- **Rate limiting** — max 20 submissions per 10 minutes per visitor
- **Honest error states** — if delivery ever fails, visitors see a clear message with a WhatsApp fallback link instead of a false "sent" confirmation
- All five forms were verified live in production; test emails arrived in each mailbox

---

## 5. Where each address appears on the website

| Address | Placement (English + French pages) |
|---|---|
| `info@basukaenergy.com` | Footer email icon (all pages) · Contact page card & search description |
| `partners@basukaenergy.com` | Partners page instructions |
| `basukaacademy@basukaenergy.com` | Academy & Ba-Suka Academy FAQs ("How to apply") |
| `cwright@basukaenergy.com` | How It Works → Contact Us |

---

## 6. Sending as `@basukaenergy.com` from Gmail (optional, for Carolyn)

Gmail can manage the mailbox fully (read + reply as `cwright@basukaenergy.com`, no "via gmail.com" label since mail goes out through the authorized server):

1. Gmail → Settings → Accounts → **"Check mail from other accounts"**: POP server `premium118.web-hosting.com`, port 995, SSL, username = full email, password = mailbox password
2. **"Send mail as"**: SMTP server `premium118.web-hosting.com`, port 465, SSL, same credentials
3. Set as default "From" and enable "Reply from the same address the message was sent to"

---

## 7. Recommendations & notes

- **Deliverability warm-up:** mark the first few emails "Not spam" and add the addresses to contacts — reputation builds within days.
- **DMARC** is in monitoring mode (`p=none`); weekly reports go to `onyxjulesctr@gmail.com`. Once everything is confirmed working for a few weeks, it can be tightened to `p=quarantine` for stronger anti-spoofing protection.
- **Bulk email:** the hosting server comfortably handles form traffic and normal correspondence, but mass campaigns (hundreds+ recipients) should use a dedicated newsletter service to protect the domain's reputation.
- **Backups:** include Email in periodic cPanel backups to safeguard mailbox contents.

## 8. Quick troubleshooting reference

| If… | Then… |
|---|---|
| Incoming mail missing | Check the mailbox in cPanel webmail first, then cPanel → Email Deliverability (DKIM/SPF status) |
| Outgoing mail bounces | Confirm DNS records in Namecheap are unchanged (SPF/DKIM rows above) |
| Form submissions not arriving | Verify the mailbox exists in cPanel; check spam folder; Vercel dashboard → Functions logs show every attempt |
| Change of hosting server | Update the `mail` A record, MX, and SPF IP in Namecheap to the new server |
