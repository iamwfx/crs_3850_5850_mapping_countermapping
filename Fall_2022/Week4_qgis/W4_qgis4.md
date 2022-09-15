
# Week 4 - Non-Governmental Publicly Available Data, Geocoding, and Georeferencing
**Today we will cover**
- Where to find publicly available non-governmental data
- Dangers and pitfalls of non-governmental publicly available data
- Geocoding with OpenStreetMaps's geocoding API
- Georeferencing digital images

# 1. Lab Tutorial

## 1.0 Non-governmental data
There are so many publicly available datasets out there with varying degrees of quality and reliability. Here are some list of lists that will help you get started:
- My Are.na channel of [publicly available datasets](https://www.are.na/wenfei-xu/datasets-w7vcldsrhny), many of which are spatial
- [This repo](https://github.com/awesomedata/awesome-public-datasets) of datasets that breaks them down by category and has a "status" flag of whether a dataset is working/up to date or whether something might be broken. It's a hodgepodge of different kinds of datasets (for instance, a [machine learning training set](https://github.com/softwaremill/lemon-dataset) of pictures of lemons for quality control using computer vision!)
- [Kaggle](https://www.kaggle.com) is a platform for people interested in machine learning to practice and work on machine learning competitions for prize money using [datasets](https://www.kaggle.com/search?q=airbnb+sortBy%3Adate+in%3Adatasets+in%3Acompetitions) that have been released by various (typically) private organizations or individuals who want to improve their own internal algorithms.
- [Crowdsourcing projects](https://directory.civictech.guide/listing-category/crowdsourcing), some of which might contain data and others of which contain information that could be scraped, like this [COVID-19 obituary page](https://projects.thecity.nyc/covid-19-deaths/#methodology) created a few months ago
- Harvard's [Dataverse](https://dataverse.harvard.edu/) which is an open data repository for mainly academic/research datasets.

## 1.1 Dangers and pitfalls of non-governmental publicly available data: Web-scraped real estate listings
Because non-governmental data do not adhere to any universal data quality standards - sometimes because these datasets were created in the process an organization day to day activities, or they might have been created by individuals "scraping" (i.e. using web-crawlers to gather information from websites to turn into datasets.) - we need start from a point of mistrust and be a bit more careful in thinking about the potential technical errors and noise in the data.

Let's take a look at an example:

[Here](https://www.kaggle.com/datasets/ahmedshahriarsakib/usa-real-estate-dataset) is a dataset I found on Kaggle of "USA Real Estate" from Realtor.com.

<p align='center'>
<img src="../Images/kaggle_RE1.png" width="800">
</p>

- Its "Expected update frequency" is **Weekly**, so that sounds good (though we're really not sure if this is what the creator of the data will actually do.)
- In the "Context" section of the page, it says that "This dataset contains Real Estate listings in the US broken by State and zip code." However, if you look down at the table, we can see that there are addresses (which we'll geocode in a bit). So it's actually more precise than the zip code level.
<p align='center'>
<img src="../Images/kaggle_RE2.png" width="800">
</p>
- Lastly, the creator says that "Data was collected via web scraping using python libraries." **This should give us the most alarm**, because we are relying on whoever collected the data to have done a thorough job.
- Also, looking at the `Zip code` column, we can see that the zip codes start at `601.0`, which is clearly wrong since all US zip code have five digits. Likely, whoever was collecting this data turned zip codes into a number instead of formatting them as string (text), so these zip codes for PR should be `00601`, `00612`, etc. Not a big deal, but still annoying because we might have to re-format this later on.
- If you go to the "Discussion" tab on this page, you can see that, hm, someone is asking about incomplete data. Clicking on that discussion, it looks like there are only a handful of states available because the collector needs to bypass the blockers Realtor.com has against webscrapping. Hm.
<p align='center'>
<img src="../Images/kaggle_RE4.png" width="600">
</p>

#### A note on webscrapping (and why I generally avoid it):
Webscrapping can be used for all kinds of malicious purposes, for instance, to copy website content and republish it. Here's a [complaint from Craiglist](https://www.scribd.com/doc/313832868/CraigslistVRadpad-Complaint?secret_password=7gTybamKvrbeVhxfi4mx) about a company called Radpad scraping Craigslist and reposting those listing on their own website:

<mark>
“[The content scraping service] would, on a daily basis, send an army of digital robots to craigslist to copy and download the full text of millions of craigslist user ads. [The service] then indiscriminately made those misappropriated listings available—through its so-called ‘data feed’—to any company that wanted to use them, for any purpose. Some such ‘customers’ paid as much as $20,000 per month for that content…”</mark>
<br>
<br>

<mark>
According to the claim, scraped data was used for spam and email fraud, among other activities: </mark>
<br>
<br>

<mark>
“[The defendants] then harvest craigslist users’ contact information from that database, and initiate many thousands of electronic mail messages per day to the addresses harvested from craigslist servers…. [The messages] contain misleading subject lines and content in the body of the spam messages, designed to trick craigslist users into switching from using craigslist’s services to using [the defenders’] service…”
</mark>
<br>
<br>

Uff. 

**What about webscrapping for research or academic purposes?** Most of the above issues most likely won't apply to you, but webscrapping makes a website's traffic *spike* if you don't modulate how often you're pinging the website. This can cause the website's server to crash. This is not very nice. Also, a lot of websites won't allow you to do it. (If you go to almost any URL and put `/robots.txt` after it, you can see a list of subdomains that site will or won't allow you to scrape.)

## 1.2 APIs and Geocoding
Geocoding is the process of transforming some spatial description of a place into geographical coordinates. We have already done the simpler kind of geocoding, which is taking a table that already has geographic coordinates in the form of lat/long columns and turning those into points. That's fairly straightforward.

Today, we're going to geocode **addresses** though we'll circumvent standard geocoding methods. If you've taken an Intro to GIS course, you may have learned that you need some kind of address locator and reference street dataset that needs to be properly styled and formatted so that your geocoder can properly interpolate between street numbers and find the location of an address.

We are going to learn a different method that takes advantage of OpenStreetMap's geocoding API, called [Nominatim](https://wiki.openstreetmap.org/wiki/Nominatim). This is a geocoder that takes the OSM data, which contains roads, buildings, neighborhoods, cities (essentially all the information - and more - that you see on the OSM basemap in QuickMapServices), and tries to locate addresses based on the information they already have through this data. 

First of all, what is an API? API stands for Application Programming Interface and essentially is a tool that, in this case, OSM created to allow us to communicate and use its "servers" (computers) in a regulated manner. There are different kinds of APIs, though most APIs that you will use are called REST APIs, which is when we (the "client") send data to the OSM (the "server") so that its geocoding API reads the data and returns the outputs we asked for - the lat/long in this case.

This won't be as complicated as it sounds. 

Some things to note. Because we are using an API and because it is regulated by the server, there are typically some limitations. Usually, for APIs offered by private organizations, you have to pay for the service after you've maxed out on your quota. For the OSM geocoding API, which is free, we have other types of limitations: 
- There's a limitation of one request per second
- If there are typos in the addresses it might not get picked up (unlike in the Google geocoding API, which might still be understand yours and, very often, my typos)

*Note: Google Maps' API is probably the most widely used geocoding API. I'm still waiting on them for educational accounts for us. If that goes through, I'll show you how to use that service in a later week.*

In this week's lab folder, there are two CSVs that you should download. These are `n=10` and `n=200` samples of just listings in NY state:
- `real-estate-ny-10sample.csv`
- `real-estate-ny-200sample.csv`

To download these files, you should right-click the **Raw** version of the file and "Save link as...". I often add the `.csv` format at the end of the filename just in case there's any confusion in reading the filetype. 

We are going to use the `n=10` sample to start. The original 923k sample is [here](https://www.dropbox.com/s/6uxgjney859894w/realtor-data.csv?dl=0) and 120MBs, FYI.

In QGIS, bring the `real-estate-ny-10sample.csv` into the layers pane and take a look at the attribute table. It should look like this:
<p align='center'>
<img src="../Images/geocode_tableshot.png" width="600">
</p>

We can see that the:
- `street` column is where we have the number, street name, apt name
- `city` has the city name. Sometimes NYC is `New York`, sometimes `New York City`. Perhaps `Brooklyn` is encoded separately? Hard to say just by looking.
- `state` is the state, thankfully there seems to be a consistent formatting, at least for this sample.
- `zip_code` is formatted as a number, which we already know about
- There are some values in the other columns that are missing. Not ideal, though not the end of the world (for now).
- The last entry has no street address, so we're not going to expect that to be geocoded. (Maybe.)

Go to **Menu->Geocode->Geocode CSV with Web Service**, you should see a window like this pop up:
<p align='center'>
<img src="../Images/geocode_window.png" width="400">
</p>

(I've hidden my google maps API key, which is not needed for Nominatim anyways. Not relevant now, but **NEVER PUBLISH YOUR API KEY.**)

In the **Input CSV File** section, you should select your `real-estate-ny-10sample.csv.` file.

Under **Address**, you should be using `street`, under **City** it should be `city`, **State** should be `state`.

If there are duplicate responses, the default is to `Use Only First Result`, which we'll stick with. If we think that there are some systematic ways that first results are wrong, we can switch to the second `Multiple Features for Multiple Results` option. When the geocoder tries to find the location of an address, the first one is typically the best guess.

For the **Output File Name**, make sure to save it down to a location you can find later. I have named my shapefile `real-estate-ny-10sample_geocoded.shp`. Same with the **Not Found Output List**, which returns a table of what was not geocoded (so you can make corrections and send it through the geocoder again). I've named this table `real-estate-ny-10sample_failed.csv`.

Once you've made the correct inputs, hit **Apply**. We have 10 rows, it should take about 10 seconds.

So it looks like only 4 entries were geocoded. Close the window and let's see what worked and what didn't:
- Opening up the attribute table of my `real-estate-ny-10sample_geocoded.shp`, I can see that the entries with addresses but not apartment units worked. Surprisingly, the one without a street address, only the city, also worked! We are learning that the OSM geocoder will default to the city when it doesn't find the address. 
- Bring in the `real-estate-ny-10sample_failed.csv` file into my layers section and opening up the attribute table, I can see that all the failed entries have an apartment number.

For our purposes now, since we're just trying to understand the basic lat/lng location of these units, I'm going to go ahead and **Edit** (using the pencil tool in the attribute table) and remove the apartment numbers from each entry manually.
<p align='center'>
<img src="../Images/geocode_manualedit.png" width="600">
</p>

**Don't forget to click the pencil button again and save down your edits after you finish.**

Now, geocode this **revised** `real-estate-ny-10sample_failed.csv` again. Make sure to change the output names from the original so you don't write over those 4 points. And don't forget to name the second failed table as something else.

Woohoo! It looks like all 6 remaining entries worked.

Lastly, we'll want to merge these two geocoded shapefiles into one file so it's easier to work with. Click **MMGIS->Combine->Merge Layers**.
<p align='center'>
<img src="../Images/mmqgis_mergelayers.png" width="300">
</p>

Make sure to select both layers you want to merge and rename the new file:
<p align='center'>
<img src="../Images/mmqgis_mergelayers2.png" width="400">
</p>

Your final 10 points should be here (we had one listing in Long Island). I added a basemap to see where the point landed:
<p align='center'>
<img src="../Images/mmqgis_final10pts.png" width="600">
</p>

#### DELIVERABLE #1
PDF Output of just the listings map after you've geocoded (no title, legend, etc. needed) them.

## 1.3 Georeferencing

Georeferencing is the process of associating pixels on to geographic coordinates. This is a method that is great for layering with other sources of data for comparative analysis. We typically start off with a digital raster map in a standard image format like `.png`, `.jpeg`, or `.TIFF`/`.TIF` and create a `.GeoTIFF`. (If you have a handdrawn map, you can scan or even photograph it.) Georeferencing can be can useful for:
- Maps, especially older ones
- Aerial images
- Handrawn maps, possibly in the course of field surveys.

Today, we're going to work with a map from the *Atlas of the Borough of Brooklyn* map collection published in 1916 by E.B. Hyde & Co. This map is essentially a book of parcel and road infrastructure data. This collection is part of the New York Public Library's Digital Collections, which as a great archive of historic NYC maps, many of which are [digitized](https://www.nypl.org/collections/nypl-recommendations/guides/nyc-maps).

<p align='center'>
<img src="../Images/bk_atlas.png" width="800">
<br>
A small section of northern Brooklyn
</p>

First, what does this map even show? Here's an index with a legend. The colors correspond to the type of housing (for ex: frame, iron, stone, brick)  and you can see that we also have the block and lot numbers of each parcel. (Link [here](https://digitalcollections.nypl.org/items/6c05633e-3bdd-b9cf-e040-e00a18063bc7)) 
<p align='center'>
<img src="../Images/bk_index.png" width="800">
</p>

<p align='center'>
<img src="../Images/bk_legend.png" width="600">
</p>

Download the original copy of this map from [here](https://digitalcollections.nypl.org/items/6c05633e-3bde-b9cf-e040-e00a18063bc7). For georeferencing, we'll want somethingn with a higher resolution. FYI, there is a `.TIFF` version of this map that is very high resolution, which you might want if you need to zoom in a lot and to preserve the resolution of the image. For our purposes, we don't really need the (many MBs) `.TIFF` file. Any image 300 dpi or above is usually fine.

**The best way to georeference is if you already know the projection of the image map.** We then set our projection to that (using the globe-hat). Since I could not find the projection listed in this atlas, I'm just going to set my map to my preferred projection of `EPSG:3857`.

We are going to use one of our **QuickMapServices** basemaps to do the georeferencing. Even though these basemaps show the NYC of today, most of the significant reference points, like roads, parks, and buildings are the same today as it was in 1916. Here I'm using the **OSM->OSM Standard** basemap. It doesn't look as pretty as some of the other ones we've been using, and that's because it more clearly shows most of the physical features that will be useful for us.

Now click **Layer -> georeferencer**. You will get a blank georeferencer window like this:

<p align='center'>
<img src="../Images/georef_blank.png" width="300">
</p>

Click on the **Open Raster** button that looks like a checker-board and open up your 1916 Brooklyn map. It should appear in your georeferencer window:
<p align='center'>
<img src="../Images/georef_wraster.png" width="600">
</p>

Generally, it's better to start by covering a lot of ground, so starting at the corners and edges of the image. You'll be able to iterate.

I'm going to start off at the upper-right hand corner, at the intersection of **Marshall and Gold** streets. (I've also located this on my OSM map)
<p align='center'>
<img src="../Images/georef_marshallgold.png" width="600">
</p>


**Now, we are basically going to add a series of points on our image and reference them in our OSM basemap and essentially "stretch" the image until it fits onto our basemap.**

To do this, click on the **Add Point** button, which will ask you to:
1. Click on a point on the image (you can zoom in)
2. (Select **From Map Canvas**)
3. Click on its location in the OSM map on your main map canvas

After you put down a point on Marshall and Gold streets, a window should pop up:
<p align='center'>
<img src="../Images/georef_mapcoord.png" width="300">
</p>

You select the point on the OSM map and now your coordinate box should be filled out:
<p align='center'>
<img src="../Images/georef_mapcoord2.png" width="600">
</p>

There should be now a pair of points, one on your image map and one on your OSM map:
<p align='center'>
<img src="../Images/georef_mapcoord3.png" width="600">
</p>

Now do this for more (maybe 7-8?) points and make sure you have points evenly distributed across all the corners and edges. (Note: We do have some roads, such as the Brooklyn-Queens Expressway, and public housing developments that were built after 1916. Actually...this area saw a lot of new developments post-1916...)

This is what my first iteration looks like:
<p align='center'>
<img src="../Images/georef_iter1.png" width="400">
<br>
The lines are telling us how the image will distort
</p>

**Save down your GCP points!** In your lab folder or wherever you can find it easily.

Now, click the yellow gear button to change preferences, since we need to change how we distort the image. We want to change the transformation type from `Linear` (which won't actually stretch your image, but try to rotate it into place and **will not work** here) to `Polynomial 2`.
<p align='center'>
<img src="../Images/georef_transformtype.png" width="300">
</p>

Here is my translation of the possible way to transform your image (from the documentation [here](https://docs.qgis.org/2.8/en/docs/user_manual/plugins/plugins_georeferencer.html#available-transformation-algorithms)):

- The Linear algorithm rotates the image.
- The Helmert transformation performs simple scaling and rotation transformations.
- The Polynomial algorithms 1-3 are among the most widely used algorithms introduced to match source and destination ground control points. The most widely used polynomial algorithm is the second-order polynomial transformation, which allows some bending. Polynomial 1 allows scaling, translation and rotation only. Polynomial 3 allows more localized curving of the image to fit your GCP points.
- The Thin Plate Spline (TPS) algorithm is a more modern georeferencing method, which is able to introduce local deformations in the data. This algorithm is useful when very low quality originals are being georeferenced.
- The Projective transformation is a linear rotation and translation of coordinates.


Finally, you can hit the **"Play"** button to start georeferencing your points.

This is what I got, not bad for the first iteration!
<p align='center'>
<img src="../Images/georef_try1.png" width="600">
</p>

You can zoom in and turn on and off the newly georeferenced layer to compare it with the OSM map. If you right-click on the layer and select **Properties**, you can also change the transparency to see the OSM map underneath.

If I zoom into my map, I can see that the georeferencing is just *slightly* off (I changed my georeferenced map transparency to 40%).
<p align='center'>
<img src="../Images/georef_off.png" width="400">
</p>

You can go ahead and open the georeferencer again, load in the points you saved, and now add new ones on top of that to make these smaller adjustments. (Thankfully OSM also has building footprints. We could have also brought in a building footprints dataset to include in our map canvas.)

It looks like my Pierrepont Street GCP was pretty off, so I'm actually going to delete a GCP I have around there and add a new point. Just hit **Delete Point** in your georeferencing window and select the point on the image you want to remove.

**Make sure to save your GCP points down each time before you georeference!** Don't lose your work.

#### DELIVERABLE #2
Finish georeferencing this image and create a PDF output of the whole georeferenced map with 40% transparency so we can see the basemap underneath. No title, legend necessary.


# 2. In-class Exercise: Proportional Symbol Map
Download the `real-estate-ny-200sample.csv` dataset and geocode with one round of edits for the points that failed to geocode. Also, I've already done the laborious scrubbing of the data of its apt unit info for you. 

Using your newly geocoded dataset, create a proportional symbol map that shows the price per sq foot of your listings. Use the **Graduated** option in **Symbology**. Under **Method**, instead of `Color` to create a choropleth map, select `Size`.

Also, my recommendation: Add some transparency to the fill of your symbols and a solid line for the border. Your symbols will overlap and it will be easier to see them with transparency.

#### DELIVERABLE #3
Create a proportional symbol map, output as a PDF, of the available price to square foot for your geocoded data. Make sure to include a scale bar, title, and your data with a basemap. Also, as text on your map, answer the following:
- How many points were you able to geocode?
- Of the points you were able to geocode, how many price entries and size entries are missing?
- Which addresses was the geocoder not able to find? Any patterns?
- Is this map an accurate representation of home values across the city? Why and why not?
