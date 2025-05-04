output "vpc_id" {
  description = "The ID of the VPC"
  value       = aws_vpc.vpc.id
}

output "public_subnet_id" {
  description = "The IDs of the public subnets"
  value       = aws_subnet.public[*].id
}

output "internet_gateway_id" {
  description = "The ID of the internet gateway"
  value       = aws_internet_gateway.igw.id
}

output "ecs_sg_id" {
  description = "The id of container security group"
  value       = aws_security_group.ecs_sg.id
}

output "alb_sg_id" {
  description = "The id of load balancer security group"
  value       = aws_security_group.alb_sg.id
}