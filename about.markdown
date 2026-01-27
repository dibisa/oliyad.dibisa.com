---
layout: page
title: About
permalink: /about/
---

<div class="about-header">
  <img src="{{ site.profile_image }}" alt="Oliyad Dibisa" class="about-photo">
  <div class="about-intro">
    <h2>About Oliyad Dibisa</h2>
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

I'm a PhD candidate in Mechanical Engineering at the University of Wisconsin–Madison. My expertise is in polymer characterization and the formulation of UV-curable biopolymers and emulsions. I focus on establishing structure-process-property relationships to translate experimental insights into scalable, high-performance products.

**Core Areas:**
- **Polymer Characterization:** Using rheometry and NMR spectroscopy (DOSY, relaxometry) to establish structure-property relationships
- **UV-Curable Formulations:** Developing photopolymerization-based processes for natural rubber latex (achieving 900%+ elongation)
- **Emulsion & Latex Processing:** Formulating ammonia-free adhesives and eco-friendly latex systems
- **Process Scale-Up:** Applying rheological models and process simulation to optimize manufacturing

## Education

**Ph.D. in Mechanical Engineering** (August 2021 – May 2026)  
University of Wisconsin–Madison  
*Advisors: Prof. Tim A. Osswald and Prof. Xiao Kuang*  
*Research: Structure–Property Relationships in Natural Rubber Latex (NRL) for Photolatex and Adhesives*

**M.S. in Mechanical Engineering** (August 2022)  
University of Wisconsin–Madison

**B.S. in Chemistry** (June 2021)  
Pacific Union College, Angwin, CA

## What I'm Looking For

I'm seeking R&D positions where I can apply polymer characterization and formulation expertise to solve real-world manufacturing challenges. I'm particularly interested in:
- Experimental materials R&D (polymers, coatings, adhesives, emulsions)
- UV-curable and latex formulation development
- Process engineering and scale-up
- Structure-process-property relationship studies

---

## Awards & Honors

<div class="awards-grid">

<div class="award-category">
<h3>🏆 Research Awards</h3>
<div class="award-item">
<strong>Student Poster Winner</strong> — SPE ANTEC 2025 & SPE Thermoset Division (2023, 2024)<br>
<span class="award-context">Recognized for research on latex viscosity prediction (<a href="https://doi.org/10.1063/5.0255679">DOI: 10.1063/5.0255679</a>) and 3D printing NRL (<a href="https://doi.org/10.1002/pls2.70011">DOI: 10.1002/pls2.70011</a>)</span><br>
<a href="https://extranet.4spe.org/i4a/pages/index.cfm?pageid=9350#gsc.tab=0" target="_blank" rel="noopener" class="award-link">View Award Details →</a>
</div>
</div>

<div class="award-category">
<h3>🎓 Teaching Awards</h3>
<div class="award-item">
<strong>TDS's Most Valuable Educator Nominee</strong> (November 2023)<br>
<a href="https://tdstelecom.com/about/news/categories/tds/TDSHonorsMostValuableEducatorNominees.html" target="_blank" rel="noopener" class="award-link">View Announcement →</a>
</div>
<div class="award-item">
<strong>Pi Tau Sigma Distinguished Teaching Award</strong> (March 2023)<br>
<img src="/assets/img/TA award.png" alt="Pi Tau Sigma Distinguished Teaching Award Certificate" class="award-certificate">
</div>
</div>

</div>

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

/* Awards Section */
.awards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin: 1.5rem 0;
}

.award-category {
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.award-category h3 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  color: #333;
}

.award-item {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 6px;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.award-item:last-child {
  margin-bottom: 0;
}

.award-context {
  font-size: 0.9rem;
  color: #666;
}

.award-link {
  display: inline-block;
  margin-top: 0.5rem;
  color: #007bff;
  font-size: 0.9rem;
  text-decoration: none;
}

.award-link:hover {
  text-decoration: underline;
}

.award-certificate {
  display: block;
  max-width: 100%;
  margin-top: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

@media (max-width: 768px) {
  .awards-grid {
    grid-template-columns: 1fr;
  }
}
</style>
