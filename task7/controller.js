function createController(model, view) {
    let searchDebounceTimer = null;

    function initGame() {
        view.initView();
        model.resetState();
        bindEvents();
        loadNextPortion(); 
    }

    function bindEvents() {
        view.bindScroll(() => handleScroll());
        view.bindSearchInput((event) => handleSearchInput(event));
    }

    async function loadNextPortion() {
        view.showLoader();
        view.hideError();

        const result = await model.loadNextPortion();

        view.hideLoader();

        if (result.status === 'error') {
            view.showError(result.error);
            return;
        }
        if (result.status === 'skipped') {
            return;
        }

        renderFilteredPosts();
    }

    function renderFilteredPosts() {
        view.renderPosts(model.getFilteredPosts());
        view.setEndMessageVisible(model.shouldShowEndMessage());
        view.setEmptyMessageVisible(
            model.shouldShowEmptyMessage(model.getFilteredPosts().length)
        );
    }

    function handleScroll() {
        if (model.getSearchQuery() !== '') return;
        const distance = view.getDistanceToBottom();
        if (distance <= model.CONFIG.SCROLL_THRESHOLD) {
            loadNextPortion();
        }
    }

    function handleSearchInput(event) {
        const value = event.target.value;

        if (searchDebounceTimer !== null) {
            clearTimeout(searchDebounceTimer);
        }

        searchDebounceTimer = setTimeout(() => {
            model.setSearchQuery(value.trim());
            renderFiltered();
        }, model.CONFIG.DEBOUNCE_DELAY);
    }

    return { initGame };
}