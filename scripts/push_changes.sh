#!/usr/bin/env bash
# Run from repo root or execute this script from the scripts/ folder.
cd "$(dirname "$0")/.." || exit 1
git add _layouts/home.html _includes/hero-media.html _includes/project-cards.html _includes/sticky-footer.html _data/projects.yml assets/main.scss assets/js/site.js assets/media/.gitkeep _config.yml
git commit -m "Home redesign: hero media carousel, project cards, collapsible sticky footer; extract PPTX media and update projects data; update site URL"
git push
