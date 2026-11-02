function createView() {
    let postsContainer;
    let loaderEl;
    let endMessageEl;
    let errorMessageEl;
    let emptyMessageEl;
    let searchInput;

    function initView() {
        postsContainer = document.getElementById('posts');
        loaderEl = document.getElementById('loader');
        endMessageEl = document.getElementById('end-message');
        errorMessageEl = document.getElementById('error-message');
        emptyMessageEl = document.getElementById('empty-message');
        searchInput = document.getElementById('search');
    }

    function showLoader() {
        loaderEl.classList.remove('hidden');
    }

    function hideLoader() {
        loaderEl.classList.add('hidden');
    }

    function showError(message) {
        errorMessageEl.textContent = 'Ошибка: ' + message;
        errorMessageEl.classList.remove('hidden');
    }

    function hideError() {
        errorMessageEl.classList.add('hidden');
    }

    function setEndMessageVisible(visible) {
        endMessageEl.classList.toggle('hidden', !visible);
    }

    function setEmptyMessageVisible(visible) {
        emptyMessageEl.classList.toggle('hidden', !visible);
    }

    function createPostCard(post) {
        const card = document.createElement('article');
        card.className = 'post-card';

        const title = document.createElement('h2');
        title.className = 'post-title';
        title.textContent = post.title;

        const body = document.createElement('p');
        body.className = 'post-body';
        body.textContent = post.body;

        const meta = document.createElement('div');
        meta.className = 'post-meta';
        meta.textContent = `ID: ${post.id} · Автор (userId): ${post.userId}`;

        card.append(title, body, meta);
        return card;
    }

    function renderPosts(posts) {
        postsContainer.innerHTML = '';
        const fragment = document.createDocumentFragment();
        for (const post of posts) {
            fragment.appendChild(createPostCard(post));
        }
        postsContainer.appendChild(fragment);
    }

    function bindSearchInput(handler) {
        searchInput.addEventListener('input', handler);
    }

    function bindScroll(handler) {
        window.addEventListener('scroll', handler, { passive: true });
    }

    function getDistanceToBottom() {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        return scrollHeight - (scrollTop + clientHeight);
    }

    return {
        initView, showLoader, hideLoader, showError, hideError, setEndMessageVisible, setEmptyMessageVisible, renderPosts, bindSearchInput, bindScroll, getDistanceToBottom
    };
}