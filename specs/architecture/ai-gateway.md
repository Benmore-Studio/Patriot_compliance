# AI Gateway Architecture Specification (DER IQ)

**Version**: 1.0
**Last Updated**: 2025-11-26
**Status**: Implementation Ready
**Compliance**: FedRAMP Moderate, SOC 2 Type II

---

## Executive Summary

This specification defines the AI Gateway architecture for Patriot Compliance Systems, implementing the DER IQ natural language query interface with:
- **Text-to-SQL** generation using LLM + schema context (not fine-tuned)
- **RAG pipeline** with pgvector for regulatory embeddings (49 CFR, FCRA, OSHA)
- **RBAC-aware query generation** with tenant and scope injection
- **Prompt injection prevention** with input sanitization and output validation
- **Query caching** for repeated compliance questions

---

## Architecture Overview

```
+==============================================================================+
|                           DER IQ AI GATEWAY ARCHITECTURE                      |
+==============================================================================+

USER QUERY                                               STRUCTURED RESPONSE
"Show me all employees                                   ┌────────────────────┐
 with expiring DOT certs                                 │ Employee   │ Expiry│
 in Texas next 30 days"                                  ├────────────┼───────┤
       │                                                 │ John Smith │ Dec 15│
       v                                                 │ Jane Doe   │ Dec 22│
┌──────────────────────────────────────────────────────────────────────────────┐
│                              DER IQ PIPELINE                                  │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                         1. INPUT PROCESSING                            │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │  │
│  │  │ Sanitize    │->│ Classify    │->│ Extract     │->│ Validate    │  │  │
│  │  │ Input       │  │ Intent      │  │ Entities    │  │ Permissions │  │  │
│  │  │             │  │             │  │             │  │             │  │  │
│  │  │ - XSS/SQLi  │  │ Query types:│  │ - employees │  │ Check RBAC  │  │  │
│  │  │ - Prompt    │  │ - search    │  │ - DOT certs │  │ scopes for  │  │  │
│  │  │   injection │  │ - aggregate │  │ - Texas     │  │ requested   │  │  │
│  │  │ - Length    │  │ - compare   │  │ - 30 days   │  │ data access │  │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                      │                                       │
│                                      v                                       │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                      2. CONTEXT ASSEMBLY                              │  │
│  │                                                                       │  │
│  │  ┌─────────────────────────────────────────────────────────────┐     │  │
│  │  │                    SCHEMA CONTEXT                            │     │  │
│  │  │  Tables: employees, dot_records, drug_tests, training_certs │     │  │
│  │  │  Columns: id, name, status, expiry_date, location_id...     │     │  │
│  │  │  Relationships: dot_records.employee_id -> employees.id     │     │  │
│  │  └─────────────────────────────────────────────────────────────┘     │  │
│  │                                                                       │  │
│  │  ┌─────────────────────────────────────────────────────────────┐     │  │
│  │  │                    USER CONTEXT (RBAC)                       │     │  │
│  │  │  tenant_id: 'acme_corp'                                      │     │  │
│  │  │  system_role: 'SafetyManager'                                │     │  │
│  │  │  location_ids: ['loc_tx_1', 'loc_tx_2']                     │     │  │
│  │  │  scopes: ['dot.read', 'roster.read', 'training.read']       │     │  │
│  │  └─────────────────────────────────────────────────────────────┘     │  │
│  │                                                                       │  │
│  │  ┌─────────────────────────────────────────────────────────────┐     │  │
│  │  │                    RAG CONTEXT (if needed)                   │     │  │
│  │  │  Retrieved from pgvector:                                    │     │  │
│  │  │  - 49 CFR Part 391.45 (medical cert requirements)           │     │  │
│  │  │  - FMCSA clearinghouse query rules                          │     │  │
│  │  │  Similarity score: 0.89                                      │     │  │
│  │  └─────────────────────────────────────────────────────────────┘     │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                      │                                       │
│                                      v                                       │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                      3. SQL GENERATION                                │  │
│  │                                                                       │  │
│  │  Prompt to LLM:                                                       │  │
│  │  ┌─────────────────────────────────────────────────────────────┐     │  │
│  │  │ You are a SQL generator for a compliance database.          │     │  │
│  │  │ Generate a SELECT query based on the user's question.       │     │  │
│  │  │                                                              │     │  │
│  │  │ MANDATORY WHERE clauses (always include):                   │     │  │
│  │  │ - tenant_id = 'acme_corp'                                   │     │  │
│  │  │ - location_id IN ('loc_tx_1', 'loc_tx_2')                  │     │  │
│  │  │                                                              │     │  │
│  │  │ User question: "employees with expiring DOT certs in TX"    │     │  │
│  │  └─────────────────────────────────────────────────────────────┘     │  │
│  │                                                                       │  │
│  │  Generated SQL:                                                       │  │
│  │  ┌─────────────────────────────────────────────────────────────┐     │  │
│  │  │ SELECT e.first_name, e.last_name, d.expiry_date            │     │  │
│  │  │ FROM employees e                                            │     │  │
│  │  │ JOIN dot_records d ON e.id = d.employee_id                 │     │  │
│  │  │ WHERE e.tenant_id = 'acme_corp'                    -- RBAC │     │  │
│  │  │   AND e.location_id IN ('loc_tx_1', 'loc_tx_2')    -- RBAC │     │  │
│  │  │   AND d.expiry_date BETWEEN NOW() AND NOW() + '30d'        │     │  │
│  │  │ ORDER BY d.expiry_date ASC;                                │     │  │
│  │  └─────────────────────────────────────────────────────────────┘     │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                      │                                       │
│                                      v                                       │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                      4. VALIDATION & EXECUTION                        │  │
│  │                                                                       │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │  │
│  │  │ SQL Parse   │->│ RBAC Check  │->│ Execute on  │->│ Format      │  │  │
│  │  │ Validate    │  │ Verify      │  │ Read Replica│  │ Response    │  │  │
│  │  │             │  │             │  │             │  │             │  │  │
│  │  │ - No DELETE │  │ - tenant_id │  │ - Timeout   │  │ - Table     │  │  │
│  │  │ - No UPDATE │  │   present   │  │   5 seconds │  │ - Chart     │  │  │
│  │  │ - No DROP   │  │ - scope     │  │ - Row limit │  │ - Summary   │  │  │
│  │  │ - Read only │  │   filters   │  │   1000      │  │             │  │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                      │                                       │
│                                      v                                       │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                      5. AUDIT & CACHE                                 │  │
│  │                                                                       │  │
│  │  - Log query, user, tenant, generated SQL, result count to audit     │  │
│  │  - Cache query result for 5 minutes (tenant-scoped)                  │  │
│  │  - Track token usage for cost monitoring                             │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Text-to-SQL Architecture

### 1.1 Design Decision: LLM + Context vs Fine-Tuning

| Approach | Pros | Cons | Decision |
|----------|------|------|----------|
| **Fine-tuned model** | Faster inference, lower token cost | Expensive to train, hard to update for schema changes | Not chosen |
| **LLM + schema context** | Easy to update, no training cost, flexible | Higher token cost, requires prompt engineering | **Chosen** |

**Rationale**: Schema changes frequently as compliance requirements evolve. Context injection allows immediate adaptation without retraining.

### 1.2 Schema Context Builder

```python
# backend/pcs/der_iq/schema_context.py

from typing import Dict, List, Optional
from dataclasses import dataclass
from django.db import connection

@dataclass
class ColumnInfo:
    name: str
    data_type: str
    nullable: bool
    description: Optional[str]
    is_pii: bool = False

@dataclass
class TableInfo:
    name: str
    columns: List[ColumnInfo]
    description: str
    relationships: List[str]

class SchemaContextBuilder:
    """
    Build schema context for text-to-SQL generation.

    Includes:
    - Table definitions with columns and types
    - Foreign key relationships
    - Column descriptions for disambiguation
    - PII field markers (for masking)
    """

    # Tables available for querying
    QUERYABLE_TABLES = [
        'employees',
        'drug_tests',
        'background_checks',
        'dot_records',
        'health_records',
        'training_records',
        'geo_checkins',
        'geo_zones',
        'compliance_events',
    ]

    # Column descriptions for disambiguation
    COLUMN_DESCRIPTIONS = {
        'employees.status': 'Employee lifecycle status: candidate, onboarding, active, suspended, on_leave, terminated',
        'employees.compliance_status': 'Overall compliance flag: green, yellow, red',
        'drug_tests.result': 'Test result: NEGATIVE, NON_NEGATIVE, POSITIVE, REFUSED, CANCELLED',
        'drug_tests.test_type': 'Type of test: DOT, NON_DOT',
        'drug_tests.test_reason': 'Reason: PRE_EMPLOYMENT, RANDOM, POST_ACCIDENT, REASONABLE_SUSPICION, RETURN_TO_DUTY, FOLLOW_UP',
        'dot_records.cert_type': 'Certificate type: MEDICAL, CDL, HAZMAT',
        'training_records.status': 'Certificate status: VALID, EXPIRING, EXPIRED',
    }

    # PII fields that require special handling
    PII_FIELDS = [
        'employees.ssn_encrypted',
        'employees.ssn_last_four',
        'employees.dob_encrypted',
        'employees.phone',
        'employees.email',
    ]

    def __init__(self, tenant_schema: str):
        self.tenant_schema = tenant_schema

    def build_context(self, include_examples: bool = True) -> str:
        """Build complete schema context for LLM prompt"""
        tables = self._get_table_definitions()
        relationships = self._get_relationships()

        context = [
            "## DATABASE SCHEMA",
            "",
            "Available tables for querying:",
            "",
        ]

        for table in tables:
            context.append(f"### {table.name}")
            context.append(f"Description: {table.description}")
            context.append("Columns:")
            for col in table.columns:
                pii_marker = " [PII]" if col.is_pii else ""
                desc = f" -- {col.description}" if col.description else ""
                context.append(f"  - {col.name}: {col.data_type}{pii_marker}{desc}")
            context.append("")

        context.append("## RELATIONSHIPS")
        for rel in relationships:
            context.append(f"  - {rel}")
        context.append("")

        if include_examples:
            context.extend(self._get_query_examples())

        return "\n".join(context)

    def _get_table_definitions(self) -> List[TableInfo]:
        """Get table definitions from database metadata"""
        tables = []

        with connection.cursor() as cursor:
            for table_name in self.QUERYABLE_TABLES:
                # Get columns
                cursor.execute(f"""
                    SELECT column_name, data_type, is_nullable
                    FROM information_schema.columns
                    WHERE table_schema = %s AND table_name = %s
                    ORDER BY ordinal_position
                """, [self.tenant_schema, table_name])

                columns = []
                for row in cursor.fetchall():
                    col_name, data_type, nullable = row
                    full_name = f"{table_name}.{col_name}"

                    columns.append(ColumnInfo(
                        name=col_name,
                        data_type=data_type,
                        nullable=nullable == 'YES',
                        description=self.COLUMN_DESCRIPTIONS.get(full_name),
                        is_pii=full_name in self.PII_FIELDS,
                    ))

                tables.append(TableInfo(
                    name=table_name,
                    columns=columns,
                    description=self._get_table_description(table_name),
                    relationships=[],
                ))

        return tables

    def _get_relationships(self) -> List[str]:
        """Get foreign key relationships"""
        return [
            "drug_tests.employee_id -> employees.id",
            "background_checks.employee_id -> employees.id",
            "dot_records.employee_id -> employees.id",
            "health_records.employee_id -> employees.id",
            "training_records.employee_id -> employees.id",
            "geo_checkins.employee_id -> employees.id",
            "geo_checkins.zone_id -> geo_zones.id",
            "employees.location_id -> locations.id",
            "employees.division_id -> divisions.id",
        ]

    def _get_table_description(self, table_name: str) -> str:
        """Get human-readable table description"""
        descriptions = {
            'employees': 'Employee roster with PII and compliance status',
            'drug_tests': 'Drug and alcohol test records',
            'background_checks': 'Background screening and adjudication records',
            'dot_records': 'DOT compliance records (medical certs, CDL, clearinghouse)',
            'health_records': 'Occupational health exams and medical surveillance',
            'training_records': 'Training certificates and expiration tracking',
            'geo_checkins': 'GPS and QR code check-in records',
            'geo_zones': 'Geo-fence zone definitions',
            'compliance_events': 'Compliance event history and audit trail',
        }
        return descriptions.get(table_name, table_name)

    def _get_query_examples(self) -> List[str]:
        """Get example queries for few-shot prompting"""
        return [
            "## EXAMPLE QUERIES",
            "",
            "Q: How many active employees do we have?",
            "SQL: SELECT COUNT(*) FROM employees WHERE status = 'active' AND tenant_id = :tenant_id",
            "",
            "Q: Show employees with expired training certificates",
            "SQL: SELECT e.first_name, e.last_name, t.cert_name, t.expiry_date",
            "     FROM employees e JOIN training_records t ON e.id = t.employee_id",
            "     WHERE e.tenant_id = :tenant_id AND t.status = 'EXPIRED'",
            "",
            "Q: List all positive drug tests this year",
            "SQL: SELECT e.first_name, e.last_name, d.test_type, d.resulted_at",
            "     FROM employees e JOIN drug_tests d ON e.id = d.employee_id",
            "     WHERE e.tenant_id = :tenant_id AND d.result = 'POSITIVE'",
            "     AND d.resulted_at >= DATE_TRUNC('year', CURRENT_DATE)",
            "",
        ]
```

### 1.3 RBAC-Aware SQL Generator

```python
# backend/pcs/der_iq/sql_generator.py

import re
from typing import Dict, List, Optional, Tuple
from anthropic import Anthropic
from django.conf import settings
from pcs.der_iq.schema_context import SchemaContextBuilder

class RBACAwareSQLGenerator:
    """
    Generate SQL queries from natural language with RBAC constraints.

    Security features:
    - Mandatory tenant_id filter injection
    - Location-based scoping for restricted roles
    - PII field exclusion for unauthorized users
    - Query validation (no writes, no system tables)
    """

    SYSTEM_PROMPT = """You are a SQL query generator for a compliance management system.
Your job is to convert natural language questions into PostgreSQL SELECT queries.

CRITICAL RULES:
1. ONLY generate SELECT queries. Never generate INSERT, UPDATE, DELETE, DROP, or any DDL.
2. ALWAYS include the mandatory WHERE clauses provided in the user context.
3. NEVER access tables outside the allowed list.
4. NEVER expose PII fields (marked [PII]) unless explicitly permitted.
5. Use parameterized queries with :param_name syntax for values.
6. Limit results to 1000 rows maximum.
7. If the question cannot be answered with the available schema, explain why.

Output format:
If valid query: Return ONLY the SQL query, no explanation.
If invalid: Return "CANNOT_GENERATE: <reason>"
"""

    def __init__(self, user_context: Dict):
        """
        Initialize with user context.

        Args:
            user_context: {
                'tenant_id': 'acme_corp',
                'user_id': 'user_123',
                'system_role': 'SafetyManager',
                'scopes': ['dot.read', 'roster.read'],
                'location_ids': ['loc_1', 'loc_2'],
            }
        """
        self.user_context = user_context
        self.client = Anthropic(api_key=settings.ANTHROPIC_API_KEY)
        self.schema_builder = SchemaContextBuilder(user_context['tenant_schema'])

    def generate_sql(self, question: str) -> Tuple[Optional[str], Optional[str]]:
        """
        Generate SQL from natural language question.

        Returns:
            Tuple of (sql_query, error_message)
        """
        # Build context
        schema_context = self.schema_builder.build_context()
        rbac_constraints = self._build_rbac_constraints()
        allowed_fields = self._get_allowed_fields()

        # Build prompt
        user_prompt = f"""
{schema_context}

## USER CONTEXT
Tenant ID: {self.user_context['tenant_id']}
User Role: {self.user_context['system_role']}
Allowed Scopes: {', '.join(self.user_context['scopes'])}

## MANDATORY WHERE CLAUSES (must include in every query)
{rbac_constraints}

## ALLOWED FIELDS
{allowed_fields}

## USER QUESTION
{question}

Generate the SQL query:
"""

        # Call LLM
        response = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            system=self.SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_prompt}]
        )

        sql = response.content[0].text.strip()

        # Check for generation failure
        if sql.startswith("CANNOT_GENERATE:"):
            return None, sql[16:].strip()

        # Validate generated SQL
        validation_error = self._validate_sql(sql)
        if validation_error:
            return None, validation_error

        # Inject RBAC filters (defense in depth)
        sql = self._inject_rbac_filters(sql)

        return sql, None

    def _build_rbac_constraints(self) -> str:
        """Build mandatory WHERE clause constraints"""
        constraints = [
            f"- tenant_id = '{self.user_context['tenant_id']}'"
        ]

        # Location scoping for restricted roles
        if self.user_context['system_role'] in ['SiteSupervisor', 'FieldWorker']:
            location_ids = self.user_context.get('location_ids', [])
            if location_ids:
                ids_str = "', '".join(location_ids)
                constraints.append(f"- location_id IN ('{ids_str}')")

        return "\n".join(constraints)

    def _get_allowed_fields(self) -> str:
        """Get list of fields user can access"""
        scopes = self.user_context.get('scopes', [])

        # PII requires explicit scope
        pii_allowed = 'pii.read' in scopes
        phi_allowed = 'phi.read' in scopes

        notes = []
        if not pii_allowed:
            notes.append("- CANNOT access: ssn_encrypted, dob_encrypted, ssn_last_four")
        if not phi_allowed:
            notes.append("- CANNOT access: medical_notes, health diagnosis fields")

        if notes:
            return "Field restrictions:\n" + "\n".join(notes)
        return "No field restrictions (full access)"

    def _validate_sql(self, sql: str) -> Optional[str]:
        """Validate SQL is safe to execute"""
        sql_upper = sql.upper()

        # Block write operations
        write_keywords = ['INSERT', 'UPDATE', 'DELETE', 'DROP', 'CREATE', 'ALTER', 'TRUNCATE']
        for keyword in write_keywords:
            if re.search(rf'\b{keyword}\b', sql_upper):
                return f"Write operation '{keyword}' not allowed"

        # Block system tables
        system_patterns = ['pg_', 'information_schema', 'pg_catalog']
        for pattern in system_patterns:
            if pattern in sql.lower():
                return f"Access to system tables not allowed"

        # Block comments (potential injection vector)
        if '--' in sql or '/*' in sql:
            return "SQL comments not allowed"

        # Block multiple statements
        if sql.count(';') > 1:
            return "Multiple SQL statements not allowed"

        return None

    def _inject_rbac_filters(self, sql: str) -> str:
        """
        Defense in depth: Inject RBAC filters even if LLM included them.

        This ensures tenant isolation even if prompt injection succeeds.
        """
        tenant_id = self.user_context['tenant_id']

        # Check if tenant filter exists
        if 'tenant_id' not in sql.lower():
            # Find WHERE clause and inject
            if 'WHERE' in sql.upper():
                sql = re.sub(
                    r'(WHERE\s+)',
                    rf"\1tenant_id = '{tenant_id}' AND ",
                    sql,
                    flags=re.IGNORECASE
                )
            else:
                # Add WHERE clause before ORDER BY or at end
                if 'ORDER BY' in sql.upper():
                    sql = re.sub(
                        r'(ORDER BY)',
                        rf"WHERE tenant_id = '{tenant_id}' \1",
                        sql,
                        flags=re.IGNORECASE
                    )
                else:
                    sql = sql.rstrip(';') + f" WHERE tenant_id = '{tenant_id}'"

        # Add row limit
        if 'LIMIT' not in sql.upper():
            sql = sql.rstrip(';') + " LIMIT 1000"

        return sql + ";"
```

---

## 2. RAG Pipeline with pgvector

### 2.1 Regulatory Document Embeddings

```python
# backend/pcs/der_iq/rag_pipeline.py

import hashlib
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass
from anthropic import Anthropic
from pgvector.django import VectorField
from django.db import models
from django.conf import settings

@dataclass
class RetrievedContext:
    """Context retrieved from RAG"""
    source: str
    section: str
    title: str
    content: str
    similarity: float

class RegulatoryEmbedding(models.Model):
    """Model for regulatory document embeddings"""

    source = models.CharField(max_length=50)  # '49_cfr_40', 'fcra', etc.
    section = models.CharField(max_length=100)
    title = models.CharField(max_length=500)
    content = models.TextField()
    embedding = VectorField(dimensions=1536)
    content_hash = models.CharField(max_length=64, unique=True)
    effective_date = models.DateField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'regulatory_embeddings'
        indexes = [
            models.Index(fields=['source']),
        ]


class RAGPipeline:
    """
    RAG pipeline for regulatory context retrieval.

    Uses pgvector for similarity search on regulatory embeddings:
    - 49 CFR Part 40 (DOT drug testing procedures)
    - 49 CFR Part 382 (DOT alcohol/drug rules)
    - 49 CFR Part 391 (Driver qualifications)
    - FCRA (Fair Credit Reporting Act for background checks)
    - OSHA 1910 (Occupational health standards)
    - Tenant-specific policies
    """

    EMBEDDING_MODEL = "text-embedding-3-small"  # OpenAI ada-002 alternative
    SIMILARITY_THRESHOLD = 0.7
    MAX_CONTEXT_CHUNKS = 5

    def __init__(self):
        self.client = Anthropic(api_key=settings.ANTHROPIC_API_KEY)

    def retrieve_context(
        self,
        question: str,
        sources: Optional[List[str]] = None,
        tenant_id: Optional[str] = None
    ) -> List[RetrievedContext]:
        """
        Retrieve relevant regulatory context for a question.

        Args:
            question: User's natural language question
            sources: Optional list of sources to search (e.g., ['49_cfr_40', 'fcra'])
            tenant_id: Optional tenant ID for tenant-specific policies

        Returns:
            List of relevant context chunks with similarity scores
        """
        # Generate embedding for question
        question_embedding = self._generate_embedding(question)

        # Build query
        contexts = []

        # Search regulatory embeddings
        regulatory_results = self._search_regulatory(
            question_embedding, sources
        )
        contexts.extend(regulatory_results)

        # Search tenant policies if tenant_id provided
        if tenant_id:
            tenant_results = self._search_tenant_policies(
                question_embedding, tenant_id
            )
            contexts.extend(tenant_results)

        # Sort by similarity and limit
        contexts.sort(key=lambda x: x.similarity, reverse=True)
        return contexts[:self.MAX_CONTEXT_CHUNKS]

    def _generate_embedding(self, text: str) -> List[float]:
        """Generate embedding vector for text"""
        # Using Claude for embeddings (alternatively use OpenAI ada-002)
        response = self.client.embeddings.create(
            model=self.EMBEDDING_MODEL,
            input=text
        )
        return response.data[0].embedding

    def _search_regulatory(
        self,
        embedding: List[float],
        sources: Optional[List[str]] = None
    ) -> List[RetrievedContext]:
        """Search regulatory embeddings"""
        from django.db import connection

        query = """
            SELECT source, section, title, content,
                   1 - (embedding <=> %s::vector) as similarity
            FROM regulatory_embeddings
            WHERE 1 - (embedding <=> %s::vector) > %s
        """
        params = [embedding, embedding, self.SIMILARITY_THRESHOLD]

        if sources:
            placeholders = ', '.join(['%s'] * len(sources))
            query += f" AND source IN ({placeholders})"
            params.extend(sources)

        query += " ORDER BY embedding <=> %s::vector LIMIT %s"
        params.extend([embedding, self.MAX_CONTEXT_CHUNKS])

        with connection.cursor() as cursor:
            cursor.execute(query, params)
            results = cursor.fetchall()

        return [
            RetrievedContext(
                source=row[0],
                section=row[1],
                title=row[2],
                content=row[3],
                similarity=row[4]
            )
            for row in results
        ]

    def _search_tenant_policies(
        self,
        embedding: List[float],
        tenant_id: str
    ) -> List[RetrievedContext]:
        """Search tenant-specific policy embeddings"""
        from django.db import connection

        query = """
            SELECT 'tenant_policy' as source, policy_id::text as section,
                   policy_name as title, policy_content as content,
                   1 - (embedding <=> %s::vector) as similarity
            FROM policy_embeddings
            WHERE tenant_id = %s
              AND 1 - (embedding <=> %s::vector) > %s
            ORDER BY embedding <=> %s::vector
            LIMIT %s
        """

        with connection.cursor() as cursor:
            cursor.execute(query, [
                embedding, tenant_id, embedding,
                self.SIMILARITY_THRESHOLD, embedding, 3
            ])
            results = cursor.fetchall()

        return [
            RetrievedContext(
                source=row[0],
                section=row[1],
                title=row[2],
                content=row[3],
                similarity=row[4]
            )
            for row in results
        ]

    def format_context_for_prompt(self, contexts: List[RetrievedContext]) -> str:
        """Format retrieved contexts for LLM prompt"""
        if not contexts:
            return ""

        formatted = ["## RELEVANT REGULATORY CONTEXT", ""]

        for ctx in contexts:
            formatted.extend([
                f"### {ctx.source.upper()} - {ctx.section}",
                f"**{ctx.title}**",
                f"(Relevance: {ctx.similarity:.0%})",
                "",
                ctx.content,
                "",
                "---",
                ""
            ])

        return "\n".join(formatted)


class EmbeddingIngestionService:
    """Service for ingesting regulatory documents into embeddings"""

    def __init__(self):
        self.rag = RAGPipeline()

    def ingest_document(
        self,
        source: str,
        sections: List[Dict[str, str]],
        effective_date: Optional[str] = None
    ) -> int:
        """
        Ingest a regulatory document into embeddings.

        Args:
            source: Source identifier (e.g., '49_cfr_40')
            sections: List of {'section': '40.1', 'title': '...', 'content': '...'}
            effective_date: Optional effective date

        Returns:
            Number of sections ingested
        """
        count = 0

        for section in sections:
            # Generate content hash for deduplication
            content_hash = hashlib.sha256(
                f"{source}:{section['section']}:{section['content']}".encode()
            ).hexdigest()

            # Skip if already exists
            if RegulatoryEmbedding.objects.filter(content_hash=content_hash).exists():
                continue

            # Generate embedding
            embedding = self.rag._generate_embedding(section['content'])

            # Create record
            RegulatoryEmbedding.objects.create(
                source=source,
                section=section['section'],
                title=section['title'],
                content=section['content'],
                embedding=embedding,
                content_hash=content_hash,
                effective_date=effective_date,
            )

            count += 1

        return count
```

### 2.2 Question Classification and Routing

```python
# backend/pcs/der_iq/question_router.py

from enum import Enum
from typing import Tuple, Optional
from dataclasses import dataclass

class QuestionType(Enum):
    """Types of questions DER IQ can answer"""
    DATA_QUERY = "data_query"           # "Show me employees with..."
    AGGREGATION = "aggregation"          # "How many...", "What percentage..."
    COMPARISON = "comparison"            # "Compare... to..."
    REGULATORY = "regulatory"            # "What are the requirements for..."
    POLICY = "policy"                    # "What is our policy on..."
    UNKNOWN = "unknown"

@dataclass
class RoutedQuestion:
    """Question with routing information"""
    original: str
    question_type: QuestionType
    requires_rag: bool
    rag_sources: list
    data_modules: list
    confidence: float

class QuestionRouter:
    """
    Route questions to appropriate handling pipelines.

    Determines:
    - Question type (data query, regulatory, policy, etc.)
    - Whether RAG context is needed
    - Which data modules to query
    """

    # Keywords for question classification
    DATA_KEYWORDS = [
        'show', 'list', 'find', 'get', 'display', 'who', 'which',
        'employees', 'drivers', 'tests', 'records', 'certificates'
    ]

    AGGREGATION_KEYWORDS = [
        'how many', 'count', 'total', 'percentage', 'average',
        'sum', 'min', 'max', 'statistics'
    ]

    REGULATORY_KEYWORDS = [
        'requirement', 'regulation', 'cfr', 'dot', 'fmcsa', 'osha',
        'fcra', 'law', 'rule', 'compliance', 'must', 'required'
    ]

    POLICY_KEYWORDS = [
        'policy', 'procedure', 'our', 'company', 'should', 'process'
    ]

    # Map keywords to data modules
    MODULE_KEYWORDS = {
        'drug_alcohol': ['drug', 'alcohol', 'test', 'random', 'mro', 'specimen'],
        'background': ['background', 'screening', 'adjudication', 'fcra', 'checkr'],
        'dot': ['dot', 'cdl', 'medical', 'clearinghouse', 'fmcsa', 'driver', 'dq file'],
        'health': ['health', 'medical', 'osha', 'physical', 'exam', 'surveillance'],
        'training': ['training', 'certificate', 'certification', 'expired', 'expiring'],
        'geo_fencing': ['location', 'checkin', 'checkout', 'zone', 'geofence', 'gps'],
    }

    # Map keywords to RAG sources
    RAG_SOURCES = {
        'dot': ['49_cfr_40', '49_cfr_382', '49_cfr_391'],
        'background': ['fcra'],
        'health': ['osha_1910'],
    }

    def route(self, question: str) -> RoutedQuestion:
        """Route question to appropriate pipeline"""
        question_lower = question.lower()

        # Classify question type
        question_type, confidence = self._classify_type(question_lower)

        # Determine if RAG is needed
        requires_rag = question_type in [QuestionType.REGULATORY, QuestionType.POLICY]

        # Determine RAG sources
        rag_sources = self._get_rag_sources(question_lower) if requires_rag else []

        # Determine data modules
        data_modules = self._get_data_modules(question_lower)

        return RoutedQuestion(
            original=question,
            question_type=question_type,
            requires_rag=requires_rag,
            rag_sources=rag_sources,
            data_modules=data_modules,
            confidence=confidence,
        )

    def _classify_type(self, question: str) -> Tuple[QuestionType, float]:
        """Classify question type"""
        # Check for aggregation
        if any(kw in question for kw in self.AGGREGATION_KEYWORDS):
            return QuestionType.AGGREGATION, 0.9

        # Check for regulatory
        if any(kw in question for kw in self.REGULATORY_KEYWORDS):
            return QuestionType.REGULATORY, 0.85

        # Check for policy
        if any(kw in question for kw in self.POLICY_KEYWORDS):
            return QuestionType.POLICY, 0.8

        # Check for data query
        if any(kw in question for kw in self.DATA_KEYWORDS):
            return QuestionType.DATA_QUERY, 0.85

        # Check for comparison
        if 'compare' in question or 'versus' in question or 'vs' in question:
            return QuestionType.COMPARISON, 0.8

        return QuestionType.UNKNOWN, 0.5

    def _get_rag_sources(self, question: str) -> list:
        """Determine RAG sources based on question content"""
        sources = set()

        for category, keywords in self.MODULE_KEYWORDS.items():
            if any(kw in question for kw in keywords):
                category_sources = self.RAG_SOURCES.get(category, [])
                sources.update(category_sources)

        return list(sources) if sources else ['49_cfr_40', 'fcra', 'osha_1910']

    def _get_data_modules(self, question: str) -> list:
        """Determine which data modules to query"""
        modules = []

        for module, keywords in self.MODULE_KEYWORDS.items():
            if any(kw in question for kw in keywords):
                modules.append(module)

        # Default to employees if no specific module detected
        return modules if modules else ['employees']
```

---

## 3. Prompt Injection Prevention

### 3.1 Input Sanitization

```python
# backend/pcs/der_iq/security.py

import re
import html
from typing import Optional, Tuple

class PromptSecurityService:
    """
    Security service for prompt injection prevention.

    Implements multiple layers of defense:
    1. Input sanitization and validation
    2. Output validation
    3. SQL injection detection
    4. Malicious pattern detection
    """

    # Maximum input length
    MAX_INPUT_LENGTH = 2000

    # Suspicious patterns that may indicate injection attempts
    INJECTION_PATTERNS = [
        r'ignore\s+(previous|above|all)\s+(instructions?|prompts?)',
        r'forget\s+(everything|what|your)',
        r'you\s+are\s+(now|actually)',
        r'new\s+instructions?:',
        r'system\s*:',
        r'assistant\s*:',
        r'user\s*:',
        r'\[INST\]',
        r'<\|.*?\|>',
        r'###\s*instruction',
        r'```sql.*?;.*?```',  # SQL in code blocks
    ]

    # SQL injection patterns
    SQL_INJECTION_PATTERNS = [
        r"'\s*OR\s+'1'\s*=\s*'1",
        r";\s*DROP\s+TABLE",
        r";\s*DELETE\s+FROM",
        r"UNION\s+SELECT",
        r"--\s*$",
        r"/\*.*?\*/",
    ]

    def __init__(self):
        self.injection_regexes = [
            re.compile(p, re.IGNORECASE) for p in self.INJECTION_PATTERNS
        ]
        self.sql_injection_regexes = [
            re.compile(p, re.IGNORECASE) for p in self.SQL_INJECTION_PATTERNS
        ]

    def sanitize_input(self, user_input: str) -> Tuple[str, Optional[str]]:
        """
        Sanitize user input.

        Returns:
            Tuple of (sanitized_input, error_message)
        """
        # Check length
        if len(user_input) > self.MAX_INPUT_LENGTH:
            return "", f"Input too long (max {self.MAX_INPUT_LENGTH} characters)"

        # Check for empty input
        if not user_input.strip():
            return "", "Input cannot be empty"

        # HTML escape
        sanitized = html.escape(user_input)

        # Remove control characters
        sanitized = re.sub(r'[\x00-\x1f\x7f-\x9f]', '', sanitized)

        # Check for injection patterns
        for pattern in self.injection_regexes:
            if pattern.search(sanitized):
                return "", "Input contains disallowed patterns"

        # Check for SQL injection patterns
        for pattern in self.sql_injection_regexes:
            if pattern.search(sanitized):
                return "", "Input contains suspicious SQL patterns"

        return sanitized, None

    def validate_generated_sql(self, sql: str) -> Tuple[bool, Optional[str]]:
        """
        Validate generated SQL before execution.

        Returns:
            Tuple of (is_valid, error_message)
        """
        sql_upper = sql.upper()

        # Must be SELECT only
        if not sql_upper.strip().startswith('SELECT'):
            return False, "Only SELECT queries allowed"

        # No write operations
        write_ops = ['INSERT', 'UPDATE', 'DELETE', 'DROP', 'CREATE', 'ALTER', 'TRUNCATE']
        for op in write_ops:
            if re.search(rf'\b{op}\b', sql_upper):
                return False, f"Write operation '{op}' not allowed"

        # No system tables
        if 'pg_' in sql.lower() or 'information_schema' in sql.lower():
            return False, "System table access not allowed"

        # No stored procedure calls
        if 'EXECUTE' in sql_upper or 'CALL' in sql_upper:
            return False, "Stored procedure calls not allowed"

        # No file operations
        if 'COPY' in sql_upper or 'pg_read_file' in sql.lower():
            return False, "File operations not allowed"

        return True, None

    def validate_output(self, output: dict) -> Tuple[bool, Optional[str]]:
        """
        Validate LLM output before returning to user.

        Returns:
            Tuple of (is_valid, error_message)
        """
        # Check for leaked system prompts
        sensitive_phrases = [
            'system prompt',
            'you are a',
            'critical rules',
            'mandatory where',
        ]

        output_str = str(output).lower()
        for phrase in sensitive_phrases:
            if phrase in output_str:
                return False, "Output may contain sensitive information"

        return True, None
```

---

## 4. API Endpoints

### 4.1 DER IQ Chat Endpoint

```python
# backend/pcs/der_iq/views.py

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from pcs.der_iq.orchestrator import DERIQOrchestrator
from pcs.der_iq.serializers import ChatRequestSerializer, ChatResponseSerializer

class DERIQChatView(APIView):
    """
    DER IQ natural language chat endpoint.

    POST /api/v1/der-iq/chat
    {
        "message": "Show me employees with expiring DOT certs",
        "conversation_id": "optional-uuid"
    }

    Response:
    {
        "response": "I found 15 employees with DOT certificates expiring...",
        "data": [...],
        "visualization": {...},
        "sources": [...],
        "sql_query": "SELECT ... (for transparency)",
        "conversation_id": "uuid"
    }
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Validate request
        serializer = ChatRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Build user context from JWT
        user_context = {
            'tenant_id': request.jwt_tenant_id,
            'tenant_schema': f"tenant_{request.jwt_tenant_id}",
            'user_id': request.jwt_user_id,
            'system_role': request.jwt_role,
            'scopes': request.jwt_scopes,
            'location_ids': request.jwt_location_ids,
        }

        # Process query
        orchestrator = DERIQOrchestrator(user_context)

        try:
            result = orchestrator.process_query(
                question=serializer.validated_data['message'],
                conversation_id=serializer.validated_data.get('conversation_id')
            )

            response_serializer = ChatResponseSerializer(result)
            return Response(response_serializer.data)

        except PermissionDenied as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_403_FORBIDDEN
            )
        except QueryGenerationError as e:
            return Response(
                {'error': f"Could not process query: {e}"},
                status=status.HTTP_400_BAD_REQUEST
            )


class DERIQSuggestionsView(APIView):
    """
    Get query suggestions based on user role and recent activity.

    GET /api/v1/der-iq/suggestions
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        role = request.jwt_role
        scopes = request.jwt_scopes

        suggestions = self._get_suggestions_for_role(role, scopes)
        return Response({'suggestions': suggestions})

    def _get_suggestions_for_role(self, role: str, scopes: list) -> list:
        """Get role-appropriate query suggestions"""

        base_suggestions = [
            "How many active employees do we have?",
            "Show employees with compliance issues",
        ]

        role_suggestions = {
            'SafetyManager': [
                "Which employees have expiring certifications this month?",
                "Show drug test results from the last 30 days",
                "List employees overdue for random testing",
            ],
            'DER': [
                "Show employees needing clearinghouse queries",
                "List positive drug tests requiring MRO review",
                "Which drivers have expired medical certificates?",
            ],
            'CompanyAdmin': [
                "Show compliance status by location",
                "Compare drug test rates across divisions",
                "Export compliance summary for audit",
            ],
            'HROnboarding': [
                "Show candidates pending background checks",
                "List new hires needing onboarding completion",
                "Which employees are missing required certifications?",
            ],
        }

        return base_suggestions + role_suggestions.get(role, [])
```

### 4.2 Orchestrator

```python
# backend/pcs/der_iq/orchestrator.py

import uuid
import time
from typing import Dict, Optional
from dataclasses import dataclass
from django.core.cache import cache
from pcs.der_iq.security import PromptSecurityService
from pcs.der_iq.question_router import QuestionRouter, QuestionType
from pcs.der_iq.sql_generator import RBACAwareSQLGenerator
from pcs.der_iq.rag_pipeline import RAGPipeline
from pcs.der_iq.response_formatter import ResponseFormatter

@dataclass
class QueryResult:
    """Result from DER IQ query processing"""
    response: str
    data: list
    visualization: Optional[dict]
    sources: list
    sql_query: Optional[str]
    conversation_id: str
    processing_time_ms: int
    cached: bool

class DERIQOrchestrator:
    """
    Orchestrates DER IQ query processing.

    Pipeline:
    1. Input sanitization
    2. Question routing
    3. Context retrieval (RAG if needed)
    4. SQL generation
    5. Query execution
    6. Response formatting
    7. Audit logging
    """

    CACHE_TTL = 300  # 5 minutes

    def __init__(self, user_context: Dict):
        self.user_context = user_context
        self.security = PromptSecurityService()
        self.router = QuestionRouter()
        self.sql_generator = RBACAwareSQLGenerator(user_context)
        self.rag = RAGPipeline()
        self.formatter = ResponseFormatter()

    def process_query(
        self,
        question: str,
        conversation_id: Optional[str] = None
    ) -> QueryResult:
        """Process a natural language query"""
        start_time = time.time()

        # Generate conversation ID if not provided
        conversation_id = conversation_id or str(uuid.uuid4())

        # 1. Sanitize input
        sanitized, error = self.security.sanitize_input(question)
        if error:
            raise ValueError(error)

        # 2. Check cache
        cache_key = self._build_cache_key(sanitized)
        cached_result = cache.get(cache_key)
        if cached_result:
            cached_result.cached = True
            return cached_result

        # 3. Route question
        routed = self.router.route(sanitized)

        # 4. Get RAG context if needed
        rag_context = []
        if routed.requires_rag:
            rag_context = self.rag.retrieve_context(
                sanitized,
                sources=routed.rag_sources,
                tenant_id=self.user_context['tenant_id']
            )

        # 5. Generate and execute SQL (if data query)
        data = []
        sql_query = None

        if routed.question_type in [QuestionType.DATA_QUERY, QuestionType.AGGREGATION]:
            sql_query, error = self.sql_generator.generate_sql(sanitized)

            if error:
                raise QueryGenerationError(error)

            # Validate SQL
            is_valid, validation_error = self.security.validate_generated_sql(sql_query)
            if not is_valid:
                raise QueryGenerationError(validation_error)

            # Execute query
            data = self._execute_query(sql_query)

        # 6. Format response
        response = self.formatter.format_response(
            question=sanitized,
            question_type=routed.question_type,
            data=data,
            rag_context=rag_context
        )

        # 7. Build result
        processing_time = int((time.time() - start_time) * 1000)

        result = QueryResult(
            response=response['text'],
            data=data,
            visualization=response.get('visualization'),
            sources=[ctx.source for ctx in rag_context],
            sql_query=sql_query,
            conversation_id=conversation_id,
            processing_time_ms=processing_time,
            cached=False
        )

        # 8. Cache result
        cache.set(cache_key, result, self.CACHE_TTL)

        # 9. Audit log
        self._log_query(sanitized, sql_query, len(data), processing_time)

        return result

    def _build_cache_key(self, question: str) -> str:
        """Build cache key including user context"""
        import hashlib
        context_str = f"{self.user_context['tenant_id']}:{self.user_context['system_role']}"
        question_hash = hashlib.sha256(question.encode()).hexdigest()[:16]
        return f"deriq:{context_str}:{question_hash}"

    def _execute_query(self, sql: str) -> list:
        """Execute SQL query on read replica"""
        from django.db import connections

        with connections['read_replica'].cursor() as cursor:
            cursor.execute(sql)
            columns = [col[0] for col in cursor.description]
            rows = cursor.fetchall()

        return [dict(zip(columns, row)) for row in rows]

    def _log_query(self, question: str, sql: str, result_count: int, time_ms: int):
        """Log query for audit and analytics"""
        from pcs.tasks import log_der_iq_query

        log_der_iq_query.delay({
            'tenant_id': self.user_context['tenant_id'],
            'user_id': self.user_context['user_id'],
            'role': self.user_context['system_role'],
            'question': question,
            'sql_generated': sql,
            'result_count': result_count,
            'processing_time_ms': time_ms,
        })
```

---

## 5. Action Plan

### Phase 1: Core Infrastructure (Week 1)

| Task | Priority | Effort | Dependencies |
|------|----------|--------|--------------|
| Set up pgvector extension | High | 0.5 days | PostgreSQL |
| Create regulatory_embeddings table | High | 0.5 days | pgvector |
| Implement SchemaContextBuilder | High | 1 day | Database schema |
| Implement PromptSecurityService | High | 1 day | None |
| Set up Anthropic API integration | High | 0.5 days | API keys |

**Deliverables:**
- [ ] pgvector installed and configured
- [ ] Schema context generation working
- [ ] Input sanitization tested
- [ ] API client configured

### Phase 2: SQL Generation (Week 2)

| Task | Priority | Effort | Dependencies |
|------|----------|--------|--------------|
| Implement RBACAwareSQLGenerator | High | 2 days | Schema context |
| Implement SQL validation | High | 1 day | Security service |
| Implement RBAC filter injection | High | 1 day | SQL generator |
| Create query execution layer | Medium | 1 day | Read replica |
| Add query caching | Medium | 0.5 days | Redis |

**Deliverables:**
- [ ] SQL generation with RBAC constraints
- [ ] Defense-in-depth validation
- [ ] Query execution on read replica
- [ ] 5-minute cache layer

### Phase 3: RAG Pipeline (Week 3)

| Task | Priority | Effort | Dependencies |
|------|----------|--------|--------------|
| Implement RAGPipeline | High | 2 days | pgvector |
| Implement QuestionRouter | High | 1 day | None |
| Create EmbeddingIngestionService | Medium | 1 day | RAG pipeline |
| Ingest regulatory documents | Medium | 2 days | Ingestion service |

**Deliverables:**
- [ ] RAG context retrieval working
- [ ] Question classification implemented
- [ ] 49 CFR, FCRA, OSHA documents ingested
- [ ] Similarity search optimized

### Phase 4: API & Integration (Week 4)

| Task | Priority | Effort | Dependencies |
|------|----------|--------|--------------|
| Implement DERIQOrchestrator | High | 1 day | All components |
| Create API endpoints | High | 1 day | Orchestrator |
| Implement ResponseFormatter | Medium | 1 day | None |
| Add audit logging | Medium | 0.5 days | Kafka |
| Create frontend integration | Medium | 1 day | API endpoints |

**Deliverables:**
- [ ] /api/v1/der-iq/chat endpoint
- [ ] /api/v1/der-iq/suggestions endpoint
- [ ] Response formatting with visualizations
- [ ] Comprehensive audit trail
- [ ] Frontend chat component

---

## 6. Security Considerations

### Prompt Injection Mitigations

| Attack Vector | Mitigation |
|---------------|------------|
| Direct injection | Input sanitization, pattern detection |
| Indirect injection | Output validation, no raw LLM output |
| SQL injection via LLM | SQL validation, parameterized defense |
| System prompt leakage | Output filtering for sensitive phrases |
| Token limit attacks | Input length limits |

### Data Security

| Concern | Mitigation |
|---------|------------|
| Cross-tenant data access | Mandatory tenant_id filter injection |
| Unauthorized PII access | Scope checking before query generation |
| Query result leakage | Role-based field masking in response |
| Audit trail | All queries logged with user context |

---

## 7. Monitoring & Metrics

### Key Metrics

```yaml
DER IQ Metrics:
  - Query latency (P50, P95, P99)
  - SQL generation success rate
  - RAG retrieval relevance scores
  - Cache hit rate
  - Token usage per query
  - Error rate by type
  - Queries per user/tenant

Alerts:
  - Error rate > 5%: Page on-call
  - P99 latency > 5s: Warning
  - Token usage anomaly: Investigate
  - Injection attempt detected: Security alert
```

---

**Document Status**: Implementation ready
**Author**: Architecture Team
**Last Review**: 2025-11-26
**Next Review**: Post Phase 1 implementation
