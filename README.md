# AWS Threat Modelling App Deployment to AWS ECS with Terraform and Github Actions

This project deploys a containerised Node.js application to AWS ECS using Terraform and GitHub Actions. The setup is designed to be simple, repeatable, and scalable, removing the need for manual steps in the AWS Console.

---

## Architecture Diagram


![alt text](./images/Architecture%20Diagram.gif)

## Overview


This project contains the Terraform code and Dockerfile to deploy the **threatmodel** web application on **AWS ECS Fargate**, behind a **public ALB with HTTPS**, using **ACM, Route 53**, and **Cloudflare** for DNS.

> ⚙️ Just edit a few values in `terraform.tfvars`, follow the steps below, and you're live.

---

---

### Architecture Diagram:

![alt text](./images/Architecture%20Diagram.gif)

---

### Local App Setup 💻

```bash
yarn install
yarn build
yarn global add serve
serve -s build
```
Then visit:

```bash
http://localhost:3000/workspaces/default/dashboard
```

Or use:

```bash
yarn global add serve
serve -s build
```

---

## Key Components

- ### Docker
    - A `Dockerfile` in the app directory defines how the application is built into a container.

- ### Terraform
    - ECS Fargate for hosting the container.
    - Application Load Balancer for routing traffic.
    - Route 53 for domain management.
    - ACM for SSL certificates.
    - Security groups to control access.
    - VPC with public subnets, internet gateway, and NAT gateway.
    - Remote state stored in an S3 bucket using native state locking.

- ### CI/CD (GitHub Actions)

    - Building and scanning the Docker image.
    - Pushing the image to Amazon ECR.
    - Running Terraform apply.
    - Destroying infrastructure if needed.

---

## Directory Structure


## 🌐 Prerequisites

- AWS account (with permissions to manage ECS, ALB, ACM, ECR, Route 53)
- Created a domain on **Cloudflare**
- Terraform installed
- Docker installed
- AWS CLI configured using 'aws configure' command and AWS security credentials.

---

## 🪜 Step-by-Step Guide

### 1. 🔧 Create a Public Hosted Zone on Route 53

- Go to **Route 53 → Hosted Zones → Create Hosted Zone**
- Domain name: `threatmodel.<your-domain>`
- Type: **Public hosted zone**

This will generate a list of **NameServers (NS)**.

---

### 2. 🌐 Update Cloudflare DNS

- Log into [Cloudflare](https://dash.cloudflare.com)
- Go to your main domain (e.g. `example.com`)
- Under **DNS > Settings**, add 4 **NS records** with the ones from Route 53

> ⚠️ DNS propagation may take a few minutes.

---

### 3. 📦 Create an ECR Repository

In the AWS Console or CLI:

```bash
aws ecr create-repository --repository-name threatmodel
```

---

### 4. 🔐 GitHub Actions: Secrets Configuration

To enable the automated pipelines (Docker image build & push, Terraform deploy/destroy), add these repository secrets:

Go to:
GitHub → Settings → Secrets and variables → Actions → New repository secret
![image](https://github.com/user-attachments/assets/ef58eef9-a702-41a2-8959-98f88fe99bd6)

---

### 5. 🐳 Build & Push Docker Image
```bash
# Authenticate Docker to your ECR
aws ecr get-login-password | docker login --username AWS --password-stdin <your-aws-account-id>.dkr.ecr.<region>.amazonaws.com

# Build the image
docker build -t threatmodel .

# Tag the image
docker tag threatmodel:latest <your-ecr-url>/threatmodel:latest

# Push it
docker push <your-ecr-url>/threatmodel:latest
```

or

Run the **Build and Push Docker Image to ECR** workflow:
Go to: Actions → Build and Push Docker Image to ECR → Run Workflow → Type "yes"

---

### 5. ✏️ Then, Edit ***terraform.tfvars***

Update the values with your own:
```hcl
domain        = "threatmodel.example.com"
container_img = "<your-ecr-url>/threatmodel:latest"
exec_role     = "ecsTaskExecutionRole"
cpu           = 1024
memory        = 3072
dns_name = "aws.threatmodel.<your-domain>"
dns_hosted_zone = "threatmodel.<your-domain>"
```

---

### 6. Deploy Terraform through CI/CD

Run the **Infrastructure Build Pipeline** workflow
Go to: Actions → Infrastructure Build Pipeline → Run Workflow → Type "yes"

---

### 7. ✅ Done!

After a couple minutes, visit your app!
```
https://aws.threatmodel.<your-domain>
```
