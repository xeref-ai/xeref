// functions/src/incidentResponse.js

module.exports = (db) => {

  const incidentResponse = async (message, context) => {
    const payload = JSON.parse(Buffer.from(message.data, 'base64').toString());
    const incident = payload.incident;
    const userLabels = message.attributes || {};
    const resourceType = userLabels.resource_type || 'unknown';
    const isDryRun = userLabels.dry_run === 'true';

    console.log(`Incident received for resource: ${resourceType}. Dry run: ${isDryRun}`);

    if (isDryRun) {
      console.log("DRY RUN: Simulating response. No actions will be taken.");
    }

    switch (resourceType) {
      case 'firestore_quota':
        await handleFirestoreQuota(incident, isDryRun);
        break;
      case 'functions_quota':
        await handleFunctionsQuota(incident, isDryRun);
        break;
      case 'deployment_failure':
        await handleDeploymentFailure(incident, isDryRun);
        break;
      default:
        console.warn(`No specific mitigation handler for resource type: ${resourceType}`);
    }

    return null;
  };

  async function handleFirestoreQuota(incident, isDryRun) {
    console.log(`Handling Firestore quota incident: ${incident.incident_id}`);
    if (isDryRun) {
      console.log("DRY RUN: Would execute Firestore mitigation (e.g., prune old data).");
      return;
    }
  }

  async function handleFunctionsQuota(incident, isDryRun) {
    console.log(`Handling Cloud Functions quota incident: ${incident.incident_id}`);
    if (isDryRun) {
      console.log("DRY RUN: Would execute Functions mitigation (e.g., scale down non-critical functions).");
      return;
    }
  }

  async function handleDeploymentFailure(incident, isDryRun) {
    console.log(`Handling deployment failure incident: ${incident.incident_id}`);
    if (isDryRun) {
      console.log("DRY RUN: Would trigger auto-revert to last known stable config.");
      return;
    }
  }
  
  return { incidentResponse };
};
