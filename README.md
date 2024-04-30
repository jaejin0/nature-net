# Development Process

We want to stablize development process using feature branches, pull request, and merge. So, we create new feature branches off of the dev branch and merge to the dev branch

branches:

- `main`: stable product branch
- `dev`: default branch for development
- `feature branches`: you will create these off of the `dev` and merge to `dev` with corresponding names of the feature

---

## Intialization

to clone the repo & track remote branches:

```
git clone git@github.com:jaejin0/nature-net.git
cd ./nature-net
git switch main
git switch dev
```

---

## Creating new feature branch

to create a new branch to develop new feature

```
git fetch
```

```
git checkout -b <feature name> dev
```

**_<h3 align="center">You can now develop your feature!</h3>_**

---

## Committing to the feature branch

to commit changes to the branch:

```
git add .
```

```
git commit -m "<commit message>"
```

```
git push -u origin <feature name>
```

> let's commit small and often

---

## Creating pull request

1. go to our GitHub repository
2. go to Pull requests tab
3. click `New pull request`
4. set `base: dev` and `compare: feature branch`
5. click `Create pull request`

If there is a `merge conflict` we can resolve as a team. If not, review can be done quick.

---

## Deleting the feature branch

After merging, we can delete the feature branch

to delete remote branch:

```
git push origin --delete <feature name>
```

to delete local branch:

```
git checkout dev
```

```
git branch -d <feature name>
```

---

# Project Proposal

<https://docs.google.com/document/d/1YZhjfzQi5ABrWiJPdZvmdrJAMHeV-FYAyagqCvLjt8g/edit?usp=sharing>

## Project Setup

First, in order to run the model, you will need to download the model itself, `best.pt`. You can find it in the shared drive [here](https://drive.google.com/drive/u/2/folders/0AAkEF1_E0xcyUk9PVA).
Place this model in the `detection_api` folder.

## Running the project

First, in one terminal, cd into the `detection_api` folder and run the server by running `python app.py`. You may need to install some packages.
Then, in another terminal, cd into the `detection_script` folder and run `python cam.py`. This will begin capturing frames and sending them through the model.

To run the backend, in another console, cd into the `Backend` folder, and run `node src/index.js`.

To run the frontend, in another console, cd into the `service_frontend` folder, and type `npm start`. This will ask if you want to run the frontend on another port. Type `Y`.
