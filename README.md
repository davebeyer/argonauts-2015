# Wait, Are you looking for the Argonauts online slideshow?

Click [here](https://argonauts-2015.firebaseapp.com)


# Argonauts show code

## The 2015 Argonatauts Show - What is it

An oath-powered photos & music slideshow, of the 2015 Argonauts at Burning Man!

```
            THE ARGONAUT OATH

            We  the Argonauts
     United by a common spirit, vow to

Cherish the Unknown, the Uncertain, the Untried
  Challenge Darkness, Dogma and Fear
Welcome the Strange, the Dirty, the Odd, and
  Seek Treasure, Passion and Thyself!


                                [Argonaut Dave]
```

## Build instructions

To clone and build, do:

```
git clone  https://github.com/davebeyer/argonauts-2015
cd argonauts-2015
npm install
```

## Local development

To build, start an http-server on localhost, and kickoff watchify/browserify to watch for & compile any changes, do:

```
./bin/start-dev
```

Then you should be able to visit:

```
http://localhost:8096
```

## Technologies

* Angular2-Alpha 
* .. plus some jquery
* Typescript
* Firebase
* node, npm, browserify, tsify, watchify, gulp
