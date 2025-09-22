# terraform/variables.tf

variable "project_id" {
  description = "The GCP project ID."
  type        = string
  default     = "xerefai-prod"
}

variable "region" {
  description = "The GCP region for resources."
  type        = string
  default     = "us-central1"
}

variable "billing_account" {
  description = "The billing account to associate with the project."
  type        = string
  # Replace with your actual Billing Account ID
  # Sensitive - consider using a secret manager or tfvars file
  default     = "YOUR_BILLING_ACCOUNT_ID" 
}

variable "org_id" {
  description = "The organization ID."
  type        = string
  # Replace with your actual Organization ID if applicable
  default     = "YOUR_ORGANIZATION_ID"
}
