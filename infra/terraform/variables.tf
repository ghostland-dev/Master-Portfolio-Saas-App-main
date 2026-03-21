variable "region" {
  description = "AWS region"
  type        = string
  default     = "eu-west-3"
}

variable "db_password" {
  description = "RDS root password"
  type        = string
  sensitive   = true
}
