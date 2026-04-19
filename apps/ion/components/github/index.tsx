'use client';

import React, { useEffect, useState } from "react";
import { Sidebar } from "../workspace/sidebar";
import { MainContent } from "./main-content";
import { getGithubRepos, addNewProject } from "@/api/api.service";
import { useRouter } from "next/navigation";

export function WorkspaceGithub() {
  const router = useRouter();
  const [repositories, setRepositories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchRepos = async (pageNumber: number) => {
    try {
      if (pageNumber === 1) setIsLoading(true);
      else setIsFetchingMore(true);

      const response = await getGithubRepos(pageNumber, 20);
      
      const mappedRepos = response.repos.map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        private: repo.private,
        stars: repo.stars,
        language: repo.language,
        updatedAt: repo.updatedAt,
        url: repo.url,
      }));

      setRepositories(prev => {
        const combined = pageNumber === 1 ? mappedRepos : [...prev, ...mappedRepos];
        // Ensure uniqueness by repository ID
        return Array.from(new Map(combined.map((repo: any) => [repo.id, repo ] ) ).values());
      });


      // Use pagination info from backend if available, otherwise fallback to length check
      setHasMore(response.pagination ? response.pagination.hasNextPage : mappedRepos.length === 20);
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
    <div className="flex h-screen w-full bg-background">
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