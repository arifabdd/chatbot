# AI Chatbot Platform - Layihə Roadmap-i

Bu sənəd layihənin inkişaf mərhələlərini və cari vəziyyətini əks etdirir.

## ✅ Tamamlanan Fazalar

### Faza 1 & 2: Əsas İnfrastruktur və UI
- **Multi-tenancy**: Hər bir müştəri (tenant) üçün təcrid olunmuş məlumat bazası məntiqi.
- **Admin Panellər**: Super Admin və Tenant Admin üçün modern, dark-theme dəstəkli dashboard-lar.
- **Vite + React**: Sürətli və dinamik SPA təcrübəsi (Inertia.js).
- **Dizayn Sistemi**: Tailwind CSS 기반 Shadcn/UI komponentləri.

### Faza 3: Mesajlaşma İnteqrasiyası
- **WhatsApp & Telegram Drivers**: Mesaj göndərmə və gələn mesajları qəbul etmə (Webhooks).
- **Background Processing**: Mesajlar bazaya yazılır və arxa fonda Queue vasitəsilə emal olunur.
- **Təhlükəsizlik**: Kanal məlumatları (bot token, api key) bazada şifrələnmiş şəkildə saxlanılır.

### Faza 4: AI & FAQ Engine
- **FAQ Matching**: Gələn mesajı FAQ bazası ilə avtomatik müqayisə edir.
- **OpenAI Fallback**: Əgər FAQ-da cavab tapılmasa, süni intellekt (OpenAI) işə düşür və tenant-ın xüsusi "System Prompt"-una uyğun cavab verir.
- **Chat History**: AI cavab verərkən söhbətin tarixçəsini (son 10 mesajı) nəzərə alır.

---

## 🚀 Növbəti Addımlar (Cari və Gələcək)

### Faza 5: Polish & Analytics (Cari Mərhələ)
- [x] **SEO & Meta**: FAQ Schema (JSON-LD) və Canonical URL-lərin əlavə edilməsi.
- [x] **UI Fixes**: Bloq kartlarının, FancyBox qalereyasının və digər vizual xətaların düzəldilməsi.
- [ ] **Analitika**: FAQ istifadə statistikası və AI cavab sayğacları.
- [ ] **Error Logging**: Uğursuz webhook-ların və API xətalarının dashboard-da göstərilməsi.

### Faza 6: Production Readiness & Scaling
- [ ] **Söhbətlər & Kontaktlar**: Aktiv söhbətlərin idarə olunması və müştəri kontakt siyahısının formalaşdırılması.
- [ ] **Dockerization**: Layihənin Docker konteynerlərinə köçürülməsi.
- [ ] **CI/CD**: Avtomatik test və deployment (GitHub Actions) qurulması.
- [ ] **Live Chat**: Lazım gəldikdə operatorun söhbətə müdaxilə edə biləcəyi panel (Human-in-the-loop).

### Faza 7: Advanced Features
- [ ] **Voice Support**: Səsli mesajların (STT/TTS) emalı.
- [ ] **Subscription & Payment**: Tenantlar üçün aylıq abunəlik və ödəniş sistemləri.
- [ ] **Multi-language**: Panelin və chatbotun çoxdilli dəstəyi.

---
*Son yenilənmə: 3 Mart 2026*
