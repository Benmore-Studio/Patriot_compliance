# Data Model - Complete Database Schema

**Document Version:** 1.0
**Created:** 2025-11-24
**Database:** PostgreSQL 15
**ORM:** Prisma 5.x
**Total Models:** 22
**Total Enums:** 18

---

## Table of Contents

1. [Schema Overview](#schema-overview)
2. [Multi-Tenant Architecture](#multi-tenant)
3. [Core Models](#core-models)
4. [Compliance Module Models](#compliance-models)
5. [Auth & Security Models](#auth-models)
6. [Audit & Logging Models](#audit-models)
7. [Enumerations](#enumerations)
8. [Indexes & Performance](#indexes)
9. [Encryption Strategy](#encryption)
10. [Data Retention](#retention)

---

## Schema Overview {#schema-overview}

```
DATABASE SCHEMA (22 Models)
════════════════════════════════════════════════════════════════

┌───────────────────────────────────────────────────────────┐
│                   CORE MODELS (6)                          │
├───────────────────────────────────────────────────────────┤
│  • Tenant              (compliance companies, service cos) │
│  • User                (authentication, authorization)     │
│  • Employee            (workforce roster)                  │
│  • ServiceCompany      (multi-tenant service companies)    │
│  • ComplianceCompany   (MSP parent companies)              │
│  • Location            (facilities, worksites)             │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│              COMPLIANCE MODULES (8)                        │
├───────────────────────────────────────────────────────────┤
│  • DrugTest            (drug & alcohol testing)            │
│  • BackgroundCheck     (criminal, credit, employment)      │
│  • DOTRecord           (driver qualification files)        │
│  • HealthRecord        (occupational health, OSHA 300)     │
│  • TrainingRecord      (certificates, expiration tracking) │
│  • GeoZone             (geo-fence polygons, PostGIS)       │
│  • GeoCheckIn          (GPS/QR check-ins)                  │
│  • Policy              (compliance rules, thresholds)      │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│              AUDIT & SECURITY (4)                          │
├───────────────────────────────────────────────────────────┤
│  • AuditLog            (immutable audit trail)             │
│  • SecurityIncident    (security events, breaches)         │
│  • POAM                (FedRAMP remediation tracking)      │
│  • VulnerabilityScan   (Nessus/Qualys results)             │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│              SUPPORTING MODELS (4)                         │
├───────────────────────────────────────────────────────────┤
│  • Alert               (compliance alerts, notifications)  │
│  • Report              (scheduled reports)                 │
│  • ExportRequest       (PII export dual control)           │
│  • ShareLink           (time-limited external access)      │
└───────────────────────────────────────────────────────────┘
```

---

## Multi-Tenant Architecture {#multi-tenant}

```
TENANT HIERARCHY
════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────┐
│              COMPLIANCE COMPANY (MSP Parent)                 │
│  id: cc_001                                                  │
│  name: "Chevron Compliance Services"                         │
│  type: COMPLIANCE_COMPANY                                    │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐    │
│  │   SERVICE COMPANY 1                                  │    │
│  │   id: sc_001                                         │    │
│  │   name: "Acme Drilling LLC"                          │    │
│  │   compliance_company_id: cc_001                      │    │
│  │   ├── Employees: 500                                 │    │
│  │   └── Users: 10 (system_admin, der, safety_manager)  │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │   SERVICE COMPANY 2                                  │    │
│  │   id: sc_002                                         │    │
│  │   name: "Gulf Coast Transport Inc"                   │    │
│  │   compliance_company_id: cc_001                      │    │
│  │   ├── Employees: 750                                 │    │
│  │   └── Users: 8                                       │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  Users (Compliance Company Level):                           │
│  ├── compliance_company_admin (manages all service cos)      │
│  ├── senior_auditor (assigned to specific service cos)       │
│  └── audit_manager (approves audits, PII exports)            │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Models {#core-models}

### Tenant (Compliance Company or Service Company)

```prisma
model Tenant {
  id                  String            @id @default(uuid())
  name                String
  type                TenantType        @default(SERVICE_COMPANY)

  // Multi-tenant MSP support
  parentTenantId      String?
  parentTenant        Tenant?           @relation("TenantHierarchy", fields: [parentTenantId], references: [id])
  childTenants        Tenant[]          @relation("TenantHierarchy")

  // Subscription
  subscriptionTier    SubscriptionTier  @default(STANDARD)
  subscriptionStatus  SubscriptionStatus @default(ACTIVE)
  billingEmail        String?

  // Settings
  settings            Json              @default("{}")

  // Status
  isActive            Boolean           @default(true)
  onboardedAt         DateTime?
  createdAt           DateTime          @default(now())
  updatedAt           DateTime          @updatedAt

  // Relations
  users               User[]
  employees           Employee[]
  policies            Policy[]
  locations           Location[]

  @@index([type, isActive])
  @@index([parentTenantId])
}

enum TenantType {
  COMPLIANCE_COMPANY  // MSP parent company
  SERVICE_COMPANY     // Individual client company
}

enum SubscriptionTier {
  STARTER
  STANDARD
  PROFESSIONAL
  ENTERPRISE
}

enum SubscriptionStatus {
  TRIAL
  ACTIVE
  PAST_DUE
  CANCELED
  SUSPENDED
}
```

**Relationships:**

```
Compliance Company (cc_001)
      ├── Service Company 1 (sc_001)
      │   ├── Employees: 500
      │   └── Users: 10
      ├── Service Company 2 (sc_002)
      │   ├── Employees: 750
      │   └── Users: 8
      └── Users: 5 (compliance_company_admin, senior_auditor, audit_manager)
```

---

### User (Authentication & Authorization)

```prisma
model User {
  id                    String      @id @default(uuid())
  email                 String      @unique
  passwordHash          String
  firstName             String
  lastName              String
  phone                 String?
  avatar                String?

  // RBAC
  role                  Role
  tenantId              String
  tenant                Tenant      @relation(fields: [tenantId], references: [id])

  // MFA
  mfaEnabled            Boolean     @default(false)
  mfaSecret             String?     // TOTP secret (encrypted)
  mfaBackupCodes        String[]    // Hashed backup codes

  // Identity Verification
  identityVerified      Boolean     @default(false)
  identityProvider      String?     // "idme", "saml", null
  identityVerificationLevel String? // "IAL1", "IAL2"
  idmeSub               String?     @unique
  samlNameId            String?     @unique

  // Account Status
  status                UserStatus  @default(PENDING_ACTIVATION)
  isActive              Boolean     @default(true)

  // Timestamps
  createdAt             DateTime    @default(now())
  updatedAt             DateTime    @updatedAt
  lastLoginAt           DateTime?
  recertifiedAt         DateTime?   // Quarterly for privileged users

  // MSP scoping (for compliance_company roles)
  assignedServiceCompanyIds String[] @default([])

  @@index([tenantId, role])
  @@index([email])
  @@index([status, isActive])
}

enum Role {
  super_admin
  pcs_security_officer
  information_system_owner
  system_admin
  compliance_company_admin
  der
  safety_manager
  compliance_officer
  senior_auditor
  audit_manager
  field_worker
  auditor
}

enum UserStatus {
  PENDING_ACTIVATION   // User created, waiting for first login
  ACTIVE               // Normal active state
  INACTIVE             // 90 days no login
  DISABLED             // Terminated, account disabled
  LOCKED               // Failed login attempts
}
```

---

### Employee (Workforce Roster)

```prisma
model Employee {
  id                String            @id @default(uuid())
  tenantId          String
  tenant            Tenant            @relation(fields: [tenantId], references: [id])

  // Basic Info
  firstName         String
  lastName          String
  email             String?
  phone             String?

  // Encrypted PII (field-level encryption)
  ssnEncrypted      String?           // AES-256 encrypted SSN
  dobEncrypted      String?           // AES-256 encrypted DOB

  // Employment
  employeeNumber    String?
  hireDate          DateTime?
  terminationDate   DateTime?
  status            EmployeeStatus    @default(ACTIVE)
  role              EmployeeRole?
  department        String?

  // Location
  locationId        String?
  location          Location?         @relation(fields: [locationId], references: [id])

  // Compliance Data (JSONB - flexible schema)
  complianceData    Json              @default("{}")

  // Timestamps
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt

  // Relations
  drugTests         DrugTest[]
  backgroundChecks  BackgroundCheck[]
  dotRecords        DOTRecord[]
  healthRecords     HealthRecord[]
  trainingRecords   TrainingRecord[]
  geoCheckIns       GeoCheckIn[]

  @@index([tenantId, status])
  @@index([tenantId, lastName])
  @@index([employeeNumber])
  @@index([status, role])
}

enum EmployeeStatus {
  ACTIVE
  INACTIVE
  LEAVE_OF_ABSENCE
  TERMINATED
}

enum EmployeeRole {
  CDL_DRIVER
  FORKLIFT_OPERATOR
  HEAVY_EQUIPMENT_OPERATOR
  GENERAL_LABORER
  MECHANIC
  SUPERVISOR
  MANAGER
  ADMINISTRATIVE
}
```

**complianceData JSON Schema:**

```json
{
  "drugTesting": {
    "status": "compliant|at_risk|non_compliant",
    "flag": "green|amber|red",
    "lastTestDate": "2025-09-15",
    "nextRandomDate": "2026-01-10",
    "violations": [],
    "mroReviews": []
  },
  "background": {
    "status": "compliant|pending|non_compliant",
    "flag": "green|amber|red",
    "lastCheckDate": "2024-06-01",
    "expirationDate": "2027-06-01",
    "adjudication": "approved|denied|pending",
    "continuousMonitoring": true,
    "reports": []
  },
  "dot": {
    "status": "compliant|non_compliant",
    "flag": "green|amber|red",
    "medicalCertExpiration": "2026-03-15",
    "clearinghouseStatus": "clean|prohibited",
    "lastClearinghouseQuery": "2025-11-01",
    "dqFileComplete": true
  },
  "health": {
    "status": "compliant|non_compliant",
    "flag": "green|amber|red",
    "respiratorFitTest": {
      "lastTest": "2025-06-15",
      "expires": "2026-06-15",
      "result": "PASS"
    },
    "audiogram": {
      "lastTest": "2025-01-10",
      "result": "WITHIN_NORMAL_LIMITS"
    }
  },
  "training": {
    "status": "compliant|at_risk|non_compliant",
    "flag": "green|amber|red",
    "certificates": {
      "forklift": {
        "expires": "2025-12-15",
        "daysRemaining": 21,
        "status": "EXPIRING_SOON"
      },
      "hazmat": {
        "expires": "2026-05-10",
        "status": "VALID"
      }
    }
  },
  "geoFencing": {
    "lastCheckIn": "2025-11-24T08:00:00Z",
    "currentZone": "zone_001",
    "complianceStatus": "compliant"
  }
}
```

**Indexes:**

```sql
-- GIN index for JSONB queries
CREATE INDEX idx_employee_compliance_data ON employees USING GIN (compliance_data);

-- Query examples:
-- Find all employees with expired forklift certs
SELECT * FROM employees
WHERE compliance_data->'training'->'certificates'->'forklift'->>'status' = 'EXPIRED';

-- Find employees with positive drug tests
SELECT * FROM employees
WHERE compliance_data->'drugTesting'->>'status' = 'non_compliant';
```

---

### Location (Facilities, Worksites)

```prisma
model Location {
  id                String      @id @default(uuid())
  tenantId          String
  tenant            Tenant      @relation(fields: [tenantId], references: [id])

  name              String
  type              LocationType @default(FACILITY)

  // Address
  street            String
  city              String
  state             String
  zipCode           String
  country           String      @default("US")

  // Geo coordinates
  latitude          Float?
  longitude         Float?

  // Compliance
  requiresCheckIn   Boolean     @default(false)
  complianceRequirements Json   @default("[]")

  // Status
  isActive          Boolean     @default(true)
  createdAt         DateTime    @default(now())

  // Relations
  employees         Employee[]
  geoZones          GeoZone[]

  @@index([tenantId, isActive])
  @@index([state, city])
}

enum LocationType {
  FACILITY
  WORKSITE
  COLLECTION_SITE
  OFFICE
  WAREHOUSE
  REFINERY
  DRILLING_SITE
}
```

---

## Compliance Module Models {#compliance-models}

### DrugTest

```prisma
model DrugTest {
  id                  String      @id @default(uuid())
  employeeId          String
  employee            Employee    @relation(fields: [employeeId], references: [id])
  tenantId            String

  // Test Details
  testType            DrugTestType
  testDate            DateTime
  specimenId          String      @unique
  ccfNumber           String?     // Custody Control Form number

  // Collection
  collectionSite      String?
  collectorName       String?
  collectedAt         DateTime?

  // Results
  result              DrugTestResult?
  mroReviewStatus     MROReviewStatus @default(PENDING)
  mroReviewedBy       String?
  mroReviewedAt       DateTime?
  mroNotes            String?

  // DOT Compliance
  isDOTRegulated      Boolean     @default(false)
  reportedToClearinghouse Boolean @default(false)
  clearinghouseReportedAt DateTime?

  // Substances Tested
  substancesTested    Json        @default("[]")

  // Documents
  documentUrl         String?
  mroLetterUrl        String?

  // Vendor
  vendor              String?     // "quest", "labcorp"
  vendorOrderId       String?

  // Status
  status              DrugTestStatus @default(PENDING_COLLECTION)

  // Timestamps
  createdAt           DateTime    @default(now())
  updatedAt           DateTime    @updatedAt

  @@index([tenantId, employeeId])
  @@index([testDate])
  @@index([status])
  @@index([result, isDOTRegulated])
}

enum DrugTestType {
  PRE_EMPLOYMENT
  RANDOM
  POST_ACCIDENT
  REASONABLE_SUSPICION
  RETURN_TO_DUTY
  FOLLOW_UP
}

enum DrugTestResult {
  NEGATIVE
  POSITIVE
  DILUTE_NEGATIVE
  DILUTE_POSITIVE
  REFUSAL_TO_TEST
  ADULTERATED
  SUBSTITUTED
  INVALID
  CANCELLED
}

enum MROReviewStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

enum DrugTestStatus {
  PENDING_COLLECTION
  SPECIMEN_COLLECTED
  LAB_ANALYSIS
  MRO_REVIEW
  COMPLETED
  CANCELLED
}
```

**substancesTested JSON Schema:**

```json
[
  {
    "substance": "Amphetamines",
    "result": "NEGATIVE",
    "cutoff": "500 ng/mL",
    "concentration": "0 ng/mL"
  },
  {
    "substance": "Cocaine",
    "result": "NEGATIVE",
    "cutoff": "150 ng/mL",
    "concentration": "0 ng/mL"
  },
  {
    "substance": "Marijuana",
    "result": "POSITIVE",
    "cutoff": "50 ng/mL",
    "concentration": "125 ng/mL",
    "confirmed": true,
    "confirmationTest": "GC/MS"
  }
]
```

---

### BackgroundCheck

```prisma
model BackgroundCheck {
  id                  String      @id @default(uuid())
  employeeId          String
  employee            Employee    @relation(fields: [employeeId], references: [id])
  tenantId            String

  // Vendor
  vendor              BackgroundVendor
  vendorReportId      String      @unique

  // Order
  orderDate           DateTime
  package             String      // "standard_criminal", "pro_criminal", etc.
  workLocations       Json        @default("[]")

  // Completion
  completionDate      DateTime?
  status              BackgroundCheckStatus @default(PENDING)
  result              BackgroundCheckResult?

  // Screenings (JSONB - flexible per vendor)
  screenings          Json        @default("[]")

  // Adjudication (FCRA)
  adjudicationStatus  AdjudicationStatus?
  adjudicatedBy       String?
  adjudicatedAt       DateTime?
  adjudicationRationale String?
  adjudicationConditions String[]  @default([])

  // Adverse Action
  adverseActionStatus AdverseActionStatus?
  preAdverseNoticeSentAt DateTime?
  finalAdverseActionSentAt DateTime?
  candidateDisputed   Boolean     @default(false)

  // Continuous Monitoring
  continuousMonitoring Boolean    @default(false)

  // Documents
  documentUrl         String?

  // Timestamps
  createdAt           DateTime    @default(now())
  updatedAt           DateTime    @updatedAt

  @@index([tenantId, employeeId])
  @@index([status])
  @@index([vendor, vendorReportId])
}

enum BackgroundVendor {
  CHECKR
  TAZWORKS
  STERLING
  HIRERIGHT
}

enum BackgroundCheckStatus {
  PENDING
  IN_PROGRESS
  COMPLETE
  DISPUTED
  CANCELLED
}

enum BackgroundCheckResult {
  CLEAR
  CONSIDER
  ENGAGED
}

enum AdjudicationStatus {
  PENDING_REVIEW
  APPROVED
  APPROVED_WITH_CONDITIONS
  DENIED
}

enum AdverseActionStatus {
  PRE_ADVERSE_SENT
  PENDING_7_DAY_WAIT
  CANDIDATE_DISPUTED
  FINAL_ADVERSE_SENT
  CANCELLED
}
```

**screenings JSON Schema (Checkr):**

```json
[
  {
    "type": "county_criminal_search",
    "status": "complete",
    "result": "consider",
    "records": [
      {
        "case_number": "CR-2015-12345",
        "file_date": "2015-03-15",
        "arresting_agency": "SFPD",
        "court_jurisdiction": "San Francisco Superior",
        "charges": [
          {
            "charge": "Theft",
            "classification": "Misdemeanor",
            "disposition": "Guilty",
            "sentence": "Probation - 1 year"
          }
        ]
      }
    ]
  },
  {
    "type": "ssn_trace",
    "status": "complete",
    "result": "clear",
    "addresses": [
      {
        "street": "123 Main St",
        "city": "San Francisco",
        "state": "CA",
        "zipCode": "94103",
        "dates": "2015-Present"
      }
    ]
  },
  {
    "type": "sex_offender_search",
    "status": "complete",
    "result": "clear",
    "records": []
  }
]
```

---

### DOTRecord (Driver Qualification Files)

```prisma
model DOTRecord {
  id                  String      @id @default(uuid())
  employeeId          String
  employee            Employee    @relation(fields: [employeeId], references: [id])
  tenantId            String

  // CDL Details
  cdlNumber           String
  cdlState            String
  cdlClass            CDLClass
  cdlEndorsements     String[]    @default([])

  // Medical Certificate
  medicalCertExpiration DateTime?
  medicalCertUrl      String?

  // Clearinghouse
  clearinghouseStatus ClearinghouseStatus @default(CLEAN)
  lastClearinghouseQueryDate DateTime?
  lastClearinghouseQueryType String? // "FULL", "LIMITED"

  // DQ File Documents (JSONB)
  dqFileDocuments     Json        @default("[]")
  dqFileComplete      Boolean     @default(false)

  // Violations
  violations          Json        @default("[]")

  // Status
  status              DOTStatus   @default(ACTIVE)

  // Timestamps
  createdAt           DateTime    @default(now())
  updatedAt           DateTime    @updatedAt

  @@unique([employeeId])
  @@index([tenantId, employeeId])
  @@index([cdlNumber, cdlState])
  @@index([clearinghouseStatus])
}

enum CDLClass {
  CLASS_A
  CLASS_B
  CLASS_C
}

enum ClearinghouseStatus {
  CLEAN             // No violations
  PROHIBITED        // Violation on record, RTD not completed
  RTD_IN_PROGRESS   // Return-to-duty process started
  RTD_COMPLETED     // Completed RTD, eligible to drive
}

enum DOTStatus {
  ACTIVE
  SUSPENDED
  REVOKED
  TERMINATED
}
```

**dqFileDocuments JSON Schema:**

```json
[
  {
    "documentType": "APPLICATION_FOR_EMPLOYMENT",
    "uploadDate": "2023-01-10",
    "url": "s3://documents/dot/emp_001/application.pdf",
    "status": "VALID"
  },
  {
    "documentType": "MOTOR_VEHICLE_RECORD",
    "uploadDate": "2024-06-01",
    "expirationDate": "2027-06-01",
    "url": "s3://documents/dot/emp_001/mvr.pdf",
    "status": "VALID"
  },
  {
    "documentType": "MEDICAL_CERTIFICATE",
    "uploadDate": "2025-03-15",
    "expirationDate": "2026-03-15",
    "url": "s3://documents/dot/emp_001/medical.pdf",
    "status": "VALID"
  },
  {
    "documentType": "ROAD_TEST_CERTIFICATE",
    "uploadDate": "2023-01-15",
    "url": "s3://documents/dot/emp_001/road_test.pdf",
    "status": "VALID"
  },
  {
    "documentType": "EMPLOYMENT_VERIFICATION_3_YEARS",
    "uploadDate": "2023-01-10",
    "url": "s3://documents/dot/emp_001/employment_history.pdf",
    "status": "VALID"
  }
]
```

---

### HealthRecord (Occupational Health)

```prisma
model HealthRecord {
  id                  String      @id @default(uuid())
  employeeId          String
  employee            Employee    @relation(fields: [employeeId], references: [id])
  tenantId            String

  // Surveillance Type
  surveillanceType    HealthSurveillanceType
  testDate            DateTime

  // Results
  result              String      // "PASS", "FAIL", "WITHIN_NORMAL_LIMITS", etc.
  findings            String?
  recommendations     String?

  // Provider
  provider            String?
  providerNPI         String?     // National Provider Identifier

  // Expiration (for respirator fit tests, etc.)
  expirationDate      DateTime?

  // Documents
  documentUrl         String?

  // OSHA 300 Log (recordable injuries)
  isOSHARecordable    Boolean     @default(false)
  daysAway            Int?
  daysRestricted      Int?

  // Privacy
  hipaaEncrypted      Boolean     @default(true)

  // Timestamps
  createdAt           DateTime    @default(now())

  @@index([tenantId, employeeId])
  @@index([surveillanceType, expirationDate])
  @@index([isOSHARecordable])
}

enum HealthSurveillanceType {
  RESPIRATOR_FIT_TEST
  AUDIOGRAM
  PULMONARY_FUNCTION_TEST
  BLOODBORNE_PATHOGENS
  ASBESTOS_MEDICAL_EXAM
  OSHA_300_INJURY
  MEDICAL_EXAM
  VACCINATION
}
```

---

### TrainingRecord (Certificates)

```prisma
model TrainingRecord {
  id                  String      @id @default(uuid())
  employeeId          String
  employee            Employee    @relation(fields: [employeeId], references: [id])
  tenantId            String

  // Certificate Details
  certificateType     CertificateType
  issuedDate          DateTime
  expirationDate      DateTime?

  // Provider
  provider            String?
  certificateNumber   String?

  // Status (calculated)
  status              CertificateStatus
  daysUntilExpiration Int?

  // Documents
  documentUrl         String?

  // Timestamps
  createdAt           DateTime    @default(now())
  updatedAt           DateTime    @updatedAt

  @@index([tenantId, employeeId])
  @@index([certificateType, expirationDate])
  @@index([status])
}

enum CertificateType {
  FORKLIFT
  HAZMAT
  FIRST_AID
  CPR
  CONFINED_SPACE
  FALL_PROTECTION
  LOCKOUT_TAGOUT
  BLOODBORNE_PATHOGENS
  H2S_AWARENESS
  DEFENSIVE_DRIVING
}

enum CertificateStatus {
  VALID
  EXPIRING_SOON      // 30-90 days
  EXPIRING_CRITICAL  // < 30 days
  EXPIRED
}
```

---

### GeoZone (PostGIS Polygons)

```prisma
model GeoZone {
  id                  String      @id @default(uuid())
  tenantId            String
  tenant              Tenant      @relation(fields: [tenantId], references: [id])

  name                String
  type                GeoZoneType @default(WORKSITE)

  // Geometry (PostGIS)
  coordinates         Json        // GeoJSON Polygon
  radius              Int?        // Meters (if circular)

  // Compliance
  complianceRequirements Json     @default("[]")

  // Location
  locationId          String?
  location            Location?   @relation(fields: [locationId], references: [id])

  // Status
  isActive            Boolean     @default(true)
  createdAt           DateTime    @default(now())

  // Relations
  checkIns            GeoCheckIn[]

  @@index([tenantId, isActive])
}

enum GeoZoneType {
  WORKSITE
  RESTRICTED_AREA
  HAZARDOUS_ZONE
  PARKING_LOT
  BREAK_AREA
}

model GeoCheckIn {
  id                  String      @id @default(uuid())
  employeeId          String
  employee            Employee    @relation(fields: [employeeId], references: [id])
  tenantId            String

  zoneId              String?
  zone                GeoZone?    @relation(fields: [zoneId], references: [id])

  // Check-In Details
  checkInTime         DateTime
  method              CheckInMethod

  // Location
  latitude            Float
  longitude           Float
  accuracy            Int?        // Meters

  // Compliance
  complianceStatus    String      // "COMPLIANT", "NON_COMPLIANT"
  violations          String[]    @default([])

  // Timestamps
  createdAt           DateTime    @default(now())

  @@index([tenantId, employeeId])
  @@index([zoneId, checkInTime])
}

enum CheckInMethod {
  GPS
  QR_CODE
  NFC
  MANUAL
}
```

**PostGIS Extension:**

```sql
-- Enable PostGIS (spatial database extension)
CREATE EXTENSION IF NOT EXISTS postgis;

-- Store geo zone as native PostGIS geometry
ALTER TABLE geo_zones ADD COLUMN geom GEOMETRY(Polygon, 4326);

-- Create spatial index
CREATE INDEX idx_geo_zones_geom ON geo_zones USING GIST (geom);

-- Query: Find zones containing a point
SELECT id, name FROM geo_zones
WHERE ST_Contains(geom, ST_SetSRID(ST_MakePoint(-95.3698, 29.7604), 4326))
  AND tenant_id = 'acme_corp';

-- Insert geo zone from GeoJSON
INSERT INTO geo_zones (id, tenant_id, name, geom)
VALUES (
  'zone_001',
  'acme_corp',
  'Houston Refinery',
  ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[-95.37,29.76],[-95.37,29.77],[-95.36,29.77],[-95.36,29.76],[-95.37,29.76]]]}')
);
```

---

### Policy (Compliance Rules)

```prisma
model Policy {
  id                  String      @id @default(uuid())
  tenantId            String
  tenant              Tenant      @relation(fields: [tenantId], references: [id])

  // Policy Details
  name                String
  description         String?
  complianceType      ComplianceType
  role                EmployeeRole? // null = applies to all roles

  // Rules (JSONB - flexible per compliance type)
  rules               Json

  // Versioning
  version             Int         @default(1)
  isActive            Boolean     @default(true)
  activatedAt         DateTime?
  deactivatedAt       DateTime?

  // Audit
  createdBy           String?
  updatedBy           String?

  // Timestamps
  createdAt           DateTime    @default(now())
  updatedAt           DateTime    @updatedAt

  @@index([tenantId, complianceType])
  @@index([isActive])
}

enum ComplianceType {
  DRUG_TEST
  BACKGROUND
  DOT
  HEALTH
  TRAINING
  GEO_FENCING
}
```

**rules JSON Schema (Drug Testing):**

```json
{
  "testFrequency": {
    "random": "50_percent_annual",
    "preEmployment": "required",
    "postAccident": "required"
  },
  "requiredResult": "NEGATIVE",
  "maxResultAgeDays": 365,
  "warningDays": 30,
  "dotRegulated": true,
  "mroReviewRequired": true,
  "clearinghouseReportingRequired": true
}
```

**rules JSON Schema (Training):**

```json
{
  "certificateType": "FORKLIFT",
  "requiredFrequency": "EVERY_3_YEARS",
  "warningDays": 90,
  "authority": "OSHA",
  "regulation": "29 CFR 1910.178",
  "expirationEnforcement": "STRICT"
}
```

---

## Auth & Security Models {#auth-models}

### Session (Redis, not Prisma)

**Stored in Redis (not PostgreSQL):**

```typescript
interface Session {
  sessionId: string
  userId: string
  tenantId: string
  role: Role

  // Session metadata
  createdAt: Date
  lastActivityAt: Date
  expiresAt: Date

  // Security context
  ipAddress: string
  userAgent: string
  mfaVerified: boolean

  // Device info
  deviceType: 'desktop' | 'mobile' | 'tablet'
  deviceId: string
}

// Redis key pattern
session:{sessionId}

// TTL based on role
Role                    | TTL (seconds)
────────────────────────┼───────────────
super_admin             | 900 (15 min)
pcs_security_officer    | 900 (15 min)
information_system_owner| 1800 (30 min)
system_admin            | 1800 (30 min)
der                     | 3600 (1 hour)
safety_manager          | 7200 (2 hours)
compliance_officer      | 3600 (1 hour)
senior_auditor          | 3600 (1 hour)
audit_manager           | 3600 (1 hour)
field_worker            | 86400 (24 hours)
auditor                 | 3600 (1 hour)
```

---

### ExportRequest (Dual Control)

```prisma
model ExportRequest {
  id                  String      @id @default(uuid())
  tenantId            String

  // Request Details
  requestedBy         String      // User ID
  resource            String      // "employees", "background", "health"
  filters             Json        @default("{}")

  // PII/PHI Detection
  containsPII         Boolean
  containsPHI         Boolean
  fields              String[]

  // Approval
  status              ExportRequestStatus @default(PENDING_APPROVAL)
  approvedBy          String?
  approvedAt          DateTime?
  deniedReason        String?

  // Export File
  exportUrl           String?
  watermarkId         String?
  recordCount         Int?
  expiresAt           DateTime?

  // Timestamps
  createdAt           DateTime    @default(now())

  @@index([tenantId, status])
  @@index([requestedBy])
}

enum ExportRequestStatus {
  PENDING_APPROVAL
  APPROVED
  DENIED
  COMPLETED
  EXPIRED
}
```

---

## Audit & Logging Models {#audit-models}

### AuditLog (Immutable, Append-Only)

```prisma
model AuditLog {
  id                  String      @id @default(uuid())
  timestamp           DateTime    @default(now())
  tenantId            String
  userId              String
  userRole            String

  // Action
  action              AuditAction
  resource            String
  resourceId          String?

  // Context
  ipAddress           String
  userAgent           String
  requestId           String

  // Details (JSONB)
  details             Json

  // Result
  result              AuditResult
  errorMessage        String?
  errorCode           String?

  // Performance
  duration            Int         // Milliseconds

  // Immutability (no updatedAt, no DELETE)
  createdAt           DateTime    @default(now())

  @@index([tenantId, createdAt])
  @@index([userId, createdAt])
  @@index([resource, resourceId])
  @@index([action, result])
}

enum AuditAction {
  // Data operations
  CREATE
  READ
  UPDATE
  DELETE
  EXPORT

  // Authentication
  LOGIN
  LOGOUT
  LOGIN_FAILED
  MFA_ENROLLED
  MFA_VERIFIED
  PASSWORD_RESET
  PASSWORD_CHANGED

  // Authorization
  ACCESS_DENIED
  PRIVILEGE_ESCALATION
  CROSS_TENANT_ATTEMPT

  // Account management
  USER_CREATED
  USER_DISABLED
  ROLE_CHANGED
  ACCOUNT_LOCKED
  ACCOUNT_UNLOCKED

  // Security
  SESSION_EXPIRED
  SESSION_INVALIDATED
  SUSPICIOUS_ACTIVITY

  // Compliance
  POLICY_UPDATED
  POLICY_ACTIVATED
  AUDIT_INITIATED
  AUDIT_CLOSED
  REPORT_GENERATED

  // Dual control
  EXPORT_REQUESTED
  EXPORT_APPROVED
  EXPORT_DENIED

  // Webhooks
  WEBHOOK_RECEIVED
  WEBHOOK_PROCESSED
}

enum AuditResult {
  SUCCESS
  FAILURE
}
```

**Partition Strategy:**

```sql
-- Partition audit_logs by month (for performance + archival)
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL,
  -- ... other columns
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
) PARTITION BY RANGE (created_at);

-- Create monthly partitions
CREATE TABLE audit_logs_2025_11 PARTITION OF audit_logs
  FOR VALUES FROM ('2025-11-01') TO ('2025-12-01');

CREATE TABLE audit_logs_2025_12 PARTITION OF audit_logs
  FOR VALUES FROM ('2025-12-01') TO ('2026-01-01');

-- Auto-create future partitions (pg_partman extension)
SELECT partman.create_parent(
  'public.audit_logs',
  'created_at',
  'native',
  'monthly',
  p_premake := 3  -- Create 3 months ahead
);
```

---

### SecurityIncident (FedRAMP IR Family)

```prisma
model SecurityIncident {
  id                  String      @id @default(uuid())
  tenantId            String?     // null for platform-level incidents

  // Incident Details
  title               String
  description         String
  severity            IncidentSeverity
  category            IncidentCategory

  // Status
  status              IncidentStatus @default(OPEN)

  // Assignment
  assignedTo          String?
  incidentCommander   String?

  // Timeline
  detectedAt          DateTime
  containedAt         DateTime?
  resolvedAt          DateTime?

  // Impact
  affectedUsers       Int?
  affectedRecords     Int?
  dataExfiltrated     Boolean     @default(false)

  // Response
  responseActions     Json        @default("[]")
  rootCause           String?
  lessonsLearned      String?

  // Reporting
  reportedToCustomers Boolean     @default(false)
  reportedToRegulators Boolean    @default(false)
  regulatorsNotified  String[]    @default([])

  // Timestamps
  createdAt           DateTime    @default(now())
  updatedAt           DateTime    @updatedAt

  @@index([status, severity])
  @@index([detectedAt])
}

enum IncidentSeverity {
  P1_CRITICAL   // Production down, data breach
  P2_HIGH       // Major feature broken, PHI exposed
  P3_MEDIUM     // Minor feature broken
  P4_LOW        // UI issue, documentation bug
}

enum IncidentCategory {
  DATA_BREACH
  UNAUTHORIZED_ACCESS
  RANSOMWARE
  DDOS
  PHISHING
  INSIDER_THREAT
  CONFIGURATION_ERROR
  AVAILABILITY_ISSUE
  PERFORMANCE_DEGRADATION
}

enum IncidentStatus {
  OPEN
  INVESTIGATING
  CONTAINED
  RESOLVED
  CLOSED
}
```

---

### POAM (FedRAMP Plan of Action & Milestones)

```prisma
model POAM {
  id                  String      @id @default(uuid())

  // Finding Details
  findingId           String      @unique
  controlId           String      // e.g., "AC-2", "AU-6"
  title               String
  description         String
  severity            POAMSeverity

  // Remediation
  status              POAMStatus  @default(OPEN)
  remediationPlan     String
  assignedTo          String

  // Milestones
  milestones          Json        @default("[]")

  // Dates
  identifiedDate      DateTime
  scheduledCompletionDate DateTime
  actualCompletionDate DateTime?

  // Risk
  residualRisk        String?
  riskAcceptedBy      String?     // information_system_owner

  // Timestamps
  createdAt           DateTime    @default(now())
  updatedAt           DateTime    @updatedAt

  @@index([status, severity])
  @@index([scheduledCompletionDate])
}

enum POAMSeverity {
  CRITICAL
  HIGH
  MEDIUM
  LOW
}

enum POAMStatus {
  OPEN
  IN_PROGRESS
  RISK_ACCEPTED
  COMPLETED
}
```

**milestones JSON Schema:**

```json
[
  {
    "milestone": "Implement MFA enforcement for all users",
    "targetDate": "2025-12-15",
    "status": "IN_PROGRESS",
    "completedDate": null,
    "evidence": null
  },
  {
    "milestone": "Deploy updated authentication service",
    "targetDate": "2025-12-20",
    "status": "NOT_STARTED",
    "completedDate": null,
    "evidence": null
  },
  {
    "milestone": "Verify MFA enforcement (3PAO testing)",
    "targetDate": "2026-01-05",
    "status": "NOT_STARTED",
    "completedDate": null,
    "evidence": null
  }
]
```

---

### Alert (Compliance Alerts)

```prisma
model Alert {
  id                  String      @id @default(uuid())
  tenantId            String

  // Alert Details
  severity            AlertSeverity
  type                AlertType
  message             String

  // Target
  employeeId          String?
  resourceType        String?
  resourceId          String?

  // Status
  status              AlertStatus @default(OPEN)
  acknowledgedBy      String?
  acknowledgedAt      DateTime?
  closedBy            String?
  closedAt            DateTime?

  // Actions
  actionRequired      Boolean     @default(false)
  dueDate             DateTime?

  // Timestamps
  createdAt           DateTime    @default(now())

  @@index([tenantId, status])
  @@index([severity, status])
  @@index([employeeId])
}

enum AlertSeverity {
  HIGH
  MEDIUM
  LOW
}

enum AlertType {
  DRUG_TEST_POSITIVE
  BACKGROUND_CHECK_CONSIDER
  CERTIFICATE_EXPIRING
  CERTIFICATE_EXPIRED
  DOT_MEDICAL_CERT_EXPIRING
  CLEARINGHOUSE_VIOLATION
  GEO_FENCE_VIOLATION
  POLICY_VIOLATION
}

enum AlertStatus {
  OPEN
  ACKNOWLEDGED
  IN_PROGRESS
  RESOLVED
  CLOSED
}
```

---

## Enumerations {#enumerations}

### Complete Enum List (18)

```prisma
// Tenant & Subscription (3)
enum TenantType { COMPLIANCE_COMPANY, SERVICE_COMPANY }
enum SubscriptionTier { STARTER, STANDARD, PROFESSIONAL, ENTERPRISE }
enum SubscriptionStatus { TRIAL, ACTIVE, PAST_DUE, CANCELED, SUSPENDED }

// User & Auth (2)
enum Role { super_admin, pcs_security_officer, ... } // 12 roles
enum UserStatus { PENDING_ACTIVATION, ACTIVE, INACTIVE, DISABLED, LOCKED }

// Employee (2)
enum EmployeeStatus { ACTIVE, INACTIVE, LEAVE_OF_ABSENCE, TERMINATED }
enum EmployeeRole { CDL_DRIVER, FORKLIFT_OPERATOR, ... } // 8 roles

// Drug Testing (4)
enum DrugTestType { PRE_EMPLOYMENT, RANDOM, POST_ACCIDENT, ... }
enum DrugTestResult { NEGATIVE, POSITIVE, DILUTE_NEGATIVE, ... }
enum MROReviewStatus { PENDING, IN_PROGRESS, COMPLETED, CANCELLED }
enum DrugTestStatus { PENDING_COLLECTION, SPECIMEN_COLLECTED, ... }

// Background Checks (4)
enum BackgroundVendor { CHECKR, TAZWORKS, STERLING, HIRERIGHT }
enum BackgroundCheckStatus { PENDING, IN_PROGRESS, COMPLETE, DISPUTED, CANCELLED }
enum BackgroundCheckResult { CLEAR, CONSIDER, ENGAGED }
enum AdjudicationStatus { PENDING_REVIEW, APPROVED, APPROVED_WITH_CONDITIONS, DENIED }
enum AdverseActionStatus { PRE_ADVERSE_SENT, PENDING_7_DAY_WAIT, ... }

// DOT (3)
enum CDLClass { CLASS_A, CLASS_B, CLASS_C }
enum ClearinghouseStatus { CLEAN, PROHIBITED, RTD_IN_PROGRESS, RTD_COMPLETED }
enum DOTStatus { ACTIVE, SUSPENDED, REVOKED, TERMINATED }

// Health & Training (3)
enum HealthSurveillanceType { RESPIRATOR_FIT_TEST, AUDIOGRAM, ... }
enum CertificateType { FORKLIFT, HAZMAT, FIRST_AID, ... }
enum CertificateStatus { VALID, EXPIRING_SOON, EXPIRING_CRITICAL, EXPIRED }

// Geo-Fencing (2)
enum GeoZoneType { WORKSITE, RESTRICTED_AREA, HAZARDOUS_ZONE, ... }
enum CheckInMethod { GPS, QR_CODE, NFC, MANUAL }

// Policy & Compliance (1)
enum ComplianceType { DRUG_TEST, BACKGROUND, DOT, HEALTH, TRAINING, GEO_FENCING }

// Alerts (3)
enum AlertSeverity { HIGH, MEDIUM, LOW }
enum AlertType { DRUG_TEST_POSITIVE, CERTIFICATE_EXPIRING, ... }
enum AlertStatus { OPEN, ACKNOWLEDGED, IN_PROGRESS, RESOLVED, CLOSED }

// Audit & Security (4)
enum AuditAction { CREATE, READ, UPDATE, DELETE, EXPORT, LOGIN, ... }
enum AuditResult { SUCCESS, FAILURE }
enum IncidentSeverity { P1_CRITICAL, P2_HIGH, P3_MEDIUM, P4_LOW }
enum IncidentStatus { OPEN, INVESTIGATING, CONTAINED, RESOLVED, CLOSED }
enum POAMSeverity { CRITICAL, HIGH, MEDIUM, LOW }
enum POAMStatus { OPEN, IN_PROGRESS, RISK_ACCEPTED, COMPLETED }

// Exports (1)
enum ExportRequestStatus { PENDING_APPROVAL, APPROVED, DENIED, COMPLETED, EXPIRED }
```

---

## Indexes & Performance {#indexes}

### Index Strategy

**Tenant Isolation (Every Table):**

```sql
CREATE INDEX idx_{table}_tenant ON {table}(tenant_id);
CREATE INDEX idx_{table}_tenant_status ON {table}(tenant_id, status);
```

**Composite Indexes (Frequent Queries):**

```sql
-- Employees: Filter by status and role
CREATE INDEX idx_employees_tenant_status_role
  ON employees(tenant_id, status, role);

-- Drug Tests: Filter by date range
CREATE INDEX idx_drug_tests_tenant_date
  ON drug_tests(tenant_id, test_date DESC);

-- Audit Logs: Search by user and date
CREATE INDEX idx_audit_logs_user_date
  ON audit_logs(user_id, created_at DESC);

-- Background Checks: Filter by status and result
CREATE INDEX idx_background_checks_status_result
  ON background_checks(tenant_id, status, result);
```

**JSONB Indexes (complianceData):**

```sql
-- GIN index for JSONB queries
CREATE INDEX idx_employee_compliance_data
  ON employees USING GIN (compliance_data);

-- GIN path indexes (specific fields)
CREATE INDEX idx_employee_drug_testing_status
  ON employees USING GIN ((compliance_data->'drugTesting'));

CREATE INDEX idx_employee_training_status
  ON employees USING GIN ((compliance_data->'training'));

-- Query examples:
-- Find all employees with expired training
SELECT * FROM employees
WHERE compliance_data->'training'->>'flag' = 'red';

-- Find employees with positive drug tests
SELECT * FROM employees
WHERE compliance_data->'drugTesting'->>'status' = 'non_compliant';
```

**Full-Text Search:**

```sql
-- Full-text search on employee names
CREATE INDEX idx_employees_fulltext
  ON employees USING GIN (
    to_tsvector('english', first_name || ' ' || last_name || ' ' || COALESCE(email, ''))
  );

-- Query:
SELECT * FROM employees
WHERE to_tsvector('english', first_name || ' ' || last_name || ' ' || COALESCE(email, ''))
  @@ to_tsquery('english', 'John & Doe');
```

---

## Encryption Strategy {#encryption}

```
ENCRYPTION ARCHITECTURE
════════════════════════════════════════════════════════════════

┌───────────────────────────────────────────────────────────┐
│              ENCRYPTION AT REST                            │
├───────────────────────────────────────────────────────────┤
│  Database (PostgreSQL):                                   │
│  • Transparent Data Encryption (TDE) - Optional           │
│  • Field-level encryption (SSN, DOB) - AES-256-GCM        │
│  • AWS KMS managed keys (automatic rotation)              │
│                                                           │
│  Object Storage (S3):                                      │
│  • Server-side encryption (SSE-S3) - AES-256              │
│  • Bucket encryption enabled by default                   │
│  • Versioning enabled (up to 100 versions)                │
│                                                           │
│  Backups:                                                  │
│  • PostgreSQL snapshots encrypted (AES-256)               │
│  • S3 backups encrypted (SSE-S3)                          │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│              ENCRYPTION IN TRANSIT                         │
├───────────────────────────────────────────────────────────┤
│  • Client ↔ Vercel CDN: TLS 1.3                           │
│  • Frontend ↔ Backend: TLS 1.3 (HTTPS)                    │
│  • Backend ↔ PostgreSQL: SSL/TLS                          │
│  • Backend ↔ Redis: TLS (Upstash requires)                │
│  • Backend ↔ Kafka: SASL_SSL                              │
│  • Backend ↔ Vendors: HTTPS (TLS 1.2+)                    │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│           FIELD-LEVEL ENCRYPTION (PII/PHI)                 │
├───────────────────────────────────────────────────────────┤
│  Encrypted Fields:                                         │
│  • employees.ssnEncrypted (SSN)                           │
│  • employees.dobEncrypted (DOB)                           │
│                                                           │
│  Encryption Algorithm: AES-256-GCM                         │
│  Key Management: AWS KMS                                   │
│  Key Rotation: Annual (automatic)                         │
│                                                           │
│  Implementation (TypeScript):                              │
│  ────────────────────────────────────────────────────────│
│  import crypto from 'crypto'                              │
│                                                           │
│  const ENCRYPTION_KEY = process.env.FIELD_ENCRYPTION_KEY  │
│  const IV_LENGTH = 16                                     │
│                                                           │
│  function encryptField(plaintext: string): string {       │
│    const iv = crypto.randomBytes(IV_LENGTH)               │
│    const cipher = crypto.createCipheriv(                  │
│      'aes-256-gcm',                                       │
│      Buffer.from(ENCRYPTION_KEY, 'hex'),                  │
│      iv                                                   │
│    )                                                      │
│    let encrypted = cipher.update(plaintext, 'utf8', 'hex')│
│    encrypted += cipher.final('hex')                       │
│    const authTag = cipher.getAuthTag()                    │
│                                                           │
│    return iv.toString('hex') + ':' +                      │
│           authTag.toString('hex') + ':' + encrypted       │
│  }                                                        │
│                                                           │
│  function decryptField(encrypted: string): string {       │
│    const parts = encrypted.split(':')                     │
│    const iv = Buffer.from(parts[0], 'hex')                │
│    const authTag = Buffer.from(parts[1], 'hex')           │
│    const encryptedData = parts[2]                         │
│                                                           │
│    const decipher = crypto.createDecipheriv(              │
│      'aes-256-gcm',                                       │
│      Buffer.from(ENCRYPTION_KEY, 'hex'),                  │
│      iv                                                   │
│    )                                                      │
│    decipher.setAuthTag(authTag)                           │
│                                                           │
│    let decrypted = decipher.update(encryptedData, 'hex', 'utf8')│
│    decrypted += decipher.final('utf8')                    │
│    return decrypted                                       │
│  }                                                        │
│                                                           │
│  // Usage:                                                │
│  const ssnEncrypted = encryptField('123-45-6789')         │
│  await prisma.employee.create({                           │
│    data: { ssnEncrypted, ... }                            │
│  })                                                       │
│                                                           │
│  const employee = await prisma.employee.findUnique(...)   │
│  const ssn = decryptField(employee.ssnEncrypted)          │
│  // ssn = '123-45-6789'                                   │
└───────────────────────────────────────────────────────────┘
```

---

## Data Retention {#retention}

```
DATA RETENTION POLICY
════════════════════════════════════════════════════════════════

┌───────────────────────────────────────────────────────────┐
│              REGULATORY REQUIREMENTS                       │
├───────────────────────────────────────────────────────────┤
│  FedRAMP: 7 years (audit logs, security records)          │
│  HIPAA: 6 years (medical records, PHI access logs)        │
│  FCRA: 5 years (background check records, adjudications)  │
│  DOT: 3 years (drug test records, DQ files)               │
│  EEOC: 1 year (hiring records, adverse actions)           │
│                                                           │
│  PCS Policy: 7 years (most conservative, covers all reqs) │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│              RETENTION BY DATA TYPE                        │
├───────────────────────────────────────────────────────────┤
│  Audit Logs:                                              │
│  • Hot storage (PostgreSQL): 90 days                      │
│  • Cold storage (S3 Glacier): 7 years                     │
│  • Auto-archive: Daily job moves logs > 90 days old       │
│                                                           │
│  Employee Records:                                         │
│  • Active employees: Unlimited                            │
│  • Terminated employees: 7 years after termination        │
│  • Soft delete (status = DISABLED), not hard delete       │
│                                                           │
│  Compliance Records (Drug Tests, Background Checks):       │
│  • All records: 7 years after creation                    │
│  • Never deleted (compliance requirement)                 │
│  • Archived to S3 after 3 years (cold storage)            │
│                                                           │
│  Documents (PDFs):                                         │
│  • S3 lifecycle: Hot (90 days) → Glacier (7 years)        │
│  • Auto-delete after 7 years                              │
│                                                           │
│  Export Files (Temp):                                      │
│  • S3 lifecycle: Auto-delete after 7 days                 │
│  • Signed URLs expire after 24 hours                      │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│              ARCHIVAL STRATEGY                             │
├───────────────────────────────────────────────────────────┤
│  Monthly Job (1st of month):                              │
│  ────────────────────────────────────────────────────────│
│  1. Identify records > 90 days old:                       │
│     SELECT * FROM audit_logs                              │
│     WHERE created_at < CURRENT_DATE - INTERVAL '90 days'  │
│                                                           │
│  2. Export to S3 (JSONL format, compressed):              │
│     s3://audit-archives/2025/08/audit_logs.jsonl.gz       │
│                                                           │
│  3. Verify upload (checksum comparison)                   │
│                                                           │
│  4. Delete from PostgreSQL (free up space):               │
│     DELETE FROM audit_logs                                │
│     WHERE created_at < CURRENT_DATE - INTERVAL '90 days'  │
│                                                           │
│  5. S3 lifecycle transitions:                             │
│     Day 0-90: S3 Standard (hot)                           │
│     Day 91-365: S3 Infrequent Access (warm)               │
│     Day 366-2555: S3 Glacier (cold, $0.004/GB/month)      │
│     Day 2556+: Auto-delete (7 years expired)              │
└───────────────────────────────────────────────────────────┘
```

---

**Document Complete: Data Model Documentation**

**Summary:**
- **22 Prisma models** covering tenants, employees, compliance, auth, audit
- **18 enumerations** for type safety and validation
- **Multi-tenant architecture** with parent-child hierarchy (MSP model)
- **Field-level encryption** for SSN, DOB (AES-256-GCM with AWS KMS)
- **JSONB schemas** for flexible complianceData storage
- **PostGIS integration** for geo-fencing (spatial queries)
- **Partitioning strategy** for audit logs (monthly partitions)
- **7-year retention** policy (FedRAMP/HIPAA/FCRA compliant)
- **Archival to S3 Glacier** (90-day hot, 7-year cold, auto-delete)

**Next:** Project Roadmap Tracking Document (final deliverable)
