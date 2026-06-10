- APIs should not return a 404 for missing data - only for a missing API!

- Resources catalog provides no way of listing resources - I have had to make a copy of it as an array. Were this real and the API data was updated, I'd be screwed.

- Seems to be an issue with slow responses and VERY slow tests when a few records have been added? Not had time to look into it more.

- I wrote a little data manipulation in the FE - if (endsAt < startsAt) { add one day to end date } - this Could be replicated in the API handler.