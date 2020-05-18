import axios from 'axios';
import $ from 'jquery';

$('#mfdg-post-list').append('<div id="mfdg-posts"></div>');
$('#mfdg-post-list').append('<div class="mfdg-buttons"><a id="mfdg-button-show-more" href="#">mostrar más</a></div>');

$('#mfdg-pl-wrapper').on('click', '#mfdg-button-show-more', e => {
    e.preventDefault();

    const params = getParams();

    displayPosts(params);
});

const getParams = () => {
    return {
        init: Number($('#mfdg-post-list').data('post')),
        offset: Number($('#mfdg-post-list').data('per-page')),
        total: Number($('#mfdg-post-list').data('total'))
    };
}

const displayPosts = (parameters) => {
    const posts = JSON.parse($('#mfdg-post-list').data('posts'));
    const end = parameters.init + parameters.offset;
    const slicedPosts = posts.slice(parameters.init, end);
    let blocks = [];

    slicedPosts.forEach(function (post) {
        const html = `
                    <a class="mfdg-post-link" href="${post.link}">
                        <span class="mfdg-post__client">${post.client}: </span>
                        <span class="mfdg-post__title">${post.title}.</span>
                    </a>`;

        blocks.push(html.trim());
    });

    $('#mfdg-posts').append(blocks.join(''));
    $('#mfdg-post-list').data('post', end);

    if (end === parameters.total) {
        $('#mfdg-button-show-more').hide();
    }
};

const getPosts = async () => {
    const params = getParams();
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

            if (receivedPostsNum === Number(apiPosts.headers['x-wp-total'])) {
                $('#mfdg-post-list').data('total', receivedPostsNum);

                break;
            }
        }
    } catch (error) {
        console.error(error);
    } finally {
        $('#mfdg-post-list').data('posts', JSON.stringify(posts));

        displayPosts(params);
    }
};

getPosts();
