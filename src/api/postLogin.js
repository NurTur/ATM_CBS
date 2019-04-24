import axios from "axios";

export default async (card_number) => {
    const result = await axios.get(`http://localhost:8181/cards/${card_number}`);
    return result.data;
};
