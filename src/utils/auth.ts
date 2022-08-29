import "../loadEnvironments";
import bcrypt from "bcryptjs";

const hashCreator = (text: string) => bcrypt.hash(text, 10);

export default hashCreator;
