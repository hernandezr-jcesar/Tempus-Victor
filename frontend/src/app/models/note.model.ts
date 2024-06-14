export interface Note {
  idNote: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  archived: Boolean;
  description?: string;
}
