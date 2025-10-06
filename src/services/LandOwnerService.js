import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/land-owner/owners"

export const listLands = () =>{
    return axios.get(REST_API_BASE_URL);
}