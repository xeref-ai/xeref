// functions/src/quotaManager.js

const { MetricServiceClient } = require('@google-cloud/monitoring');
const { getSystemState, updateSystemState } = require('./stateManager');

module.exports = (db) => {
  const monitoringClient = new MetricServiceClient();
  
  class IntelligentQuotaManager {
    constructor() {
      this.quotas = {
        'xerefai-staging': { functions_quota: 2000, secrets_quota: 200 },
        'xerefai': { functions_quota: 10000, secrets_quota: 500 }
      };
    }
    
    async checkAllQuotas() {
      for (const [projectId, projectQuotas] of Object.entries(this.quotas)) {
        for (const [resourceType, limit] of Object.entries(projectQuotas)) {
          const currentUsage = this.getSimulatedUsage(resourceType, limit);
          await this.processResourceState(projectId, resourceType, currentUsage, limit);
        }
      }
    }
    
    async processResourceState(projectId, resourceType, currentUsage, limit) {
      const currentState = await getSystemState(resourceType, projectId) || {};
      const usagePercent = (currentUsage / limit) * 100;
      let shouldSendAlert = false;
      let newAlertSentStatus = currentState.alertSent || false;
      
      if (usagePercent > 85 && !currentState.alertSent) {
        shouldSendAlert = true;
        newAlertSentStatus = true;
        console.log(`ALERT TRIGGERED for ${resourceType} in ${projectId}. Usage: ${usagePercent.toFixed(2)}%`);
        await this.writeCustomMetric(projectId, usagePercent, 'HIGH');
      } else if (usagePercent <= 85 && currentState.alertSent) {
        console.log(`Alert condition cleared for ${resourceType} in ${projectId}.`);
        newAlertSentStatus = false;
      }
      
      const newState = {
        usageSnapshot: currentUsage,
        predictionWindow: 30,
        alertSent: newAlertSentStatus
      };
      await updateSystemState(resourceType, projectId, newState);
    }
    
    getSimulatedUsage(resourceType, limit) {
      const randomFactor = Math.random();
      if (randomFactor > 0.9) {
        return Math.floor(limit * 0.95);
      } else if (randomFactor > 0.7) {
        return Math.floor(limit * 0.75);
      }
      return Math.floor(limit * 0.5);
    }
    
    async writeCustomMetric(projectId, value, severity) {
      // ... (existing implementation remains the same)
    }
  }
  
  return { IntelligentQuotaManager };
};
