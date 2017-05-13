# Meesman

> Tool to keep track of my investments in Meesman Indexbeleggen.

## Usage

First install the module dependencies:

```
> npm install
```

Then you can run it with:

```
> npm start
```

Make sure you have the following environment variables set:

```
MEESMAN_USERNAME=your_meesman_username
MEESMAN_PASSWORD=your_meesman_password
```

You can set the environment variables and run the tool with the following one-liner:
 
```
> MEESMAN_USERNAME=your_meesman_username \
  MEESMAN_PASSWORD=your_meesman_password \
  npm start
```

## Running as a docker container

You can also run this tool as a docker container, using `docker-compose`.

The container uses a cron job to gather data from the server every day at 18:00.

First, make sure you set the right environment variable values in the file `docker-compose-variables.env`.
 
Then simply run:

```
docker-compose up
```

# Advanced configuration

Check the properties in the [`convict` configuration file](config.js) for more information. 

# License

[MIT](LICENSE).