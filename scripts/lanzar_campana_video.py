"""
Crea y activa la campana publicitaria del Video Reel en Meta Ads.
"""
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request

sys.stdout.reconfigure(encoding="utf-8")

AD_ACCOUNT_ID = "act_361995981"
PAGE_ID = "584160754786937"
POST_ID = "584160754786937_122183780510822317"
CREATIVE_ID = "1657212845797957"
API_BASE = "https://graph.facebook.com/v22.0"


def post_form(endpoint: str, token: str, payload: dict) -> dict:
    data = {"access_token": token}
    for k, v in payload.items():
        data[k] = json.dumps(v, ensure_ascii=False) if isinstance(v, (dict, list)) else str(v)
    encoded = urllib.parse.urlencode(data).encode("utf-8")
    req = urllib.request.Request(f"{API_BASE}/{endpoint}", data=encoded, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"HTTP {exc.code} en {endpoint}: {body}") from exc


def main() -> None:
    token = os.environ.get("META_TOKEN", "").strip()
    if not token:
        raise SystemExit("Falta META_TOKEN.")

    daily_budget = int(os.environ.get("DAILY_BUDGET_CENTS", "250000"))  # 2.500 ARS/dia
    spend_cap = int(os.environ.get("SPEND_CAP_CENTS", "2000000"))  # 20.000 ARS tope total

    print("1. Creando campana de Video Reel...")
    campaign = post_form(
        f"{AD_ACCOUNT_ID}/campaigns",
        token,
        {
            "name": "[TuSong] Validacion ES - Video Reel (Messenger)",
            "objective": "OUTCOME_ENGAGEMENT",
            "status": "ACTIVE",
            "buying_type": "AUCTION",
            "special_ad_categories": ["NONE"],
            "spend_cap": spend_cap,
            "is_adset_budget_sharing_enabled": "false",
        },
    )
    campaign_id = campaign["id"]
    print("   Campaign ID:", campaign_id)

    print("2. Creando conjunto de anuncios (Espana - Messenger)...")
    adset = post_form(
        f"{AD_ACCOUNT_ID}/adsets",
        token,
        {
            "name": "[TuSong] Espana 24-65 - Regalos y Ocasiones (Video Reel)",
            "campaign_id": campaign_id,
            "daily_budget": daily_budget,
            "billing_event": "IMPRESSIONS",
            "optimization_goal": "CONVERSATIONS",
            "destination_type": "MESSENGER",
            "bid_strategy": "LOWEST_COST_WITHOUT_CAP",
            "promoted_object": {"page_id": PAGE_ID},
            "dsa_beneficiary": "TuSong",
            "dsa_payor": "Daro",
            "targeting": {
                "geo_locations": {
                    "countries": ["ES"],
                    "location_types": ["frequently_in", "home", "recent"],
                },
                "age_min": 24,
                "age_max": 65,
                "locales": [7, 23],
                "publisher_platforms": ["facebook", "messenger"],
                "flexible_spec": [
                    {
                        "interests": [
                            {"id": "6003019539929", "name": "Regalos (concepto social)"},
                            {"id": "6003152263430", "name": "Cumpleaños (evento)"},
                            {"id": "6003155254305", "name": "Aniversario"},
                            {"id": "6003409392877", "name": "Bodas (concepto social)"},
                        ]
                    }
                ],
                "targeting_automation": {"advantage_audience": 1},
            },
            "status": "ACTIVE",
        },
    )
    adset_id = adset["id"]
    print("   Ad Set ID:", adset_id)

    print("3. Creando anuncio vinculado al video recien subido...")
    ad = post_form(
        f"{AD_ACCOUNT_ID}/ads",
        token,
        {
            "name": "[TuSong] Anuncio Video Reel - Espana (Messenger)",
            "adset_id": adset_id,
            "creative": {"creative_id": CREATIVE_ID},
            "status": "ACTIVE",
        },
    )
    ad_id = ad["id"]
    print("   Ad ID:", ad_id)
    print("\nSUCCESS! Campana del Video Reel creada y ACTIVADA en Meta Ads.")


if __name__ == "__main__":
    main()
