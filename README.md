# BizStart Landing

O‘quv markazlar uchun sotiladigan demo landing page:
- Next.js + Tailwind frontend
- FastAPI backend
- SQLite database
- Ariza qabul qilish formasi
- Admin panel

## Ishga tushirish

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
copy .env.example .env
uvicorn main:app --reload
```

Backend: http://localhost:8000

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:3000

## Admin panel

URL: http://localhost:3000/admin

Demo token:

```txt
demo-admin-token
```

## Sotuvdagi nomi

"Tayyor landing page + admin panel + ariza qabul qilish sistemi"

Tavsiya qilingan narx:
- Template: 200k–500k so‘m
- Moslab berish: 700k–2 mln so‘m
- Telegram notification qo‘shilsa: 2–3 mln+ so‘m
