function createModel() {
    const CONFIG = {
        API_URL: 'https://jsonplaceholder.typicode.com/posts',
        PAGE_SIZE: 10,
        TOTAL_POSTS: 100,
        DEBOUNCE_DELAY: 300,
        SCROLL_THRESHOLD: 200
    };

    const state = {
        allPosts: [],
        nextStart: 1,      
        isLoading: false,
        hasMore: true,
        searchQuery: ''
    };

    function resetState() {
        state.allPosts = [];
        state.nextStart = 1;
        state.isLoading = false;
        state.hasMore = true;
        state.searchQuery = '';
    }

    async function loadNextPortion() {
        if (state.isLoading || !state.hasMore) {
            return { status: 'skipped' };
        }

        state.isLoading = true;

        try {
            const end = state.nextStart + CONFIG.PAGE_SIZE - 1;
            const effectiveEnd = Math.min(end, CONFIG.TOTAL_POSTS);
            const limit = effectiveEnd - state.nextStart + 1;
            const url = `${CONFIG.API_URL}?_start=${state.nextStart - 1}&_limit=${limit}`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`сервер вернул статус ${response.status}`);
            }

            const posts = await response.json();

            if (!Array.isArray(posts)) {
                throw new Error('некорректный формат ответа сервера');
            }

            if (posts.length === 0) {
                state.hasMore = false;
                return { status: 'empty' };
            }

            state.allPosts.push(...posts);
            state.nextStart += posts.length;

            if (state.nextStart > CONFIG.TOTAL_POSTS) {
                state.hasMore = false;
            }

            return { status: 'ok', added: posts.length };
        } catch (error) {
            const message = error instanceof TypeError ? 'Проверьте соединение с интернетом.' : error.message;
            return { status: 'error', error: message };
        } finally {
            state.isLoading = false;
        }
    }

    function setSearchQuery(query) {
        state.searchQuery = query;
    }

    function getSearchQuery() {
        return state.searchQuery;
    }

    function getFilteredPosts() {
        const query = state.searchQuery.toLowerCase();
        if (query === '') return state.allPosts;
        return state.allPosts.filter((post) =>
            post.title.toLowerCase().includes(query)
        );
    }

    function shouldShowEndMessage() {
        return !state.hasMore && state.searchQuery === '';
    }

    function shouldShowEmptyMessage(filteredCount) {
        return (
            state.searchQuery !== '' &&
            filteredCount === 0 &&
            state.allPosts.length > 0
        );
    }

    return {
        CONFIG, resetState, loadNextPortion, setSearchQuery, getSearchQuery, getFilteredPosts, shouldShowEndMessage, shouldShowEmptyMessage
    };
}