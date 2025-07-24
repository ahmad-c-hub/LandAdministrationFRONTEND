import axios from "axios";

const REST_API_BASE_URL = "http://landadministration.railway.internal/land-owner/owners"

export const listLands = () =>{
    return axios.get(REST_API_BASE_URL);
}