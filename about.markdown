---
layout: page
title: About
permalink: /about/
---

<div class="about-header">
  <img src="{{ site.profile_image }}" alt="Oliyad Dibisa" class="about-photo">
  <div class="about-intro">
    <h2>Hey, I'm Oliyad Dibisa</h2>
    <p class="about-tagline">{{ site.tagline }}</p>
    {% if site.availability_status %}
    <div class="about-availability">
      <span class="status-dot"></span>
      {{ site.availability_status }}
    </div>
    {% endif %}
  </div>
</div>

## Research Focus

I'm a PhD candidate in Mechanical Engineering at the University of Wisconsin–Madison. My training is in soft matter physics and biopolymer manufacturing, and my research bridges the gap between theoretical modeling and scalable material processing.

**Core Areas:**
- **Rheology & Flow Modeling:** Developing CFD-based predictive models for colloidal systems
- **Additive Manufacturing:** Pioneering photopolymerization techniques for natural rubber latex (achieving 900% elongation)
- **NMR Characterization:** Using advanced spectroscopy (DOSY, relaxometry) to understand structure-property relationships
- **Sustainable Materials:** Investigating eco-friendly latex formulations and processing

## Education

**Ph.D. in Mechanical Engineering** (August 2021 – December 2025)  
University of Wisconsin–Madison  
*Advisors: Prof. Tim A. Osswald and Prof. Xiao Kuang*  
*Research: Structure–Property Relationships in Natural Rubber Latex (NRL) for Photolatex and Adhesives*

**M.S. in Mechanical Engineering** (August 2022)  
University of Wisconsin–Madison

**B.S. in Chemistry** (June 2021)  
Pacific Union College, Angwin, CA

## What I'm Looking For

I'm seeking R&D positions where I can apply computational modeling and experimental expertise to solve real-world manufacturing challenges. I'm particularly interested in:
- Materials R&D (polymers, soft matter, biopolymers)
- Process engineering and scale-up
- Computational materials science
- Postdoctoral research in applied polymer physics

---

## Beyond the Lab

When I'm not in the lab, you'll find me on the soccer field, behind a camera, or thinking about where materials R&D is heading next.

**Connect with me:**

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
.about-header {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.about-photo {
  width: 180px;
  height: 180px;
  border-radius: 16px;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.about-intro {
  flex: 1;
  min-width: 280px;
}

.about-intro h2 {
  margin: 0 0 0.5rem 0;
}

.about-tagline {
  color: #666;
  font-size: 1.1rem;
  margin: 0 0 1rem 0;
}

.about-availability {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #e8f5e9;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #2e7d32;
}

.about-availability .status-dot {
  width: 8px;
  height: 8px;
  background: #4caf50;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

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

@media (max-width: 600px) {
  .about-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .about-photo {
    width: 140px;
    height: 140px;
  }
}
</style>
