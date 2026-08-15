import type { GeneratedCourse, CourseModule } from '@core/utils/export/pdf-course-export';

export async function exportCourseToSCORM(course: GeneratedCourse): Promise<void> {
  const { default: JSZip } = await import('jszip');
  const zip = new JSZip();

  zip.file('imsmanifest.xml', buildManifest(course));
  zip.file('scorm-api.js', buildScormAPI());
  zip.file('styles.css', buildStyles());
  zip.file('index.html', buildIndexHTML(course));

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = course.title.replace(/[^a-zA-Z0-9]+/g, '_') + '_SCORM.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildManifest(course: GeneratedCourse): string {
  const orgItems = course.modules
    .map(
      (m) =>
        `      <item identifier="ITEM_${m.id}" identifierref="RES_01">
        <title>${escapeXml(m.title)}</title>
      </item>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="COURSE_MANIFEST" version="1.0"
  xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
  xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd
    http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>
  <organizations default="ORG_01">
    <organization identifier="ORG_01">
      <title>${escapeXml(course.title)}</title>
${orgItems}
    </organization>
  </organizations>
  <resources>
    <resource identifier="RES_01" type="webcontent" adlcp:scormtype="sco" href="index.html">
      <file href="index.html"/>
      <file href="scorm-api.js"/>
      <file href="styles.css"/>
    </resource>
  </resources>
</manifest>`;
}

function buildScormAPI(): string {
  return `// SCORM 1.2 API Wrapper
(function() {
  var api = null;
  var initialized = false;
  var completed = false;

  function findAPI(win) {
    try {
      var attempts = 0;
      while (win && !win.API && attempts < 10) {
        if (win === win.parent) break;
        win = win.parent;
        attempts++;
      }
      return win && win.API ? win.API : null;
    } catch (e) {
      return null;
    }
  }

  function getAPI() {
    if (api) return api;
    api = findAPI(window);
    if (!api && window.opener) {
      api = findAPI(window.opener);
    }
    return api;
  }

  window.ScormAPI = {
    initialize: function() {
      var a = getAPI();
      if (a) {
        var result = a.LMSInitialize("");
        initialized = (result === "true" || result === true);
      } else {
        console.log("SCORM API not found - running in standalone mode");
        initialized = true;
      }
      return initialized;
    },
    setValue: function(key, value) {
      var a = getAPI();
      if (a && initialized) {
        a.LMSSetValue(key, String(value));
        a.LMSCommit("");
      }
    },
    setComplete: function() {
      if (completed) return;
      completed = true;
      this.setValue("cmi.core.lesson_status", "completed");
      this.setValue("cmi.core.score.raw", "100");
      this.setValue("cmi.core.score.min", "0");
      this.setValue("cmi.core.score.max", "100");
    },
    finish: function() {
      var a = getAPI();
      if (a && initialized) {
        a.LMSFinish("");
      }
    }
  };

  window.addEventListener("beforeunload", function() {
    window.ScormAPI.finish();
  });
})();`;
}

function buildStyles(): string {
  return `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f8fafc; color: #1e293b; }
.layout { display: flex; min-height: 100vh; }

/* Sidebar */
.sidebar { width: 280px; background: #0e7490; color: #fff; padding: 24px 0; flex-shrink: 0; overflow-y: auto; }
.sidebar h1 { font-size: 16px; padding: 0 20px 16px; border-bottom: 1px solid rgba(255,255,255,.2); margin-bottom: 8px; }
.sidebar-item { display: block; width: 100%; text-align: left; padding: 10px 20px; font-size: 14px; color: rgba(255,255,255,.8); background: none; border: none; cursor: pointer; transition: background .15s; }
.sidebar-item:hover { background: rgba(255,255,255,.1); color: #fff; }
.sidebar-item.active { background: rgba(255,255,255,.15); color: #fff; font-weight: 600; border-left: 3px solid #fff; }
.sidebar-item .badge { display: inline-block; font-size: 11px; padding: 1px 6px; border-radius: 8px; margin-left: 6px; }
.badge-video { background: #3b82f6; }
.badge-reading { background: #9333ea; }
.badge-quiz { background: #f59e0b; }
.badge-activity { background: #22c55e; }

/* Main */
.main { flex: 1; padding: 32px 40px; max-width: 860px; }
.main h2 { font-size: 24px; margin-bottom: 8px; }
.main .desc { color: #64748b; margin-bottom: 24px; line-height: 1.5; }
.section { background: #fff; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,.08); }
.section h3 { font-size: 18px; margin-bottom: 12px; color: #0e7490; }
.section p, .section li { font-size: 14px; line-height: 1.6; color: #475569; }
.section ul { padding-left: 20px; }
.section li { margin-bottom: 4px; }

/* Quiz */
.quiz-question { margin-bottom: 20px; }
.quiz-question p { font-weight: 600; margin-bottom: 8px; color: #1e293b; }
.quiz-option { display: block; width: 100%; text-align: left; padding: 10px 14px; margin-bottom: 6px; border: 1px solid #e2e8f0; border-radius: 8px; background: #fff; font-size: 14px; cursor: pointer; transition: border-color .15s, background .15s; }
.quiz-option:hover { border-color: #0891b2; background: #ecfeff; }
.quiz-option.correct { border-color: #22c55e; background: #f0fdf4; color: #166534; }
.quiz-option.incorrect { border-color: #ef4444; background: #fef2f2; color: #991b1b; }
.quiz-option:disabled { cursor: default; }
.quiz-result { padding: 10px 14px; border-radius: 8px; font-size: 14px; font-weight: 500; margin-top: 8px; }
.quiz-result.pass { background: #f0fdf4; color: #166534; }
.quiz-result.fail { background: #fef2f2; color: #991b1b; }

.complete-btn { display: inline-block; margin-top: 16px; padding: 10px 24px; background: #0891b2; color: #fff; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; }
.complete-btn:hover { background: #0e7490; }
.footer { text-align: center; padding: 24px; color: #94a3b8; font-size: 12px; }`;
}

function buildModuleContent(mod: CourseModule, idx: number): string {
  if (mod.type === 'quiz' && mod.questions) {
    const quizHtml = mod.questions
      .map((q, qi) => {
        const optionsHtml = q.options
          .map(
            (opt, oi) =>
              `<button class="quiz-option" data-q="${idx}-${qi}" data-idx="${oi}" data-correct="${q.correct}" onclick="checkAnswer(this)">${String.fromCharCode(65 + oi)}. ${escapeHtml(opt)}</button>`,
          )
          .join('\n          ');
        return `<div class="quiz-question" id="q-${idx}-${qi}">
        <p>${qi + 1}. ${escapeHtml(q.question)}</p>
        <div class="quiz-options">
          ${optionsHtml}
        </div>
      </div>`;
      })
      .join('\n      ');
    return quizHtml;
  }

  return `<p>${escapeHtml(mod.content || 'Module content will be available in the full course.')}</p>`;
}

function buildIndexHTML(course: GeneratedCourse): string {
  // Build sidebar items
  const sidebarItems = course.modules
    .map(
      (m, i) =>
        `<button class="sidebar-item${i === 0 ? ' active' : ''}" onclick="showModule(${i})">${i + 1}. ${escapeHtml(m.title)} <span class="badge badge-${m.type}">${m.type}</span></button>`,
    )
    .join('\n      ');

  // Build module sections
  const moduleSections = course.modules
    .map(
      (m, i) =>
        `<div class="module-panel" id="module-${i}" style="${i === 0 ? '' : 'display:none'}">
      <div class="section">
        <h3>Module ${i + 1}: ${escapeHtml(m.title)}</h3>
        <p style="font-size:12px;color:#94a3b8;margin-bottom:12px">${escapeHtml(m.type.toUpperCase())} &bull; ${escapeHtml(m.duration)}</p>
        ${buildModuleContent(m, i)}
      </div>
    </div>`,
    )
    .join('\n    ');

  const objectivesHtml = course.learningObjectives
    .map((o) => `<li>${escapeHtml(o)}</li>`)
    .join('\n          ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${escapeHtml(course.title)}</title>
  <link rel="stylesheet" href="styles.css"/>
  <script src="scorm-api.js"><\/script>
</head>
<body>
  <div class="layout">
    <nav class="sidebar">
      <h1>${escapeHtml(course.title)}</h1>
      ${sidebarItems}
    </nav>
    <div class="main">
      <div class="module-panel" id="module-overview">
        <h2>${escapeHtml(course.title)}</h2>
        <p class="desc">${escapeHtml(course.description)}</p>
        <div class="section">
          <h3>Learning Objectives</h3>
          <ul>
            ${objectivesHtml}
          </ul>
        </div>
        <div class="section">
          <h3>Assessment Strategy</h3>
          <p>${escapeHtml(course.assessmentStrategy)}</p>
        </div>
      </div>
      ${moduleSections}
      <button class="complete-btn" onclick="markComplete()">Mark Course Complete</button>
      <div class="footer">Built by Evelyn Learning &bull; evelynlearning.com</div>
    </div>
  </div>

  <script>
    // Initialize SCORM
    if (window.ScormAPI) window.ScormAPI.initialize();

    var currentModule = -1; // -1 = overview
    var totalModules = ${course.modules.length};

    function showModule(idx) {
      // Hide overview
      document.getElementById("module-overview").style.display = "none";
      // Hide all modules
      for (var i = 0; i < totalModules; i++) {
        document.getElementById("module-" + i).style.display = "none";
      }
      // Show selected
      document.getElementById("module-" + idx).style.display = "block";
      currentModule = idx;

      // Update sidebar active state
      var items = document.querySelectorAll(".sidebar-item");
      items.forEach(function(el, i) { el.classList.toggle("active", i === idx); });

      // Report progress
      if (window.ScormAPI) {
        var pct = Math.round(((idx + 1) / totalModules) * 100);
        window.ScormAPI.setValue("cmi.core.lesson_location", "module_" + idx);
      }
    }

    function checkAnswer(btn) {
      var q = btn.getAttribute("data-q");
      var idx = parseInt(btn.getAttribute("data-idx"));
      var correct = parseInt(btn.getAttribute("data-correct"));
      var siblings = document.querySelectorAll('[data-q="' + q + '"]');
      siblings.forEach(function(el) {
        el.disabled = true;
        var elIdx = parseInt(el.getAttribute("data-idx"));
        if (elIdx === correct) el.classList.add("correct");
      });
      if (idx !== correct) btn.classList.add("incorrect");
    }

    function markComplete() {
      if (window.ScormAPI) window.ScormAPI.setComplete();
      alert("Course marked as complete!");
    }
  <\/script>
</body>
</html>`;
}
