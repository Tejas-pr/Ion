import { REPO_BACKEND_URL, REQUEST_BACKEND_URL } from "@/config";
import axios from "axios";

// In-memory cache to prevent redundant fetches on tab switching
let cachedWorkspaceDetails: any = null;
const cachedGithubRepos: { [key: string]: any } = {};

export const getCachedWorkspaceDetails = () => {
    return cachedWorkspaceDetails || null;
};

export const getCachedGithubRepos = (page: number = 1, perPage: number = 20) => {
    return cachedGithubRepos[`${page}-${perPage}`] || null;
};


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

    // Invalidate workspace cache on new project creation
    cachedWorkspaceDetails = null;

    return response.data;
};

export const getWorkspaceDetails = async (bypassCache = false) => {
    if (cachedWorkspaceDetails && !bypassCache) {
        return cachedWorkspaceDetails;
    }
    const response = await axios.get(`${REQUEST_BACKEND_URL}/workspace`, {
        withCredentials: true,
    });
    cachedWorkspaceDetails = response.data;
    return response.data;
};

export const getProjectDetails = async (id: string) => {
    const response = await axios.get(`${REQUEST_BACKEND_URL}/project/${id}`, {
        withCredentials: true,
    });
    return response.data;
};

export const getGithubRepos = async (page: number = 1, perPage: number = 20, bypassCache = false) => {
    const cacheKey = `${page}-${perPage}`;
    if (cachedGithubRepos[cacheKey] && !bypassCache) {
        return cachedGithubRepos[cacheKey];
    }
    const response = await axios.get(`${REPO_BACKEND_URL}/github/repos`, {
        params: {
            page,
            perPage,
        },
        withCredentials: true,
    });
    cachedGithubRepos[cacheKey] = response.data;
    return response.data;
};

