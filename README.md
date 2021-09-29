# Treasure Hacks Frontend Website

The frontend website for the Treasure Hacks Hackathon

---

## Running the code Locally

Requirements:
- Have NodeJS installed
- Have node package manager (npm) installed

1. Clone the repo
2. Open your editor to the root
3. Open the command line (terminal or command prompt).
4. Run `npm run build` to initialize local environment variables.
   - The newly created `.ENV` file is different for every deploy location (.dev, .org, etc.) and is NOT committed to the repository. More on the .ENV file later.
5. To run the code on a local server, simply type `npm run serve` to see the static site.

## Making Changes in Development

In order to change the content of the site, you will need to change the code inside of the `views` and `partials` folders.

- The `partials` folder stores any reusable code, such as the website header and footer.
- The `views` folder stores all static and templated (dynamic) files.

<ins><b>IMPORTANT!</b></ins> The `/docs` folder is ***completely auto-generated***, and any changes made to that directory **WILL BE LOST** when the site is compiled.

- To make changes to the static files on the site, simply treat `/views` as the root. You can change the contents of any file, add new files, or delete files within the `/views` directory.
Those changes will be applied to the site automatically when you compile the code.
- Since you want your code to be compiled as soon as you make any change, let's run `npm run dev`. This will create a local server on `localhost:5700`, and every time you make a change, the files in the `/views` folder will be rebuilt. The resulting webpage will be live on `localhost:5700`.
- However, you may want to create templated files to reuse variables and HTML code for elements such as headers and footers.

## Creating Template files
- In order to convert an HTML file into a templated file, just add `.hbs` to the end of the filename. The same applies to JS, CSS, or really anything, though it should only really be used for HTML files.
- To restore formatting, set the file's language in your editor to the original language of the file.

### Adding Reusable Values
This is how to add variables that you can access from any HTML template file (NAME.html.hbs)
1. In the `.ENV` file, add the variable name and value in this format, on a new line: `BUILD_VARNAME=test` (each accessible variable must have `BUILD_` at the start of the key).
2. From the template file (NAME.html.hbs), add the HTML code `<div>{{VARNAME}}</div>`. This will result in `<div>test</div>` when the site is compiled.
- To render "partials" (reusable HTML code), create a partial inside of the `partials

### Reusing HTML Code
To reuse HTML code, we are using a feature called "partials" in the Handlebars library, and the term "partial" just refers to any HTML code that is reusable within the entire site.

- To modify an existing partial, simply change the HTML content inside of the `.hbs` file inside of the `/partials` folder.
- To add a new partial, simply create a new file inside the `/partials` folder. The name of the file is how you will refer to it in template files, and files inside folders are supported.
- Load any partial to embed its content into a template file (NAME.html.hbs). You can do this by adding `{{> NAME_OF_PARTIAL }}` to the code of the template file.

Examples:
- `/partials/info.hbs` will be referred to as `{{> info }}`
- `/partials/api/docs.hbs` will be referred to as `{{> api/docs }}`

## Pushing Changes Back to Remote
If you are running `npm run dev` already, chances are the compiled files are already in the `/docs` folder. However, let's do these steps for safety and to double-check that everything is correct.

1. Stop the local server with `ctrl + C` in the command line after you are done testing and checking the site on `localhost:5700`
2. Run `npm run build` one more time, and make sure there aren't any compile errors. If there are errors, they should be in red and contain the path to the file so you can easily identify which file is causing the problem.
3. Content should be auto-generated in the `/docs` folder. Give it a quick glance to make sure that the content of the files in the `/docs` folder files is correct.
4. If all is good, you should see your changes reflected in the `/views` folder (uncompiled) and `/docs` folder (compiled) in your Git client. Once confirmed, you can push your changes.

## Quick Overview
1. Download/clone/pull the code onto your local machine
2. `npm run build` if .ENV is not present for you
`npm run serve` if you just need to see the static site, but not make changes
3. `npm run dev` to watch and show changes on `localhost:5700`
4. Make changes
5. One more `npm run build` to make sure all of the files are compiled correctly. Maks sure there are no errors.
6. Commit changes and push.
