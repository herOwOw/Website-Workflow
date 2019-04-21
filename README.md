# Website Workflow
Workflow with Gulp, it helps to make a site development quicker :p

# Getting Started
git clone https://github.com/herOwOw/Website-Workflow.git 

# Prerequisites
run yarn or npm install

# Built With
Gulp version 4, but i did some troll mix...


# Authors
Younes Keraressi.

 the image task optimisation was copied from https://gist.github.com/LoyEgor/e9dba0725b3ddbb8d1a68c91ca5452b5 

# Acknowledgments
commands list :   
gulp -init // generate folders : 
1) builds > development{ img, sass(0_base.scss), js(0_base.js), index.html}. 
2) builds > production > {img, css(style.min.css), js(script.min.js), index.html}

gulp css -map "or" gulp js -map //to make a source in css/js respectively

gulp html -min // to make all html inside development minified

gulp watch // to start working and make changes on the fly with browsersync

note that in development (sass/js folder) it start with 0_base.scss/0_base.js you put your base or grid there and the next file will be 1_whatever.(scss/js) and so on to avoid breaking and keep ordering priority as code logic goes on, and maybe you ll name it 1_menu or something that easily to go back and change it when need it.

so basically run first gulp init then gulp watch, if wanted map press ctrl + c to stop gulp watch and just run gulp css -map for css or gulp js -map for javascript, and if wanted minified html just run : gulp html -min, and thats it :).