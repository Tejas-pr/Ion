'use client';

import React, { useEffect, useState } from "react";
import { Sidebar } from "../workspace/sidebar";
import { MainContent } from "./main-content";
import { getGithubRepos, getCachedGithubRepos, addNewProject } from "@/api/api.service";
import { useRouter } from "next/navigation";

export function WorkspaceGithub() {
  const router = useRouter();
  const [repositories, setRepositories] = useState<any[]>(() => {
    return getCachedGithubRepos(1, 20)?.repos || [];
  });
  const [isLoading, setIsLoading] = useState(() => {
    return !getCachedGithubRepos(1, 20);
  });
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(() => {
    return getCachedGithubRepos(1, 20)?.pagination?.hasNextPage ?? true;
  });

  const fetchRepos = async (pageNumber: number) => {
    try {
      if (pageNumber === 1) {
        // Only show spinner on first mount if cache is empty
        if (!getCachedGithubRepos(1, 20)) {
          setIsLoading(true);
        }
      } else {
        setIsFetchingMore(true);
      }

      const response = await getGithubRepos(pageNumber, 20);
      const repos = response.repos ?? [];
      const pagination = response.pagination ?? {};

      setRepositories(prev => {
        const combined = pageNumber === 1 ? repos : [...prev, ...repos];
        // Deduplicate by ID in case of overlapping pages
        return Array.from(new Map(combined.map((repo: any) => [repo.id, repo])).values());
      });

      // Use the server-side Link header result for reliable pagination
      setHasMore(pagination.hasNextPage ?? false);
    } catch (error) {
      console.error("Failed to fetch GitHub repos:", error);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };


  useEffect(() => {
    fetchRepos(1);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchRepos(nextPage);
  };

  const handleImport = async (repo: any) => {
    try {
      const response = await addNewProject(repo.name, repo.url);
      if (response && response.project) {
        router.push(`/workspace/project/${response.project.projectId}`);
      }
    } catch (error) {
      console.error("Failed to import repository:", error);
      alert("Failed to import repository. Please try again.");
    }
  };

  return (
    <div className="flex flex-1 w-full bg-background overflow-hidden">
      <Sidebar />
      <MainContent
        repositories={repositories}
        isLoading={isLoading}
        isFetchingMore={isFetchingMore}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        onImport={handleImport}
      />
    </div>
  );
}