/**
 * Knowledge Module Registry
 *
 * Central registry for all available knowledge modules.
 * Modules are registered at build time and loaded dynamically at runtime.
 */

import type { KnowledgeModule, Subject, Level } from './types';

// Registry of all available modules
const moduleRegistry = new Map<string, () => Promise<KnowledgeModule>>();

// Cache of loaded modules
const moduleCache = new Map<string, KnowledgeModule>();

/**
 * Generate a module ID from subject, topic, and level
 */
export function getModuleId(subject: string, topic: string, level: string): string {
  return `${subject}-${topic}-${level}`.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Register a knowledge module
 * @param moduleId - Unique identifier for the module
 * @param loader - Async function that loads the module
 */
export function registerModule(
  moduleId: string,
  loader: () => Promise<KnowledgeModule>
): void {
  if (moduleRegistry.has(moduleId)) {
    console.warn(`Module ${moduleId} is already registered. Overwriting.`);
  }
  moduleRegistry.set(moduleId, loader);
}

/**
 * Check if a module is registered
 */
export function isModuleRegistered(moduleId: string): boolean {
  return moduleRegistry.has(moduleId);
}

/**
 * Check if a module is registered by subject, topic, and level
 */
export function isModuleAvailable(subject: string, topic: string, level: string): boolean {
  const moduleId = getModuleId(subject, topic, level);
  return isModuleRegistered(moduleId);
}

/**
 * Load a knowledge module
 * @param moduleId - The module ID to load
 * @returns The loaded module
 * @throws Error if module is not registered
 */
export async function loadModule(moduleId: string): Promise<KnowledgeModule> {
  // Check cache first
  const cached = moduleCache.get(moduleId);
  if (cached) {
    return cached;
  }

  // Get loader from registry
  const loader = moduleRegistry.get(moduleId);
  if (!loader) {
    throw new Error(`Module ${moduleId} is not registered. Available modules: ${getAvailableModuleIds().join(', ')}`);
  }

  // Load and cache
  const module = await loader();
  moduleCache.set(moduleId, module);
  return module;
}

/**
 * Load a module by subject, topic, and level
 */
export async function loadModuleByParams(
  subject: string,
  topic: string,
  level: string
): Promise<KnowledgeModule> {
  const moduleId = getModuleId(subject, topic, level);
  return loadModule(moduleId);
}

/**
 * Get all registered module IDs
 */
export function getAvailableModuleIds(): string[] {
  return Array.from(moduleRegistry.keys());
}

/**
 * Get module metadata for all registered modules (without loading full content)
 */
export interface ModuleMetadata {
  id: string;
  subject: Subject;
  topic: string;
  level: Level;
  displayName: string;
  description: string;
  estimatedHours: number;
}

// Metadata registry (lighter weight than full modules)
const metadataRegistry = new Map<string, ModuleMetadata>();

/**
 * Register module metadata (called during module registration)
 */
export function registerModuleMetadata(metadata: ModuleMetadata): void {
  metadataRegistry.set(metadata.id, metadata);
}

/**
 * Get all available module metadata
 */
export function getAllModuleMetadata(): ModuleMetadata[] {
  return Array.from(metadataRegistry.values());
}

/**
 * Get modules by subject
 */
export function getModulesBySubject(subject: Subject): ModuleMetadata[] {
  return getAllModuleMetadata().filter((m) => m.subject === subject);
}

/**
 * Get modules by level
 */
export function getModulesByLevel(level: Level): ModuleMetadata[] {
  return getAllModuleMetadata().filter((m) => m.level === level);
}

/**
 * Clear the module cache (useful for development/testing)
 */
export function clearModuleCache(): void {
  moduleCache.clear();
}

/**
 * Clear all registrations (useful for testing)
 */
export function clearRegistry(): void {
  moduleRegistry.clear();
  metadataRegistry.clear();
  moduleCache.clear();
}

// =============================================================================
// MODULE REGISTRATION
// =============================================================================

// Import and register modules here
// Each module directory should have an index.ts that exports a register function

// Example registration (will be filled in when modules are created):
// registerModule('physics-kinematics-ap', () => import('./physics/kinematics').then(m => m.module));

// For now, we'll dynamically import modules based on a config
// This allows lazy loading of modules

/**
 * Initialize the registry with all available modules
 * Called once at app startup
 */
export async function initializeRegistry(): Promise<void> {
  // Register physics modules
  try {
    // Physics - Kinematics
    registerModule('physics-kinematics-ap', async () => {
      const { module } = await import('./physics/kinematics');
      return module;
    });

    registerModuleMetadata({
      id: 'physics-kinematics-ap',
      subject: 'physics',
      topic: 'kinematics',
      level: 'AP',
      displayName: 'AP Physics 1: Kinematics',
      description: 'Motion in one and two dimensions - position, velocity, acceleration, projectile motion',
      estimatedHours: 10,
    });

    // Physics - Fluids
    registerModule('physics-fluids-ap', async () => {
      const { module } = await import('./physics/fluids');
      return module;
    });

    registerModuleMetadata({
      id: 'physics-fluids-ap',
      subject: 'physics',
      topic: 'fluids',
      level: 'AP',
      displayName: 'AP Physics: Fluid Mechanics',
      description: 'Fluid statics and dynamics - density, pressure, buoyancy, flow rate, and Bernoulli\'s principle',
      estimatedHours: 8,
    });

    // Add more modules as they are created...
  } catch (error) {
    // Modules may not exist yet during development
    console.log('Some modules not yet available:', error);
  }
}
