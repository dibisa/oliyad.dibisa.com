---
layout: page
title: About
permalink: /about/
---


Hi — I’m Oliyad Dibisa, a PhD candidate in Mechanical Engineering.

My work focuses on sustainable latex-based materials, rheology, and NMR structure–property analysis, with applications in UV-curable systems and additive manufacturing.

Outside the lab: soccer, photography, and ideas about where materials R&D are heading next.

<div class="about-layout">
<div class="about-left">

**Connect with me**

{% if site.social_links %}
{% for s in site.social_links %}
- [{{ s.label }}]({{ s.url }})
{% endfor %}
{% endif %}

</div>
<div class="about-right">
{% include elastomer-demo.html %}
</div>
</div>

<style>
.about-layout {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  flex-wrap: wrap;
  margin-top: 1.5rem;
}
.about-left {
  flex: 0 0 200px;
  min-width: 180px;
}
.about-right {
  flex: 1 1 500px;
  min-width: 300px;
}
@media (max-width: 700px) {
  .about-layout {
    flex-direction: column;
  }
  .about-left, .about-right {
    flex: 1 1 100%;
    min-width: 100%;
  }
}
</style>

