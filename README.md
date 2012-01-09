# Introducing ember-runner
This build tool is for the crazy ones that loves Node.JS and EmberJS, and for these one that loves simplicty too. In an clean and easy way you can run a preview of your application instantly in production mode or by previewing a development mode that you can debug your files more easily.

## Some of the features you will love are:
- **Preview Mode**: Run your application in preview mode so you can debug it.
- **Production Mode**: Run in production mode, so you can test performance, files sizes and so on.
- **Generator**: Will generate files for you with the ``-g`` flag. (Coming soon)
- **Auto-Deploy**: Generates the required libraries, styles, and templates on the fly after you save the file
- **Proxy**: Allow you to call your backend without tricks.
- **Build Distributions**: You can manage how the scripts are concatenated to generate a script, for example now you can join your ember.js with your frameworks to generate only one file.

## How it works
The idea is to apply best practices we have learned over time, and we found that we separate these sripts that belong to an application and other than belong to a framework, and each one manages common resouces that will be separated to identify them easily, the following is the idea of the structure of work that is inspired by this tool:

```
- <your project>
  - <apps>
    - <appA>
      - <css>
      - <js>
      - <templates>
      - <static>
    - <appA>
      - <css>
      - <js>
      - <templates>
      - <static>
  - <public>
      - <apps>
      - <libraries>
      index.html
  - <vendors/frameworks>
    - <ember.js>
    - <ember-data>
    - <ember-touch>
    - <ember-routing>
    - <your framework A>
    - <your framework B>
```

# Handlers
The handlers are common action that you need to chain to transform a source file to a distributable one, for example an style file with .less extension will be transformed to a .css, and then minify to reduce the unrequired space, so will be ready for use in your deployed app.

## Published Handlers

- **encloseExportFunction**: For each file enclose to be ready for use in your browser
- **includeTemplate**: Add .handlebars file to Ember.TEMPLATES collection, so your view can found it.
- **removeRequires**: This handlers removes all require('*') found in each .js scripts.
- **less**: Transform your less style to css

## Comming Handlers

- **stylus**: Transform your less style to css
- **uglify-css**: Minifies your stylesheet
- **uglify-js**: Minifies your script
- **jslint**: Check you javascript with jslint to check for inconsistencies.
- **spriteImages**: Concatenates images to save spaces and the number of request when fetching resources.

# Starting with ember-runner

## Installation

``` javascript
npm install -g ember-runner
```

## Run

In your EmberJS root directory run to run a preview develpment server

``` javascript
ember-runner
```