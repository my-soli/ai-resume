import io
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable, Table, TableStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT


def generate_resume_pdf(resume_data: dict, template: str = "modern") -> bytes:
    dispatch = {
        "classic": _classic_template,
        "executive": _executive_template,
        "minimal": _minimal_template,
    }
    fn = dispatch.get(template, _modern_template)
    return fn(resume_data)


# ── Modern ────────────────────────────────────────────────────────────────────

def _modern_template(resume_data: dict) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter,
                            rightMargin=0.7 * inch, leftMargin=0.7 * inch,
                            topMargin=0.6 * inch, bottomMargin=0.7 * inch)

    INDIGO = colors.HexColor("#4F46E5")
    DARK   = colors.HexColor("#111827")
    MID    = colors.HexColor("#374151")
    LIGHT  = colors.HexColor("#9CA3AF")

    name_style = ParagraphStyle("Name", fontSize=22, fontName="Helvetica-Bold",
                                 textColor=DARK, spaceAfter=2)
    contact_style = ParagraphStyle("Contact", fontSize=9, textColor=MID, spaceAfter=8)
    section_style = ParagraphStyle("Section", fontSize=10, fontName="Helvetica-Bold",
                                    textColor=INDIGO, spaceBefore=12, spaceAfter=3)
    body_style  = ParagraphStyle("Body", fontSize=9.5, textColor=MID, spaceAfter=3, leading=14)
    title_style = ParagraphStyle("Title", fontSize=10, fontName="Helvetica-Bold",
                                  textColor=DARK, spaceAfter=1)
    meta_style  = ParagraphStyle("Meta", fontSize=9, textColor=LIGHT, spaceAfter=4)
    bullet_style = ParagraphStyle("Bullet", fontSize=9.5, textColor=MID, spaceAfter=2,
                                   leading=14, leftIndent=12)

    story = []
    personal = resume_data.get("personal_info", {})

    if personal.get("name"):
        story.append(Paragraph(personal["name"], name_style))

    contact_parts = [personal[f] for f in ["email", "phone", "location"] if personal.get(f)]
    for f in ["linkedin", "github", "website"]:
        if personal.get(f):
            contact_parts.append(personal[f])
    if contact_parts:
        story.append(Paragraph("  ·  ".join(contact_parts), contact_style))

    story.append(HRFlowable(width="100%", thickness=2, color=INDIGO, spaceAfter=6))

    if personal.get("summary"):
        story.append(Paragraph("PROFESSIONAL SUMMARY", section_style))
        story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#E5E7EB")))
        story.append(Spacer(1, 4))
        story.append(Paragraph(personal["summary"], body_style))

    _add_experience_modern(story, resume_data.get("work_experience", []),
                           section_style, title_style, meta_style, bullet_style)
    _add_education_modern(story, resume_data.get("education", []),
                          section_style, title_style, meta_style, body_style)
    _add_skills_modern(story, resume_data.get("skills", []), section_style, body_style)
    _add_projects_modern(story, resume_data.get("projects", []),
                         section_style, title_style, meta_style, body_style)

    doc.build(story)
    return buffer.getvalue()


def _add_experience_modern(story, work_exp, section_style, title_style, meta_style, bullet_style):
    if not work_exp:
        return
    story.append(Paragraph("WORK EXPERIENCE", section_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#E5E7EB")))
    story.append(Spacer(1, 4))
    for exp in work_exp:
        end = "Present" if exp.get("current") else (exp.get("end_date") or "")
        story.append(Paragraph(f"{exp.get('position', '')} · {exp.get('company', '')}", title_style))
        start = exp.get("start_date", "")
        if start or end:
            story.append(Paragraph(f"{start} – {end}", meta_style))
        if exp.get("description"):
            story.append(Paragraph(exp["description"], bullet_style))
        for ach in (exp.get("achievements") or []):
            if ach and ach.strip():
                story.append(Paragraph(f"▸  {ach.strip()}", bullet_style))
        story.append(Spacer(1, 5))


def _add_education_modern(story, education, section_style, title_style, meta_style, body_style):
    if not education:
        return
    story.append(Paragraph("EDUCATION", section_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#E5E7EB")))
    story.append(Spacer(1, 4))
    for edu in education:
        degree = edu.get("degree", "")
        field  = edu.get("field", "")
        inst   = edu.get("institution", "")
        line   = f"{degree} in {field}" if field else degree
        story.append(Paragraph(f"{line} · {inst}", title_style))
        start, end = edu.get("start_date", ""), edu.get("end_date", "")
        if start or end:
            story.append(Paragraph(f"{start} – {end}", meta_style))
        if edu.get("gpa"):
            story.append(Paragraph(f"GPA: {edu['gpa']}", body_style))
        story.append(Spacer(1, 5))


def _add_skills_modern(story, skills, section_style, body_style):
    if not skills:
        return
    story.append(Paragraph("SKILLS", section_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#E5E7EB")))
    story.append(Spacer(1, 4))
    story.append(Paragraph("  ·  ".join(skills), body_style))


def _add_projects_modern(story, projects, section_style, title_style, meta_style, body_style):
    if not projects:
        return
    story.append(Paragraph("PROJECTS", section_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#E5E7EB")))
    story.append(Spacer(1, 4))
    for proj in projects:
        title = proj.get("name", "")
        story.append(Paragraph(title, title_style))
        if proj.get("technologies"):
            techs = proj["technologies"]
            tech_str = ", ".join(techs) if isinstance(techs, list) else techs
            story.append(Paragraph(f"Stack: {tech_str}", meta_style))
        if proj.get("description"):
            story.append(Paragraph(proj["description"], body_style))
        if proj.get("url"):
            story.append(Paragraph(proj["url"], meta_style))
        story.append(Spacer(1, 5))


# ── Classic ───────────────────────────────────────────────────────────────────

def _classic_template(resume_data: dict) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter,
                            rightMargin=0.75 * inch, leftMargin=0.75 * inch,
                            topMargin=0.75 * inch, bottomMargin=0.75 * inch)

    name_style = ParagraphStyle("Name", fontSize=20, fontName="Helvetica-Bold",
                                 alignment=TA_CENTER, spaceAfter=3)
    contact_style = ParagraphStyle("Contact", fontSize=9, alignment=TA_CENTER, spaceAfter=10)
    section_style = ParagraphStyle("Section", fontSize=11, fontName="Helvetica-Bold",
                                    spaceBefore=12, spaceAfter=3,
                                    textColor=colors.HexColor("#1a1a1a"))
    body_style  = ParagraphStyle("Body", fontSize=9.5, spaceAfter=3, leading=14)
    title_style = ParagraphStyle("Title", fontSize=10, fontName="Helvetica-Bold", spaceAfter=1)
    meta_style  = ParagraphStyle("Meta", fontSize=9, textColor=colors.HexColor("#555555"), spaceAfter=4)
    bullet_style = ParagraphStyle("Bullet", fontSize=9.5, spaceAfter=2, leading=14, leftIndent=14)

    story = []
    personal = resume_data.get("personal_info", {})

    if personal.get("name"):
        story.append(Paragraph(personal["name"].upper(), name_style))

    contact_parts = [personal[f] for f in ["email", "phone", "location"] if personal.get(f)]
    for f in ["linkedin", "github", "website"]:
        if personal.get(f):
            contact_parts.append(personal[f])
    if contact_parts:
        story.append(Paragraph(" | ".join(contact_parts), contact_style))

    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#1a1a1a")))

    if personal.get("summary"):
        story.append(Paragraph("PROFESSIONAL SUMMARY", section_style))
        story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#aaaaaa")))
        story.append(Spacer(1, 4))
        story.append(Paragraph(personal["summary"], body_style))

    work_exp = resume_data.get("work_experience", [])
    if work_exp:
        story.append(Paragraph("WORK EXPERIENCE", section_style))
        story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#aaaaaa")))
        story.append(Spacer(1, 4))
        for exp in work_exp:
            end = "Present" if exp.get("current") else (exp.get("end_date") or "")
            story.append(Paragraph(f"{exp.get('position', '')} — {exp.get('company', '')}", title_style))
            start = exp.get("start_date", "")
            if start or end:
                story.append(Paragraph(f"{start} – {end}", meta_style))
            if exp.get("description"):
                story.append(Paragraph(exp["description"], body_style))
            for ach in (exp.get("achievements") or []):
                if ach and ach.strip():
                    story.append(Paragraph(f"• {ach.strip()}", bullet_style))
            story.append(Spacer(1, 6))

    education = resume_data.get("education", [])
    if education:
        story.append(Paragraph("EDUCATION", section_style))
        story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#aaaaaa")))
        story.append(Spacer(1, 4))
        for edu in education:
            degree, field, inst = edu.get("degree", ""), edu.get("field", ""), edu.get("institution", "")
            line = f"{degree} in {field} — {inst}" if field else f"{degree} — {inst}"
            story.append(Paragraph(line, title_style))
            start, end = edu.get("start_date", ""), edu.get("end_date", "")
            if start or end:
                story.append(Paragraph(f"{start} – {end}", meta_style))
            if edu.get("gpa"):
                story.append(Paragraph(f"GPA: {edu['gpa']}", body_style))
            story.append(Spacer(1, 6))

    skills = resume_data.get("skills", [])
    if skills:
        story.append(Paragraph("SKILLS", section_style))
        story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#aaaaaa")))
        story.append(Spacer(1, 4))
        story.append(Paragraph("  •  ".join(skills), body_style))

    projects = resume_data.get("projects", [])
    if projects:
        story.append(Paragraph("PROJECTS", section_style))
        story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#aaaaaa")))
        story.append(Spacer(1, 4))
        for proj in projects:
            title_text = proj.get("name", "")
            story.append(Paragraph(title_text, title_style))
            if proj.get("technologies"):
                techs = proj["technologies"]
                tech_str = ", ".join(techs) if isinstance(techs, list) else techs
                story.append(Paragraph(f"Technologies: {tech_str}", meta_style))
            if proj.get("description"):
                story.append(Paragraph(proj["description"], body_style))
            story.append(Spacer(1, 6))

    doc.build(story)
    return buffer.getvalue()


# ── Executive ─────────────────────────────────────────────────────────────────

def _executive_template(resume_data: dict) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter,
                            rightMargin=0.7 * inch, leftMargin=0.7 * inch,
                            topMargin=0.6 * inch, bottomMargin=0.7 * inch)

    NAVY   = colors.HexColor("#1E3A5F")
    GOLD   = colors.HexColor("#C5973A")
    DARK   = colors.HexColor("#1a1a1a")
    MID    = colors.HexColor("#444444")
    LIGHT  = colors.HexColor("#888888")

    name_style = ParagraphStyle("Name", fontSize=24, fontName="Helvetica-Bold",
                                 textColor=NAVY, spaceAfter=2)
    tagline_style = ParagraphStyle("Tag", fontSize=11, textColor=GOLD, spaceAfter=4)
    contact_style = ParagraphStyle("Contact", fontSize=9, textColor=MID, spaceAfter=0)
    section_style = ParagraphStyle("Section", fontSize=10, fontName="Helvetica-Bold",
                                    textColor=colors.white, spaceBefore=0, spaceAfter=0)
    body_style  = ParagraphStyle("Body", fontSize=9.5, textColor=MID, spaceAfter=3, leading=14)
    title_style = ParagraphStyle("Title", fontSize=10, fontName="Helvetica-Bold",
                                  textColor=DARK, spaceAfter=1)
    meta_style  = ParagraphStyle("Meta", fontSize=9, textColor=LIGHT, spaceAfter=4)
    bullet_style = ParagraphStyle("Bullet", fontSize=9.5, textColor=MID, spaceAfter=2,
                                   leading=14, leftIndent=12)

    story = []
    personal = resume_data.get("personal_info", {})

    if personal.get("name"):
        story.append(Paragraph(personal["name"], name_style))

    # Tagline from summary first sentence if available
    if personal.get("summary"):
        first_sentence = personal["summary"].split(".")[0] + "."
        story.append(Paragraph(first_sentence, tagline_style))

    contact_parts = [personal[f] for f in ["email", "phone", "location"] if personal.get(f)]
    for f in ["linkedin", "github", "website"]:
        if personal.get(f):
            contact_parts.append(personal[f])
    if contact_parts:
        story.append(Paragraph("  |  ".join(contact_parts), contact_style))

    story.append(Spacer(1, 10))

    def section_header(label):
        tbl = Table([[Paragraph(f"  {label}", section_style)]], colWidths=["100%"])
        tbl.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), NAVY),
            ("TOPPADDING", (0, 0), (-1, -1), 5),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ]))
        story.append(tbl)
        story.append(Spacer(1, 6))

    if personal.get("summary"):
        section_header("PROFESSIONAL SUMMARY")
        story.append(Paragraph(personal["summary"], body_style))
        story.append(Spacer(1, 6))

    work_exp = resume_data.get("work_experience", [])
    if work_exp:
        section_header("PROFESSIONAL EXPERIENCE")
        for exp in work_exp:
            end = "Present" if exp.get("current") else (exp.get("end_date") or "")
            start = exp.get("start_date", "")
            # Position + date on same line using table
            row = Table(
                [[Paragraph(f"{exp.get('position', '')} · {exp.get('company', '')}", title_style),
                  Paragraph(f"{start} – {end}", meta_style)]],
                colWidths=["70%", "30%"]
            )
            row.setStyle(TableStyle([
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("RIGHTPADDING", (1, 0), (1, 0), 0),
                ("ALIGN", (1, 0), (1, 0), "RIGHT"),
            ]))
            story.append(row)
            if exp.get("description"):
                story.append(Paragraph(exp["description"], body_style))
            for ach in (exp.get("achievements") or []):
                if ach and ach.strip():
                    story.append(Paragraph(f"▸  {ach.strip()}", bullet_style))
            story.append(Spacer(1, 6))

    education = resume_data.get("education", [])
    if education:
        section_header("EDUCATION")
        for edu in education:
            degree, field, inst = edu.get("degree", ""), edu.get("field", ""), edu.get("institution", "")
            line = f"{degree} in {field}" if field else degree
            story.append(Paragraph(f"{line}", title_style))
            story.append(Paragraph(f"{inst}  ·  {edu.get('start_date', '')} – {edu.get('end_date', '')}", meta_style))
            if edu.get("gpa"):
                story.append(Paragraph(f"GPA: {edu['gpa']}", body_style))
            story.append(Spacer(1, 4))

    skills = resume_data.get("skills", [])
    if skills:
        section_header("SKILLS")
        story.append(Paragraph("  ·  ".join(skills), body_style))
        story.append(Spacer(1, 6))

    projects = resume_data.get("projects", [])
    if projects:
        section_header("KEY PROJECTS")
        for proj in projects:
            story.append(Paragraph(proj.get("name", ""), title_style))
            if proj.get("technologies"):
                techs = proj["technologies"]
                tech_str = ", ".join(techs) if isinstance(techs, list) else techs
                story.append(Paragraph(f"Stack: {tech_str}", meta_style))
            if proj.get("description"):
                story.append(Paragraph(proj["description"], body_style))
            story.append(Spacer(1, 4))

    doc.build(story)
    return buffer.getvalue()


# ── Minimal ───────────────────────────────────────────────────────────────────

def _minimal_template(resume_data: dict) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter,
                            rightMargin=0.8 * inch, leftMargin=0.8 * inch,
                            topMargin=0.8 * inch, bottomMargin=0.8 * inch)

    DARK  = colors.HexColor("#111111")
    MID   = colors.HexColor("#555555")
    LIGHT = colors.HexColor("#999999")
    ACC   = colors.HexColor("#2D2D2D")

    name_style = ParagraphStyle("Name", fontSize=26, fontName="Helvetica-Bold",
                                 textColor=DARK, spaceAfter=4)
    contact_style = ParagraphStyle("Contact", fontSize=9, textColor=LIGHT, spaceAfter=16)
    section_style = ParagraphStyle("Section", fontSize=9, fontName="Helvetica-Bold",
                                    textColor=LIGHT, spaceBefore=14, spaceAfter=5,
                                    letterSpacing=2)
    body_style  = ParagraphStyle("Body", fontSize=10, textColor=MID, spaceAfter=3, leading=15)
    title_style = ParagraphStyle("Title", fontSize=10, fontName="Helvetica-Bold",
                                  textColor=DARK, spaceAfter=1)
    meta_style  = ParagraphStyle("Meta", fontSize=9, textColor=LIGHT, spaceAfter=4)
    bullet_style = ParagraphStyle("Bullet", fontSize=10, textColor=MID, spaceAfter=2,
                                   leading=15, leftIndent=10)

    story = []
    personal = resume_data.get("personal_info", {})

    if personal.get("name"):
        story.append(Paragraph(personal["name"], name_style))

    contact_parts = [personal[f] for f in ["email", "phone", "location"] if personal.get(f)]
    for f in ["linkedin", "github", "website"]:
        if personal.get(f):
            contact_parts.append(personal[f])
    if contact_parts:
        story.append(Paragraph("   ·   ".join(contact_parts), contact_style))

    if personal.get("summary"):
        story.append(Paragraph("SUMMARY", section_style))
        story.append(Paragraph(personal["summary"], body_style))

    work_exp = resume_data.get("work_experience", [])
    if work_exp:
        story.append(Paragraph("EXPERIENCE", section_style))
        for exp in work_exp:
            end = "Present" if exp.get("current") else (exp.get("end_date") or "")
            start = exp.get("start_date", "")
            story.append(Paragraph(exp.get("position", ""), title_style))
            story.append(Paragraph(
                f"{exp.get('company', '')}   {start} – {end}", meta_style))
            if exp.get("description"):
                story.append(Paragraph(exp["description"], body_style))
            for ach in (exp.get("achievements") or []):
                if ach and ach.strip():
                    story.append(Paragraph(f"– {ach.strip()}", bullet_style))
            story.append(Spacer(1, 6))

    education = resume_data.get("education", [])
    if education:
        story.append(Paragraph("EDUCATION", section_style))
        for edu in education:
            degree, field, inst = edu.get("degree", ""), edu.get("field", ""), edu.get("institution", "")
            line = f"{degree} in {field}" if field else degree
            story.append(Paragraph(line, title_style))
            story.append(Paragraph(
                f"{inst}   {edu.get('start_date', '')} – {edu.get('end_date', '')}", meta_style))
            if edu.get("gpa"):
                story.append(Paragraph(f"GPA: {edu['gpa']}", body_style))
            story.append(Spacer(1, 4))

    skills = resume_data.get("skills", [])
    if skills:
        story.append(Paragraph("SKILLS", section_style))
        story.append(Paragraph(",   ".join(skills), body_style))

    projects = resume_data.get("projects", [])
    if projects:
        story.append(Paragraph("PROJECTS", section_style))
        for proj in projects:
            story.append(Paragraph(proj.get("name", ""), title_style))
            if proj.get("technologies"):
                techs = proj["technologies"]
                tech_str = ", ".join(techs) if isinstance(techs, list) else techs
                story.append(Paragraph(tech_str, meta_style))
            if proj.get("description"):
                story.append(Paragraph(proj["description"], body_style))
            story.append(Spacer(1, 4))

    doc.build(story)
    return buffer.getvalue()
