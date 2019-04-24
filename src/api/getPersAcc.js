import axios from "axios";

export default async (obj) => {
    const result = await axios.get(`http://localhost:8181/${obj.city}_communals/${obj.schet}`);
    return result.data;
};