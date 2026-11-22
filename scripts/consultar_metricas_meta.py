"""
Consulta métricas y estado de las campañas en Meta Ads.
Lee automáticamente el token de scripts/.env_meta si no está en el entorno.

Uso:
  python scripts/consultar_metricas_meta.py
"""
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request

sys.stdout.reconfigure(encoding="utf-8")

AD_ACCOUNT_ID = "act_361995981"
API_BASE = "https://graph.facebook.com/v22.0"
ENV_PATH = os.path.join(os.path.dirname(__file__), ".env_meta")


def load_env() -> dict:
    env = {}
    if os.path.exists(ENV_PATH):
        with open(ENV_PATH, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and "=" in line and not line.startswith("#"):
                    k, v = line.split("=", 1)
                    env[k.strip()] = v.strip()
    return env


def get_json(endpoint: str, token: str, params: dict = None) -> dict:
    if params is None:
        params = {}
    params["access_token"] = token
    url = f"{API_BASE}/{endpoint}?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, method="GET")
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"HTTP {exc.code} en {endpoint}: {body}") from exc


def report_campaign(camp_id: str, token: str) -> None:
    camp = get_json(
        camp_id,
        token,
        {"fields": "id,name,status,effective_status,objective,spend_cap"},
    )
    print("=" * 60)
    print(f"Campaña: {camp.get('name')}")
    print(f"ID: {camp.get('id')} | Estado Efectivo: {camp.get('effective_status')}")

    ads = get_json(
        f"{camp_id}/ads",
        token,
        {"fields": "id,name,status,effective_status"},
    )
    for ad in ads.get("data", []):
        print(f"  -> Anuncio [{ad.get('id')}]: {ad.get('name')} ({ad.get('effective_status')})")

    insights = get_json(
        f"{camp_id}/insights",
        token,
        {
            "fields": "spend,impressions,reach,clicks,cpc,ctr,actions",
            "date_preset": "maximum",
        },
    )
    data = insights.get("data", [])
    if not data:
        print("  Métricas: Aún sin gasto o impresiones registradas.")
        return

    row = data[0]
    spend = float(row.get("spend", "0"))
    impressions = int(row.get("impressions", "0"))
    reach = int(row.get("reach", "0"))
    clicks = int(row.get("clicks", "0"))
    ctr = float(row.get("ctr", "0"))

    print(f"  Gasto: {spend:,.2f} ARS | Alcance: {reach:,} | Impresiones: {impressions:,}")
    print(f"  Clics: {clicks} | CTR: {ctr:.2f}% | CPC: {float(row.get('cpc', 0)):,.2f} ARS")

    messages = 0
    for a in row.get("actions", []):
        if "messaging_conversation_started" in a.get("action_type", ""):
            messages = int(a.get("value", "0"))
            break
    print(f"  Mensajes Messenger iniciados: {messages}")


def main() -> None:
    env = load_env()
    token = os.environ.get("META_TOKEN", "").strip() or env.get("META_TOKEN", "") or env.get("USER_ACCESS_TOKEN", "")

    if not token:
        raise SystemExit("No se encontró token en variable de entorno ni en scripts/.env_meta")

    # Campañas de TuSong (Campaña activa actual)
    campaigns = ["52773246924890"]
    for cid in campaigns:
        report_campaign(cid, token)


if __name__ == "__main__":
    main()
