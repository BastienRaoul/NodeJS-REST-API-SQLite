Command line instructions

Git global setup

git config --global user.name "Bastien RAOUL"

git config --global user.email "bastien.raoul@etu.univ-nantes.fr"

Create a new repository

git clone https://gitlab.univ-nantes.fr/E174687C/nodejs.git

cd nodejs

touch README.md

git add README.md

git commit -m "add README"

git push -u origin master