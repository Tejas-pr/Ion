import { REPO_BACKEND_URL, REQUEST_BACKEND_URL } from "@/config";
import axios from "axios";

export const addNewProject = async (name: string, link: string) => {
    const response = await axios.post(
        `${REPO_BACKEND_URL}/deploy`,
        {
            name,
            url: link,
        },
        {
            withCredentials: true,
        }
    );

    return response.data;
};

export const getWorkspaceDetails = async () => {
    const response = await axios.get(`${REQUEST_BACKEND_URL}/workspace`, {
        withCredentials: true,
    });
    return response.data;
};

export const getProjectDetails = async (id: string) => {
    const response = await axios.get(`${REQUEST_BACKEND_URL}/project/${id}`, {
        withCredentials: true,
    });
    return response.data;
};
