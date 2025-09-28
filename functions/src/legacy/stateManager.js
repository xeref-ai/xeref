// functions/src/stateManager.js

const { FieldValue } = require('firebase-admin/firestore');

module.exports = (db) => {
  // --- Advanced State Management for Quota Monitoring ---

  function validateSystemState(data) {
    if (typeof data.usageSnapshot !== 'number' || typeof data.predictionWindow !== 'number') {
      console.error("Invalid systemState data:", data);
      return false;
    }
    return true;
  }

  const getSystemState = async (resourceType, resourceId) => {
    const docId = `${resourceType}_${resourceId}`;
    try {
      const docRef = db.collection('systemState').doc(docId);
      const doc = await docRef.get();
      if (doc.exists) {
        return doc.data();
      }
      return null;
    } catch (error) {
      console.error(`Error getting system state for ${docId}:`, error);
      throw new Error(`Failed to get system state: ${error.message}`);
    }
  };

  const updateSystemState = async (resourceType, resourceId, stateData) => {
    const docId = `${resourceType}_${resourceId}`;
    
    const dataToStore = {
      ...stateData,
      lastChecked: FieldValue.serverTimestamp()
    };

    if (!validateSystemState(dataToStore)) {
      throw new Error("Invalid system state data provided.");
    }

    try {
      const docRef = db.collection('systemState').doc(docId);
      await docRef.set(dataToStore, { merge: true });
      console.log(`Successfully updated system state for ${docId}.`);
    } catch (error) {
      console.error(`Error updating system state for ${docId}:`, error);
      throw new Error(`Failed to update system state: ${error.message}`);
    }
  };

  const recordSuccessfulDeployment = async (message, context) => {
    // ... existing implementation
  };
  
  return {
    getSystemState,
    updateSystemState,
    recordSuccessfulDeployment
  };
};
