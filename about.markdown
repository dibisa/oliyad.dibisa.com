---
layout: page
title: About
permalink: /about/
---


Hi — I'm Oliyad Dibisa, a PhD candidate in Mechanical Engineering.

My work focuses on sustainable latex-based materials, rheology, and NMR structure–property analysis, with applications in UV-curable systems and additive manufacturing.

Outside the lab: soccer, photography, and ideas about where materials R&D are heading next.

**Connect with me**

{% if site.social_links %}
<ul class="social-links-list">
{% for s in site.social_links %}
<li><a href="{{ s.url }}" target="_blank" rel="noopener">{{ s.label }}</a></li>
{% endfor %}
</ul>
{% endif %}

---

{% include elastomer-demo.html %}

<style>
.social-links-list {
  list-style: none;
  padding-left: 0;
  margin: 0.5rem 0 1rem 0;
}
.social-links-list li {
  margin: 0.3rem 0;
}
.social-links-list a {
  color: #0066cc;
}
</style>
