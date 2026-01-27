---
layout: page
title: CV
permalink: /cv/
---

<div class="cv-header">
  <div class="cv-actions">
    <a href="/assets/docs/Oliyad.Dibisa_resume.pdf" class="cv-download-btn primary" download>
      📄 Download CV (PDF)
    </a>
  </div>
  <p class="cv-note">Full academic CV with publications, presentations, and research experience.</p>
</div>

<div class="cv-embed-wrapper">
<iframe
  src="/assets/docs/Oliyad.Dibisa_resume.pdf"
  width="100%"
  height="900"
  style="border:1px solid #e5e5e5; border-radius:12px;"
  class="cv-iframe"
></iframe>
</div>

<style>
.cv-header {
  margin-bottom: 1.5rem;
}

.cv-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 0.75rem;
}

.cv-download-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
}

.cv-download-btn.primary {
  background: #007bff;
  color: white;
}

.cv-download-btn.primary:hover {
  background: #0056b3;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,123,255,0.3);
}

.cv-download-btn.secondary {
  background: #f8f9fa;
  color: #333;
  border: 1px solid #ddd;
}

.cv-download-btn.secondary:hover {
  background: #e9ecef;
}

.cv-note {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

.cv-embed-wrapper {
  width: 100%;
  max-width: 100%;
}

/* Mobile: smaller iframe, show download link prominently */
@media (max-width: 640px) {
  .cv-iframe {
    height: 500px;
    border-radius: 8px;
  }
  .cv-download-btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 400px) {
  .cv-iframe {
    height: 400px;
  }
}
</style>
