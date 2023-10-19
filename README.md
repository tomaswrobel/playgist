# PlayGist - GitHub Gist Code Fiddle

PlayGist is a web-based code fiddle tool that allows you to open, modify, and run GitHub Gists effortlessly. Whether you want to experiment with code snippets, collaborate on projects, or simply run and test code from GitHub Gists, PlayGist makes it simple and efficient.

## Client × Server

This happens on the client:

* Code transpilation
* Code execution

This happens on the server:

* NPM Packages transpilation ([esm.sh](https://esm.sh))
* GitHub integration ([playgist.dev](https://playgist.dev))
* Storage ([gist.github.com](https://gist.github.com))

## Supported languages

| Name       | Extensions    |
| ---------- | ------------- |
| JavaScript | `.js`, `.jsx` |
| TypeScript | `.ts`, `.tsx` |
| CSS        | `.css`        |

## Supported patterns

* ECMAScript imports:
    * NPM modules
    * Local files
* Dynamic 

## Unsupported patterns

* Folders
* CommonJS
* HTML files
* Images, fonts, etc.
* CSS modules
* CSS relative imports
* CSS preprocessors

## Getting Started

1. Visit the PlayGist website at [playgist.dev](https://playgist.dev).
2. If you want to access your own Gists, log in using your GitHub account. This can be done via `Save as a Gist` link.
3. To open a Gist, simply type the URL in the format `playgist.dev/GIST_ID`.
4. Edit the code as needed and run it to see the results.
5. Share your modified Gist with others by copying the unique URL provided.

## Technologies Used

PlayGist is built using the following technologies:

- Next.js for the web application framework.
- GitHub API for Gist retrieval and management.
- Prism for the code editor component.
- OAuth for GitHub integration.

## Feedback and Contributions

I welcome feedback, suggestions, and contributions to make PlayGist even better. If you have any ideas or encounter issues, please open an issue on the [PlayGist GitHub Repository](https://github.com/tomas-wrobel/playgist).

## License

PlayGist is open-source software, released under the MIT License. You are free to use, modify, and distribute it as per the terms of the license.
