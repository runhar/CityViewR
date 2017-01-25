# CityViewR: open data for smart cities, in VR
Aimed at decision-makers and data-analists, **CityViewR** combines the best of the Web and VR.
It uses *open data* to collect low regional statistical data which users can combine with their own data.
CityViewR presents these data in an *immersive* room-scale setting, letting users view these data in new ways.
Which hopefully leads to a better insight in social and economical developments in the city, and in turn to
more evidence-based policy making.

## About the demo
The demo presents data about Amsterdam. This city was mainly chosen because the winner of the Virtuleap Hackathon will earn a spot
there (try to find the little blue dot!). Data on city district level ('wijk' in Dutch) come from the OData service of CBS,
the Dutch statistical institute. Because data are loaded in real-time, all variable labels are in Dutch. Therefore some explanation:
by default, the first view will show the distribution of migrant groups across the city. Clicking on bars will show the statistical
figures. Data are from 2016, so many of the categories don't have actual data yet.
To show that CityViewR can also deal with microdata, I prepared a synthetic dataset derived from an open data source on energy labels.
Click 'own data' to view more than 4.000 values (green correlates with low energy consumption, red with high energy consumption).
Data are read from a csv file containing latitude, longitude and values.

Best viewed with HTC Vive in the experimental Chromium VR browser. Other configurations fail sometimes. Reloading the page helps sometime.
Remember, this is still very experimental stuff.

## What's next?
This is a prototype. CityViewR can easily be extended to cover all Dutch municipalities, and probably many other cities.
Prerequisities at the moment are that there needs to be some GEOJSON information available to map the data, and of course a data API.

On our wishlist:
* a generic input procedure for adding own datasets (in R)
* animation, to see how things develop over time
* drill down to even more detailed regional information (neighbourhoods)
* basic data manipulation (create categories, cross variables)
* grab, zoom and rotate
* improve code for better maintainability, better user interaction, better performance on mobile devices etc. etc.
