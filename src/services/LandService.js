import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/land/records/id"

export const listLands = () =>{
    return axios.get(REST_API_BASE_URL);
}