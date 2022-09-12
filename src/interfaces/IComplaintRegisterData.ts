import { NumberExpression } from "mongoose";

interface IComplaintRegisterData {
  category: string;
  title: string;
  description?: string;
  countComplaints: number;
  image: string;
  creationDate?: Date;
  location?: [Number, Number];
}

export default IComplaintRegisterData;
