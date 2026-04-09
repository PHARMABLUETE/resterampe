# Resterampe – Projekt-Dokumentation

## Zweck
Dashboard für PHARMABLÜTE-Mitarbeiter: Zeigt alle Shopware-Produkte mit Restbestand 1–49 Stück.
Ziel: Mitarbeitern helfen, bei bestehenden Kundenbestellungen schnell die beste Alternative zu finden.

## Architektur
```
Shopware API (pharmabluete-mainz.de)
     ↓ (alle 30min + manuell via Webhook)
 n8n Workflow: resterampe_sync
     ↓ UPSERT
  PostgreSQL DB: shopware / Tabelle: resterampe (Hetzner)
     ↓
  Next.js Dashboard (localhost:3000 → später öffentlich via Coolify)
```

## Projektstruktur
```
resterampe/
├── CLAUDE.md               ← Diese Datei
├── .gitignore
├── .mcp.json               ← lokal (nicht in Git) – n8n MCP Config
├── .mcp.json.example       ← Template
├── n8n/
│   └── workflow_resterampe_v1.json   ← Export des n8n Workflows
└── dashboard/              ← Next.js App
    ├── .env.local          ← lokal (nicht in Git)
    └── ...
```

## n8n Workflow
- **Name:** resterampe_sync
- **Trigger:** Schedule (alle 30min) + Manual + Webhook (`/webhook/resterampe-refresh`)
- **Shopware Filter:** `stock >= 1 AND stock < 50 AND active = true`
- **Daten:** Name, Artikelnummer, Bestand, Preis, Kategorien, Eigenschaften, Produktbild
- **Referenz-Workflow:** "Produkt/Verfügbarkeit_Schnittstelle_251013" (n8n-Instanz)

## PostgreSQL
- **Server:** Hetzner (automation.pharmabluete.de, Docker-Container: postgres)
- **Datenbank:** `shopware` (NEU)
- **Tabelle:** `resterampe`
- **Credential in n8n:** Basierend auf LK14Dt5HaeVeMhZc (DB-Name: shopware)

## Next.js Dashboard
- **Lokaler Start:** `cd dashboard && npm run dev` → http://localhost:3000
- **Für Entwicklung:** SSH-Tunnel für PostgreSQL nötig:
  ```bash
  ssh -i ~/.ssh/til_nagel -p 2232 -L 5432:postgres:5432 root@automation.pharmabluete.de
  ```
- **Später:** Deployment via Coolify auf Hetzner

## Secrets
Liegen in `secrets/` (lokal) oder als `.env.local` in `dashboard/` – niemals in Git!

## n8n Webhooks
- `GET  https://automation.pharmabluete.de/webhook/resterampe-data`    → Produkte aus DB
- `POST https://automation.pharmabluete.de/webhook/resterampe-refresh` → Sync triggern

## n8n Credentials
- Shopware OAuth2: `DmONQ5tXOAd4QB9b`
- PostgreSQL shopware: `0dXOUxRF1iiYhAV8`
- Workflow ID: `C6p1MDeFR2HN9Nm7`

## Wichtige URLs
- n8n: https://automation.pharmabluete.de
- pgAdmin: https://db.pharmabluete.de
- Shopware: https://pharmabluete-mainz.de
- GitHub: https://github.com/PHARMABLUETE/resterampe

## Deployment (Stand 2026-04-01)

**Live:** https://lagerverwaltung.t3rp.de

- **Coolify App UUID:** `xu1rr1ea2doa0dzj1yxj89jl`
- **Host-Port:** `3001:3000` (Workaround solange Traefik nicht läuft)
- **Caddy-Eintrag:** `lagerverwaltung.t3rp.de → reverse_proxy 172.18.0.1:3001`
- **Caddyfile:** `/root/n8n-docker-caddy/caddy_config/Caddyfile`

### iptables-Regel (nicht persistent!)
Damit Caddy den Host-Port 3001 erreicht:
```bash
iptables -I INPUT -i br-1c77be0fa43c -p tcp --dport 3001 -j ACCEPT
```
→ Muss nach Server-Neustart neu gesetzt werden. Dauerlösung: Phase 2 (n8n-Stack in Coolify → Traefik übernimmt).

### Coolify Auto-Deploy
Jeder Push auf `main` triggert automatisch Redeploy. Container-IP ändert sich dabei, aber Host-Port 3001 bleibt stabil → Caddy-Config bleibt unverändert.

## Stabilisierungs-Fixes (2026-04-09)

### n8n Workflow (v13, 13 Nodes)
- **Retry:** Shopware HTTP Request hat 3 Retries (5s Pause) — temporäre API-Ausfälle überbrückt
- **IF-Guard "Hat Produkte?":** vor dem DELETE-Node — leerer Sync lässt die DB unberührt
- **Stale-Intervall:** 35 min → 2 Stunden — toleriert bis zu 3 aufeinanderfolgende Fehlschläge

### Next.js Dashboard
- `Array.isArray(data)`-Check verhindert Frontend-Crash wenn API Fehler zurückgibt
- Error-State-Anzeige (roter Hinweis statt leerem Bildschirm)
- Poll nach Refresh (alle 2s, max 20s) statt 8s-Hardcode
- 15s Timeout auf `GET /api/products`, 30s auf `POST /api/refresh`

### n8n API-Zugang
- n8n Workflow direkt via REST API updatebar (API Key in `secrets/n8n.md`)
- Lokales JSON `n8n/workflow_resterampe_v1.json` immer synchron mit Live-Stand halten
