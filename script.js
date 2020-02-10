let btn = document.querySelector(".btn");
let inp = document.querySelector("#name");
let displayInfoArea = document.querySelector(".display-info-area");

async function getUserAsync(name) {
    let response = await fetch(`https://api.github.com/users/${name}`);
    let data = await response.json();
    return data;
}

async function getUserRepros(name) {
    let response = await fetch(`https://api.github.com/users/${name}/repos`);
    let data = await response.json();
    return data;
}

function clearResults() {
    while (displayInfoArea.hasChildNodes()) {
        displayInfoArea.removeChild(displayInfoArea.firstChild);
    }
}

function createResults(title, text, hr, link, errorMessage) {
    if (link !== true) {
        if (errorMessage) {
            let p = document.createElement("P");
            let strong = document.createElement("strong");

            let textNode = document.createTextNode(title);
            let strongText = document.createTextNode(text);

            p.appendChild(textNode);
            strong.appendChild(strongText);
            p.appendChild(strong);
            p.classList.add("error");
            displayInfoArea.appendChild(p);

        } else {
            let p = document.createElement("P");
            let textNode = document.createTextNode(title + text);
            p.appendChild(textNode);
            displayInfoArea.appendChild(p);

        }
    }
    if (link === true) {
        let p = document.createElement("P");
        let a = document.createElement("a");
        let pTitle = document.createTextNode(title);
        let aTitle = document.createTextNode(text);
        a.href = text;
        a.target = "_blank";
        a.appendChild(aTitle);
        p.appendChild(pTitle);
        p.appendChild(a);
        displayInfoArea.appendChild(p);
    }

    if (hr === true) {
        let hr = document.createElement("hr")
        displayInfoArea.appendChild(hr);
    }
}

// Function that checks if a string has spaces
function isSpace(str) {
    return str.match(/\s/) !== null;
}

function apiGet() {
    clearResults();
    let value = inp.value;
    if (value != "" && !isSpace(value)) {
        getUserAsync(value).then(function(result) {

            if (result.message !== "Not Found") {
                if (result.name !== null) {
                    createResults("Name: ", result.name);
                } else {
                    createResults("Name: ", "-");
                }
                createResults("Username: ", result.login);
                createResults("Account Type: ", result.type);
                createResults("Public Repos: ", result.public_repos, true);

                if (result.public_repos > 0) {
                    getUserRepros(value).then(function(repo) {
                        // console.log(repo);
                        for (let i = 0; i < repo.length; i++) {
                            const e = repo[i];
                            let j = i + 1;
                            createResults("#" + j + " Repo name: ", e.name);
                            if (e.description !== null) {
                                createResults("Description: ", e.description);
                            } else {
                                createResults("Description: ", "-");
                            }
                            if (e.language !== null) {
                                createResults("Language: ", e.language);
                            } else {
                                createResults("Language: ", "-");
                            }

                            createResults("Link: ", e.html_url, true, true);

                        }
                    });
                }
            } else {
                createResults("No user account found for: ", value, false, false, true);
            }
        });

    } else {
        createResults("Please make sure there are no spaces within the username. Invalid username: ", value, false, false, true)
    }
}



btn.addEventListener("click", apiGet);
inp.addEventListener("keyup", event => {
    if (event.keyCode === 13) {
        apiGet();
    }
});