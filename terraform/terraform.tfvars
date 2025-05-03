location = "us-east-1"

# VPC & Networking
vpc_name                  = "hypertrio-vpc"
vpc_cidr_block            = "10.0.0.0/16"
public_subnet_cidrs       = ["10.0.1.0/24", "10.0.2.0/24"]
subnet_availability_zones = ["us-east-1a", "us-east-1b"]

# ECS & App
image_uri = "public.ecr.aws/o8g5z6h6/hypertrio@sha256:c41d9e2dbce27f11cd527a3c3847eed3e3a3a060457f9be8980b957758413a8d"
ecs_name       = "hypertrio-ecs"
ecs_family     = "hypertrio-task"
service_name   = "hypertrio-service"
exec_role      = "ecsTaskExecutionRole" # replace with your actual IAM role ARN
cpu            = 512
memory         = 1024

# ALB
alb_name = "hypertrio-alb"
tg_name  = "hypertrio-target-group"


# Route 53 / ACM
dns_name = "app.hypertrio.hamidhirsi.com"
dns_hosted_zone = "hypertrio.hamidhirsi.com"