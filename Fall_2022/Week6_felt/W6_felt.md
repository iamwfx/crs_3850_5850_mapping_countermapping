
# Week 5 - Collaborative Mapping with Felt

**Today we will cover**
Today we're going to focus on learning how to use the mapping platform Felt. This is an experiment. We will do this by working on an "Areas of Daily Activity" map that you will create as a class. Through this These are the basic functionalities I'd like to highlight today:
- Annotate
- Add data
- Add media
- Highlight shapes
- Draw shapes
- Collaborate

This week, I'll be sparser with the instructions since I think most of the functionalities should be fairly intuitive.

# 1. Lab Tutorial
In this first exercise, we are going to create a collective
## 1.0 - Get your data from Mergin
Make sure that, in your app, you have uploaded all the data you've collected to your Mergin account online.

Once you've done that, go to [your account on Mergin maps](https://app.merginmaps.com/dashboard) and click on your survey in the dashboard. Save down all the files into your lab folder.

## 1.1 - Felt Sign-Up and Overview
1. First, you'll need to sign up for a free Felt account [here](https://felt.com/signup).
2. Add the email address you used to sign up [here](https://docs.google.com/spreadsheets/d/1oG5OafHRC_dym4a5-WfgStWnkQQC8mLASSXxN_v4xOY/edit?usp=sharing) so I can add you as a contributor to our first collaborative map.

Once you've done these , watch [this short video](https://www.youtube.com/watch?v=kodNAqe8g3U) to get a sense of how to use Felt (it's very easy).


## 1.2 - Add your data
Go to the "Map 1: Areas of Daily Activity" map that you have been invited to edit. Using the **Upload** tool in the menu bar, upload your `data.gpkg` as a **Data Layer** on to the map. Rename this layer to your name so you can keep track of it.

<p align='center'>
<img src="../Images/felt_upload.png" width="600"
</p>

## 1.3 - Style your data
After everyone has uploaded their `data.gpkg` and renamed their data layers, I'd like you to create a categorical map of your own points layer using the following color scheme (we are going to use the Hex color syntax):
- `Recreational`: `#19FFE8`
- `School`: `#63D471`
- `Work`:`#FF3AAA`
- `In Transit`: `#BF00FF`
- `Errands`:`#FF3232`

On the right-hand side, you can **Style Layer** and there are tools that allow you to create a **Style by Category**. **We are not going to use this function.** Instead, click **Advanced** in the borrow of the tool bar.  
<p align='center'>
<img src="../Images/felt_advancedstyling.png" width="300"
</p>

Felt has a [style language](https://feltmaps.notion.site/Felt-Style-Language-0f4de46f0cf2450ea2a19853741097d6#09076b738fe74e6494a481905df13103) that allows users more control over how we style maps. This "language" uses the `JSON` file format (it is stands for JavaScript Object Notation) that uses a **dictionary** of key-value pairs to store information. For instance, the following is a `JSON`: ``{"name":"John", "age":30, "car":null}``. Here, `name`, `age`,`car` are the **keys**, and the information that follows each of the `:` are the **values**. We know it's a dictionary by the `{` and `}` that begin and end the code. As we'll see below, we can have dictionaries within dictionaries, where the value associated with a key is a dictionary itself.

Just some syntax rules for JSONs:
- Data is in key/value pairs
- Data is separated by commas
- `{}` braces hold objects (read: dictionaries)
- `[]` Square brackets hold arrays (read: lists)
- Spaces and line breaks do not matter
- `""` denotes a string (read: text)

Felt takes two types of style blocks: the `datasets` block and the `visualizations`.
From the [documentation](https://feltmaps.notion.site/Felt-Style-Language-0f4de46f0cf2450ea2a19853741097d6#f87b154dec58412f915a113ae8edf61e):
- "The datasets block contains information on each dataset that’s included in your layer."
- "The visualizations block contains information on how your datasets will be shown on the map. Visualization blocks are rendered from top to bottom following the order in which they are defined."

We are going to be working with the visualizations block today.

From your visualizations block, which should begin at:
```
"visualizations": [
    {
      ...
```
We need to set of these the parameters to create our map:
- `type`: There are two types :
  - `simple`: this is what your visualization block might currently show, which colors all the shapes in the same way
  - `categorical`: this creates our categorical map where we can color by our **Activity Type** column.

Since, we want to create a categorical map, our visualizations block should show this:
```
"visualizations": [
    {
      "type":"categorical",
      ...
```
- `dataset`: This is just the reference ID for your dataset. We won't need to change this.
- `config`: This is dictionary of inputs that tells Felt about certain configurations of the data: (From the documentation):

  | Field name | Description |
  | --- | --- |
  | `labelAttribute` | Optional. Used both in simple and categorical visualizations. Defines which dataset attribute or attributes to be used for labeling. If multiple values are provided, the first available one will be used. |
  | `categoricalAttribute` | Mandatory. Used in categorical visualizations. The attribute that contains the categories that will be used. |
  | `categories` | Mandatory. Used in categorical visualizations. An array of the values that will be used as categories. Categories will be rendered from top to bottom following the definition order. The same order will be used in the legend. |
  | `showOther` | Optional. Used in categorical visualizations. If this field is set to true it will show all features that do not match any of the defined categories and add an extra entry as the last item in the legend. |
  | `otherOrder` | Optional. Used in categorical visualizations. It can be set to either “below” or “above” to make features that do not match any of the defined categories render below or above the other ones. The default position is “below”. |

For our purposes, we are going to set:
```
"categoricalAttribute":"Activity type",
"categories": ["Recreational", "School","Work","In Transit","Errands"],
```

These are less important, but we will also use:
```
"showOther": true,
"otherOrder": "above"
```
Now your visualizations block should show:
```
"visualizations": [
    {
      "type": "categorical",
      "dataset": "[ID OF YOUR DATASET, YOU DON'T NEED TO CHANGE]",
      "config": {
        "categoricalAttribute":"Activity type",
        "categories": ["Recreational", "School","Work","In Transit","Errands"],

      ...
```

- `style`: is a dictionary that tell us how to style the above categories. It has the following components:

  | Field name | Description |
  | --- | --- |
  |color|Fill color. Accepts named color, hex, rgb(a), hsl(a). Works on lines, points, and polygons. **Note, color is a list and the order in which the colors appear corresponds to the order in which the categories above appear.**
  |strokeColor|Outline color. Accepts named color, hex, rgb(a), hsl(a). Works on points, and polygons.|
  |strokeWidth|Outline width in pixels. Works on points and polygons.|
  |opacity|The opacity value applied to both color and strokeColor. A number from 0 to 1. Works on points, polygons and lines.|
  |size|  Point radius or line width in pixels.|
  |lineCap|The shape used to draw the end points of lines. Can be “butt”, “round” or “square”. Works on lines.|
  |lineJoin|The shape used to join two line segments when they meet. Can be “bevel”, “round”, “miter”. Works on lines.|
  |isSandwiched|  A boolean telling if a polygon layer should be rendered below (true) or above (false) basemap roads and water bodies. Defaults to true, rendering polygons below basemap roads and water bodies.|

Now your visualizations block you should like this: (Note: please fill out the rest of the color list with the colors I provided above.). Note that I've removed the boundaries of the points with `"strokeWidth": 0`.
```
"visualizations": [
    {
      "type": "categorical",
      "dataset": "[ID OF YOUR DATASET, YOU DON'T NEED TO CHANGE]",
      "config": {
        "categoricalAttribute":"Activity type",
        "categories": ["Recreational", "School","Work","In Transit","Errands"],
      "style": {
         "color": [
           ["#19FFE8",...PLEASE FILL OUT THE REST...]
         ],
         "strokeColor": [
           "#FFFFFF"
         ],
         "size": 5,
         "strokeWidth": 0,
         "opacity": 1
      }
      ...
```

- `label`: This tell us how we want to set style the labels.

We'll just stick to the default settings for the labels for now, but note that you can also customize the `colors`, `haloColors`, fonts, etc, in a very similar way to how your categories can map onto point colors.

Now your visualizations block you should like this:
```
"visualizations": [
    {
      "type": "categorical",
      "dataset": "[ID OF YOUR DATASET, YOU DON'T NEED TO CHANGE]",
      "config": {
        "categoricalAttribute":"Activity type",
        "categories": ["Recreational", "School","Work","In Transit","Errands"],
      "style": {
         "color": [
           ["#19FFE8",...(PLEASE FILL OUT THE REST)...]
         ],
         "strokeColor": [
           "#FFFFFF"
         ],
         "size": 5,
         "strokeWidth": 0,
         "opacity": 1
      }
      "label": {
        "minZoom": 3,
        "fontWeight": 400,
        "fontSize": 14,
        "haloWidth": 1.5,
        "offset": [
          8,
          0
        ],
        "color": "#5a5a5a",
        "haloColor": "#d0d0d0"
      }
      ...
```

- `legend`:Lastly, in our legend, we can change what our activity type categories map onto using `displayName`. We can also add a subtitle to our legend.

Let's change `Recreational` to be displayed as `Fun` in our legend and give our legend a subtitle:
```
      "legend":{
        "displayName": {
          "Recreational": "Fun",
          "School": ""#63D471"
          "Work":"#FF3AAA",
          "In Transit": "#BF00FF",
          "Errands":""#FF3232",
        },
        "subtitle": "INSERT A SUITABLE SUBTITLE?"
      }
```

The completed visualizations block should look like this (with your own insertions):
```
"visualizations": [
    {
      "type": "categorical",
      "dataset": "[ID OF YOUR DATASET, YOU DON'T NEED TO CHANGE]",
      "config": {
        "categoricalAttribute":"Activity type",
        "categories": ["Recreational", "School","Work","In Transit","Errands"],
      "style": {
         "color": [
           ["#19FFE8",...(PLEASE FILL OUT THE REST)...]
         ],
         "strokeColor": [
           "#FFFFFF"
         ],
         "size": 5,
         "strokeWidth": 0,
         "opacity": 1
      }
      "label": {
        "minZoom": 3,
        "fontWeight": 400,
        "fontSize": 14,
        "haloWidth": 1.5,
        "offset": [
          8,
          0
        ],
        "color": "#5a5a5a",
        "haloColor": "#d0d0d0"
      },
      "legend":{
        "displayName": {
          "Recreational": "Fun",
          "School": ""#63D471"
          "Work":"#FF3AAA",
          "In Transit": "#BF00FF",
          "Errands":""#FF3232",
        },
        "subtitle": "INSERT A SUITABLE SUBTITLE?"
      }
    }
  ]  
```

## 1.4 - Add your pictures
Upload your pictures on the map. Your images should automatically show up where you took them. You can resize them.

If you want, you can also add a **Note** by copy-pasting your corresponding text from the **Notes** column.

## 1.5 - Draw shapes
Now, use the **Polygon** tool in your toolbox and draw out, **using the color red**, areas you generally traverse over the course of the week. You can use your points as "guideposts", but you don't need to.

Label the area with your name using the **Text** tool.

# 2. In-Class Exercise: New Student Guide to Cornell and Ithaca
For this exercise, we are going to crowd-source a guide to Cornell and Ithaca. Let's say you are introducing a new Urban Studies or Urban and Regional Planning student to the area. Using [this map](https://felt.com/map/Map-2-Guide-to-Ithaca-as-an-Urban-Studies-Planning-Student-WwDHs6cWSSOWlshQn9AFTTB), create a guide on some of the places, areas, landmarks, paths that would be helpful to orient them. Some guiding questions:

- Where are the places on campus and elsewhere to get lunch? Coffee? A nice dinner out? Groceries? East Asian groceries? (You can use the **Pin** tool or **Clip** tool to highlight buildings when you zoom in close.)
- Where are good study space? Gyms? Hangout spots? Places to see a show? You can use the **magnifying** tool on the upper right hand corner to search for a place name. (You can also **link** a website)
- Landmarks people should know about?
- What are some nice walks? Running paths? (Try the **Route** tool)
- Which are the key buildings on campus that students should know about? In a text or note, explain why they should know about them.
- What are places you should avoid? Paths or areas you should avoid are difficult to traverse? (I added one)
- Do you want to color code the map? Coordinate amongst the class.
