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

export const getGithubRepos = async (page: number = 1, perPage: number = 5) => {
    const response = await axios.get(`${REPO_BACKEND_URL}/github/repos`, {
        params: {
            page,
            perPage,
        },
        withCredentials: true,
    });
    return response.data;
}
