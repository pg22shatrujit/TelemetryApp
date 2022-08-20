###**PG22 T4 Cloud Computing - A4: Telemetry Charts /w Cloud Functions**

Submitted by: Shatrujit Kumar (pg22shatrujit)
Date: 17th August, 2022
----------

Demonstrates the use of cloud functions to generate two charts, one of which is a heat map. 
The data used to generate the charts is aggregated using Firebase cloud functions.
[Repository](https://github.com/pg22shatrujit/TelemetryApp)

####**Download/Install**
---------
 - Clone/download the `cloud-functions` branch of the [repository](https://github.com/pg22shatrujit/TelemetryApp)
 - Install dependencies with `npm install` and `npm install @vue/cli`.
 - Run `firebase emulators:start` to enable the firestore and functions emulator
 - Run `vue ui` to start the vue ui client.
 - From the Tasks tab, run the server and client tasks and open the client app.

####**How to use**
--------
 - Navigate to the Charts view from the Navbar to see the charts
 - Data can be updated using the form in the Admin view, with changes reflecting live on Charts View
 - A "Generate 100 Records" button has been added to the Admin view for easier testing