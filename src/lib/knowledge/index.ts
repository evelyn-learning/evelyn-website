/**
 * Knowledge Module System
 *
 * Export all types and utilities for knowledge modules.
 */

// Types
export * from './types';

// Registry
export {
  getModuleId,
  registerModule,
  isModuleRegistered,
  isModuleAvailable,
  loadModule,
  loadModuleByParams,
  getAvailableModuleIds,
  getAllModuleMetadata,
  getModulesBySubject,
  getModulesByLevel,
  initializeRegistry,
  type ModuleMetadata,
} from './registry';
