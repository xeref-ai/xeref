# terraform/environments/staging/notificationChannels.tf

resource "google_pubsub_topic" "incident_response" {
  project = var.project_id
  name    = "incident-response"
}

resource "google_monitoring_notification_channel" "incident_response_pubsub" {
  project      = var.project_id
  display_name = "Incident Response (Pub/Sub)"
  type         = "pubsub"
  labels = {
    topic = google_pubsub_topic.incident_response.id
  }
  user_labels = {
    "X-Alert-Payload-Version" = "1.0"
  }
}
