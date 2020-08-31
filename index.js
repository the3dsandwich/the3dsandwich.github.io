const converter = new showdown.Converter();
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const articleName = urlParams.get("articlename");

function fetchAndDisplay(filename) {
  fetch(
    `https://raw.githubusercontent.com/the3dsandwich/the3dsandwich.github.io/master/articles/${filename}`
  ).then(replaceFetchResult);
}

function fetch404() {
  fetch(
    `https://raw.githubusercontent.com/the3dsandwich/the3dsandwich.github.io/master/contents/404.md`
  ).then(replaceFetchResult);
}

function fetchDefault() {
  fetch(
    "https://raw.githubusercontent.com/the3dsandwich/the3dsandwich/master/README.md"
  ).then(replaceFetchResult);
}

function replaceFetchResult(res) {
  if (res.ok) {
    res.text().then((text) => {
      const html = converter.makeHtml(text);
      document.getElementById("content").innerHTML = html;
    });
  } else {
    fetch404();
  }
}

// fetch content
if (articleName !== null && articleName.length > 0) {
  fetchAndDisplay(`${articleName}.md`);
} else {
  fetchDefault();
}

// fetch article list
fetch(
  "https://api.github.com/repos/the3dsandwich/the3dsandwich.github.io/git/trees/master?recursive=1"
).then((res) => {
  res.json().then(({ tree }) => {
    const postList = tree.filter(({ path }) =>
      path.match("articles/[0-9a-zA-z]*.md")
    );
    for (const post of postList) {
      const postNode = document.createElement("li");
      const postTitle = post.path.replace("articles/", "").replace(".md", "");
      const postLink = document.createElement("a");
      postLink.setAttribute("href", `?articlename=${postTitle}`);
      postLink.innerHTML = postTitle;
      postNode.appendChild(postLink);
      document.getElementById("posts").appendChild(postNode);
    }
  });
});
