export interface PaginatedResponse<T> {
	data: T
	pagination: {
		totalEntries: number
		totalPages: number
		currentPage: number
		limit: number
	}
}
