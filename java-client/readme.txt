###########
Java Client
###########

The Java Client implements View 1 as per requested by the instructions.
The Client will communicate with the server to gather programs and
courses for an off-pattern student, but it is not required to make any
other communication with the server, as per the View 1 specifications.

###################
Instructions to Run
###################

-Ensure that the CourseBuddy Server is running

-Ensure that JDK 7 or better is available on your machine
(this is the minimum recommended version by Oracle, and required by the syntax version used)

To Run JAR:
- The JAR file uses the default Apache host and port
- Double-click java-client/View1.jar

To Build:
- Recommended that you use Eclipse (no gradle build script is included)

1. Verify server Apache HOST and PORT in java-client/src/models/Constants.java
2. Add the java-client/src directory, and java-client/lib/gson.jar to your classpath.
3. Compile and run java-client/src/Client.java
