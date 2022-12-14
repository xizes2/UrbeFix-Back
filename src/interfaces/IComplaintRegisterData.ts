interface IComplaintRegisterData {
  category: string;
  title: string;
  description?: string;
  countComplaints: number;
  image: string;
  creationDate?: Date;
  location?: [number, number];
  address: string;
  owner: string;
}

export default IComplaintRegisterData;
