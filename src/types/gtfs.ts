export interface GTFSFile {
  id: string;
  name: string;
  type: string;
  lastModified: string;
  size: string;
}

export interface GTFSValidationResult {
  isValid: boolean;
  errors: string[];
} 