import axios from 'axios';

(async () => {

    const displayPosts = (init, offset) => {
        const posts = JSON.parse($('#mfdg-post-list').data('posts'));
        const slicedPosts = posts.slice(init, offset);
        let blocks = [];

        slicedPosts.forEach(function (post) {
            const html = `
                    <a class="mfdg-post-link" href="${post.link}">
                        <span class="mfdg-post__client">${post.client}: </span>
                        <span class="mfdg-post__title">${post.title}.</span>
                    </a>`;

            blocks.push(html.trim());
        });

        $('#mfdg-pl-wrapper').append(blocks.join(''));
    };

    let receivedPostsNum = 0;
    let posts = [];

    try {
        const apiTags = await axios.get('https://dseis.com/wp-json/wp/v2/tags?per_page=90&page=1');

        for (let page = 1; page < 10; page++) {
            const apiPosts = await axios.get(`https://dseis.com/wp-json/wp/v2/posts?status=publish&per_page=50&page=${page}&categories=74&orderby=date&order=desc`);

            receivedPostsNum += apiPosts.data.length;

            for (const apiPost of apiPosts.data) {
                const tag = apiTags.data.filter(item => {
                    return item.id === apiPost.tags[0];
                });

                posts.push({
                    link: apiPost.link,
                    client: tag[0].name,
                    title: apiPost.title.rendered
                });
            }

            if (receivedPostsNum === Number(apiPosts.headers['x-wp-total'])) break;
        }
    } catch (error) {
        console.error(error);
    } finally {
        $('#mfdg-post-list').append('<div id="mfdg-pl-wrapper"></div>');
        $('#mfdg-post-list').data('posts', JSON.stringify(posts));

        displayPosts(0, 1);
    }
})();
