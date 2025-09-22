# terraform/main.tf

terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_project_service" "firebase_api" {
  service = "firebase.googleapis.com"
}

resource "google_project_service" "firestore_api" {
  service = "firestore.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "cloudfunctions_api" {
  service = "cloudfunctions.googleapis.com"
}

resource "google_project_service" "cloudbuild_api" {
  service = "cloudbuild.googleapis.com"
}

resource "google_project_service" "secretmanager_api" {
  service = "secretmanager.googleapis.com"
}

resource "google_project" "main" {
  project_id      = var.project_id
  name            = var.project_id
  billing_account = var.billing_account
  org_id          = var.org_id
}
