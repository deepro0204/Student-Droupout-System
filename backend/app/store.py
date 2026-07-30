"""In-memory data store.

Loaded once at application startup: student records (merged from the CSVs) and
the seeded demo user accounts used for authentication.
"""

from __future__ import annotations

from .config import settings
from .data_loader import load_students
from .security import hash_password


class DataStore:
    def __init__(self) -> None:
        self.students: list[dict] = []
        self._students_by_id: dict[int, dict] = {}
        self.users: dict[str, dict] = {}
        self._loaded = False

    # --- lifecycle ---------------------------------------------------------
    def load(self) -> None:
        if self._loaded:
            return
        self.students = load_students()
        self._students_by_id = {s["id"]: s for s in self.students}
        self._seed_users()
        self._loaded = True

    def _seed_users(self) -> None:
        pw = hash_password(settings.demo_password)
        demo = [
            {"id": "1", "name": "Student1", "email": "student1@example.com",
             "role": "student", "studentId": "1"},
            {"id": "2", "name": "Teacher1", "email": "teacher1@example.com",
             "role": "teacher"},
            {"id": "3", "name": "Admin1", "email": "admin1@example.com",
             "role": "admin"},
            {"id": "4", "name": "Counselor1", "email": "counselor1@example.com",
             "role": "counselor"},
        ]
        for u in demo:
            self.users[u["email"]] = {**u, "password_hash": pw}

    # --- users -------------------------------------------------------------
    def get_user_by_email(self, email: str) -> dict | None:
        if not email:
            return None
        return self.users.get(email.lower().strip())

    # --- students ----------------------------------------------------------
    def get_student(self, student_id: int) -> dict | None:
        return self._students_by_id.get(student_id)

    def query_students(
        self,
        skip: int = 0,
        limit: int = 50,
        risk: str | None = None,
        search: str | None = None,
    ) -> tuple[int, list[dict]]:
        items = self.students
        if risk:
            items = [s for s in items if s["riskLevel"].lower() == risk.lower()]
        if search:
            q = search.lower()
            items = [
                s for s in items
                if q in s["name"].lower() or q in str(s["id"]) or q in s["student_class"].lower()
            ]
        total = len(items)
        return total, items[skip: skip + limit]

    def analytics_summary(self) -> dict:
        total = len(self.students)
        if total == 0:
            return {"totalStudents": 0}

        dist = {"Low": 0, "Medium": 0, "High": 0}
        by_class: dict[str, int] = {}
        sum_att = sum_marks = sum_fee = 0.0
        for s in self.students:
            dist[s["riskLevel"]] += 1
            by_class[s["student_class"]] = by_class.get(s["student_class"], 0) + 1
            sum_att += s["attendance_percent"]
            sum_marks += s["avg_marks"]
            sum_fee += s["fee_paid_percent"]

        return {
            "totalStudents": total,
            "riskDistribution": {
                "low": dist["Low"],
                "medium": dist["Medium"],
                "high": dist["High"],
            },
            "averages": {
                "attendance": round(sum_att / total, 1),
                "marks": round(sum_marks / total, 1),
                "feePaid": round(sum_fee / total, 1),
            },
            "byClass": by_class,
        }


store = DataStore()
