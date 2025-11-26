# Infrastructure Architecture Specification

**Version**: 1.0
**Last Updated**: 2025-11-26
**Status**: Implementation Ready
**Compliance**: FedRAMP Moderate, SOC 2 Type II

---

## Executive Summary

This specification defines the AWS infrastructure architecture for Patriot Compliance Systems, implementing:

- **ECS Fargate** cluster for containerized workloads (chosen over EKS for simpler FedRAMP)
- **Aurora PostgreSQL** Multi-AZ with read replicas
- **Native ECS Blue-Green deployment** for zero-downtime releases
- **Multi-AZ architecture** across 3 availability zones
- **99.9% uptime SLA** with 4-hour RTO, 1-hour RPO

---

## Architecture Overview

```
+==============================================================================+
|                    AWS INFRASTRUCTURE ARCHITECTURE                            |
|                        (FedRAMP Moderate Boundary)                            |
+==============================================================================+

                                INTERNET
                                    │
                                    v
                         ┌──────────────────────┐
                         │     ROUTE 53         │
                         │   (DNS + Health)     │
                         └──────────┬───────────┘
                                    │
                         ┌──────────┴───────────┐
                         │    CLOUDFRONT        │
                         │  (CDN + WAF + TLS)   │
                         │                      │
                         │  - TLS 1.3 only      │
                         │  - AWS WAF rules     │
                         │  - DDoS protection   │
                         │  - Static caching    │
                         └──────────┬───────────┘
                                    │
┌───────────────────────────────────┴────────────────────────────────────────┐
│                                  VPC                                        │
│                            10.0.0.0/16                                      │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      PUBLIC SUBNETS (DMZ)                           │   │
│  │              10.0.1.0/24  │  10.0.2.0/24  │  10.0.3.0/24           │   │
│  │                 (AZ-a)    │    (AZ-b)     │    (AZ-c)              │   │
│  │                                                                     │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐                    │   │
│  │  │ NAT GW    │  │ NAT GW    │  │ NAT GW    │                    │   │
│  │  │ (AZ-a)    │  │ (AZ-b)    │  │ (AZ-c)    │                    │   │
│  │  └────────────┘  └────────────┘  └────────────┘                    │   │
│  │                                                                     │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │              APPLICATION LOAD BALANCER                       │   │   │
│  │  │           (HTTPS:443, Health Checks, WAF)                   │   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│  ┌─────────────────────────────────┴───────────────────────────────────┐   │
│  │                      PRIVATE SUBNETS (Application)                  │   │
│  │              10.0.10.0/24 │  10.0.11.0/24 │  10.0.12.0/24          │   │
│  │                 (AZ-a)    │    (AZ-b)     │    (AZ-c)              │   │
│  │                                                                     │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │                    ECS FARGATE CLUSTER                       │   │   │
│  │  │                                                              │   │   │
│  │  │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │   │   │
│  │  │   │ Django API  │  │ Django API  │  │ Django API  │         │   │   │
│  │  │   │ (2-20 tasks)│  │ (replica)   │  │ (replica)   │         │   │   │
│  │  │   └─────────────┘  └─────────────┘  └─────────────┘         │   │   │
│  │  │                                                              │   │   │
│  │  │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │   │   │
│  │  │   │ Celery      │  │ Celery Beat │  │ Next.js     │         │   │   │
│  │  │   │ Worker      │  │ (1 task)    │  │ (optional)  │         │   │   │
│  │  │   │ (1-10 tasks)│  └─────────────┘  │ (2-10 tasks)│         │   │   │
│  │  │   └─────────────┘                   └─────────────┘         │   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  │                                                                     │   │
│  │  ┌──────────────────┐  ┌──────────────────┐                        │   │
│  │  │  ElastiCache     │  │  MSK (Kafka)     │                        │   │
│  │  │  Redis Cluster   │  │  3 Brokers       │                        │   │
│  │  │  (3 nodes)       │  │  Multi-AZ        │                        │   │
│  │  └──────────────────┘  └──────────────────┘                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│  ┌─────────────────────────────────┴───────────────────────────────────┐   │
│  │                      DATABASE SUBNETS (Isolated)                    │   │
│  │              10.0.20.0/24 │  10.0.21.0/24 │  10.0.22.0/24          │   │
│  │                 (AZ-a)    │    (AZ-b)     │    (AZ-c)              │   │
│  │                                                                     │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │               AURORA POSTGRESQL CLUSTER                      │   │   │
│  │  │                                                              │   │   │
│  │  │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │   │   │
│  │  │   │  PRIMARY    │  │  STANDBY    │  │   READ      │         │   │   │
│  │  │   │  Writer     │->│  (Auto      │  │  REPLICA    │         │   │   │
│  │  │   │  (AZ-a)     │  │  Failover)  │  │  (AZ-c)     │         │   │   │
│  │  │   │             │  │  (AZ-b)     │  │             │         │   │   │
│  │  │   └─────────────┘  └─────────────┘  └─────────────┘         │   │   │
│  │  │                                                              │   │   │
│  │  │   Features:                                                  │   │   │
│  │  │   - Multi-AZ with automatic failover                        │   │   │
│  │  │   - Encryption at rest (KMS)                                │   │   │
│  │  │   - Point-in-time recovery (35 days)                        │   │   │
│  │  │   - 7-year backup retention (S3 Glacier)                    │   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                           S3 BUCKETS                                │   │
│  │                                                                     │   │
│  │  pcs-documents-prod     pcs-backups-prod     pcs-logs-prod         │   │
│  │  - SSE-KMS encryption   - Glacier lifecycle  - CloudWatch Logs     │   │
│  │  - Versioning enabled   - 7-year retention   - VPC Flow Logs       │   │
│  │  - Cross-region repl.   - Cross-region repl. - WAF Logs            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         MONITORING & SECURITY                               │
│                                                                             │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐           │
│  │ CloudWatch │  │ GuardDuty  │  │ AWS Config │  │ Security   │           │
│  │ (Metrics/  │  │ (Threat    │  │ (Compliance│  │ Hub        │           │
│  │  Logs)     │  │  Detection)│  │  Tracking) │  │ (Findings) │           │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘           │
│                                                                             │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐           │
│  │ AWS KMS    │  │ Secrets    │  │ IAM        │  │ CloudTrail │           │
│  │ (Encryption│  │ Manager    │  │ (Roles/    │  │ (API Audit)│           │
│  │  Keys)     │  │ (API Keys) │  │  Policies) │  │            │           │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Network Architecture

### 1.1 VPC Design

```hcl
# terraform/modules/networking/vpc.tf

resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "pcs-${var.environment}-vpc"
    Environment = var.environment
    Compliance  = "FedRAMP-Moderate"
  }
}

# Public Subnets (DMZ)
resource "aws_subnet" "public" {
  count                   = 3
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.${count.index + 1}.0/24"
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = false

  tags = {
    Name = "pcs-${var.environment}-public-${count.index + 1}"
    Tier = "public"
  }
}

# Private Subnets (Application)
resource "aws_subnet" "private" {
  count             = 3
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.${count.index + 10}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name = "pcs-${var.environment}-private-${count.index + 1}"
    Tier = "private"
  }
}

# Database Subnets (Isolated)
resource "aws_subnet" "database" {
  count             = 3
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.${count.index + 20}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name = "pcs-${var.environment}-database-${count.index + 1}"
    Tier = "database"
  }
}

# NAT Gateways (one per AZ for HA)
resource "aws_nat_gateway" "main" {
  count         = 3
  allocation_id = aws_eip.nat[count.index].id
  subnet_id     = aws_subnet.public[count.index].id

  tags = {
    Name = "pcs-${var.environment}-nat-${count.index + 1}"
  }
}

# VPC Flow Logs
resource "aws_flow_log" "main" {
  vpc_id               = aws_vpc.main.id
  traffic_type         = "ALL"
  log_destination_type = "s3"
  log_destination      = aws_s3_bucket.logs.arn

  tags = {
    Name = "pcs-${var.environment}-flow-logs"
  }
}
```

### 1.2 Security Groups

```hcl
# terraform/modules/networking/security_groups.tf

# ALB Security Group
resource "aws_security_group" "alb" {
  name        = "pcs-${var.environment}-alb-sg"
  description = "Security group for ALB"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "HTTPS from CloudFront"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    prefix_list_ids = [data.aws_ec2_managed_prefix_list.cloudfront.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "pcs-${var.environment}-alb-sg"
  }
}

# ECS Tasks Security Group
resource "aws_security_group" "ecs_tasks" {
  name        = "pcs-${var.environment}-ecs-tasks-sg"
  description = "Security group for ECS tasks"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "HTTP from ALB"
    from_port       = 8000
    to_port         = 8000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "pcs-${var.environment}-ecs-tasks-sg"
  }
}

# Database Security Group
resource "aws_security_group" "database" {
  name        = "pcs-${var.environment}-database-sg"
  description = "Security group for Aurora PostgreSQL"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "PostgreSQL from ECS"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs_tasks.id]
  }

  # No egress - databases don't initiate connections

  tags = {
    Name = "pcs-${var.environment}-database-sg"
  }
}

# Redis Security Group
resource "aws_security_group" "redis" {
  name        = "pcs-${var.environment}-redis-sg"
  description = "Security group for ElastiCache Redis"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "Redis from ECS"
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs_tasks.id]
  }

  tags = {
    Name = "pcs-${var.environment}-redis-sg"
  }
}
```

---

## 2. Compute Layer (ECS Fargate)

### 2.1 ECS Cluster

```hcl
# terraform/modules/ecs/cluster.tf

resource "aws_ecs_cluster" "main" {
  name = "pcs-${var.environment}-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  configuration {
    execute_command_configuration {
      kms_key_id = aws_kms_key.ecs.arn
      logging    = "OVERRIDE"

      log_configuration {
        cloud_watch_encryption_enabled = true
        cloud_watch_log_group_name     = aws_cloudwatch_log_group.ecs_exec.name
      }
    }
  }

  tags = {
    Name        = "pcs-${var.environment}-cluster"
    Environment = var.environment
  }
}

resource "aws_ecs_cluster_capacity_providers" "main" {
  cluster_name = aws_ecs_cluster.main.name

  capacity_providers = ["FARGATE", "FARGATE_SPOT"]

  default_capacity_provider_strategy {
    base              = 2
    weight            = 100
    capacity_provider = "FARGATE"
  }
}
```

### 2.2 Django API Service

```hcl
# terraform/modules/ecs/services/api.tf

resource "aws_ecs_task_definition" "api" {
  family                   = "pcs-${var.environment}-api"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 1024
  memory                   = 2048
  execution_role_arn       = aws_iam_role.ecs_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([
    {
      name  = "django-api"
      image = "${aws_ecr_repository.api.repository_url}:${var.image_tag}"

      portMappings = [
        {
          containerPort = 8000
          protocol      = "tcp"
        }
      ]

      environment = [
        { name = "DJANGO_SETTINGS_MODULE", value = "pcs.settings.production" },
        { name = "AWS_REGION", value = var.aws_region },
      ]

      secrets = [
        { name = "DATABASE_URL", valueFrom = aws_secretsmanager_secret.database_url.arn },
        { name = "REDIS_URL", valueFrom = aws_secretsmanager_secret.redis_url.arn },
        { name = "SECRET_KEY", valueFrom = aws_secretsmanager_secret.django_secret.arn },
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.api.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "api"
        }
      }

      healthCheck = {
        command     = ["CMD-SHELL", "curl -f http://localhost:8000/health || exit 1"]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 60
      }
    }
  ])

  tags = {
    Name = "pcs-${var.environment}-api-task"
  }
}

resource "aws_ecs_service" "api" {
  name                              = "pcs-${var.environment}-api"
  cluster                           = aws_ecs_cluster.main.id
  task_definition                   = aws_ecs_task_definition.api.arn
  desired_count                     = var.api_desired_count
  health_check_grace_period_seconds = 60

  capacity_provider_strategy {
    capacity_provider = "FARGATE"
    weight            = 100
    base              = 2
  }

  network_configuration {
    subnets          = var.private_subnet_ids
    security_groups  = [aws_security_group.ecs_tasks.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.api.arn
    container_name   = "django-api"
    container_port   = 8000
  }

  deployment_controller {
    type = "CODE_DEPLOY"  # Blue-Green deployment
  }

  lifecycle {
    ignore_changes = [task_definition, desired_count]
  }

  tags = {
    Name = "pcs-${var.environment}-api-service"
  }
}

# Auto Scaling
resource "aws_appautoscaling_target" "api" {
  max_capacity       = 20
  min_capacity       = 2
  resource_id        = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.api.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "api_cpu" {
  name               = "pcs-${var.environment}-api-cpu-scaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.api.resource_id
  scalable_dimension = aws_appautoscaling_target.api.scalable_dimension
  service_namespace  = aws_appautoscaling_target.api.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    target_value       = 70.0
    scale_in_cooldown  = 300
    scale_out_cooldown = 60
  }
}
```

### 2.3 Celery Worker Service

```hcl
# terraform/modules/ecs/services/celery.tf

resource "aws_ecs_task_definition" "celery" {
  family                   = "pcs-${var.environment}-celery"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 512
  memory                   = 1024
  execution_role_arn       = aws_iam_role.ecs_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([
    {
      name    = "celery-worker"
      image   = "${aws_ecr_repository.api.repository_url}:${var.image_tag}"
      command = ["celery", "-A", "pcs", "worker", "-l", "info", "-c", "4"]

      environment = [
        { name = "DJANGO_SETTINGS_MODULE", value = "pcs.settings.production" },
        { name = "AWS_REGION", value = var.aws_region },
      ]

      secrets = [
        { name = "DATABASE_URL", valueFrom = aws_secretsmanager_secret.database_url.arn },
        { name = "REDIS_URL", valueFrom = aws_secretsmanager_secret.redis_url.arn },
        { name = "KAFKA_BOOTSTRAP_SERVERS", valueFrom = aws_secretsmanager_secret.kafka_url.arn },
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.celery.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "celery"
        }
      }
    }
  ])

  tags = {
    Name = "pcs-${var.environment}-celery-task"
  }
}

resource "aws_ecs_service" "celery" {
  name            = "pcs-${var.environment}-celery"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.celery.arn
  desired_count   = var.celery_desired_count

  capacity_provider_strategy {
    capacity_provider = "FARGATE_SPOT"  # Cost optimization for workers
    weight            = 80
  }

  capacity_provider_strategy {
    capacity_provider = "FARGATE"
    weight            = 20
    base              = 1  # At least 1 on-demand for reliability
  }

  network_configuration {
    subnets          = var.private_subnet_ids
    security_groups  = [aws_security_group.ecs_tasks.id]
    assign_public_ip = false
  }

  tags = {
    Name = "pcs-${var.environment}-celery-service"
  }
}
```

---

## 3. Database Layer (Aurora PostgreSQL)

### 3.1 Aurora Cluster

```hcl
# terraform/modules/database/aurora.tf

resource "aws_rds_cluster" "main" {
  cluster_identifier = "pcs-${var.environment}-aurora"
  engine             = "aurora-postgresql"
  engine_version     = "15.4"
  engine_mode        = "provisioned"

  database_name   = "pcs"
  master_username = "pcs_admin"
  master_password = random_password.db_password.result

  # Multi-AZ
  availability_zones = var.availability_zones

  # Storage
  storage_encrypted = true
  kms_key_id        = aws_kms_key.database.arn

  # Networking
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.database.id]

  # Backup
  backup_retention_period = 35  # Maximum for Aurora
  preferred_backup_window = "03:00-04:00"
  copy_tags_to_snapshot   = true
  deletion_protection     = true

  # Maintenance
  preferred_maintenance_window = "sun:04:00-sun:05:00"
  apply_immediately            = false

  # Enhanced monitoring
  enabled_cloudwatch_logs_exports = ["postgresql", "audit"]

  # Performance Insights
  performance_insights_enabled    = true
  performance_insights_kms_key_id = aws_kms_key.database.arn

  # IAM authentication
  iam_database_authentication_enabled = true

  # Serverless v2 scaling (optional)
  serverlessv2_scaling_configuration {
    min_capacity = 0.5
    max_capacity = 32
  }

  tags = {
    Name        = "pcs-${var.environment}-aurora"
    Environment = var.environment
    Compliance  = "FedRAMP-Moderate"
  }
}

# Primary instance
resource "aws_rds_cluster_instance" "primary" {
  identifier         = "pcs-${var.environment}-aurora-primary"
  cluster_identifier = aws_rds_cluster.main.id
  instance_class     = var.db_instance_class
  engine             = aws_rds_cluster.main.engine
  engine_version     = aws_rds_cluster.main.engine_version

  publicly_accessible  = false
  db_subnet_group_name = aws_db_subnet_group.main.name

  performance_insights_enabled    = true
  performance_insights_kms_key_id = aws_kms_key.database.arn

  monitoring_interval = 60
  monitoring_role_arn = aws_iam_role.rds_monitoring.arn

  tags = {
    Name = "pcs-${var.environment}-aurora-primary"
  }
}

# Read replicas
resource "aws_rds_cluster_instance" "replicas" {
  count = 2

  identifier         = "pcs-${var.environment}-aurora-replica-${count.index + 1}"
  cluster_identifier = aws_rds_cluster.main.id
  instance_class     = var.db_instance_class
  engine             = aws_rds_cluster.main.engine
  engine_version     = aws_rds_cluster.main.engine_version

  publicly_accessible  = false
  db_subnet_group_name = aws_db_subnet_group.main.name

  performance_insights_enabled    = true
  performance_insights_kms_key_id = aws_kms_key.database.arn

  monitoring_interval = 60
  monitoring_role_arn = aws_iam_role.rds_monitoring.arn

  tags = {
    Name = "pcs-${var.environment}-aurora-replica-${count.index + 1}"
  }
}

# Separate read endpoint for read replicas
resource "aws_rds_cluster_endpoint" "reader" {
  cluster_identifier          = aws_rds_cluster.main.id
  cluster_endpoint_identifier = "reader"
  custom_endpoint_type        = "READER"

  static_members = [
    aws_rds_cluster_instance.replicas[0].id,
    aws_rds_cluster_instance.replicas[1].id,
  ]
}
```

### 3.2 Database Parameters

```hcl
# terraform/modules/database/parameters.tf

resource "aws_rds_cluster_parameter_group" "main" {
  name        = "pcs-${var.environment}-aurora-params"
  family      = "aurora-postgresql15"
  description = "PCS Aurora PostgreSQL parameters"

  # RLS and security
  parameter {
    name  = "rds.force_ssl"
    value = "1"
  }

  # Performance
  parameter {
    name  = "shared_preload_libraries"
    value = "pg_stat_statements,auto_explain,pgvector"
  }

  parameter {
    name  = "pg_stat_statements.track"
    value = "all"
  }

  parameter {
    name  = "auto_explain.log_min_duration"
    value = "1000"  # Log queries > 1 second
  }

  # Connection pooling
  parameter {
    name  = "max_connections"
    value = "1000"
  }

  # Logging for audit (FedRAMP)
  parameter {
    name  = "log_statement"
    value = "all"
  }

  parameter {
    name  = "log_connections"
    value = "1"
  }

  parameter {
    name  = "log_disconnections"
    value = "1"
  }

  tags = {
    Name = "pcs-${var.environment}-aurora-params"
  }
}
```

---

## 4. Blue-Green Deployment

### 4.1 CodeDeploy Configuration

```hcl
# terraform/modules/deployment/codedeploy.tf

resource "aws_codedeploy_app" "main" {
  name             = "pcs-${var.environment}-api"
  compute_platform = "ECS"
}

resource "aws_codedeploy_deployment_group" "api" {
  app_name               = aws_codedeploy_app.main.name
  deployment_group_name  = "pcs-${var.environment}-api-dg"
  service_role_arn       = aws_iam_role.codedeploy.arn
  deployment_config_name = "CodeDeployDefault.ECSAllAtOnce"

  ecs_service {
    cluster_name = aws_ecs_cluster.main.name
    service_name = aws_ecs_service.api.name
  }

  deployment_style {
    deployment_option = "WITH_TRAFFIC_CONTROL"
    deployment_type   = "BLUE_GREEN"
  }

  blue_green_deployment_config {
    deployment_ready_option {
      action_on_timeout    = "CONTINUE_DEPLOYMENT"
      wait_time_in_minutes = 5
    }

    terminate_blue_instances_on_deployment_success {
      action                           = "TERMINATE"
      termination_wait_time_in_minutes = 15
    }
  }

  load_balancer_info {
    target_group_pair_info {
      prod_traffic_route {
        listener_arns = [aws_lb_listener.https.arn]
      }

      target_group {
        name = aws_lb_target_group.api_blue.name
      }

      target_group {
        name = aws_lb_target_group.api_green.name
      }

      test_traffic_route {
        listener_arns = [aws_lb_listener.test.arn]
      }
    }
  }

  auto_rollback_configuration {
    enabled = true
    events  = ["DEPLOYMENT_FAILURE", "DEPLOYMENT_STOP_ON_ALARM"]
  }

  alarm_configuration {
    alarms  = [aws_cloudwatch_metric_alarm.api_errors.alarm_name]
    enabled = true
  }

  tags = {
    Name = "pcs-${var.environment}-api-deployment-group"
  }
}
```

### 4.2 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml

name: Deploy to Production

on:
  push:
    branches: [main]

env:
  AWS_REGION: us-east-1
  ECR_REPOSITORY: pcs-api
  ECS_CLUSTER: pcs-prod-cluster
  ECS_SERVICE: pcs-prod-api

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: "3.12"

      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install -r requirements-dev.txt

      - name: Run tests
        run: |
          pytest --cov=pcs --cov-report=xml

      - name: Security scan
        uses: snyk/actions/python@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

  build:
    needs: test
    runs-on: ubuntu-latest
    outputs:
      image_tag: ${{ steps.build.outputs.image_tag }}
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build, tag, and push image
        id: build
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          echo "image_tag=$IMAGE_TAG" >> $GITHUB_OUTPUT

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Generate task definition
        run: |
          aws ecs describe-task-definition \
            --task-definition pcs-prod-api \
            --query taskDefinition > task-definition.json

      - name: Update task definition with new image
        run: |
          IMAGE="${{ steps.login-ecr.outputs.registry }}/${{ env.ECR_REPOSITORY }}:${{ needs.build.outputs.image_tag }}"
          jq --arg IMAGE "$IMAGE" '.containerDefinitions[0].image = $IMAGE' task-definition.json > new-task-definition.json

      - name: Deploy to ECS (Blue-Green)
        uses: aws-actions/amazon-ecs-deploy-task-definition@v1
        with:
          task-definition: new-task-definition.json
          service: ${{ env.ECS_SERVICE }}
          cluster: ${{ env.ECS_CLUSTER }}
          wait-for-service-stability: true
          codedeploy-appspec: appspec.yaml
          codedeploy-application: pcs-prod-api
          codedeploy-deployment-group: pcs-prod-api-dg
```

---

## 5. Monitoring & Alerting

### 5.1 CloudWatch Dashboards

```hcl
# terraform/modules/monitoring/dashboards.tf

resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "pcs-${var.environment}-overview"

  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6
        properties = {
          title  = "API Response Times"
          region = var.aws_region
          metrics = [
            ["AWS/ApplicationELB", "TargetResponseTime", "LoadBalancer", aws_lb.main.arn_suffix, { stat = "p50", label = "P50" }],
            ["...", { stat = "p95", label = "P95" }],
            ["...", { stat = "p99", label = "P99" }],
          ]
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 0
        width  = 12
        height = 6
        properties = {
          title  = "Error Rates"
          region = var.aws_region
          metrics = [
            ["AWS/ApplicationELB", "HTTPCode_Target_5XX_Count", "LoadBalancer", aws_lb.main.arn_suffix],
            [".", "HTTPCode_Target_4XX_Count", ".", "."],
          ]
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 6
        width  = 8
        height = 6
        properties = {
          title  = "ECS CPU Utilization"
          region = var.aws_region
          metrics = [
            ["AWS/ECS", "CPUUtilization", "ClusterName", aws_ecs_cluster.main.name, "ServiceName", aws_ecs_service.api.name],
          ]
        }
      },
      {
        type   = "metric"
        x      = 8
        y      = 6
        width  = 8
        height = 6
        properties = {
          title  = "Database Connections"
          region = var.aws_region
          metrics = [
            ["AWS/RDS", "DatabaseConnections", "DBClusterIdentifier", aws_rds_cluster.main.cluster_identifier],
          ]
        }
      },
      {
        type   = "metric"
        x      = 16
        y      = 6
        width  = 8
        height = 6
        properties = {
          title  = "Redis Cache Hit Rate"
          region = var.aws_region
          metrics = [
            ["AWS/ElastiCache", "CacheHitRate", "CacheClusterId", aws_elasticache_cluster.main.cluster_id],
          ]
        }
      },
    ]
  })
}
```

### 5.2 Alerts

```hcl
# terraform/modules/monitoring/alerts.tf

# API Error Rate Alert
resource "aws_cloudwatch_metric_alarm" "api_errors" {
  alarm_name          = "pcs-${var.environment}-api-error-rate"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "HTTPCode_Target_5XX_Count"
  namespace           = "AWS/ApplicationELB"
  period              = 60
  statistic           = "Sum"
  threshold           = 10
  alarm_description   = "API 5XX errors exceeded threshold"

  dimensions = {
    LoadBalancer = aws_lb.main.arn_suffix
  }

  alarm_actions = [aws_sns_topic.alerts.arn]
  ok_actions    = [aws_sns_topic.alerts.arn]

  tags = {
    Name = "pcs-${var.environment}-api-errors"
  }
}

# Database CPU Alert
resource "aws_cloudwatch_metric_alarm" "db_cpu" {
  alarm_name          = "pcs-${var.environment}-db-cpu-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "CPUUtilization"
  namespace           = "AWS/RDS"
  period              = 300
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "Database CPU utilization is high"

  dimensions = {
    DBClusterIdentifier = aws_rds_cluster.main.cluster_identifier
  }

  alarm_actions = [aws_sns_topic.alerts.arn]
  ok_actions    = [aws_sns_topic.alerts.arn]

  tags = {
    Name = "pcs-${var.environment}-db-cpu"
  }
}

# Response Time Alert
resource "aws_cloudwatch_metric_alarm" "latency" {
  alarm_name          = "pcs-${var.environment}-latency-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "TargetResponseTime"
  namespace           = "AWS/ApplicationELB"
  period              = 60
  extended_statistic  = "p99"
  threshold           = 0.5  # 500ms
  alarm_description   = "P99 latency exceeds 500ms"

  dimensions = {
    LoadBalancer = aws_lb.main.arn_suffix
  }

  alarm_actions = [aws_sns_topic.alerts.arn]

  tags = {
    Name = "pcs-${var.environment}-latency"
  }
}
```

---

## 6. Disaster Recovery

### 6.1 Backup Strategy

```hcl
# terraform/modules/backup/main.tf

# Aurora automated backups (35-day retention)
# Configured in aws_rds_cluster

# Long-term backup to S3 Glacier
resource "aws_backup_vault" "main" {
  name        = "pcs-${var.environment}-backup-vault"
  kms_key_arn = aws_kms_key.backup.arn

  tags = {
    Name = "pcs-${var.environment}-backup-vault"
  }
}

resource "aws_backup_plan" "main" {
  name = "pcs-${var.environment}-backup-plan"

  rule {
    rule_name         = "daily-backup"
    target_vault_name = aws_backup_vault.main.name
    schedule          = "cron(0 3 * * ? *)"  # 3 AM daily

    lifecycle {
      cold_storage_after = 30   # Move to Glacier after 30 days
      delete_after       = 2555  # 7 years (FedRAMP requirement)
    }

    copy_action {
      destination_vault_arn = aws_backup_vault.dr.arn

      lifecycle {
        delete_after = 2555
      }
    }
  }

  rule {
    rule_name         = "weekly-backup"
    target_vault_name = aws_backup_vault.main.name
    schedule          = "cron(0 4 ? * SUN *)"  # 4 AM Sundays

    lifecycle {
      cold_storage_after = 30
      delete_after       = 2555
    }
  }

  tags = {
    Name = "pcs-${var.environment}-backup-plan"
  }
}

resource "aws_backup_selection" "main" {
  name         = "pcs-${var.environment}-backup-selection"
  plan_id      = aws_backup_plan.main.id
  iam_role_arn = aws_iam_role.backup.arn

  resources = [
    aws_rds_cluster.main.arn,
    aws_s3_bucket.documents.arn,
  ]
}
```

### 6.2 DR Runbook

```markdown
# Disaster Recovery Runbook

## RTO: 4 hours | RPO: 1 hour

### Scenario 1: Single AZ Failure

- **Detection**: CloudWatch alarms, ALB health checks
- **Response**: Automatic failover (Aurora Multi-AZ, ECS Multi-AZ)
- **Recovery Time**: < 5 minutes (automatic)

### Scenario 2: Database Failure

- **Detection**: RDS events, application errors
- **Response**: Aurora automatic failover to standby
- **Recovery Time**: < 2 minutes (automatic)
- **Manual Steps**: Verify application connectivity

### Scenario 3: Region Failure

- **Detection**: Route 53 health checks
- **Response**:
  1. Activate DR region resources (terraform apply)
  2. Restore Aurora from cross-region backup
  3. Update Route 53 to point to DR region
  4. Verify application functionality
- **Recovery Time**: < 4 hours

### Scenario 4: Data Corruption

- **Detection**: Application errors, data integrity checks
- **Response**:
  1. Stop write operations
  2. Identify corruption time window
  3. Use Aurora PITR to restore to pre-corruption point
  4. Verify data integrity
  5. Resume operations
- **Recovery Time**: < 2 hours

### Contact Information

- On-Call: [PagerDuty escalation]
- Database: [DBA team]
- Security: [Security team]
```

---

## 7. Cost Estimation

### Monthly Costs by Scale

| Component                | 10K Users | 100K Users | 1M Users   |
| ------------------------ | --------- | ---------- | ---------- |
| **ECS Fargate (API)**    | $146      | $365       | $1,095     |
| **ECS Fargate (Celery)** | $73       | $182       | $547       |
| **Aurora PostgreSQL**    | $292      | $730       | $2,190     |
| **ElastiCache Redis**    | $73       | $182       | $365       |
| **MSK (Kafka)**          | $0        | $200       | $400       |
| **ALB**                  | $22       | $45        | $90        |
| **NAT Gateway**          | $32       | $100       | $300       |
| **S3 Storage**           | $10       | $50        | $200       |
| **CloudWatch**           | $15       | $50        | $150       |
| **Data Transfer**        | $0        | $33        | $204       |
| **Total (On-Demand)**    | **$663**  | **$1,937** | **$5,541** |
| **Total (Reserved 3yr)** | **$464**  | **$1,356** | **$3,879** |

### Cost Optimization Strategies

1. **Reserved Instances**: 3-year reserved for Aurora and baseline ECS (31% savings)
2. **Fargate Spot**: Use for Celery workers (70% savings)
3. **S3 Intelligent-Tiering**: Automatic storage class optimization
4. **Rightsize instances**: Monthly review of CloudWatch metrics

---

## 8. Action Plan

### Phase 1: Foundation (Week 1-2)

| Task                      | Priority | Effort   | Dependencies |
| ------------------------- | -------- | -------- | ------------ |
| Create VPC and networking | High     | 2 days   | AWS account  |
| Set up security groups    | High     | 1 day    | VPC          |
| Create KMS keys           | High     | 0.5 days | AWS account  |
| Set up ECR repositories   | High     | 0.5 days | AWS account  |
| Configure IAM roles       | High     | 1 day    | AWS account  |

### Phase 2: Data Stores (Week 2-3)

| Task                     | Priority | Effort   | Dependencies |
| ------------------------ | -------- | -------- | ------------ |
| Deploy Aurora cluster    | High     | 1 day    | VPC          |
| Configure read replicas  | High     | 0.5 days | Aurora       |
| Deploy ElastiCache Redis | High     | 0.5 days | VPC          |
| Deploy MSK Kafka         | Medium   | 1 day    | VPC          |
| Set up S3 buckets        | Medium   | 0.5 days | KMS          |

### Phase 3: Compute Layer (Week 3-4)

| Task                    | Priority | Effort   | Dependencies |
| ----------------------- | -------- | -------- | ------------ |
| Create ECS cluster      | High     | 0.5 days | VPC          |
| Deploy ALB              | High     | 0.5 days | VPC          |
| Create task definitions | High     | 1 day    | ECR          |
| Deploy API service      | High     | 1 day    | Task defs    |
| Deploy Celery service   | High     | 0.5 days | Task defs    |
| Configure auto-scaling  | Medium   | 0.5 days | Services     |

### Phase 4: CI/CD & Monitoring (Week 4)

| Task                  | Priority | Effort   | Dependencies  |
| --------------------- | -------- | -------- | ------------- |
| Set up CodeDeploy     | High     | 1 day    | ECS           |
| Create GitHub Actions | High     | 1 day    | CodeDeploy    |
| Configure CloudWatch  | Medium   | 1 day    | All resources |
| Set up alerting       | Medium   | 0.5 days | CloudWatch    |
| Create dashboards     | Low      | 0.5 days | CloudWatch    |

---

**Document Status**: Implementation ready
**Author**: Architecture Team
**Last Review**: 2025-11-26
**Next Review**: Post Phase 1 implementation
