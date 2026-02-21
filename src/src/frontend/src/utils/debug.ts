/**
 * Debug utility for logging authentication issues
 */
export function logAuthDebug() {
  console.log("=== Auth Debug Info ===");
  console.log("II_URL env:", process.env.II_URL);
  console.log("DFX_NETWORK:", process.env.DFX_NETWORK);
  console.log("CANISTER_ID_BACKEND:", process.env.CANISTER_ID_BACKEND);
  console.log("======================");
}
