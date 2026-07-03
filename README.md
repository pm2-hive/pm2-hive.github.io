
# Official PM2 marketing/documentation

This is the Jekyll/Github page that generates the website hosted on http://pm2.keymetrics.io/

LLM-friendly documentation is available at [pm2.keymetrics.io/llms.txt](https://pm2.keymetrics.io/llms.txt) (index) and [pm2.keymetrics.io/llms-full.txt](https://pm2.keymetrics.io/llms-full.txt) (full docs in one Markdown file).

# Updating the documentation

After editing files under `docs/`, regenerate the LLM-oriented single-file documentation ([llms.txt](https://llmstxt.org) convention) and commit the result:

```bash
node scripts/build-llms-full.js
```

This rebuilds `llms-full.txt` at the repository root, following the page order of `_data/nav.yml`. The curated index `llms.txt` is hand-maintained: update it when adding or removing a docs page.

# Contribution

If you see any typo, have any recommendation, advice, feel free to open a [Pull Request](https://github.com/pm2-hive/pm2-hive.github.io/pulls)

Thanks

