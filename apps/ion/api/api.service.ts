import { REPO_BACKEND_URL } from "@/config";
import axios from "axios";

export const addNewProject = async (name: string, link: string) => {
    const response = await axios.post(
        `${REPO_BACKEND_URL}/deploy`,
        {
            name,
            url: link, // Backend expects 'url' instead of 'link'
        },
        {
            withCredentials: true,
        }
    );

    return response.data;
};