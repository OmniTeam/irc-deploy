## How to build for production
### Building the server Jar File
Run this command in the project root directory to build server jar file that you will use for deployment

`gradle build -x test -x integrationTest`

The jar file will be found in the `server/build/libs` directory.

The -x test and -x integrationTest excludes test classes during the build.

Try `gradlew` in case gradle doesn't work

### Building the client deployment files
Run this command in the `client` directory

`ng build --prod --base-href <name>`

Replace `<name>` base-href name can either be `kengamis` for CRVPF or `ircmis` for IRC