# Encrypted pitch — how it works & how to edit

The published `index.html` is an **encrypted shell**. It contains the deck as
AES-256-GCM ciphertext plus a small in-browser decryptor. Visitors must enter
the passcode; the key is derived from it with PBKDF2 (SHA-256). A wrong passcode
fails the GCM authentication tag, so the content can never be revealed without
the correct passcode.

## Files

| File | Role | Public? |
|------|------|---------|
| `index.html` | Encrypted shell + ciphertext (served by GitHub Pages) | yes — but it's ciphertext |
| `deck.src.html` | The **editable** deck (plaintext source of truth) | only safe once the repo is **private** |
| `shell.template.html` | Template for the shell (gate UI + decryptor) | not sensitive |
| `encrypt.mjs` | Build script (re-encrypts the deck) | not sensitive |

## Editing the deck

```bash
# 1. edit the deck
$EDITOR deck.src.html

# 2. re-encrypt (default passcode is baked into encrypt.mjs)
node encrypt.mjs
#    or with a custom passcode:
AIGO_PASS='your passcode' node encrypt.mjs

# 3. commit both
git add deck.src.html index.html && git commit -m "Update deck" && git push
```

## Changing the passcode

Run `AIGO_PASS='new passcode' node encrypt.mjs` and commit the new `index.html`.
Nothing else stores the passcode.

## Important security notes

- **The live site is protected** — Pages serves only ciphertext, so the deck
  cannot be read without the passcode.
- **The repo should be private.** `deck.src.html` (and the deck's earlier git
  history) is plaintext. Until the repo is private, the source is public even
  though the live site is encrypted. Note: GitHub Pages from a **private** repo
  requires a paid plan (Pro or higher).
- **Assets are not encrypted.** Images/videos under `assets/` are still served
  at their URLs (they just aren't discoverable without the decrypted HTML).
- A static-site passcode is strong against casual access but is **not** a
  substitute for server-side auth. For the highest assurance, put the site
  behind an edge auth layer such as Cloudflare Access.
