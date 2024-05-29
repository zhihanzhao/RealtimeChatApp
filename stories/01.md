## Realtime Chat App with NestJS and Angular
### 1. Video

You need:
- Angular
- Nestjs
- npm
- docker

Story:
As a developer I want the NestJS Backend and the Angular Frontend to be set up.
Both should be run with a dockerfile.
They should be run/started together via a docker-compose file, so we can start everything with one command.
The NestJS Backend should connect to a Postgres database, that is also started with docker-compose file.
At the end of this video the Frontend should be able to retrieve a value from the Backend, all inside docker.

Acceptance Criteria:
- Set Up Angular (/)
    - Angular vresion : 15.2.2
    - node version : 14
    - command : ng new <name>
- Set Up NestJS (/)
    - command : nest new <name>
    - version : 9.3.0
- Start Angular with Docker-Compose/Dockerfile & access in the browser via http://localhost:4200 (/)
- Start NestJS with Docker-Compose/Dockerfile & get a basic value via http://localhost:3000/api (/)
    - create the Dockerfile
    - create the docker-composer.yml
    - start the Docker on the local
- NestJS should connect to a postgres database with docker-compose (/)
    - Connect to DB by TypeOrmModule
    - Setup the Docker
        1. docker-compose build
        2. docker-compose up
        3. if packages not recongized, need restart/delete the docker 
- Angular should display a value that it gets from the NestJS Backend (/)
    - connect the Frontend and Backend 
    - Backend : create the restfulAPI 
        1. setGlobalPrefix
        2. service(value)-controller(endpoint)
    - Frontend: use HTTPClient get value 
        1. create http client
        2. set proxy.conf.json and set in angular.json (proxyConfig)

### Docker: 
1. frontend - client : 4200
2. api - server : 3000
3. database  - postgre : 5050

