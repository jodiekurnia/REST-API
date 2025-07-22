# Dokumentasi Endpoint `/tevi`

---

## 1. POST https://tts.teknologio.id/tevi/:phone
**Deskripsi:**
Menambahkan phone baru tanpa cloner.

**Request:**
- URL Parameter:
  - `phone` (string): Nomor telepon unik.
- Body: kosong

**Response Sukses:**
- Status: 201
- Body:
  ```json
  {
    "_id": "ObjectId",
    "phone": "08123456789",
    "cloners": [],
    "__v": 0
  }
  ```

**Response Error:**
- Status: 400 jika phone sudah ada.

---

## 2. GET https://tts.teknologio.id/tevi/:phone
**Deskripsi:**
Mengambil data phone beserta seluruh cloner dan akun Gmail di dalamnya.

**Request:**
- URL Parameter:
  - `phone` (string): Nomor telepon.

**Response Sukses:**
- Status: 200
- Body:
  ```json
  {
    "_id": "ObjectId",
    "phone": "08123456789",
    "cloners": [
      {
        "clonerNumber": 1,
        "gmails": [
          {
            "firstName": "Budi",
            "lastName": "Santoso",
            "email": "budi@gmail.com",
            "password": "rahasia",
            "dob": { "month": "01", "date": "15", "year": "1990" },
            "createdAt": "2024-05-01T12:00:00.000Z"
          }
          // ... maksimal 10 akun per cloner
        ]
      }
      // ... maksimal 50 cloner per phone
    ]
  }
  ```

**Response Error:**
- Status: 404 jika phone tidak ditemukan.

---

## 3. POST https://tts.teknologio.id/tevi/:phone/:cloner
**Deskripsi:**
Menambahkan **satu akun Gmail** ke cloner tertentu pada phone.
Jika phone atau cloner belum ada, akan dibuat otomatis.

**Request:**
- URL Parameter:
  - `phone` (string): Nomor telepon.
  - `cloner` (number): Nomor cloner (1-50).
- Body:
  ```json
  {
    "firstName": "Budi",
    "lastName": "Santoso",
    "email": "budi@gmail.com",
    "password": "rahasia",
    "dob": { "month": "01", "date": "15", "year": "1990" }
  }
  ```

**Response Sukses:**
- Status: 200
- Body: Data phone terbaru (berisi semua cloner dan gmails).

**Response Error:**
- Status: 400 jika data tidak lengkap, sudah ada 10 akun di cloner, atau sudah ada 50 cloner di phone.

---

## 4. GET https://tts.teknologio.id/tevi/:phone/:cloner
**Deskripsi:**
Mengambil seluruh akun Gmail pada cloner tertentu dari phone.

**Request:**
- URL Parameter:
  - `phone` (string): Nomor telepon.
  - `cloner` (number): Nomor cloner (1-50).

**Response Sukses:**
- Status: 200
- Body:
  ```json
  {
    "clonerNumber": 1,
    "gmails": [
      {
        "firstName": "Budi",
        "lastName": "Santoso",
        "email": "budi@gmail.com",
        "password": "rahasia",
        "dob": { "month": "01", "date": "15", "year": "1990" },
        "createdAt": "2024-05-01T12:00:00.000Z"
      }
      // ... maksimal 10 akun
    ]
  }
  ```

**Response Error:**
- Status: 404 jika phone atau cloner tidak ditemukan.

---

## 5. DELETE https://tts.teknologio.id/tevi/:phone/:cloner
**Deskripsi:**
Menghapus cloner tertentu dari phone.

**Request:**
- URL Parameter:
  - `phone` (string): Nomor telepon.
  - `cloner` (number): Nomor cloner (1-50).

**Response Sukses:**
- Status: 200
- Body:
  ```json
  {
    "message": "Cloner dihapus",
    "tevi": { ...data phone terbaru... }
  }
  ```

**Response Error:**
- Status: 404 jika phone tidak ditemukan.

---

### Catatan
- Maksimal 50 cloner per phone.
- Maksimal 10 akun Gmail per cloner.
- Field `dob` wajib berisi object `{ month, date, year }`.
- Password **belum di-hash** (perlu perhatian untuk keamanan). 