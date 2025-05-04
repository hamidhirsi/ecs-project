terraform {
  backend "s3" {
    bucket         = "hypertrio-terraform"  
    key            = "terraform/terraform.tfstate"
    region         = "us-east-1"
  }
}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  required_version = ">= 1.3.0"
}

provider "aws" {
  region = var.location
}