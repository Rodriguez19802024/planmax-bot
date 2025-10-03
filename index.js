fetch(
    `https://api.search.brave.com/res/v1/web/search?${new URLSearchParams({
        q: "greek restaurants in san francisco",
        count: 10,
        country: "us",
        search_lang: "en",
    })}`,
    {
        headers: {
            "X-Subscription-Token": "<BRAVE_SEARCH_API_KEY>",
        },
    }
)
.then((response) => response.json())
.then((data) => console.log(data));
