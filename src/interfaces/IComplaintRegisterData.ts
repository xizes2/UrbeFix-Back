interface IComplaintRegisterData {
  category: string;
  title: string;
  description: string;
  countComplaints: number;
  image: string;
  creationDate: Date;
  location?: string;
}

export default IComplaintRegisterData;
