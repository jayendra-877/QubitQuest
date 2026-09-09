// Stub for ExecutionResult Model
const ExecutionResult = {
  id: String,
  circuitId: String,
  userId: String,
  results: Object, // e.g., {'00': 0.5, '11': 0.5}
  executedAt: Date
};

module.exports = ExecutionResult;
