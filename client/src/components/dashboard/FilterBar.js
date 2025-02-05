function FilterBar({ onSearch, onSort, onFilterGenre, currentFilters }) {
  return (
    <div className="filter-bar">
      <input
        type="text"
        placeholder="Search movies..."
        onChange={(e) => onSearch(e.target.value)}
        value={currentFilters.search}  
        className="search-input"
      />
      
      <select 
        onChange={(e) => onSort(e.target.value)} 
        value={currentFilters.sortBy}  
        className="sort-select"
      >
        <option value="">Sort by</option>
        <option value="rating">Rating</option>
        <option value="year">Year</option>
        <option value="title">Title</option>
      </select>

      <select 
        onChange={(e) => onFilterGenre(e.target.value)}
        value={currentFilters.genre}  
        className="genre-select"
      >
        <option value="">All Genres</option>
        <option value="action">Action</option>
        <option value="comedy">Comedy</option>
        <option value="drama">Drama</option>
        <option value="horror">Horror</option>
        <option value="thriller">Thriller</option>
      </select>
    </div>
  )
}

export default FilterBar