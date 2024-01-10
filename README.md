# Scrape receipts

You need to login to amazon on the machine you're using then use this query in the console.

Go to Amazon -> My Orders -> Search for "whole foods" then use the `getIds()` function from the console.

### Commands

Flags are:

- Number of pages to search through `-c` (default to 30)
- Save order ID to JSON file `-s` (defaults to `true`)
- Keyword query search `-q` (defaults to `"whole foods,fresh"` comma separate for multiple keywords NO SPACES)

##### Examples

- `node index.js -c 2 -q book,lego -s false`
- `node index.js -c 10 -q bath,book,toy -s false`
