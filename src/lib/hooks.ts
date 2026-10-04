"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  API_BASE_URL,
  ApiError,
  createSearch,
  fetchSearch,
  fetchMaterial,
  compareMaterials,
  fetchReport,
  generateReport,
} from "./api";
import {
  SearchRequest,
  SearchDetailResponse,
  MaterialDetailResponse,
  CompareRequest,
  CompareResponse,
  ReportResponse,
  SearchEventData,
} from "@/types";

/**
 * TanStack Query Hook: GET /api/search/{id}
 */
export function useSearchQuery(id: string | undefined, enabled = true) {
  return useQuery<SearchDetailResponse, ApiError>({
    queryKey: ["search", id],
    queryFn: () => {
      if (!id) throw new Error("Search ID is required");
      return fetchSearch(id);
    },
    enabled: Boolean(id && enabled),
    staleTime: 10 * 1000,
    retry: (failureCount, error) => {
      if (error?.status === 404) return false;
      return failureCount < 2;
    },
  });
}

/**
 * TanStack Query Hook: GET /api/material/{id}
 */
export function useMaterialQuery(materialId: string | undefined) {
  return useQuery<MaterialDetailResponse, ApiError>({
    queryKey: ["material", materialId],
    queryFn: () => {
      if (!materialId) throw new Error("Material ID is required");
      return fetchMaterial(materialId);
    },
    enabled: Boolean(materialId),
    staleTime: 60 * 1000,
    retry: (failureCount, error) => {
      if (error?.status === 404) return false;
      return failureCount < 2;
    },
  });
}

/**
 * TanStack Query Hook: GET /api/reports/{id}
 */
export function useReportQuery(searchId: string | undefined, enabled = true) {
  return useQuery<ReportResponse, ApiError>({
    queryKey: ["report", searchId],
    queryFn: () => {
      if (!searchId) throw new Error("Search ID is required");
      return fetchReport(searchId);
    },
    enabled: Boolean(searchId && enabled),
    staleTime: 30 * 1000,
    retry: (failureCount, error) => {
      if (error?.status === 404) return false;
      return failureCount < 2;
    },
  });
}

/**
 * TanStack Mutation Hook: POST /api/search/
 */
export function useCreateSearchMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SearchRequest) => createSearch(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["search", data.search_id] });
    },
  });
}

/**
 * TanStack Mutation Hook: POST /api/compare/
 */
export function useCompareMaterialsMutation() {
  return useMutation<CompareResponse, ApiError, CompareRequest>({
    mutationFn: (payload: CompareRequest) => compareMaterials(payload),
  });
}

/**
 * TanStack Mutation Hook: POST /api/reports/{id}/generate
 */
export function useGenerateReportMutation() {
  const queryClient = useQueryClient();

  return useMutation<ReportResponse, ApiError, string>({
    mutationFn: (searchId: string) => generateReport(searchId),
    onSuccess: (data, searchId) => {
      queryClient.setQueryData(["report", searchId], data);
      queryClient.invalidateQueries({ queryKey: ["report", searchId] });
      queryClient.invalidateQueries({ queryKey: ["search", searchId] });
    },
  });
}

/**
 * Native EventSource Hook: /api/search/{id}/events
 *
 * Requirements:
 * - Connects using native EventSource on /api/search/{id}/events
 * - Reconnects on disconnect
 * - Refetches GET /api/search/{id}
 * - Stops when status is completed or failed
 */
export function useSearchEvents(
  searchId: string | undefined,
  currentStatus?: string
) {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTerminatedRef = useRef<boolean>(false);

  const isTerminalStatus =
    currentStatus === "completed" || currentStatus === "failed";

  const closeStream = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const refetchSearchData = useCallback(() => {
    if (searchId) {
      queryClient.invalidateQueries({ queryKey: ["search", searchId] });
    }
  }, [queryClient, searchId]);

  useEffect(() => {
    if (!searchId || isTerminalStatus) {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      return;
    }

    isTerminatedRef.current = false;
    let isMounted = true;

    function connect() {
      if (isTerminatedRef.current || !isMounted || !searchId) return;

      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }

      const eventsUrl = `${API_BASE_URL.replace(/\/$/, "")}/api/search/${encodeURIComponent(searchId)}/events`;

      try {
        const es = new EventSource(eventsUrl);
        eventSourceRef.current = es;

        es.onopen = () => {
          if (!isMounted) return;
          setIsConnected(true);
          setStreamError(null);
        };

        es.onmessage = (event) => {
          if (!isMounted) return;

          try {
            const parsed = JSON.parse(event.data) as SearchEventData;
            const newStatus = parsed.state?.status || (parsed as unknown as { status?: string }).status;

            if (parsed.state) {
              queryClient.setQueryData<SearchDetailResponse>(
                ["search", searchId],
                (old) => {
                  if (!old) {
                    return {
                      id: searchId,
                      query: parsed.query || "",
                      status: newStatus || "running",
                      state: parsed.state,
                    };
                  }
                  return {
                    ...old,
                    status: newStatus || old.status,
                    state: {
                      ...old.state,
                      ...parsed.state,
                    },
                  };
                }
              );
            }

            if (newStatus === "completed" || newStatus === "failed") {
              isTerminatedRef.current = true;
              if (es) es.close();
              eventSourceRef.current = null;
              setIsConnected(false);
              refetchSearchData();
            }
          } catch (e) {
            console.warn("Error parsing search event data:", e);
          }
        };

        es.onerror = () => {
          if (!isMounted) return;
          setIsConnected(false);

          refetchSearchData();

          if (isTerminatedRef.current) {
            if (es) es.close();
            eventSourceRef.current = null;
            return;
          }

          setStreamError("SSE disconnected; attempting reconnection...");
          if (es) es.close();
          eventSourceRef.current = null;

          reconnectTimeoutRef.current = setTimeout(() => {
            if (isMounted && !isTerminatedRef.current) {
              connect();
            }
          }, 3000);
        };
      } catch {
        setStreamError("Failed to initialize EventSource");
        reconnectTimeoutRef.current = setTimeout(() => {
          if (isMounted && !isTerminatedRef.current) {
            connect();
          }
        }, 3000);
      }
    }

    connect();

    return () => {
      isMounted = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [searchId, isTerminalStatus, refetchSearchData, queryClient]);

  return {
    isConnected,
    streamError,
    close: closeStream,
  };
}
