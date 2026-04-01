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

## Wichtige URLs
- n8n: https://automation.pharmabluete.de
- pgAdmin: https://db.pharmabluete.de
- Shopware: https://pharmabluete-mainz.de
