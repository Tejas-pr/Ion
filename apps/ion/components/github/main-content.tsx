"use client";

import { useState, useMemo } from "react";
import { Search, Lock, Globe, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Repository {
  id: number;
  name: string;
  description?: string;
  private: boolean;
  stars?: number;
  language?: string;
  updatedAt?: string;
  url?: string;
}

interface MainContentProps {
  repositories?: Repository[];
  onImport?: (repo: Repository) => void;
  isLoading?: boolean;
  isFetchingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export function MainContent({
  repositories = [],
  onImport,
  isLoading = false,
  isFetchingMore = false,
  hasMore = false,
  onLoadMore,
}: MainContentProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRepos = useMemo(() => {
    if (!searchQuery.trim()) return repositories;

    return repositories.filter(
      (repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.description?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [repositories, searchQuery]);

  const handleImport = (repo: Repository) => {
    if (onImport) {
      onImport(repo);
    } else {
      console.log("Importing repository:", repo.name);
      if (repo.url) window.open(repo.url, "_blank");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background text-foreground w-full">
      {/* Header Section */}
      <div className="border-b border-border p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold mb-1">Import Git Repository</h1>
          <p className="text-muted-foreground text-sm">
            Select a repository to import into your project
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50 border-border text-foreground placeholder:text-muted-foreground h-9 focus:border-ring focus:bg-background"
              />
            </div>
          </div>

          {/* Repositories List */}
          <div className="space-y-0 border border-border rounded-lg overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <span className="ml-3 text-neutral-400 text-sm">
                  Loading repositories...
                </span>
              </div>
            ) : filteredRepos.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-neutral-400">
                  {searchQuery
                    ? "No repositories found matching your search"
                    : "No repositories found"}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-3 text-neutral-400 hover:text-white text-sm transition-colors"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="divide-y divide-border">
                  {filteredRepos.map((repo) => (
                    <div
                      key={repo.id}
                      className="flex items-center justify-between gap-4 p-4 hover:bg-muted/50 transition-colors"
                    >
                      {/* Left Content */}
                      <div className="flex-1 min-w-0 flex items-start gap-3">
                        {/* Icon */}
                        <div className="flex-shrink-0 mt-1">
                          {repo.private ? (
                            <Lock className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <Globe className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-medium text-foreground truncate">
                              {repo.name}
                            </h3>
                            {repo.private && (
                              <span className="text-xs text-muted-foreground flex-shrink-0">
                                Private
                              </span>
                            )}
                          </div>

                          {repo.description && (
                            <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                              {repo.description}
                            </p>
                          )}

                          {/* Meta */}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            {repo.language && (
                              <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50"></span>
                                {repo.language}
                              </span>
                            )}
                            {repo.stars !== undefined && repo.stars > 0 && (
                              <span>⭐ {repo.stars.toLocaleString()}</span>
                            )}
                            {repo.updatedAt && (
                              <span>
                                {new Date(repo.updatedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Import Button */}
                      <Button
                        onClick={() => handleImport(repo)}
                        className="flex-shrink-0 h-8 px-4 text-sm"
                        variant="outline"
                      >
                        Import
                      </Button>
                    </div>
                  ))}
                </div>

                {hasMore && (
                  <div className="p-4 border-t border-border text-center">
                    <Button
                      onClick={onLoadMore}
                      disabled={isFetchingMore}
                      variant="ghost"
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {isFetchingMore ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                          <span>Loading...</span>
                        </div>
                      ) : (
                        "Load More"
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer Info */}
          {!isLoading && filteredRepos.length > 0 && (
            <p className="text-xs text-muted-foreground mt-4">
              Showing {filteredRepos.length} repositories
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
