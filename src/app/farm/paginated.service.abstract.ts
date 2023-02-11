import type { Observable } from 'rxjs';

export abstract class PaginatedService {
  /**
   * Watch multiple entities with pagination.
   * Hot until end of pagination.
   */
  abstract watchAll(...args: any[]): Observable<any[]>;

  /**
   * Triggers next page loading. Use when page end comes into view.
   */
  abstract triggerNextPage(): void;

  /**
   * Use to refresh pagination.
   * Resets pagination to page 1.
   */
  abstract clearPaginationCache(): void;

  /**
   * Resets Pagination with optional search parameters.
   */
  abstract setSearch?(...args: any[]): void;
}
