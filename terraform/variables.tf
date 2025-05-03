variable "location" {
  type = string
}
variable "dns_hosted_zone" {
  type        = string
  description = "The name of the DNS"
}
variable "dns_name" {
  type        = string
  description = "The name of the DNS"
}
variable "vpc_cidr_block" {
  type        = string
  description = "The cidr block for vpc"
}
variable "image_uri" {
  type = string
}
variable "subnet_availability_zones" {
  type        = list(string)
  description = "The availability zones for the subnets"
}

variable "public_subnet_cidrs" {
  type        = list(string)
  description = "The cidr block for the public subnet"
}

variable "vpc_name" {
  type        = string
  description = "The name tag for the VPC"
}

variable "tg_name" {
  type        = string
  description = "The name of the target group"
}

variable "alb_name" {
  type        = string
  description = "The name of the ALB"
}

variable "ecs_name" {
  type    = string
}

variable "service_name" {
  type    = string
}

variable "ecs_family" {
  type    = string
}

variable "exec_role" {
  type        = string
  description = "Execution role for ECS"
}

variable "cpu" {
  type        = number
  description = "ECS Container CPU"
}

variable "memory" {
  type        = number
  description = "ECS Container memory"
}