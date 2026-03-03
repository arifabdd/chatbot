1️⃣ Core Architecture Rules
1.1 Multi-Tenancy Isolation

Hər bir tenant-ın məlumatları logical isolation prinsipi ilə ayrılmalıdır.

Bütün sorğular:

tenant_id filter ilə gəlməlidir.

Global scope istifadə edilməlidir (mümkündürsə).

Heç bir halda:

Tenant A, Tenant B məlumatına çıxış edə bilməz.

Cache açarları tenant-aware olmalıdır:

tenant:{tenant_id}:faq:{id}
1.2 Driver-Based Channel Architecture

WhatsApp, Telegram və gələcək kanallar üçün:

Hər kanal ayrıca driver class olmalıdır.

ChannelDriverInterface istifadə edilməlidir.

Məsələn:

interface ChannelDriverInterface {
    public function send(MessageDTO $message);
    public function handleWebhook(array $payload);
}

Yeni kanal əlavə ediləndə:

Mövcud kod dəyişdirilməməlidir (OCP prinsipi).

Sadəcə yeni driver implement edilməlidir.

1.3 Queue First Principle

Aşağıdakılar synchronous işləməməlidir:

AI response generation

Webhook processing

Notification dispatch

Analytics counting

Hamısı queue üzərindən işləməlidir.

2️⃣ AI & Message Processing Rules
2.1 FAQ First, AI Second

Mesaj emalı ardıcıllığı:

Normalize message

FAQ matching

Confidence threshold yoxlanışı

Əgər uyğun cavab yoxdursa → AI fallback

AI yalnız fallback kimi işləməlidir.

2.2 Context Window Limiti

AI çağırışı zamanı:

Maksimum son 10 mesaj

System prompt tenant-specific olmalıdır

Token limiti nəzərə alınmalıdır

Böyük tarixçə Redis və ya summary mexanizmi ilə optimizasiya edilməlidir

2.3 AI Safety & Abuse Protection

Prompt injection yoxlanmalıdır

Rate limiting tətbiq olunmalıdır

Tenant başına aylıq AI limit sistemi qurulmalıdır

Abuse detection logging olmalıdır

3️⃣ Security Rules
3.1 Credential Encryption

Aşağıdakılar mütləq encrypt olunmalıdır:

WhatsApp API key

Telegram Bot Token

OpenAI API key

Payment credentials

Heç vaxt:

Log-larda açıq göstərilməməlidir

Frontend-ə göndərilməməlidir

3.2 Webhook Security

Signature validation

IP whitelist (mümkündürsə)

Replay attack prevention

Failed webhook-lar log olunmalıdır

3.3 Tenant Authorization

Hər request-də tenant context resolve edilməlidir

Policy-based authorization istifadə edilməlidir

Super Admin override qaydası açıq şəkildə müəyyən edilməlidir

4️⃣ Code Quality Rules
4.1 SOLID Principles

Kod aşağıdakılara uyğun olmalıdır:

SRP – Service class-lar yalnız bir məsuliyyət daşımalıdır

OCP – Yeni kanal üçün mövcud kod dəyişməməlidir

DIP – Interface üzərindən dependency injection istifadə edilməlidir

4.2 Service Layer Pattern

Controller-lər:

Business logic saxlamamalıdır

Yalnız request validation + service call etməlidir

4.3 DTO Usage

Message və AI request-lər üçün:

Raw array istifadə edilməməlidir

Typed DTO istifadə edilməlidir

5️⃣ Performance & Scaling Rules
5.1 Caching Strategy

Cache edilə bilənlər:

FAQ list

Tenant config

AI system prompt

TTL tenant plan-a görə dəyişə bilər.

5.2 Database Indexing

Index olunmalıdır:

tenant_id

conversation_id

channel

created_at

5.3 Rate Limiting

Limitlər:

Message per minute

AI request per hour

Webhook retry limit

6️⃣ Logging & Observability
6.1 Structured Logging

Log formatı:

tenant_id
conversation_id
channel
status
error_code
execution_time
6.2 Error Dashboard

Dashboard-da göstərilməlidir:

Failed webhook

AI timeout

Rate limit breach

Payment failure

7️⃣ Production Readiness Rules
7.1 Docker Standards

Separate containers:

app

queue worker

redis

database

Health check endpoint olmalıdır

7.2 CI/CD Rules

Pipeline mərhələləri:

Lint

Test

Build

Deploy

Main branch → production
Develop branch → staging

8️⃣ Anti-Gravity Principles (Project Philosophy)

Bu layihədə:

❌ Quick hack qəbul edilmir

❌ Tenant isolation pozula bilməz

❌ Synchronous AI processing olmaz

❌ Hardcoded config olmaz

❌ Silent fail olmaz

Hər şey:

Observable

Scalable

Extensible

Secure

olmalıdır.