variable "dns_name" {
  type        = string
  description = "The name of the DNS"
}

variable "dns_record_ttl" {
  type        = number
  description = "The TTL for the DNS record"
}

variable "dns_hosted_zone" {
  type = string
}