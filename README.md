
# Official PM2 marketing/documentation

This is the Jekyll/Github page that generates the website hosted on http://pm2.keymetrics.io/

LLM-friendly documentation is available at [pm2.keymetrics.io/llms.txt](https://pm2.keymetrics.io/llms.txt) (index) and [pm2.keymetrics.io/llms-full.txt](https://pm2.keymetrics.io/llms-full.txt) (full docs in one Markdown file).

# Updating the documentation

The LLM-oriented artifacts ([llms.txt](https://llmstxt.org) convention) — `llms-full.txt`, the per-page `index.html.md` Markdown mirrors and the `last_modified_at` front-matter dates — are regenerated automatically by the `Keep LLM docs in sync` GitHub Action after every docs change. To regenerate locally instead:

```bash
node scripts/update-last-modified.js
node scripts/build-llms-full.js
```

The curated index `llms.txt` is hand-maintained: update it when adding or removing a docs page.

# Contribution

If you see any typo, have any recommendation, advice, feel free to open a [Pull Request](https://github.com/pm2-hive/pm2-hive.github.io/pulls)

Thanks

