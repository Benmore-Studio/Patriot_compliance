# Compliance Module Documentation

This directory contains detailed documentation for each of the 6 compliance modules in Patriot Compliance Systems.

## Module Index

| Module | File | Status | Vendor Integration |
|:-------|:-----|:-------|:-------------------|
| Drug & Alcohol Testing | [drug-alcohol.md](./drug-alcohol.md) | Documented | CRL, Quest, FormFox |
| Background Screening | [background-checks.md](./background-checks.md) | Documented | TazWorks |
| DOT Compliance | [dot-compliance.md](./dot-compliance.md) | Documented | FMCSA Clearinghouse |
| Occupational Health | [occupational-health.md](./occupational-health.md) | Documented | Quest |
| Training & Certifications | [training-certifications.md](./training-certifications.md) | Documented | Internal |
| Geo-Fencing | [geo-fencing.md](./geo-fencing.md) | Documented | PostGIS |

## Common Patterns

All modules share the **Universal Compliance Event Flow**:

```
Ingest → Parse → Validate → Store → Flag → Alert → Display
```

### Shared Components

- **Policy Driver**: Evaluates compliance rules per module
- **Alert Engine**: Generates notifications based on flag changes
- **Audit Logging**: Records all data access and modifications
- **Export Service**: PDF/CSV generation for reports

### Data Model Pattern

Each module stores data in:
1. **Dedicated table** (e.g., `drug_tests`, `background_checks`)
2. **Employee.complianceData JSONB** (rollup for dashboard display)

### API Pattern

All modules expose:
- `GET /api/{module}` - List with pagination
- `POST /api/{module}` - Create record
- `GET /api/{module}/[id]` - Single record
- `PATCH /api/{module}/[id]` - Update record
- `DELETE /api/{module}/[id]` - Delete (admin only)
- `GET /api/{module}/export` - Export to PDF/CSV

### RBAC Pattern

- **Read**: View module data
- **Write**: Create/update records
- **Delete**: Remove records (restricted)
- **Export**: Download data
- **Own**: Self-service (field workers only)
