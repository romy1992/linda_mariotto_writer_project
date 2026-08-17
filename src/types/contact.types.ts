export interface ContactRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  projectType: string;
  message: string;
  privacyAccepted: boolean;
  createdAt: number;
}
