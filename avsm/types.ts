export interface VisitorProfile {
  name: string;
  age: string; // Changed from number to string to accommodate age ranges (e.g., "30-35")
  gender: string;
  profession: string;
}

export interface LoggedVisitor {
  id: string;
  timestamp: string; // Represents check-in time
  checkOutTime: string | null;
  status: 'Checked-in' | 'Checked-out';
  photo: string; // The base64 preview URL
  rawProfile: VisitorProfile; // The original data from the AI
  enhancedProfile: VisitorProfile; // The data after user edits
}
