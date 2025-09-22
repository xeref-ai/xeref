# Terraform for Xeref.ai Infrastructure

This directory contains all Terraform configurations for provisioning the foundational Google Cloud and Firebase infrastructure for the Xeref.ai project.

## 📜 Source of Truth

As defined in our enterprise architecture, **Terraform is the exclusive source of truth for all infrastructure provisioning.** This includes:

-   GCP Project creation (`xerefai-prod`, `xerefai-dev`, etc.)
-   Enabling all necessary Google Cloud APIs (Firebase, Firestore, Cloud Functions, etc.)
-   Provisioning core Firebase services (Firestore databases, Storage buckets).
-   Defining Cloud Functions (runtime, memory, region, service account).
-   Creating Secret Manager secrets.
-   Setting up Cloud Build triggers.
-   Managing all underlying IAM roles and service accounts.

##  Boundary with Firebase Studio

**Firebase Studio** is the source of truth for **application-level configuration** that resides *within* the infrastructure provisioned by Terraform. This includes:

-   Firestore Security Rules logic.
-   Cloud Functions code.
-   Firebase Hosting configurations (routes, redirects).
-   App Check provider settings.
-   Remote Config parameter values.

## Usage

### Prerequisites

-   Install Terraform
-   Authenticate with Google Cloud: `gcloud auth application-default login`

### Initialization

Run the following command in this directory:

```bash
terraform init
```

### Planning and Applying

Before applying any changes, always run a plan to review the proposed actions:

```bash
# Update variables in variables.tf or use a terraform.tfvars file
terraform plan
terraform apply
```
