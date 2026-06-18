export const API_URL = "https://shopez-mern.onrender.com";
import { API_URL } from '../config';

const { data } = await axios.post(
  `${API_URL}/api/users/login`,
  { email, password }
);
