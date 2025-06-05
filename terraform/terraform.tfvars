location = "us-east-1"

# VPC & Networking
vpc_name                  = "threatmodel-vpc"
vpc_cidr_block            = "10.0.0.0/16"
public_subnet_cidrs       = ["10.0.1.0/24", "10.0.2.0/24"]
subnet_availability_zones = ["us-east-1a", "us-east-1b"]

# ECS & App
image_uri = "292144046362.dkr.ecr.us-east-1.amazonaws.com/threatmodel:latest"
ecs_name       = "threatmodel-ecs"
ecs_family     = "threatmodel-task"
service_name   = "threatmodel-service"
exec_role      = "ecsTaskExecutionRole"
cpu            = 1024
memory         = 2048

# ALB
alb_name = "threatmodel-alb"
tg_name  = "threatmodel-target-group"


# Route 53 / ACM
dns_name = "aws.threatmodel.hamidhirsi.com"
dns_hosted_zone = "threatmodel.hamidhirsi.com"