output "alb_arn" {
  value       = aws_lb.alb.arn
  description = "The arn of alb"
}

output "alb_dns" {
  value       = aws_lb.alb.dns_name
  description = "The dns of the alb"
}

output "alb_url" {
  value       = "https://${aws_lb.alb.dns_name}"
  description = "The url of the alb"
}

output "tg_arn" {
  value       = aws_lb_target_group.tg.arn
  description = "The arn of target group"
}

output "http_listen_id" {
  value       = aws_lb_listener.listener-http.id
  description = "The id of http listener"
}


output "alb_zone_id" {
  value       = aws_lb.alb.zone_id
  description = "The zone id of alb"
}