"""
Crea la campaña de validación de TuSong en Meta Ads (estado PAUSED por seguridad)
apuntando a una publicación existente de la página de Facebook TuSong.

Uso en PowerShell:
  $env:META_TOKEN = "<TU_TOKEN>"
  python scripts/crear_campana_meta.py
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
POST_ID = "584160754786937_122183584886822317"
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
        raise SystemExit("Falta la variable de entorno META_TOKEN.")

    daily_budget = int(os.environ.get("DAILY_BUDGET_CENTS", "250000"))  # 2.500 ARS/día por defecto
    spend_cap = int(os.environ.get("SPEND_CAP_CENTS", "2000000"))  # 20.000 ARS tope total

    print("1. Creando campaña...")
    campaign = post_form(
        f"{AD_ACCOUNT_ID}/campaigns",
        token,
        {
            "name": "[TuSong] Validacion ES - Flyer 1 (Messenger)",
            "objective": "OUTCOME_ENGAGEMENT",
            "status": "PAUSED",
            "buying_type": "AUCTION",
            "special_ad_categories": ["NONE"],
            "spend_cap": spend_cap,
            "is_adset_budget_sharing_enabled": "false",
        },
    )
    campaign_id = campaign["id"]
    print("   Campaign ID:", campaign_id)

    print("2. Creando conjunto de anuncios (España · Messenger)...")
    adset = post_form(
        f"{AD_ACCOUNT_ID}/adsets",
        token,
        {
            "name": "[TuSong] Espana 24-65 - Regalos y Ocasiones (Messenger)",
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
                    "location_types": ["home", "recent"],
                },
                "age_min": 24,
                "age_max": 65,
                "locales": [1002],
                "publisher_platforms": ["facebook", "messenger"],
                "flexible_spec": [
                    {
                        "interests": [
                            {"id": "6003019539929", "name": "Regalo (concepto social)"},
                            {"id": "6003155254305", "name": "Aniversario"},
                            {"id": "6003152263430", "name": "Cumpleaños (evento)"},
                            {"id": "6003409392877", "name": "Bodas (concepto social)"},
                        ]
                    }
                ],
                "targeting_automation": {"advantage_audience": 1},
            },
            "status": "PAUSED",
        },
    )
    adset_id = adset["id"]
    print("   Ad Set ID:", adset_id)

    print("3. Creando creativo con la publicación del Flyer 1 + CTA Messenger...")
    welcome_msg = {
        "type": "VISUAL_EDITOR",
        "version": 2,
        "landing_screen_type": "welcome_message",
        "media_type": "text",
        "text_format": {
            "customer_action_type": "ice_breakers",
            "message": {
                "text": "¡Hola {{user_first_name}}! Qué alegría que quieras regalar una canción única con TuSong 🎵❤️ Cuéntanos: ¿para quién sería y qué ocasión celebran?",
                "ice_breakers": [
                    {"title": "💍 Aniversario / Pareja", "payload": "OCASION_ANIVERSARIO"},
                    {"title": "🎂 Cumpleaños especial", "payload": "OCASION_CUMPLEANOS"},
                    {"title": "🎁 Otra ocasión / Precio", "payload": "OCASION_OTRA"},
                ],
            },
        },
    }
    creative = post_form(
        f"{AD_ACCOUNT_ID}/adcreatives",
        token,
        {
            "name": "[TuSong] Creativo Flyer 1 - Espana (Messenger)",
            "object_story_id": POST_ID,
            "call_to_action": {
                "type": "MESSAGE_PAGE",
                "value": {"app_destination": "MESSENGER"},
            },
            "page_welcome_message": welcome_msg,
        },
    )
    creative_id = creative["id"]
    print("   Creative ID:", creative_id)

    print("4. Creando anuncio (PAUSED)...")
    ad = post_form(
        f"{AD_ACCOUNT_ID}/ads",
        token,
        {
            "name": "[TuSong] Anuncio Flyer 1 - Espana (Messenger)",
            "adset_id": adset_id,
            "creative": {"creative_id": creative_id},
            "status": "PAUSED",
        },
    )
    ad_id = ad["id"]
    print("   Ad ID:", ad_id)
    print("\nOK! Todo creado en estado PAUSED.")


if __name__ == "__main__":
    main()
