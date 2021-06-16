import { SandboxItem } from './sandbox-item.model';
import { SandboxOptions } from './sandbox-options.model';

export type Sandbox = {
  error?: Error;
  options: SandboxOptions;
  items: readonly SandboxItem[];
};
