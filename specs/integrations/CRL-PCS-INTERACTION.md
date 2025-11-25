# How CRL/FormFox Plugs Into Patriot Compliance System

---

## The Big Picture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                        PATRIOT COMPLIANCE SYSTEM                            │
│                              (Your System)                                  │
│                                                                             │
│   ┌───────────────┐   ┌───────────────┐   ┌───────────────┐                │
│   │  Employees    │   │    Orders     │   │   Results     │                │
│   │  Database     │   │   Manager     │   │   Storage     │                │
│   └───────┬───────┘   └───────┬───────┘   └───────▲───────┘                │
│           │                   │                   │                        │
│           │                   │                   │                        │
│   ┌───────▼───────────────────▼───────────────────┴───────┐                │
│   │                                                        │                │
│   │                 CRL INTEGRATION LAYER                  │                │
│   │                                                        │                │
│   └───────────────────────────┬────────────────────────────┘                │
│                               │                                             │
└───────────────────────────────┼─────────────────────────────────────────────┘
                                │
                         ═══════╪═══════  INTERNET
                                │
                    ┌───────────▼───────────┐
                    │                       │
                    │     CRL / FORMFOX     │
                    │    (External Service) │
                    │                       │
                    └───────────────────────┘
```

---

## What PCS Sends TO CRL

```
                    PATRIOT COMPLIANCE SYSTEM
                    ┌─────────────────────┐
                    │                     │
                    │   Your Employee     │
                    │   Your Order        │
                    │   Your Request      │
                    │                     │
                    └──────────┬──────────┘
                               │
                               │  YOU SEND
                               │
               ┌───────────────┼───────────────┐
               │               │               │
               ▼               ▼               ▼

        ┌──────────┐    ┌──────────┐    ┌──────────┐
        │  SEARCH  │    │  ORDER   │    │  MANAGE  │
        └──────────┘    └──────────┘    └──────────┘

        "Find clinics    "Test this      "Change it"
         near 75001"      employee"       "Cancel it"
                                          "Get auth PDF"
```

### Search Request
```
PCS ────────────────────────────────────────────► CRL

     {
       ZIP code: 75001
       Services needed: ["Drug Test", "Physical"]
       Search radius: 25 miles
     }
```

### Create Order Request
```
PCS ────────────────────────────────────────────► CRL

     {
       Employee: John Smith
       SSN: xxx-xx-1234
       DOB: 1985-03-15
       Phone: 555-123-4567

       Company: ABC Trucking

       Clinic ID: 12345 (from search)
       Test Type: Pre-Employment Drug Test
       DOT: Yes
     }
```

---

## What PCS Receives FROM CRL

```
                    ┌─────────────────────┐
                    │                     │
                    │    CRL / FORMFOX    │
                    │                     │
                    └──────────┬──────────┘
                               │
                               │  THEY SEND
                               │
       ┌───────────┬───────────┼───────────┬───────────┐
       │           │           │           │           │
       ▼           ▼           ▼           ▼           ▼

  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
  │ Clinic  │ │ Order   │ │ Status  │ │ Results │ │  MRO    │
  │  List   │ │Confirm  │ │ Updates │ │ + PDFs  │ │ Decision│
  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘

  "Here are    "Order      "Employee   "Test done,  "Doctor
   5 clinics"  #12345      arrived"    here's CCF"  verified
               created"    "Collected"              negative"
                           "At lab"
```

### Clinic List Response
```
CRL ────────────────────────────────────────────► PCS

     [
       { Clinic: "QuickCare", ID: 12345, Distance: 2.1 mi },
       { Clinic: "LabCorp",   ID: 67890, Distance: 4.3 mi },
       ...
     ]
```

### Order Confirmation Response
```
CRL ────────────────────────────────────────────► PCS

     {
       Reference ID: 98765  ← SAVE THIS! Links everything
       Status: "Approved"
       Marketplace Order #: MPO-2024-12345
     }
```

### Status Updates (Automatic Push)
```
CRL ════════════════════════════════════════════► PCS

     Update 1: { Order: 98765, Status: "Employee arrived" }
     Update 2: { Order: 98765, Status: "Collection complete" }
     Update 3: { Order: 98765, Status: "Specimen at lab" }
     Update 4: { Order: 98765, Status: "Testing in progress" }
```

### Results (Automatic Push)
```
CRL ════════════════════════════════════════════► PCS

     {
       Order: 98765
       Result: "NEGATIVE"
       Documents: [
         { name: "Chain of Custody", pdf: "base64..." }
       ]
     }
```

---

## The Complete Interaction Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PATRIOT COMPLIANCE SYSTEM                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐                                                            │
│  │  EMPLOYEES  │ ─── Employee data (name, SSN, DOB, phone)                 │
│  └──────┬──────┘                          │                                 │
│         │                                 │                                 │
│         ▼                                 ▼                                 │
│  ┌─────────────────────────────────────────────────────┐                   │
│  │                                                     │                   │
│  │              CRL INTEGRATION MODULE                 │                   │
│  │                                                     │                   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌────────┐ │                   │
│  │  │ Search  │  │ Create  │  │ Webhook │  │ Store  │ │                   │
│  │  │ Clinics │  │ Orders  │  │Listener │  │Results │ │                   │
│  │  └────┬────┘  └────┬────┘  └────▲────┘  └────▲───┘ │                   │
│  │       │            │            │            │      │                   │
│  └───────┼────────────┼────────────┼────────────┼──────┘                   │
│          │            │            │            │                          │
└──────────┼────────────┼────────────┼────────────┼──────────────────────────┘
           │            │            │            │
           │ SEND       │ SEND       │ RECEIVE    │ RECEIVE
           │            │            │            │
           ▼            ▼            │            │
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                            CRL / FORMFOX                                 │
│                                                                          │
│    Clinics ──────►  Orders ──────►  Collection ──────►  Lab ──────► MRO │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## PCS Components That Talk to CRL

### Component 1: Clinic Finder
```
┌──────────────────────────────────────────────────────────────┐
│  PCS: CLINIC FINDER                                          │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  INPUT (from your UI):                                       │
│  • ZIP code or address                                       │
│  • What services needed                                      │
│  • How far willing to travel                                 │
│                                                              │
│                         │                                    │
│                         ▼                                    │
│              ┌─────────────────────┐                        │
│              │   Call CRL Search   │ ──────► CRL            │
│              └─────────────────────┘ ◄────── CRL            │
│                         │                                    │
│                         ▼                                    │
│                                                              │
│  OUTPUT (to your UI):                                        │
│  • List of clinics with names, addresses, distances         │
│  • Clinic IDs (needed for ordering)                         │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Component 2: Order Creator
```
┌──────────────────────────────────────────────────────────────┐
│  PCS: ORDER CREATOR                                          │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  INPUT (from your database + UI):                            │
│  • Employee record from PCS database                         │
│  • Selected clinic ID (from Clinic Finder)                   │
│  • Test type (drug, physical, etc.)                         │
│  • Reason (pre-employment, random, etc.)                    │
│                                                              │
│                         │                                    │
│                         ▼                                    │
│              ┌─────────────────────┐                        │
│              │  Call CRL Create    │ ──────► CRL            │
│              │      Order          │ ◄────── CRL            │
│              └─────────────────────┘                        │
│                         │                                    │
│                         ▼                                    │
│                                                              │
│  OUTPUT:                                                     │
│  • Reference ID (STORE THIS - links all updates)            │
│  • Authorization sent to employee (email/text)              │
│                                                              │
│  STORE IN PCS:                                               │
│  • Order record linked to employee                          │
│  • Reference ID for tracking                                │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Component 3: Webhook Listener
```
┌──────────────────────────────────────────────────────────────┐
│  PCS: WEBHOOK LISTENER                                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  This is an ENDPOINT that CRL calls when things happen       │
│                                                              │
│              CRL ──────────────────────┐                    │
│                                        │                    │
│                                        ▼                    │
│              ┌─────────────────────────────────┐            │
│              │  PCS Webhook Endpoint           │            │
│              │  POST /api/webhooks/crl         │            │
│              └─────────────────────────────────┘            │
│                         │                                    │
│                         ▼                                    │
│              ┌─────────────────────────────────┐            │
│              │  What type of update?           │            │
│              └─────────────────────────────────┘            │
│                    │         │         │                    │
│           ┌────────┘         │         └────────┐          │
│           ▼                  ▼                  ▼          │
│     ┌──────────┐      ┌──────────┐      ┌──────────┐       │
│     │  Status  │      │  Result  │      │   MRO    │       │
│     │  Update  │      │  + PDFs  │      │ Decision │       │
│     └────┬─────┘      └────┬─────┘      └────┬─────┘       │
│          │                 │                 │              │
│          ▼                 ▼                 ▼              │
│     ┌─────────────────────────────────────────────┐        │
│     │         UPDATE PCS DATABASE                  │        │
│     │  • Update order status                       │        │
│     │  • Store result                              │        │
│     │  • Save PDF documents                        │        │
│     │  • Update employee compliance record         │        │
│     └─────────────────────────────────────────────┘        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Timeline View: What Happens When

```
TIME        PCS ACTION                    CRL ACTION
─────────────────────────────────────────────────────────────────────

 T+0        User clicks
            "New Drug Test"
                 │
                 ▼
 T+1        Search clinics ──────────────► Returns clinic list
                 │
                 ▼
 T+2        User selects clinic
                 │
                 ▼
 T+3        Create order ────────────────► Returns Reference ID
                 │                                   │
                 ▼                                   ▼
 T+4        Store order in PCS            Sends auth to employee
            (status: PENDING)

─────────────────────────────────────────────────────────────────────
            EMPLOYEE GOES TO CLINIC (hours/days later)
─────────────────────────────────────────────────────────────────────

 T+X                                      Employee arrives
                 │                                   │
                 ▼                                   ▼
            ◄──────────────────────────── Webhook: "Arrived"
                 │
                 ▼
            Update PCS status
            (status: ACTIVE)

            ◄──────────────────────────── Webhook: "Collected"
                 │
                 ▼
            Update PCS status
            (status: COLLECTED)

            ◄──────────────────────────── Webhook: "At Lab"
                 │
                 ▼
            Update PCS status
            (status: IN_LAB)

─────────────────────────────────────────────────────────────────────
            LAB PROCESSES (2-3 days)
─────────────────────────────────────────────────────────────────────

            ◄──────────────────────────── Webhook: "NEGATIVE" + PDF
                 │
                 ▼
            Store result in PCS
            Store PDF document
            Update employee record
            (status: COMPLETE)
                 │
                 ▼
            Show in dashboard ✓
```

---

## What PCS Must Store

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          PCS DATABASE                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ORDERS TABLE                                                               │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │ id │ employee_id │ crl_reference_id │ status    │ created_at       │    │
│  │ 1  │ emp_001     │ 98765            │ COMPLETE  │ 2024-01-15       │    │
│  │ 2  │ emp_002     │ 98766            │ IN_LAB    │ 2024-01-16       │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│         │                   │                                               │
│         │                   └──── This links to all CRL updates            │
│         │                                                                   │
│         ▼                                                                   │
│  RESULTS TABLE                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │ id │ order_id │ result   │ mro_decision │ result_date              │    │
│  │ 1  │ 1        │ NEGATIVE │ null         │ 2024-01-18               │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  DOCUMENTS TABLE                                                            │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │ id │ order_id │ type              │ file_path                      │    │
│  │ 1  │ 1        │ Chain of Custody  │ /docs/orders/1/ccf.pdf         │    │
│  │ 2  │ 1        │ Authorization     │ /docs/orders/1/auth.pdf        │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

WHY? CRL doesn't store your history. You can't ask them "show me all tests
     from last year." You must save everything they send you.
```

---

## Summary: PCS ↔ CRL Interaction

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                    PATRIOT COMPLIANCE SYSTEM                         │  │
│   │                                                                      │  │
│   │   Employees    Orders    Results    Documents    Dashboard          │  │
│   │       │           │          ▲           ▲            ▲             │  │
│   │       │           │          │           │            │             │  │
│   │       └─────┬─────┘          └─────┬─────┘            │             │  │
│   │             │                      │                  │             │  │
│   │             ▼                      │                  │             │  │
│   │   ┌─────────────────────────────────────────────────────────┐      │  │
│   │   │              CRL INTEGRATION LAYER                       │      │  │
│   │   │                                                          │      │  │
│   │   │   OUTBOUND (we call)         INBOUND (they call us)     │      │  │
│   │   │   ──────────────────         ─────────────────────      │      │  │
│   │   │   • Search clinics           • Status webhooks          │      │  │
│   │   │   • Create order             • Result webhooks          │      │  │
│   │   │   • Update order             • MRO webhooks             │      │  │
│   │   │   • Cancel order             • PDF documents            │      │  │
│   │   │   • Get authorization                                   │      │  │
│   │   │                                                          │      │  │
│   │   └─────────────────────────────────────────────────────────┘      │  │
│   │                          │              ▲                          │  │
│   └──────────────────────────┼──────────────┼──────────────────────────┘  │
│                              │              │                             │
│                              │              │                             │
│                    WE SEND   │              │   THEY SEND                │
│                              │              │                             │
│                              ▼              │                             │
│                    ┌─────────────────────────────┐                       │
│                    │                             │                       │
│                    │       CRL / FORMFOX         │                       │
│                    │      (Black Box)            │                       │
│                    │                             │                       │
│                    │   Clinics → Collection →    │                       │
│                    │   Lab → MRO                 │                       │
│                    │                             │                       │
│                    └─────────────────────────────┘                       │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘


SIMPLE VERSION:

     ┌─────┐         "Find, Create, Manage"          ┌─────┐
     │ PCS │ ───────────────────────────────────────► │ CRL │
     │     │ ◄═══════════════════════════════════════ │     │
     └─────┘         "Status, Results, PDFs"         └─────┘
                     (automatic updates)
```

---

## Nano-Banana Prompt

```
Create a simple system integration diagram.

Left side: Large rounded rectangle labeled "PATRIOT COMPLIANCE SYSTEM (PCS)"
containing three smaller boxes stacked vertically:
- "Employees" (person icon)
- "Orders" (clipboard icon)
- "Results" (document icon)

Right side: Cloud shape labeled "CRL/FormFox" with "External Service" subtitle

Between them, two arrows:
1. Solid arrow pointing RIGHT labeled "Search, Order, Manage"
2. Double-line arrow pointing LEFT labeled "Status Updates, Results, PDFs"

Below the diagram, simple text: "PCS sends requests → CRL does the work → CRL sends updates back"

Style: Clean corporate diagram, blue and gray colors, minimal,
suitable for executive presentation. No technical jargon.
```
