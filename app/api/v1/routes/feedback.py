import csv
import io
import json
import os
import sqlite3
from datetime import datetime
from pathlib import Path
from typing import List, Optional

import httpx
from fastapi import APIRouter, BackgroundTasks, HTTPException
from fastapi.responses import Response, StreamingResponse
from pydantic import BaseModel

router = APIRouter(prefix="/v1", tags=["feedback"])

DB_PATH = Path(__file__).resolve().parent.parent.parent.parent / "feedback.db"


def get_db():
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with get_db() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS recruiter_feedback (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                time_saved TEXT,
                willingness_to_pay TEXT,
                price_range TEXT,
                feature_requests TEXT,
                comments TEXT,
                email TEXT,
                company_name TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        conn.commit()


init_db()


class FeedbackPayload(BaseModel):
    time_saved: str
    willingness_to_pay: str
    price_range: str
    feature_requests: List[str] = []
    comments: Optional[str] = ""
    email: Optional[str] = ""
    company_name: Optional[str] = ""
    created_at: Optional[str] = None


async def send_webhook_notification(feedback: FeedbackPayload):
    webhook_url = os.getenv("FEEDBACK_WEBHOOK_URL") or os.getenv("DISCORD_WEBHOOK_URL")
    if not webhook_url:
        return

    features_str = ", ".join(feedback.feature_requests) if feedback.feature_requests else "Žádné"
    
    # Discord embed format
    payload = {
        "content": "🎯 **Nový recruiter feedback z desideo!**",
        "embeds": [
          {
            "title": f"Firma: {feedback.company_name or 'Neuvedena'}",
            "color": 5063421,  # Indigo
            "fields": [
              {"name": "⏱ Úspora času", "value": feedback.time_saved, "inline": True},
              {"name": "💰 Ochota platit", "value": feedback.willingness_to_pay, "inline": True},
              {"name": "🏷 Cenový model", "value": feedback.price_range, "inline": False},
              {"name": "⭐ Požadované funkce", "value": features_str, "inline": False},
              {"name": "💬 Komentář", "value": feedback.comments or "Bez komentáře", "inline": False},
              {"name": "📧 E-mail", "value": feedback.email or "Neuveden", "inline": True},
            ],
            "footer": {"text": f"Odesláno: {datetime.now().strftime('%d.%m.%Y %H:%M')}"}
          }
        ]
    }

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            await client.post(webhook_url, json=payload)
    except Exception as e:
        print(f"Chyba při odesílání webhooku: {e}")


@router.post("/feedback")
async def create_feedback(feedback: FeedbackPayload, background_tasks: BackgroundTasks):
    created_at = feedback.created_at or datetime.now().isoformat()
    features_json = json.dumps(feedback.feature_requests, ensure_ascii=False)

    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                INSERT INTO recruiter_feedback 
                (time_saved, willingness_to_pay, price_range, feature_requests, comments, email, company_name, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    feedback.time_saved,
                    feedback.willingness_to_pay,
                    feedback.price_range,
                    features_json,
                    feedback.comments or "",
                    feedback.email or "",
                    feedback.company_name or "",
                    created_at,
                ),
            )
            conn.commit()
            feedback_id = cursor.lastrowid
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Nepodařilo se uložit feedback: {exc}")

    # Forward to Discord/Slack webhook in background if configured
    background_tasks.add_task(send_webhook_notification, feedback)

    return {
        "success": True,
        "id": feedback_id,
        "message": "Zpětná vazba byla úspěšně uložena.",
    }


@router.get("/feedback")
async def list_feedback():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM recruiter_feedback ORDER BY id DESC")
        rows = cursor.fetchall()

    results = []
    for r in rows:
        results.append(
            {
                "id": r["id"],
                "time_saved": r["time_saved"],
                "willingness_to_pay": r["willingness_to_pay"],
                "price_range": r["price_range"],
                "feature_requests": json.loads(r["feature_requests"] or "[]"),
                "comments": r["comments"],
                "email": r["email"],
                "company_name": r["company_name"],
                "created_at": r["created_at"],
            }
        )
    return {"total": len(results), "feedback": results}


@router.get("/feedback/export-csv")
async def export_feedback_csv():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM recruiter_feedback ORDER BY id DESC")
        rows = cursor.fetchall()

    output = io.StringIO()
    # Write UTF-8 BOM so Microsoft Excel in Windows opens Czech characters correctly
    output.write("\ufeff")

    writer = csv.writer(output, delimiter=";")
    writer.writerow(
        [
            "ID",
            "Datum a čas",
            "Úspora času",
            "Ochota platit",
            "Férová cena",
            "Požadované funkce",
            "Poznámka / Komentář",
            "E-mail",
            "Firma / Agentura",
        ]
    )

    for r in rows:
        features = ", ".join(json.loads(r["feature_requests"] or "[]"))
        writer.writerow(
            [
                r["id"],
                r["created_at"],
                r["time_saved"],
                r["willingness_to_pay"],
                r["price_range"],
                features,
                r["comments"],
                r["email"],
                r["company_name"],
            ]
        )

    output.seek(0)
    filename = f"recruiter_feedback_{datetime.now().strftime('%Y%m%d_%H%M')}.csv"

    return StreamingResponse(
        io.BytesIO(output.getvalue().encode("utf-8-sig")),
        media_type="text/csv; charset=utf-8",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )

