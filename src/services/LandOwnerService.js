import axios from "axios";

const REST_API_BASE_URL = "https://landadministration-production.up.railway.app/land-owner/owners"

export const listLands = () =>{
    return axios.get(REST_API_BASE_URL);
}