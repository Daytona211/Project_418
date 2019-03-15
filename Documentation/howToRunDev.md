# How to run our 418 project
To run our project you will need some programs installed. Firstly you need to have NodeJS installed this is a runtime environment for
javascript. Essentially what that means is we can run javascript outside of the browser like we do Java, or C. The link to the download is https://nodejs.org/en/ then select the LTS version. Then you should be able to access NodeJS from your terminal.

## After getting Node
After downlaoding NodeJS we now need a copy of our project git clone the repo https://github.com/Daytona211/Project_418 and if you already have a copy run a git pull to get the most current version.

## Once the repo is set up
You will see a directory call Project_418 this is the folder that has our project cd into it and you will then see many folders lets break this down

**Documentation**- Pretty self explanitary. This is where all of our docs and forms will go so that we have it in one collected area we
will present this to the professor at the end of the semester so we need to keep it clean and organized
**node_modules**- Think of this as a giant config file for our project there is alot of technical things in here DON'T TOUCH IT. We will
run commands using node that will update this we ** WE SHOULD NEVER TOUCH IT OURSELVES **
**Server**- Server is where our server goes (duh) it has everything fro our backend so our backend JS (which is written using expressJS)
database stuff and anything else we may need on the backend
**Views**- This is where our views will go aka our front end stuff like HTML CSS and frontend JS. You may be asking why we have ejs files
in there well ejs is our view engine which basically allows us to write HTML with all the standard rules but now we can use ejs which lets
us use variables loops and other things we may need within the HTML.

## Wrap up
Thanks for reading if any of this DID NOT make sense you should contact a group member or **WATCH THE TUTORIALS ASAP** since you are
expected to contribute to this.
